import Link from "next/link";

export default function DevSiteNav() {
  return (
    <header className="dev-nav">
      <Link href="/dev" className="dev-nav-brand">
        ADOFAI Developers
      </Link>
      <span className="dev-nav-tag">dev.adofai.net</span>
      <nav className="dev-nav-links" aria-label="Developer">
        <Link href="/dev">Hub</Link>
        <Link href="/dev/environment">.env split</Link>
        <Link href="/dev/oauth">OAuth &amp; API</Link>
        <a href="/.well-known/oauth-authorization-server">Discovery (JSON)</a>
        <Link href="/login">Try IdP login</Link>
      </nav>
    </header>
  );
}
