import Link from "next/link";

function LoginInner({
  err,
  returnTo,
}: {
  err: string | null;
  returnTo: string;
}) {
  return (
    <div style={{ maxWidth: 400, margin: "3rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Sign in</h1>
      <p style={{ color: "#7777aa", marginBottom: "1.25rem" }}>
        Identity provider for <strong style={{ color: "#f0f0ff" }}>auth.adofai.net</strong>
      </p>
      {err && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            borderRadius: 10,
            background: "rgba(255,34,68,0.1)",
            border: "1px solid rgba(255,34,68,0.25)",
            color: "#ff8888",
            fontSize: "0.9rem",
          }}
        >
          {err}
        </div>
      )}
      <form action="/api/auth/login" method="POST">
        <input type="hidden" name="return_to" value={returnTo} />
        <label style={{ display: "block", fontSize: "0.75rem", color: "#7777aa", marginBottom: 4 }}>
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          style={{
            width: "100%",
            padding: "0.6rem 0.75rem",
            marginBottom: "1rem",
            borderRadius: 10,
            border: "1px solid #2a2a4a",
            background: "#0d0d18",
            color: "#f0f0ff",
          }}
        />
        <label style={{ display: "block", fontSize: "0.75rem", color: "#7777aa", marginBottom: 4 }}>
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          style={{
            width: "100%",
            padding: "0.6rem 0.75rem",
            marginBottom: "1.25rem",
            borderRadius: 10,
            border: "1px solid #2a2a4a",
            background: "#0d0d18",
            color: "#f0f0ff",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: 10,
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            background: "linear-gradient(135deg, #ff2244, #ff8800)",
            color: "white",
          }}
        >
          Continue
        </button>
      </form>
      <p style={{ marginTop: "1.25rem", fontSize: "0.9rem", color: "#555577", textAlign: "center" as const }}>
        No account? <Link href="/register">Register</Link>
      </p>
      <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#444466" }}>
        After login you will return to: <code style={{ color: "#666688" }}>{returnTo}</code>
      </p>
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const returnTo = typeof sp.return_to === "string" ? sp.return_to : "/";
  const errCode = typeof sp.error === "string" ? sp.error : "";
  const err =
    errCode === "invalid"
      ? "Invalid email or password."
      : errCode === "missing"
        ? "Email and password required."
        : null;

  return <LoginInner err={err} returnTo={returnTo.startsWith("/") ? returnTo : "/"} />;
}
