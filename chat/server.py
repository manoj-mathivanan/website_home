"""Private SQLite chat storage, anonymous sessions, and durable email notifications."""
import contextlib
import hashlib
import hmac
import json
import logging
import os
import re
import secrets
import smtplib
import sqlite3
import ssl
import threading
import time
import uuid
from email.message import EmailMessage
from http.cookies import SimpleCookie, CookieError
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request, urlopen
from assistant import answer

LOG = logging.getLogger('home-chat')
SCHEMA = '''
CREATE TABLE IF NOT EXISTS conversations (
 id TEXT PRIMARY KEY, token_hash TEXT NOT NULL, created REAL NOT NULL,
 updated REAL NOT NULL, contact TEXT, contact_saved REAL);
CREATE TABLE IF NOT EXISTS messages (
 id INTEGER PRIMARY KEY, conversation TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL, question TEXT NOT NULL, answer TEXT, sources TEXT,
 created REAL NOT NULL, UNIQUE(conversation,request_id));
CREATE TABLE IF NOT EXISTS outbox (
 id TEXT PRIMARY KEY, conversation TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
 kind TEXT NOT NULL, payload TEXT NOT NULL, created REAL NOT NULL, sent REAL,
 attempts INTEGER NOT NULL DEFAULT 0, next_attempt REAL NOT NULL DEFAULT 0,
 last_error TEXT);
CREATE TABLE IF NOT EXISTS rate_events (key TEXT NOT NULL, kind TEXT NOT NULL, created REAL NOT NULL);
CREATE INDEX IF NOT EXISTS rate_lookup ON rate_events(key,kind,created);
'''

class Problem(Exception):
    def __init__(self, status, message):
        self.status, self.message = status, message

