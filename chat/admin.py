"""Owner-only history export and SQLite backups. Run over SSH, never exposed over HTTP."""
import argparse
import html
import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('action', choices=['list', 'export', 'backup'])
parser.add_argument('--state', default=os.getenv('CHAT_STATE_DIR', '/var/lib/home-chat'))
parser.add_argument('--conversation')
args = parser.parse_args()
state = Path(args.state)
db = sqlite3.connect(state / 'conversations.sqlite3')
db.row_factory = sqlite3.Row
if args.action == 'backup':
    os.umask(0o077)
    directory = state / 'backups'
    directory.mkdir(exist_ok=True)
    path = directory / (datetime.now(timezone.utc).strftime('%Y-%m-%d') + '.sqlite3')
    with sqlite3.connect(path) as backup:
        db.backup(backup)
    for old in sorted(directory.glob('*.sqlite3'))[:-7]:
        old.unlink()
    print('Private database backup complete.')
else:
    clause = 'WHERE c.id=?' if args.conversation else ''
    rows = db.execute(f'SELECT c.*, (SELECT COUNT(*) FROM messages WHERE conversation=c.id) AS count FROM conversations c {clause} ORDER BY c.created DESC', (args.conversation,) if args.conversation else ()).fetchall()
    if args.action == 'list':
        for row in rows:
            print(json.dumps({'id': row['id'], 'created': datetime.fromtimestamp(row['created'], timezone.utc).isoformat(), 'messages': row['count'], 'contact': json.loads(row['contact']) if row['contact'] else None}, ensure_ascii=False))
        pending = db.execute('SELECT COUNT(*) FROM outbox WHERE sent IS NULL').fetchone()[0]
        print(f'Pending email notifications: {pending}')
    else:
        print('<!doctype html><html lang="en"><meta charset="utf-8"><title>Private resume chat history</title><style>body{font:16px/1.6 system-ui;max-width:850px;margin:40px auto;padding:20px}pre{white-space:pre-wrap;overflow-wrap:anywhere}article{border-top:1px solid #ccc;margin-top:30px}dt{font-weight:bold}dd{margin:0 0 20px;white-space:pre-wrap}</style><h1>Private resume chat history</h1>')
        for row in rows:
            print(f'<article><h2>{html.escape(row["id"])}</h2><p>{datetime.fromtimestamp(row["created"], timezone.utc).isoformat()}</p>')
            if row['contact']:
                print('<h3>Contact request</h3><pre>' + html.escape(json.dumps(json.loads(row['contact']), ensure_ascii=False, indent=2)) + '</pre>')
            print('<dl>')
            for message in db.execute('SELECT * FROM messages WHERE conversation=? ORDER BY id', (row['id'],)):
                print('<dt>Visitor</dt><dd>' + html.escape(message['question']) + '</dd><dt>Assistant</dt><dd>' + html.escape(message['answer'] or '') + '</dd>')
            print('</dl></article>')
        print('</html>')
db.close()
