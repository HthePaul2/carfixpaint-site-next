# Deploy — Hetzner Hestia (`carfixpaint.tigidal.ro`)

## Layout pe server

| Path | Rol |
|------|-----|
| `/home/tigidal/web/carfixpaint.tigidal.ro/private/site-next` | App (git clone) |
| `/home/tigidal/web/carfixpaint.tigidal.ro/private/site-next/.env.production` | Env runtime |
| `/home/tigidal/web/carfixpaint.tigidal.ro/private/site-next/media` | Upload-uri Payload |
| systemd `carfixpaint-next.service` | Next standalone pe `127.0.0.1:3010` |
| Hestia proxy tpl `carfixpaint-node` | Nginx → `:3010`, backend `no-php` |

## Rebuild după `git pull`

```bash
ssh hetzner
export NVM_DIR=/root/.nvm && . "$NVM_DIR/nvm.sh" && nvm use 22.22.2
cd /home/tigidal/web/carfixpaint.tigidal.ro/private/site-next
grep '^PAYLOAD_MEDIA_DIR=' .env.production
GIT_SSH_COMMAND='ssh -i /root/.ssh/carfixpaint_github -o IdentitiesOnly=yes' git pull --ff-only
npm ci --legacy-peer-deps
npm run migrate
npm run build
mkdir -p .next/standalone/.next
rm -rf .next/standalone/.next/static .next/standalone/public
cp -a .next/static .next/standalone/.next/static
cp -a public .next/standalone/public
ln -sfn "$(pwd)/media" .next/standalone/media
test -e .next/standalone/media/home.jpg
cp -f .env.production .next/standalone/.env.production
systemctl restart carfixpaint-next
```

`PAYLOAD_MEDIA_DIR` trebuie să pointeze la directorul persistent de uploaduri:

```dotenv
PAYLOAD_MEDIA_DIR=/home/tigidal/web/carfixpaint.tigidal.ro/private/site-next/media
```

**Ordine importantă:** pe DB goală, rulează `migrate` (și opțional `seed`) **înainte** de `build` — pagina global 404 citește site-settings la build.

## Template-uri Hestia

Fișierele din `deploy/hestia/` se copiază pe server în:

`/usr/local/hestia/data/templates/web/nginx/`

Apoi:

```bash
v-change-web-domain-backend-tpl tigidal carfixpaint.tigidal.ro no-php
v-change-web-domain-proxy-tpl tigidal carfixpaint.tigidal.ro carfixpaint-node
```

## Credențiale

Secrete pe VPS (doar root): `/root/carfixpaint-db-credentials.txt`
