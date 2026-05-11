import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>
        ADOFAI Auth
      </h1>
      <p style={{ color: "#8888b0", lineHeight: 1.6 }}>
        OAuth 2.0 authorization server for <strong style={{ color: "#f0f0ff" }}>auth.adofai.net</strong>.
        Third-party sites can register a public client and sign users in with{' '}
        <strong style={{ color: "#f0f0ff" }}>Authorization Code + PKCE</strong>.
      </p>
      <ul style={{ marginTop: "1.5rem", lineHeight: 1.8, color: "#a0a0cc" }}>
        <li>
          <Link href="/.well-known/oauth-authorization-server">Discovery metadata</Link> (RFC 8414)
        </li>
        <li>
          <Link href="/login">Sign in</Link> (identity provider session)
        </li>
      </ul>
      <p style={{ marginTop: "2rem", fontSize: "0.85rem", color: "#555577" }}>
        Integrations: see README in the repository for client registration, token exchange, and{' '}
        <code style={{ color: "#8888aa" }}>userinfo</code>.
      </p>
    </main>
  );
}
