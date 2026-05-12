import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OAuth & API",
};

export default function DevOAuthPage() {
  const prodIssuer = process.env.OAUTH_ISSUER ?? process.env.NEXT_PUBLIC_AUTH_ISSUER ?? "https://auth.adofai.net";
  const base = prodIssuer.replace(/\/$/, "");
  const rows = [
    { doc: "Authorization Server Metadata", path: "/.well-known/oauth-authorization-server", note: "GET — RFC 8414 discovery" },
    { doc: "Authorization UI", path: "/oauth/authorize", note: "?client_id=&redirect_uri=&response_type=code&scope=openid&code_challenge=&code_challenge_method=S256…" },
    { doc: "Token", path: "/api/oauth/token", note: "POST — authorization_code; prefer PKCE" },
    { doc: "Dynamic registration", path: "/api/oauth/register", note: "POST — register redirect URIs" },
    { doc: "UserInfo", path: "/api/oauth/userinfo", note: "GET — Bearer access_token" },
    { doc: "JWKS", path: "/api/oauth/jwks", note: "GET — verify JWT signatures" },
    { doc: "Revoke", path: "/api/oauth/revoke", note: "POST — revoke tokens" },
  ];

  return (
    <main className="dev-page">
      <h1>OAuth &amp; IdP URLs</h1>
      <p className="lead">
        Canonical issuer for this deployment (from server env)&nbsp;: <strong style={{ color: "var(--text)" }}>{base}</strong>.
        Consumers should still load discovery from <code>{base}/.well-known/oauth-authorization-server</code>.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.88rem",
            border: "1px solid var(--border)",
          }}
        >
          <thead>
            <tr style={{ background: "rgba(26,26,53,0.6)", textAlign: "left" }}>
              <th style={{ padding: "0.5rem 0.65rem" }}>Purpose</th>
              <th style={{ padding: "0.5rem 0.65rem" }}>Path</th>
              <th style={{ padding: "0.5rem 0.65rem" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ doc, path, note }) => (
              <tr key={path} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "0.5rem 0.65rem", color: "var(--text)" }}>{doc}</td>
                <td style={{ padding: "0.5rem 0.65rem" }}>
                  <code style={{ color: "#88aad0" }}>
                    <a href={path}>{base + path}</a>
                  </code>
                </td>
                <td style={{ padding: "0.5rem 0.65rem", color: "var(--muted)" }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="prose" style={{ marginTop: "1.5rem" }}>
        Verse OAuth client (<code>OAUTH_CLIENT_ID=adofai_verse_web</code>) and battle client (<code>adofai_online_contest</code>) ship in IdP prisma
        seeds — register extras through <code>/api/oauth/register</code> or extend the seed.
      </p>
    </main>
  );
}
