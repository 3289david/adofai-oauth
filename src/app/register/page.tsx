import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const code = typeof sp.error === "string" ? sp.error : "";
  const errMsg =
    code === "taken"
      ? "Email or username already registered."
      : code === "invalid"
        ? "Check username (3–20 letters/numbers), email, and password (8+ chars)."
        : code === "failed"
          ? "Could not register. Try again."
          : null;

  return (
    <div style={{ maxWidth: 400, margin: "3rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Create account</h1>
      <p style={{ color: "#7777aa", marginBottom: "1.25rem" }}>Identity on this IdP — used for OAuth sign-in.</p>
      {errMsg && (
        <div style={{ marginBottom: "1rem", padding: "0.75rem", borderRadius: 10, color: "#ff8888", fontSize: "0.9rem" }}>
          {errMsg}
        </div>
      )}
      <form action="/api/auth/register" method="POST">
        <label style={label}>Username</label>
        <input
          name="username"
          placeholder="3–20 characters"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_-]+"
          style={{ ...input, marginBottom: "1rem" }}
        />
        <label style={label}>Email</label>
        <input name="email" type="email" required style={{ ...input, marginBottom: "1rem" }} />
        <label style={label}>Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          style={{ ...input, marginBottom: "1.25rem" }}
        />
        <button type="submit" style={btn}>
          Create account
        </button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555577", textAlign: "center" }}>
        <Link href="/login">Back to sign in</Link>
      </p>
    </div>
  );
}

const label = { display: "block" as const, fontSize: "0.75rem", color: "#7777aa", marginBottom: 4 };

const input = {
  width: "100%" as const,
  padding: "0.65rem 0.75rem",
  borderRadius: 10,
  border: "1px solid #2a2a4a",
  background: "#0d0d18",
  color: "#f0f0ff",
};

const btn = {
  width: "100%" as const,
  padding: "0.75rem",
  borderRadius: 10,
  border: "none",
  fontWeight: 700 as const,
  cursor: "pointer",
  background: "linear-gradient(135deg, #ff2244, #ff8800)",
  color: "white",
};
