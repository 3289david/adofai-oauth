import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Environment (.env)",
};

const IDP_DOTENV_PUBLIC = `# adofai-oauth/.env — non-secrets safe to duplicate across machines / templates
OAUTH_ISSUER="https://auth.adofai.net"
NEXT_PUBLIC_AUTH_ISSUER="https://auth.adofai.net"`;

const IDP_DOTENV_LOCAL = `# adofai-oauth/.env.local — never commit / never paste publicly
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/adofai_community"
JWT_SECRET=""

RESEND_API_KEY=""
RESEND_FROM="ADOFAI Auth <onboarding@resend.dev>"

NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
TURNSTILE_SECRET_KEY=""
# Optional seed password for prisma/seed.ts bootstrap user
# SEED_USER_PASSWORD="change-me-before-production"`;

const VERSE_DOTENV_PUBLIC = `# ADOFAI.VERSE/.env
NEXT_PUBLIC_APP_URL="https://adofai.net"
NEXT_PUBLIC_AUTH_ISSUER="https://auth.adofai.net"
OAUTH_ISSUER="https://auth.adofai.net"
OAUTH_CLIENT_ID="adofai_verse_web"`;

const VERSE_DOTENV_LOCAL = `# ADOFAI.VERSE/.env.local
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/adofai_community"
JWT_SECRET=""

RESEND_API_KEY=""
RESEND_FROM="ADOFAI.NET <onboarding@resend.dev>"

NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
TURNSTILE_SECRET_KEY=""

STEAM_API_KEY=""`;

const BATTLE_DOTENV_PUBLIC = `# adofai-battle/.env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_AUTH_ISSUER="https://auth.adofai.net"
OAUTH_CLIENT_ID="adofai_online_contest"`;

const BATTLE_DOTENV_LOCAL = `# adofai-battle/.env.local
#
# OAuth public clients omit client_secret. Register redirect URI on IdP, e.g.:
#   {NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback
#
# (battle uses SQLite separately; no DATABASE_URL unless you extend it.)
`;

export default function DevEnvironmentPage() {
  return (
    <main className="dev-page">
      <h1>Splitting .env and .env.local</h1>
      <p className="lead">
        Next.js loads <code>.env</code>, then merges <code>.env.local</code> on top (
        <a href="https://nextjs.org/docs/app/guides/environment-variables">docs</a>
        ).
        Put <strong>URLs, issuer strings, and NEXT_PUBLIC_*</strong> in <code>.env</code>; put{" "}
        <strong>database URLs, JWT, and vendor API secrets</strong> in <code>.env.local</code>, which stays gitignored.
      </p>

      <p className="prose">
        Template files mirror this split in each repo: copy <code>.env.public.example</code>→<code>.env</code>, and{" "}
        <code>.env.local.example</code>→ <code>.env.local</code>.
      </p>

      <h2 style={{ fontSize: "1.15rem", marginTop: "2rem" }}>1 · OAuth IdP (auth.adofai.net)</h2>
      <p className="prose">Repo:&nbsp;<code>adofai-oauth</code></p>
      <pre className="code-block">{IDP_DOTENV_PUBLIC}</pre>
      <pre className="code-block">{IDP_DOTENV_LOCAL}</pre>

      <h2 style={{ fontSize: "1.15rem", marginTop: "1rem" }}>2 · ADOFAI.NET (verse)</h2>
      <p className="prose">
        Repo: <code>adofai-verse</code> — OAuth callback path <code>/api/auth/oauth/callback</code> must align with{" "}
        <code>NEXT_PUBLIC_APP_URL</code>.
      </p>
      <pre className="code-block">{VERSE_DOTENV_PUBLIC}</pre>
      <pre className="code-block">{VERSE_DOTENV_LOCAL}</pre>

      <h2 style={{ fontSize: "1.15rem", marginTop: "1rem" }}>3 · Battle / contest app</h2>
      <p className="prose">
        Repo: <code>adofai-battle</code> — same OAuth pattern; SQLite for app-local data; link users via OAuth <code>sub</code>, stored as{" "}
        <code>adofai_net_id</code>.
      </p>
      <pre className="code-block">{BATTLE_DOTENV_PUBLIC}</pre>
      <pre className="code-block">{BATTLE_DOTENV_LOCAL}</pre>
    </main>
  );
}
