import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How ADOFAI Auth works — A to Z",
  description:
    "End-to-end explanation of auth.adofai.net, ADOFAI.NET, the contest (battle) app, OAuth, Postgres, SQLite, Turnstile, and Resend email.",
};

const code = {
  background: "rgba(7,7,20,0.9)",
  border: "1px solid rgba(26,26,53,0.9)",
  borderRadius: 12,
  padding: "1rem 1.15rem",
  fontSize: "0.78rem",
  overflowX: "auto" as const,
  color: "#a0aac8",
  lineHeight: 1.5,
};

export default function HowItWorksPage() {
  return (
    <article className="section prose" style={{ maxWidth: 820 }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 900, marginTop: 0 }}>A → Z: the three ADOFAI services</h1>
      <p style={{ fontSize: "1rem", color: "var(--muted)" }}>
        This page is for <strong style={{ color: "var(--text)" }}>players and operators</strong>. Developers: RFC 8414 discovery is at{" "}
        <Link href="/.well-known/oauth-authorization-server">/.well-known/oauth-authorization-server</Link>; open client registration via{" "}
        <code>POST /api/oauth/register</code> (CORS enabled).
      </p>

      <h2 style={{ marginTop: "2.25rem", color: "#f0f0ff", fontSize: "1.2rem" }} id="overview">
        A · What exists?
      </h2>
      <ol>
        <li>
          <strong>auth.adofai.net</strong> — OAuth 2 / IdP (<em>this repo — adofai-oauth</em>). Holds passwords + email verification +
          CAPTCHA/session for sign-in screens.
        </li>
        <li>
          <strong>ADOFAI.NET</strong> — maps, rankings, upload, AI, etc. (<em>adofai-verse</em>). Signs you in via OAuth PKCE redirect; stores game
          data in Postgres (shared user rows with IdP if you configure the same <code>DATABASE_URL</code>).
        </li>
        <li>
          <strong>Online contest / battle app</strong> — tournaments (<em>adofai-battle</em>). Same OAuth PKCE → links your identity to a SQLite
          row via <code>adofai_net_id</code>.
        </li>
      </ol>
      <p>
        About <strong>&quot;Balltel&quot;</strong>: there is <strong>no</strong> project with that codename here. Assume you meant the{" "}
        <strong>Battle / tournament</strong> app — env template is in that repo as <code>.env.example</code>.
      </p>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }} id="players">
        B · What you do as a player
      </h2>
      <ol>
        <li>Create an account — <Link href="/register">Register here</Link> or follow a link from ADOFAI.NET.</li>
        <li>
          Finish <strong>Cloudflare Turnstile</strong>; we block disposable emails &amp; scripted abuse (rate limits, honeypot, timing checks).
        </li>
        <li>
          Confirm email — outbound mail uses <strong>Resend</strong> when <code>RESEND_API_KEY</code> is set on this server (same vendor pattern as
          ADOFAI.NET verification links).
        </li>
        <li>
          Visiting ADOFAI.NET or Battle: click <strong>OAuth / Continue</strong> → you briefly land here to authorize → you return logged in.
        </li>
      </ol>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }} id="email">
        C · Email sending (parity with legacy adofai-verse)
      </h2>
      <p>
        Previously, sign-up emails could originate from <strong>either</strong> host depending on UX. Today:{" "}
        <strong>verification links for NEW accounts typed on IdP screens</strong> are sent <strong>from this IdP</strong> using{" "}
        <strong>Resend</strong> (<code>RESEND_API_KEY</code>, <code>RESEND_FROM</code>). Links point to{" "}
        <strong>auth.adofai.net</strong> verification routes.
      </p>
      <p>
        ADOFAI.NET may still send its own mails via its own <strong>RESEND_*</strong> keys when that code runs there — configure both places in
        production so users always receive mail.</p>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }} id="oauth">
        D · OAuth + PKCE (why password never hits third-party PHP/Next)
      </h2>
      <p>
        Each app registers a <strong>redirect URL</strong> on the IdP and starts <code>/oauth/authorize</code> with a <strong>proof key</strong>.
        Tokens are swapped server-side (<code>/api/oauth/token</code>). Partner sites only ever see <strong>access_token</strong> +{" "}
        <strong>userinfo</strong>.</p>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }} id="databases">
        E · Postgres vs SQLite</h2>
      <ul>
        <li><strong>IdP + ADOFAI.NET:</strong> same PostgreSQL if you intentionally point both <code>DATABASE_URL</code> values — <code>User.id</code> is the OAuth <code>sub</code>.</li>
        <li><strong>Battle app:</strong> local SQLite tournament DB — only stores linkage <code>adofai_net_id = OAuth sub</code>.</li>
      </ul>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }} id="env">
        F · Copy-paste ENV files (duplicate into <code>.env.local</code>)</h2>
      <p>Below are authoritative templates tracked in Git as <strong>.env.example</strong>; strip comments if your host dislikes quotes.</p>

      <h3 style={{ color: "#c8c8e8", marginTop: "1.25rem" }}>1 — auth.adofai.net (OAuth / IdP)</h3>
      <pre style={code}>{`# === ADOFAI Auth (IdP) — production example ===

# Postgres (SHARED with ADOFAI.NET if you want one account database)
DATABASE_URL="postgresql://USER:PASSWORD@DB_HOST:5432/adofai_community"

# Public URL of THIS service — used in JWT "iss", discovery JSON, verification links (no trailing slash)
OAUTH_ISSUER="https://auth.adofai.net"

# Optional browser duplicate (SSR / client hints)
NEXT_PUBLIC_AUTH_ISSUER="https://auth.adofai.net"

# Separate secret for JWT session + OAuth access tokens — MUST NOT match main site JWT if you isolate
JWT_SECRET="$(openssl rand -base64 48)"

# Resend — transactional mail (verification)
RESEND_API_KEY="re_xxxxxxxx"
RESEND_FROM="ADOFAI Auth <noreply@example.com>"

# Cloudflare Turnstile — human gate on login & register widgets
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4AAA..."
TURNSTILE_SECRET_KEY="0x4AAA..."

# prisma/seed.ts demo login (optional dev)
SEED_USER_PASSWORD="change-me-once-deployed"`}</pre>

      <h3 style={{ color: "#c8c8e8", marginTop: "1.25rem" }}>2 — ADOFAI.NET</h3>
      <pre style={code}>{`# === ADOFAI.VERSE (.env.local) ===

DATABASE_URL="postgresql://USER:PASSWORD@DB_HOST:5432/adofai_community"
JWT_SECRET="$(openssl rand -base64 32)"

NEXT_PUBLIC_APP_URL="https://adofai.net"
NEXT_PUBLIC_AUTH_ISSUER="https://auth.adofai.net"
OAUTH_ISSUER="https://auth.adofai.net"
OAUTH_CLIENT_ID="adofai_verse_web"

RESEND_API_KEY="re_xxxxxxxx"
RESEND_FROM="ADOFAI.NET <noreply@example.com>"
NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
TURNSTILE_SECRET_KEY=""

STEAM_API_KEY=""`}</pre>

      <h3 style={{ color: "#c8c8e8", marginTop: "1.25rem" }} id="battle">
        3 — Battle / Online contest (“Balltel” → use this)</h3>
      <pre style={code}>{`# === ADOFAI Battle (.env.local) ===
# Pick one free port locally if ADOFAI.NET already occupies 3000

NEXT_PUBLIC_APP_URL="http://localhost:3001"
NEXT_PUBLIC_AUTH_ISSUER="https://auth.adofai.net"
OAUTH_CLIENT_ID="adofai_online_contest"`}</pre>

      <p style={{ marginTop: "2rem" }}>
        <Link href="/" className="btn btn-primary" style={{ display: "inline-flex" }}>
          ← Back home</Link>

        {" "}·{" "}
        <Link href="/register">Register</Link>
      </p>
    </article>
  );
}
