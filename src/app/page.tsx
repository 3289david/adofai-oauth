import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>One account for all of ADOFAI</h1>
        <p className="hero-lead">
          Sign up once and you&apos;re in &mdash; ADOFAI.NET, online tournaments, and every community site that uses ADOFAI accounts. No separate logins, no extra passwords.
        </p>
        <div className="btn-row">
          <Link href="/register" className="btn btn-primary">
            Create free account
          </Link>
          <Link href="/login" className="btn btn-ghost">
            Sign in
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Works across the ADOFAI community</h2>
        <div className="card-grid">
          <article className="card">
            <div className="badge" style={{ background: "rgba(255,34,68,0.15)", color: "#ff8899" }}>Maps &middot; Rankings</div>
            <h3>ADOFAI.NET</h3>
            <p>The main community site. Upload maps, check rankings, and browse everything ADOFAI &mdash; all signed in with your account.</p>
          </article>
          <article className="card">
            <div className="badge" style={{ background: "rgba(255,136,0,0.15)", color: "#ffcc88" }}>Tournaments</div>
            <h3>Online contests</h3>
            <p>Join community tournaments and battle events. Your ADOFAI account carries over automatically &mdash; just click &ldquo;Sign in with ADOFAI.&rdquo;</p>
          </article>
          <article className="card">
            <div className="badge" style={{ background: "rgba(0,102,255,0.15)", color: "#88ccff" }}>Community</div>
            <h3>Partner sites</h3>
            <p>Any ADOFAI community site can support sign-in with your account. One account, everywhere.</p>
          </article>
        </div>
      </section>

      <section className="section prose">
        <h2>Your account is free and always will be</h2>
        <p>
          Creating an account takes under a minute. Your password is never shared with any site you sign in to &mdash; only your username and profile are passed along.
        </p>
        <p style={{ marginTop: "1rem" }}>
          <Link href="/register" className="btn btn-primary" style={{ display: "inline-flex" }}>
            Get started
          </Link>
          {" "}
          <Link href="/how-it-works" className="btn btn-ghost" style={{ display: "inline-flex", marginLeft: "0.5rem" }}>
            How it works
          </Link>
        </p>
      </section>
    </>
  );
}
