import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="site-nav">
      <Link href="/" className="site-nav-brand">
        ADOFAI Account
      </Link>
      <nav className="site-nav-links" aria-label="Main">
        <Link href="/how-it-works">Help</Link>
        <Link href="/login">Sign in</Link>
        <Link href="/register">Create account</Link>
      </nav>
    </header>
  );
}
