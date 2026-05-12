import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>One login for ADOFAI.NET · tournaments · partner sites</h1>
        <p className="hero-lead">
          <strong style={{ color: "var(--text)" }}>auth.adofai.net</strong> is the community&apos;s <strong>identity host</strong>. You verify as a
          human (Cloudflare Turnstile), prove you&apos;re real (rate limits), confirm your email (Resend), then any approved app signs you in with
          OAuth — without ever giving that app your password.
        </p>
        <div className="btn-row">
          <Link href="/register" className="btn btn-primary">
            Create account
          </Link>
          <Link href="/login" className="btn btn-ghost">
            Sign in
          </Link>
          <Link href="/how-it-works" className="btn btn-ghost">
            Full A → Z guide
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>The three services (what connects to whom)</h2>
        <div className="card-grid">
          <article className="card">
            <div className="badge">Identity</div>
            <h3>1 — This site (OAuth / IdP)</h3>
            <p>
              <strong style={{ color: "var(--text)" }}>auth.adofai.net</strong> — password storage, verification email, CAPTCHA session, OAuth
              codes. Apps never see your password.
            </p>
          </article>
          <article className="card">
            <div className="badge" style={{ background: "rgba(255,34,68,0.15)", color: "#ff8899" }}>
              Maps · AI
            </div>
            <h3>2 — ADOFAI.NET</h3>
            <p>The main community site (maps DB, uploads, rankings). Signs you in via OAuth and reads your profile from Postgres.</p>
          </article>
          <article className="card">
            <div className="badge" style={{ background: "rgba(255,136,0,0.15)", color: "#ffcc88" }}>
              Battles — “Battle” app
            </div>
            <h3>3 — Online contest (“ADOFAI Battle”)</h3>
            <p>
              Tournament / contest app (often called battle in repos). Uses the same OAuth; links your IdP ID to a local game profile (
              <code>adofai_net_id</code>).
            </p>
            <p style={{ marginTop: "0.65rem", fontSize: "0.8rem" }}>
              Nothing named <strong>&quot;Balltel&quot;</strong> exists in our code — use this block for{" "}
              <strong>Battle / contest hosting</strong>
              (.env below).
            </p>
          </article>
        </div>
      </section>

      <section className="section prose">
        <h2>For developers · “open” integrations</h2>
        <p>
          Any website can mint a <strong>public PKCE OAuth client</strong> by calling{" "}
          <code>POST …/api/oauth/register</code> (CORS enabled). Tokens are JWTs signed with our <code>JWT_SECRET</code>; consume{" "}
          <code>GET …/api/oauth/userinfo</code> with Bearer access token.
        </p>
        <p style={{ marginTop: "1rem" }}>
          <Link href="/how-it-works" className="btn btn-primary" style={{ display: "inline-flex" }}>
            Read A → Z (flows, databases, emails)
          </Link>
        </p>
      </section>
    </>
  );
}
