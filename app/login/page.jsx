"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "שגיאה");
      }
    } catch {
      setError("שגיאת רשת");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #eef2ff, #faf5ff)",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "40px 32px",
        maxWidth: "400px",
        width: "100%",
        boxShadow: "0 8px 30px rgba(99,102,241,0.12)",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
        <h1 style={{
          fontSize: "24px",
          marginBottom: "6px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          עץ החלטה → פעולה
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "32px" }}>
          הכנס אימייל כדי להתחיל
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              fontSize: "16px",
              outline: "none",
              textAlign: "center",
              direction: "ltr",
              marginBottom: "12px",
              boxSizing: "border-box"
            }}
          />
          {error && (
            <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "12px" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: loading
                ? "#c7d2fe"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "default" : "pointer",
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)"
            }}
          >
            {loading ? "..." : "כניסה"}
          </button>
        </form>
      </div>
    </div>
  );
}
