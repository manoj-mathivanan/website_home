# Homepage deployment

This homepage shares the existing DigitalOcean `manoj-projects` VPS with Trader. Caddy serves the static resume directly, so there is no extra application process or purchased hosting service.

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

## Future resume chatbot

The existing VPS can run a small, separate backend for `/api/chat`, while Caddy continues serving the homepage as static files. Keep model API credentials only on the server. Add request limits, spending limits, and a reviewed public resume knowledge base when implementing the chatbot. No chatbot backend or model charges are introduced by this deployment. A traffic increase or heavier local model would require a fresh capacity and cost assessment.
