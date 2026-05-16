import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="site-nav">
      <Link href="/" className="site-nav-brand">
        ADOFAI Auth
      </Link>
      <nav className="site-nav-links" aria-label="Main">
        <a href="https://dev.adofai.net">Developers</a>
        <Link href="/how-it-works">How it works — A to Z</Link>
        <Link href="/login">Sign in</Link>
        <Link href="/register">Register</Link>
        <a href="/.well-known/oauth-authorization-server">OAuth discovery</a>
      </nav>
    </header>
  );
}
