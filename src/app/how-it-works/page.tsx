import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works",
  description: "How your ADOFAI account works across ADOFAI.NET, tournaments, and community sites.",
};

export default function HowItWorksPage() {
  return (
    <article className="section prose" style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 900, marginTop: 0, color: "var(--text)" }}>How your ADOFAI account works</h1>

      <h2 style={{ marginTop: "2.25rem", color: "#f0f0ff", fontSize: "1.2rem" }}>What is an ADOFAI account?</h2>
      <p>
        An ADOFAI account is a free account that works across every site in the ADOFAI community &mdash;
        ADOFAI.NET, online tournaments, and any partner site that supports ADOFAI sign-in.
        You create it once and use it everywhere.
      </p>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }}>Creating your account</h2>
      <ol>
        <li>Go to <Link href="/register">Register</Link> and enter your username, email, and password.</li>
        <li>Check your inbox for a confirmation email and click the link inside.</li>
        <li>That&apos;s it &mdash; your account is ready.</li>
      </ol>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }}>Signing in to ADOFAI sites</h2>
      <p>
        When you visit ADOFAI.NET or a tournament site and click <strong>Sign in with ADOFAI</strong>,
        you&apos;ll be brought here briefly to confirm it&apos;s really you, then sent straight back.
        You never type your password into any other site &mdash; only here.
      </p>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }}>Is my password safe?</h2>
      <p>
        Yes. Your password is stored securely and is <strong>never shared</strong> with ADOFAI.NET, tournament sites,
        or any other app. When you sign in to a partner site, only your username and public profile are passed along.
      </p>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }}>What sites use ADOFAI accounts?</h2>
      <ul>
        <li><strong>ADOFAI.NET</strong> &mdash; the main community site for maps, rankings, and uploads.</li>
        <li><strong>Online tournaments</strong> &mdash; community contest and battle events.</li>
        <li><strong>Partner sites</strong> &mdash; any community project that integrates ADOFAI sign-in.</li>
      </ul>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }}>I didn&apos;t receive my confirmation email</h2>
      <p>
        Check your spam folder first. If it&apos;s not there, you can request a new one from the sign-in page.
        Make sure you typed your email address correctly when you registered.
      </p>

      <h2 style={{ marginTop: "2rem", color: "#f0f0ff", fontSize: "1.2rem" }}>I forgot my password</h2>
      <p>
        Password reset is coming soon. In the meantime, contact a community admin for help.
      </p>

      <p style={{ marginTop: "2.5rem" }}>
        <Link href="/register" className="btn btn-primary" style={{ display: "inline-flex" }}>
          Create account
        </Link>
        {" "}
        <Link href="/login" className="btn btn-ghost" style={{ display: "inline-flex", marginLeft: "0.5rem" }}>
          Sign in
        </Link>
      </p>
    </article>
  );
}
