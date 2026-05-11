import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

function err(msg: string) {
  return (
    <div style={{ padding: "2rem", maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.25rem" }}>OAuth error</h1>
      <p style={{ color: "#cc8888" }}>{msg}</p>
    </div>
  );
}

export default async function AuthorizePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const client_id = typeof sp.client_id === "string" ? sp.client_id : "";
  const redirect_uri = typeof sp.redirect_uri === "string" ? sp.redirect_uri : "";
  const response_type = typeof sp.response_type === "string" ? sp.response_type : "";
  const state = typeof sp.state === "string" ? sp.state : "";
  const code_challenge = typeof sp.code_challenge === "string" ? sp.code_challenge : "";
  const code_challenge_method =
    typeof sp.code_challenge_method === "string" ? sp.code_challenge_method : "S256";
  const scope = typeof sp.scope === "string" ? sp.scope : "openid profile email";

  if (response_type !== "code" || !client_id || !redirect_uri || !code_challenge) {
    return err("Missing or invalid parameters. Required: response_type=code, client_id, redirect_uri, code_challenge (PKCE).");
  }

  if (code_challenge_method !== "S256" && code_challenge_method !== "plain") {
    return err("Only S256 or plain code_challenge_method is supported.");
  }

  const client = await db.oAuthClient.findUnique({ where: { clientId: client_id } });
  if (!client || !client.redirectUris.includes(redirect_uri)) {
    return err("Unknown client_id or redirect_uri does not match this client.");
  }

  const sess = await getSession();
  if (!sess) {
    const q = new URLSearchParams();
    q.set("client_id", client_id);
    q.set("redirect_uri", redirect_uri);
    q.set("response_type", response_type);
    if (state) q.set("state", state);
    q.set("code_challenge", code_challenge);
    q.set("code_challenge_method", code_challenge_method);
    if (scope) q.set("scope", scope);
    redirect(`/login?return_to=${encodeURIComponent(`/oauth/authorize?${q.toString()}`)}`);
  }

  return (
    <div style={{ maxWidth: 420, margin: "3rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem" }}>Authorize app</h1>
      <p style={{ color: "#8888b0", marginBottom: "1.5rem" }}>
        <strong style={{ color: "#f0f0ff" }}>{client.name}</strong> ({client.clientId}) wants to access your
        account using scopes: <code style={{ color: "#a0aac8" }}>{scope}</code>
      </p>
      <form action="/api/oauth/consent" method="POST">
        <input type="hidden" name="client_id" value={client_id} />
        <input type="hidden" name="redirect_uri" value={redirect_uri} />
        <input type="hidden" name="state" value={state} />
        <input type="hidden" name="code_challenge" value={code_challenge} />
        <input type="hidden" name="code_challenge_method" value={code_challenge_method} />
        <input type="hidden" name="scope" value={scope} />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: 12,
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            background: "linear-gradient(135deg, #ff2244, #ff8800)",
            color: "white",
          }}
        >
          Authorize
        </button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#555577" }}>
        Signed in as {sess.username}. Wrong account? Clear cookies for this domain and sign in again.
      </p>
    </div>
  );
}
