"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Shield, Loader2, Mail } from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

export default function LoginFormWrapper({ initialReturn }: { initialReturn: string }) {
  return <IdpLoginForm initialReturn={initialReturn} />;
}

function IdpLoginForm({ initialReturn }: { initialReturn: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const formLoadedAt = useRef(Date.now());

  const [needsVerify, setNeedsVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sent" | "error">("idle");
  const [resendErr, setResendErr] = useState("");

  const input = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    borderRadius: 10,
    border: "1px solid rgba(26,26,53,0.8)",
    background: "rgba(7,7,15,0.8)",
    color: "#f0f0ff",
  } as const;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!turnstileToken) {
      setError("Please complete verification first.");
      return;
    }
    setLoading(true);
    setError("");
    setNeedsVerify(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          turnstile: turnstileToken,
          honeypot: (document.getElementById("hp-login") as HTMLInputElement)?.value ?? "",
          formLoadedAt: formLoadedAt.current,
          return_to: initialReturn.startsWith("/") ? initialReturn : "/",
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.error === "EMAIL_NOT_VERIFIED") {
          setNeedsVerify(true);
          setVerifyEmail(data.email ?? email);
          setResendStatus("idle");
        } else {
          setError(typeof data.error === "string" ? data.error : "Login failed");
        }
        return;
      }

      const next = typeof data.return_to === "string" ? data.return_to : initialReturn;
      window.location.href = next.startsWith("/") ? next : "/";
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setResending(true);
    setResendErr("");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmail }),
      });
      const d = await res.json();
      setResendStatus(res.ok ? "sent" : "error");
      if (!res.ok) setResendErr(d.error ?? "Failed");
    } catch {
      setResendStatus("error");
      setResendErr("Network error");
    } finally {
      setResending(false);
    }
  }

  if (needsVerify) {
    return (
      <div style={{ maxWidth: 400, margin: "3rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <Mail size={32} style={{ marginBottom: "0.75rem" }} color="#ff8800" />
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Verify your email</h1>
        <p style={{ color: "#8888b0", fontSize: "0.9rem", marginBottom: "1rem" }}>
          Check <strong style={{ color: "#f0f0ff" }}>{verifyEmail}</strong>
        </p>
        <button type="button" onClick={resend} disabled={resending} style={{
          padding: "0.5rem 1rem", borderRadius: 8, border: "none", cursor: resending ? "wait" : "pointer",
          background: "linear-gradient(135deg,#ff2244,#ff8800)", color: "white", fontWeight: 700,
        }}>
          {resending ? "Sending…" : "Resend link"}
        </button>
        {resendStatus === "sent" && <p style={{ color: "#44dd88", marginTop: "0.75rem" }}>Sent. Check inbox.</p>}
        {resendErr && <p style={{ color: "#ff8888", marginTop: "0.5rem" }}>{resendErr}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "3rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Sign in</h1>
      <p style={{ color: "#8888b0", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
        Uses the same protections as ADOFAI.NET — Turnstile, rate limits, and email verification.
      </p>
      {error && (
        <div style={{ padding: "0.75rem", marginBottom: "1rem", borderRadius: 10, color: "#ff8888",
          border: "1px solid rgba(255,34,68,0.25)", background: "rgba(255,34,68,0.08)", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}
      <form onSubmit={submit}>
        <input id="hp-login" tabIndex={-1} aria-hidden name="biz" autoComplete="off"
          style={{ position: "absolute", left: -9999, opacity: 0, height: 0, width: 0 }} />
        <label style={{ fontSize: "0.75rem", color: "#7777aa" }}>Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...input, marginBottom: "1rem", marginTop: 4 }} />
        <label style={{ fontSize: "0.75rem", color: "#7777aa" }}>Password</label>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...input, marginTop: 4, marginBottom: "1rem" }} />
        <TurnstileWidget
          onToken={setTurnstileToken}
          onError={() => setError("Verification failed to load")}
          onExpire={() => setTurnstileToken("")}
        />
        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: turnstileToken ? "#44dd88" : "#778" }}>
          {turnstileToken ? <Shield size={12} /> : null}
          {turnstileToken ? "Human verification ready" : "Complete the check above"}
        </div>
        <button type="submit" disabled={loading || !turnstileToken}
          style={{
            marginTop: "1rem",
            width: "100%",
            padding: "0.75rem",
            borderRadius: 10,
            border: "none",
            cursor: loading ? "wait" : "pointer",
            opacity: loading || !turnstileToken ? 0.65 : 1,
            fontWeight: 700,
            color: "white",
            background: "linear-gradient(135deg,#ff2244,#ff8800)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
          }}>
          {loading ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : null}
          Continue
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.85rem", color: "#555577" }}>
        <Link href="/register">Create account</Link>
      </p>
    </div>
  );
}
