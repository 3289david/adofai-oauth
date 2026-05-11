# ADOFAI Auth — `auth.adofai.net`

Standalone **OAuth 2.0 Authorization Server** for the ADOFAI community. Deploy this app on its own hostname (for example **`https://auth.adofai.net`**) so **any website** can sign users in with **Authorization Code + PKCE** (public clients, no client secret in the browser).

This is intentionally **“open OAuth”**:

- **Dynamic client registration** — `POST /api/oauth/register` (RFC 7591-style) creates a **public** `client_id` for your app (PKCE required).
- **Manual clients** — you can also insert rows in the `OAuthClient` table or use the seed.

The main site (**ADOFAI.VERSE** at `adofai.net`) can keep its own cookies, or you can add a small Next.js callback route there that exchanges the code for tokens (see below).

---

## Endpoints (issuer = your deployment URL)

| URL | Purpose |
|-----|---------|
| `GET /.well-known/oauth-authorization-server` | Discovery (RFC 8414) |
| `GET /oauth/authorize` | Authorization endpoint — user signs in and approves |
| `POST /api/oauth/token` | Token endpoint — exchange `code` + `code_verifier` |
| `GET /api/oauth/userinfo` | OIDC-style profile (`Authorization: Bearer …`) |
| `POST /api/oauth/register` | Dynamic registration — returns `client_id` (public client) |
| `GET /login`, `GET /register` | Identity provider (IdP) sign-in / sign-up on **this** domain |

Public metadata example:

```http
GET https://auth.adofai.net/.well-known/oauth-authorization-server
```

---

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | **yes** | PostgreSQL connection string |
| `JWT_SECRET` | **yes (prod)** | Same secret used to sign IdP session cookies and API **access tokens** (HS256). Resource servers must share this secret **or** call `userinfo` with the bearer token. |
| `OAUTH_ISSUER` | **yes (prod)** | Public base URL of this service, e.g. `https://auth.adofai.net` |

Optional:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_AUTH_URL` | Same as issuer if you expose it client-side |
| `SEED_USER_PASSWORD` | Password for the seeded demo user (default `change-me-now!`) |

---

## Database

Uses Prisma + PostgreSQL.

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

- **Sharing users with ADOFAI.VERSE** — point `DATABASE_URL` at the **same** Postgres as the main app so the `User` table is shared (schema fields here are a compatible subset). If you keep separate databases, users are **different** on each system.
- OAuth tables: `OAuthClient`, `AuthCode`.

---

## Run locally

```bash
npm run dev
# http://localhost:3010
```

---

## 1) Register your website as an OAuth client

### Option A — Dynamic registration (open to developers)

```bash
curl -sS -X POST https://auth.adofai.net/api/oauth/register \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "My Fansite",
    "redirect_uris": ["https://mysite.example/oauth/callback"],
    "grant_types": ["authorization_code"],
    "token_endpoint_auth_method": "none"
  }'
```

Response includes `client_id`. **PKCE is mandatory** for these clients.

### Option B — Seed / DB

The seed script creates an example client `adofai_verse_web` with redirect URIs for local + production callbacks (adjust in `prisma/seed.ts`).

---

## 2) Authorization Code + PKCE (browser or server)

1. **Generate PKCE** in your app:

   - `code_verifier` — random 43–128 chars (unreserved).
   - `code_challenge` — `BASE64URL(SHA256(code_verifier))` (method `S256`).

2. **Redirect the user** to:

```http
GET https://auth.adofai.net/oauth/authorize
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=https://mysite.example/oauth/callback
  &scope=openid%20profile%20email
  &state=RANDOM_ANTICS
  &code_challenge=CHALLENGE
  &code_challenge_method=S256
```

3. After login + consent, the user returns to:

```text
https://mysite.example/oauth/callback?code=AUTH_CODE&state=...
```

4. **Exchange the code** (from your **server** for best security):

```bash
curl -sS -X POST https://auth.adofai.net/api/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=authorization_code" \
  --data-urlencode "code=AUTH_CODE" \
  --data-urlencode "redirect_uri=https://mysite.example/oauth/callback" \
  --data-urlencode "client_id=YOUR_CLIENT_ID" \
  --data-urlencode "code_verifier=ORIGINAL_VERIFIER"
```

5. Call **userinfo**:

```bash
curl -sS https://auth.adofai.net/api/oauth/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Returns JSON with `sub`, `email`, `username`, etc.

---

## Tokens

- Access tokens are **JWTs** (HS256) signed with `JWT_SECRET` and include `iss` = `OAUTH_ISSUER`.
- Your app can verify JWTs locally **if it shares `JWT_SECRET`**, or trust **`/api/oauth/userinfo`** only (no shared secret).

---

## Deploying at `auth.adofai.net`

1. Create DNS **CNAME** or **A** record: `auth.adofai.net` → your host (same as any Next.js app).
2. Set `OAUTH_ISSUER=https://auth.adofai.net` and `JWT_SECRET` to a strong random string.
3. Run migrations / `db:push`, seed if needed, `npm run build`, `npm run start` (or PM2, Docker, etc.).
4. Terminate TLS at your reverse proxy (Caddy, nginx, Cloudflare) with a valid certificate.

---

## New GitHub repository

This folder is a **separate** deployable app. Publish it as its own repo:

```bash
cd adofai-auth
git init
git add .
git commit -m "Initial commit: ADOFAI OAuth server for auth.adofai.net"
gh repo create adofai-auth --public --source=. --remote=origin --push
# Or create an empty repo on GitHub and:
git remote add origin https://github.com/YOU/adofai-auth.git
git push -u origin main
```

If this project lives inside the **ADOFAI.VERSE** monorepo clone, add `adofai-auth/` to the parent `.gitignore` so you do not commit the nested repo twice—or use a git submodule.

---

## Trademark / legal

“A Dance of Fire and Ice” and related marks belong to their owners. This service name is for the fan community; configure branding for your deployment.
