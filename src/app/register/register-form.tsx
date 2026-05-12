"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Mail, Loader2, Shield } from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

export default function RegisterPageClient() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const formLoadedAt = useRef(Date.now());

  const input = {
    width: "100%",
    padding: "0.55rem 0.7rem",
    borderRadius: 10,
    border: "1px solid rgba(26,26,53,0.8)",
    background: "rgba(7,7,15,0.8)",
    color: "#f0f0ff",
  } as const;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!turnstileToken) {
      setError("Complete verification.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          turnstile: turnstileToken,
          honeypot: (document.getElementById("hp-reg") as HTMLInputElement)?.value ?? "",
          formLoadedAt: formLoadedAt.current,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(d.error ?? "Failed");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{ maxWidth: 420, margin: "3rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <Mail size={40} style={{ marginBottom: "0.75rem" }} color="#44dd88" />
        <h1 style={{ marginBottom: "0.75rem" }}>Check your email</h1>
        <p style={{ color: "#8888b0", fontSize: "0.9rem", marginBottom: "1rem" }}>
          Verify <strong>{email}</strong>, then apps like ADOFAI.NET can sign you in with OAuth.
        </p>
        <Link href="/login" style={{ fontWeight: 700 }}>
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: "3rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ marginBottom: "0.35rem", fontWeight: 800 }}>Register</h1>
      <p style={{ color: "#8888b0", fontSize: "0.82rem", marginBottom: "1rem" }}>
        One account at <strong>auth.adofai.net</strong> for all integrating sites (Turnstile + email verify).
      </p>
      {error && (
        <div style={{ padding: "0.65rem", marginBottom: "1rem", color: "#ff8888", fontSize: "0.9rem", borderRadius: 10 }}>
          {error}
        </div>
      )}
      <form onSubmit={submit}>
        <input id="hp-reg" tabIndex={-1} aria-hidden autoComplete="off" name="company"
          style={{ position: "absolute", opacity: 0, left: -9999 }} />
        <label style={{ fontSize: "0.7rem", color: "#778" }}>Username</label>
        <input pattern="^[a-zA-Z0-9_-]+$" minLength={3} maxLength={20} required value={username}
          onChange={(e) => setUsername(e.target.value)} style={{ ...input, marginTop: 4, marginBottom: "0.75rem" }} />
        <label style={{ fontSize: "0.7rem", color: "#778" }}>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ ...input, marginTop: 4, marginBottom: "0.75rem" }} />
        <label style={{ fontSize: "0.7rem", color: "#778" }}>Password</label>
        <input type="password" minLength={8} required value={password}
          onChange={(e) => setPassword(e.target.value)} style={{ ...input, marginTop: 4, marginBottom: "0.85rem" }} />
        <TurnstileWidget
          onToken={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
        />
        <div style={{ marginTop: 8, fontSize: "0.72rem", color: turnstileToken ? "#44dd88" : "#666", display: "flex", gap: 6, alignItems: "center" }}>
          <Shield size={12} />
          {turnstileToken ? "Verification ready" : "Complete CAPTCHA"}
        </div>
        <button type="submit" disabled={loading || !turnstileToken}
          style={{
            marginTop: "1rem",
            width: "100%",
            padding: "0.75rem",
            borderRadius: 10,
            border: "none",
            fontWeight: 700,
            color: "#fff",
            cursor: loading ? "wait" : "pointer",
            opacity: loading || !turnstileToken ? 0.65 : 1,
            background: "linear-gradient(135deg,#ff2244,#ff8800)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}>
          {loading ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : null}
          Create account
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        <Link href="/login">Sign in</Link>
      </p>
    </div>
  );
}