class App:
    def __init__(self, state=None, origin=None, secure=None):
        self.state = Path(state or os.getenv('CHAT_STATE_DIR', './.chat-data'))
        self.state.mkdir(parents=True, exist_ok=True)
        if os.name != 'nt':
            self.state.chmod(0o700)
        self.path = self.state / 'conversations.sqlite3'
        self.origin = origin or os.getenv('CHAT_ORIGIN', 'http://127.0.0.1:3000')
        self.secure = secure if secure is not None else self.origin.startswith('https://')
        self.retention = int(os.getenv('CHAT_RETENTION_DAYS', '90'))
        secret_path = self.state / 'rate-secret'
        if not secret_path.exists():
            with secret_path.open('xb') as file:
                file.write(secrets.token_bytes(32))
            if os.name != 'nt':
                secret_path.chmod(0o600)
        self.secret = secret_path.read_bytes()
        with self.db() as db:
            db.execute('PRAGMA journal_mode=WAL')
            db.executescript(SCHEMA)
        if os.name != 'nt':
            self.path.chmod(0o600)
        self.cleanup()

    @contextlib.contextmanager
    def db(self):
        db = sqlite3.connect(self.path, timeout=15)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA foreign_keys=ON')
        try:
            with db:
                yield db
        finally:
            db.close()

    def cleanup(self):
        with self.db() as db:
            db.execute('DELETE FROM conversations WHERE updated < ?', (time.time() - self.retention * 86400,))
            db.execute('DELETE FROM rate_events WHERE created < ?', (time.time() - 86400,))

    def session(self, cookie):
        jar = SimpleCookie()
        try:
            jar.load(cookie or '')
            value = jar['home_chat'].value if 'home_chat' in jar else ''
            ident, token, signature = value.split('.')
        except (ValueError, KeyError, CookieError):
            return None
        if not re.fullmatch(r'[a-f0-9]{32}', ident) or len(token) != 43:
            return None
        expected = hmac.new(self.secret, f'{ident}.{token}'.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            return None
        with self.db() as db:
            row = db.execute('SELECT * FROM conversations WHERE id=?', (ident,)).fetchone()
        if row and row['updated'] >= time.time() - self.retention * 86400 and hmac.compare_digest(row['token_hash'], hashlib.sha256(token.encode()).hexdigest()):
            return dict(row)
        if not row:
            return {'id': ident, 'token_hash': hashlib.sha256(token.encode()).hexdigest(), 'anonymous': True}
        return None

    def fresh_cookie(self):
        value = f'{uuid.uuid4().hex}.{secrets.token_urlsafe(32)}'
        signature = hmac.new(self.secret, value.encode(), hashlib.sha256).hexdigest()
        return self.cookie(f'{value}.{signature}')

    def cookie(self, value='', clear=False):
        return f'home_chat={value}; Path=/api/chat; HttpOnly; SameSite=Strict; Max-Age={0 if clear else 604800}' + ('; Secure' if self.secure else '')

    def ip_key(self, ip):
        return hmac.new(self.secret, ip.encode(), hashlib.sha256).hexdigest()

    def rate(self, db, key, kind, limit, seconds):
        now = time.time()
        count = db.execute('SELECT COUNT(*) FROM rate_events WHERE key=? AND kind=? AND created>?', (key, kind, now-seconds)).fetchone()[0]
        if count >= limit:
            raise Problem(429, 'Too many requests. Please try again later.')
        db.execute('INSERT INTO rate_events VALUES(?,?,?)', (key, kind, now))

    def transcript(self, session):
        if not session or session.get('anonymous'):
            return {'messages': [], 'contact_saved': False}
        with self.db() as db:
            messages = db.execute('SELECT question,answer,sources FROM messages WHERE conversation=? ORDER BY id', (session['id'],)).fetchall()
        return {'messages': [{'question': row['question'], 'answer': row['answer'], 'sources': json.loads(row['sources'] or '[]')} for row in messages], 'contact_saved': bool(session['contact'])}

    def message(self, body, session, ip):
        if body.get('consent') is not True:
            raise Problem(400, 'Please agree to message storage before starting.')
        question = body.get('message')
        request_id = body.get('request_id')
        if not isinstance(question, str) or not 1 <= len(question.strip()) <= 1200:
            raise Problem(400, 'Enter a question of 1–1,200 characters.')
        if not isinstance(request_id, str) or not re.fullmatch(r'[a-zA-Z0-9-]{16,64}', request_id):
            raise Problem(400, 'Invalid request identifier.')
        question = question.strip()
        if '\x00' in question:
            raise Problem(400, 'Invalid message.')
        session_cookie = None
        if not session:
            raise Problem(409, 'Please reopen the chat to start a secure session.')
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            current = db.execute('SELECT * FROM conversations WHERE id=?', (session['id'],)).fetchone()
            if current:
                if not hmac.compare_digest(current['token_hash'], session['token_hash']):
                    raise Problem(401, 'Invalid session')
                session = dict(current)
            if session:
                existing = db.execute('SELECT * FROM messages WHERE conversation=? AND request_id=?', (session['id'], request_id)).fetchone()
                if existing:
                    if existing['question'] != question:
                        raise Problem(409, 'This request identifier has already been used.')
                    return {'text': existing['answer'], 'sources': json.loads(existing['sources'])}, None
            self.rate(db, self.ip_key(ip), 'message', 20, 60)
            self.rate(db, 'global', 'message', 1000, 86400)
            if not current:
                self.rate(db, self.ip_key(ip), 'start', 5, 86400)
                self.rate(db, 'global', 'start', 100, 86400)
                ident = session['id']
                db.execute('INSERT INTO conversations(id,token_hash,created,updated) VALUES(?,?,?,?)', (ident, session['token_hash'], time.time(), time.time()))
                self.queue(db, ident, 'started', {'first_question': question})
            ident = session['id']
            if db.execute('SELECT COUNT(*) FROM messages WHERE conversation=?', (ident,)).fetchone()[0] >= 60:
                raise Problem(429, 'This conversation has reached its limit. Start a new conversation later or email Manoj.')
            prior = db.execute('SELECT question FROM messages WHERE conversation=? ORDER BY id DESC LIMIT 1', (ident,)).fetchone()
            result = answer(question, prior['question'] if prior else '')
            db.execute('INSERT INTO messages(conversation,request_id,question,answer,sources,created) VALUES(?,?,?,?,?,?)', (ident, request_id, question, result['text'], json.dumps(result['sources']), time.time()))
            db.execute('UPDATE conversations SET updated=? WHERE id=?', (time.time(), ident))
        return result, session_cookie

    def queue(self, db, ident, kind, payload):
        db.execute('INSERT INTO outbox(id,conversation,kind,payload,created) VALUES(?,?,?,?,?)', (uuid.uuid4().hex, ident, kind, json.dumps(payload), time.time()))

    def contact(self, body, session, ip):
        if not session or session.get('anonymous'):
            raise Problem(401, 'Start a conversation before leaving contact details.')
        if body.get('consent') is not True:
            raise Problem(400, 'Please agree to being contacted.')
        values = {}
        for key, maximum in [('name',100), ('email',254), ('phone',40), ('note',1000)]:
            value = body.get(key, '')
            if not isinstance(value, str) or len(value) > maximum or any(ord(c) < 32 and c not in '\n\t' for c in value):
                raise Problem(400, 'Please check the length and format of your contact details.')
            values[key] = value.strip()
        if values['email'] and not re.fullmatch(r'[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+', values['email']):
            raise Problem(400, 'Please enter a valid email address.')
        if values['phone'] and not re.fullmatch(r'[+0-9() .-]{5,40}', values['phone']):
            raise Problem(400, 'Please enter a valid phone number.')
        if not (values['email'] or values['phone']):
            raise Problem(400, 'Leave an email address or phone number so Manoj can reach you.')
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            existing = db.execute('SELECT contact FROM conversations WHERE id=?', (session['id'],)).fetchone()
            if not existing:
                raise Problem(401, 'Please start a new conversation.')
            if existing['contact']:
                if json.loads(existing['contact']) == values:
                    return {'saved': True}
                raise Problem(409, 'Contact details have already been saved for this conversation. Email Manoj to update them.')
            self.rate(db, self.ip_key(ip), 'contact', 5, 86400)
            db.execute('UPDATE conversations SET contact=?,contact_saved=?,updated=? WHERE id=?', (json.dumps(values), time.time(), time.time(), session['id']))
            self.queue(db, session['id'], 'contact', values)
        return {'saved': True}

    def mail_ready(self):
        return bool(os.getenv('RESEND_API_KEY') and os.getenv('CHAT_EMAIL_FROM')) or bool(os.getenv('SMTP_HOST') and os.getenv('SMTP_USER') and os.getenv('SMTP_PASSWORD') and os.getenv('CHAT_EMAIL_FROM'))

    def send_email(self, row):
        recipient = os.getenv('CHAT_NOTIFY_TO', 'ma.manoj@gmail.com')
        sender = os.environ['CHAT_EMAIL_FROM']
        payload = json.loads(row['payload'])
        title = 'New resume conversation' if row['kind'] == 'started' else 'Resume visitor requested follow-up'
        subject = f"{title} [{row['conversation'][:8]}]"
        text = f"{subject} at manojmathivanan.com\nConversation: {row['conversation']}\n\n"
        if row['kind'] == 'started':
            text += 'First question:\n' + payload['first_question']
        else:
            text += '\n'.join(f'{key}: {value}' for key, value in payload.items())
        text += '\n\nHistory is stored privately on your server. Use the owner export command described in deploy/README.md.\n'
        if os.getenv('RESEND_API_KEY'):
            data = json.dumps({'from': sender, 'to': [recipient], 'subject': subject, 'text': text}).encode()
            request = Request('https://api.resend.com/emails', data=data, headers={'Authorization': 'Bearer ' + os.environ['RESEND_API_KEY'], 'Content-Type': 'application/json', 'User-Agent': 'ManojHomeChat/1.0', 'Idempotency-Key': 'home-chat-' + row['id']}, method='POST')
            with urlopen(request, timeout=15) as response:
                result = json.load(response)
                if not result.get('id'):
                    raise RuntimeError('Email provider did not acknowledge the message')
        else:
            message = EmailMessage()
            message['From'], message['To'], message['Subject'] = sender, recipient, subject
            message['Message-ID'] = f"<{row['id']}@manojmathivanan.com>"
            message.set_content(text)
            host, port = os.environ['SMTP_HOST'], int(os.getenv('SMTP_PORT', '587'))
            if port == 465:
                client = smtplib.SMTP_SSL(host, port, timeout=15, context=ssl.create_default_context())
            else:
                client = smtplib.SMTP(host, port, timeout=15)
                client.starttls(context=ssl.create_default_context())
            with client:
                client.login(os.environ['SMTP_USER'], os.environ['SMTP_PASSWORD'])
                client.send_message(message)

    def deliver(self):
        if not self.mail_ready():
            return
        with self.db() as db:
            row = db.execute('SELECT * FROM outbox WHERE sent IS NULL AND next_attempt<=? ORDER BY created LIMIT 1', (time.time(),)).fetchone()
        if not row:
            return
        try:
            self.send_email(dict(row))
            with self.db() as db:
                db.execute('UPDATE outbox SET sent=?,last_error=NULL WHERE id=?', (time.time(), row['id']))
        except Exception as error:
            # Provider bodies and secrets never enter logs or public responses.
            with self.db() as db:
                db.execute('UPDATE outbox SET attempts=attempts+1,next_attempt=?,last_error=? WHERE id=?', (time.time()+min(3600,30*2**min(row['attempts'],7)), type(error).__name__, row['id']))
            LOG.warning('Email delivery failed; retry scheduled (%s)', type(error).__name__)

    def worker(self, stop):
        while not stop.wait(3):
            try:
                self.deliver()
                self.cleanup()
            except Exception:
                LOG.exception('Notification worker failure')

def make_handler(app):
    class Handler(BaseHTTPRequestHandler):
        server_version = 'HomeChat'

        def setup(self):
            super().setup()
            self.connection.settimeout(10)

        def log_message(self, fmt, *args):
            pass  # Do not log visitor content or tokens.

        def respond(self, status, value, cookie=None):
            data = json.dumps(value, ensure_ascii=False).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            if status == 429:
                self.send_header('Retry-After', '60')
            if cookie:
                self.send_header('Set-Cookie', cookie)
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            if self.path == '/api/chat/status':
                self.respond(200, {'ready': True, 'mode': 'verified-facts', 'notifications_ready': app.mail_ready(), 'retention_days': app.retention})
            elif self.path == '/api/chat/session':
                session = app.session(self.headers.get('Cookie'))
                self.respond(200, app.transcript(session), None if session else app.fresh_cookie())
            else:
                self.respond(404, {'error': 'Not found'})

        def do_POST(self):
            try:
                if self.path not in ('/api/chat/message', '/api/chat/contact', '/api/chat/new'):
                    raise Problem(404, 'Not found')
                if self.headers.get('Origin') != app.origin:
                    raise Problem(403, 'Please use the chat on Manoj’s website.')
                if self.headers.get('Content-Type', '').split(';')[0] != 'application/json' or self.headers.get('Transfer-Encoding'):
                    raise Problem(415, 'JSON requests are required.')
                try:
                    size = int(self.headers.get('Content-Length', '0'))
                except ValueError:
                    raise Problem(400, 'Invalid request length')
                if not 0 < size <= 8192:
                    raise Problem(413, 'Request too large or empty.')
                try:
                    body = json.loads(self.rfile.read(size))
                except (ValueError, UnicodeError):
                    raise Problem(400, 'Invalid JSON')
                if not isinstance(body, dict):
                    raise Problem(400, 'Invalid request')
                session = app.session(self.headers.get('Cookie'))
                # Only loopback Caddy may reach this service; Caddy overwrites this header.
                ip = self.headers.get('X-Home-Client-IP', self.client_address[0])
                if self.path == '/api/chat/message':
                    result, cookie = app.message(body, session, ip)
                    self.respond(200, result, cookie)
                elif self.path == '/api/chat/contact':
                    self.respond(200, app.contact(body, session, ip))
                else:
                    self.respond(200, {'cleared': True}, app.fresh_cookie())
            except Problem as error:
                self.respond(error.status, {'error': error.message})
            except Exception:
                LOG.exception('Chat request failed')
                self.respond(500, {'error': 'Chat is temporarily unavailable. Please try again or email Manoj.'})
    return Handler

def serve(app, port=8766):
    server = ThreadingHTTPServer(('127.0.0.1', port), make_handler(app))
    server.daemon_threads = True
    return server

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    os.umask(0o077)
    app = App()
    stop = threading.Event()
    threading.Thread(target=app.worker, args=(stop,), daemon=True).start()
    server = serve(app, int(os.getenv('CHAT_PORT', '8766')))
    LOG.info('Chat listening on loopback; notification service configured: %s', app.mail_ready())
    try:
        server.serve_forever()
    finally:
        stop.set()
        server.server_close()
