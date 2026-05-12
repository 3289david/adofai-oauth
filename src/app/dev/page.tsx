import Link from "next/link";

export default function DevelopersHubPage() {
  return (
    <main className="dev-page">
      <p className="badge" style={{ marginBottom: "0.75rem" }}>
        Hosted at https://dev.adofai.net
      </p>
      <h1>Developer hub</h1>
      <p className="lead">
        Deploy this IdP Next app twice on the same build: point{" "}
        <strong style={{ color: "var(--text)" }}>auth.adofai.net</strong> at players (login, OAuth), and{" "}
        <strong style={{ color: "var(--text)" }}>dev.adofai.net</strong> at the same codebase — middleware rewrites "/" to "/dev". Use{" "}
        <code>/dev</code>
        anytime on localhost.
      </p>

      <p className="prose">
        Integration stack: central IdP (this repo / <code>adofai-oauth</code>),{" "}
        <a href="https://github.com/3289david/adofai-verse">ADOFAI.NET (verse)</a>, and{" "}
        <a href="https://github.com/3289david/adofai-battle">Battle / tournament app</a>. Split{" "}
        <code>.env</code>
        versus <code>.env.local</code> so you only commit/share non-secret URLs.
      </p>

      <div className="dev-grid" style={{ marginTop: "1.75rem" }}>
        <Link href="/dev/environment" className="dev-card-link">
          <h2>.env vs .env.local</h2>
          <p>Copy-paste bundles for OAuth IdP, verse, and battle — secrets stay in .env.local.</p>
        </Link>
        <Link href="/dev/oauth" className="dev-card-link">
          <h2>OAuth endpoints</h2>
          <p>Discovery URL, authorize, token, register, JWKS, userinfo, revoke.</p>
        </Link>
        <Link href="/how-it-works" className="dev-card-link">
          <h2>Player-facing A→Z</h2>
          <p>Non-technical walkthrough shared with ordinary users.</p>
        </Link>
        <a href="/.well-known/oauth-authorization-server" className="dev-card-link">
          <h2>Live discovery JSON</h2>
          <p>RFC 8414 Authorization Server Metadata for dynamic clients.</p>
        </a>
      </div>

      <h2 style={{ marginTop: "2.5rem", fontSize: "1.15rem" }}>Repos</h2>
      <ul className="prose">
        <li>
          IdP:&nbsp;<a href="https://github.com/3289david/adofai-oauth">3289david/adofai-oauth</a>
        </li>
        <li>
          Verse:&nbsp;<a href="https://github.com/3289david/adofai-verse">3289david/adofai-verse</a>
        </li>
        <li>
          Battle:&nbsp;<a href="https://github.com/3289david/adofai-battle">3289david/adofai-battle</a>
        </li>
      </ul>
    </main>
  );
}
