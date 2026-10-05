# Homepage deployment

This homepage shares the existing DigitalOcean `manoj-projects` VPS with Trader. Caddy serves the resume directly and proxies only `/api/chat/*` to a small Python service on loopback port 8766. No additional hosting subscription or model API is required.

## Infrastructure

| Item | Value |
| --- | --- |
| Site | `https://manojmathivanan.com` |
| Source | `https://github.com/manoj-mathivanan/website_home` |
| Source checkout | `/opt/home` |
| Static release files | `/srv/home/releases/<Git commit SHA>` |
| Active release | `/srv/home/current` symlink |
| Homepage Caddy fragment | `/etc/caddy/home.Caddyfile` |
| DNS | Cloudflare DNS-only apex A record to the existing VPS |

Trader keeps its own repository, `/opt/trader` checkout, data, Docker application, and Caddy hostname block. The homepage does not alter those.

## Initial setup

On the existing VPS, clone the public repository and create the release directory:

```sh
git clone https://github.com/manoj-mathivanan/website_home.git /opt/home
mkdir -p /srv/home/releases
sh /opt/home/deploy/publish.sh
systemctl restart home-chat.service
cp /opt/home/deploy/home.Caddyfile /etc/caddy/home.Caddyfile
```

Back up `/etc/caddy/Caddyfile`, then add `import /etc/caddy/home.Caddyfile` once. Preserve every existing hostname block. Validate with `caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile` before reloading `caddy.service`. Point the root-domain DNS record to the existing VPS. Caddy obtains and renews the HTTPS certificate automatically.

## Subsequent updates

After committing and pushing source changes to GitHub:

```sh
git -C /opt/home pull --ff-only origin main
sh /opt/home/deploy/publish.sh
```

The script publishes only tracked public site files from that exact commit, then switches the active release atomically. It does not expose `.git`, documentation, scripts, or the original resume. No Caddy reload is needed for content updates. Check the homepage, its JavaScript and stylesheet, and Trader's existing endpoint after publishing.

## Rollback

To restore a previously verified release, replace `<prior-commit>` with a real directory name from `/srv/home/releases`:

```sh
test -f /srv/home/releases/<prior-commit>/index.html
ln -s releases/<prior-commit> /srv/home/.rollback
mv -Tf /srv/home/.rollback /srv/home/current
```

Keep older release directories until rollback is no longer needed. Never clean Trader's directories during homepage updates.

## Private chatbot setup

Python 3.10+ is required; the backend uses only the standard library. Build locally before committing to regenerate `chat/knowledge.json`. On the VPS:

```sh
id home-chat >/dev/null 2>&1 || useradd --system --home-dir /var/lib/home-chat --shell /usr/sbin/nologin home-chat
install -m 600 /opt/home/chat/config.env.example /etc/home-chat.env
install -m 644 /opt/home/deploy/home-chat*.service /opt/home/deploy/home-chat-backup.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now home-chat.service home-chat-backup.timer
```

Do not overwrite an existing `/etc/home-chat.env`: it contains private credentials. Configure one sender using `sudoedit /etc/home-chat.env`: either `RESEND_API_KEY` and `CHAT_EMAIL_FROM`, or the SMTP host/user/password and sender. SMTP requires TLS. Notification recipient defaults to `ma.manoj@gmail.com`. Restart `home-chat.service` after configuring credentials. Never put these values in Git, public assets, logs, or chat messages. A local ignored `chat/config.env` can be used to transfer configuration securely over SSH.

Install the updated homepage Caddy fragment, validate the main configuration, and reload Caddy. Preserve the Trader hostname block. Check `/api/chat/status` over HTTPS. `notifications_ready` indicates credentials are present, **not** verified inbox delivery; send one clearly marked test conversation and verify its email before declaring notifications operational.

Each first message creates one private conversation and a durable notification. Retries with the same request ID do not duplicate messages or notifications. Optional contact details create a separate follow-up notification. When sender configuration is missing or delivery fails, email stays queued for retry. Resend supports idempotent delivery; SMTP has a small possibility of duplicates if the process stops after sending but before saving delivery confirmation.

History lives in `/var/lib/home-chat/conversations.sqlite3`, owned by the isolated `home-chat` system user. There is no public history/admin endpoint; anonymous cookies can access only their own transcript. Origins, request sizes, session signatures, and request rates are checked. Stored network rate-limit identifiers are hashed. Answers quote trusted public facts and decline unsupported requests; this is a deterministic facts assistant, not a general-purpose generative model.

## Read history and contacts

Use SSH as the server owner:

```sh
python3 /opt/home/chat/admin.py list
umask 077
python3 /opt/home/chat/admin.py export > /root/home-chat-history.html
# Or export one conversation ID from a notification:
python3 /opt/home/chat/admin.py export --conversation <id> > /root/home-chat-history.html
```

Copy the HTML privately to your computer using SCP and open it locally. Never place an export under `/srv/home` or commit it. Exports escape visitor text and contain no executable scripts. Keep exported copies only as long as needed.

Inactive conversations expire after 90 days, including messages, contact details, and queued notifications. The daily timer creates seven rolling private SQLite backups under `/var/lib/home-chat/backups`; older snapshots may contain expired records for up to seven additional days. Backups on the same VPS protect against accidental edits, not VPS loss. To restore, stop `home-chat.service`, preserve the current database, restore a chosen backup with owner `home-chat` and mode 600, remove stale WAL/SHM files while stopped, then restart. The service immediately applies retention cleanup.

Backend rollback also requires checking out the prior compatible source commit and restarting the service; switching the static release alone does not roll back Python code. Keep credentials and SQLite data outside the checkout.
