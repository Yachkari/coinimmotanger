"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") ?? "/dashboard";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur de connexion.");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">

      {/* Background grid pattern */}
      <div className="login-bg" />

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <span className="login-diamond">◆</span>
          <h1 className="login-title">Administration</h1>
          <p className="login-subtitle">Accès réservé au gestionnaire</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label className="field-label">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="admin@agence.ma"
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label className="field-label">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;600&family=Playfair+Display:wght@600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .login-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: #141414;
          border: 1px solid #222;
          border-radius: 16px;
          padding: 48px 40px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08);
          animation: cardIn 0.4s ease both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        .login-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .login-diamond {
          display: block;
          font-size: 28px;
          color: #c9a84c;
          margin-bottom: 16px;
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.6; }
        }

        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 600;
          color: #f0f0f0;
          letter-spacing: 0.02em;
          margin-bottom: 8px;
        }

        .login-subtitle {
          font-size: 13px;
          color: #555;
          letter-spacing: 0.02em;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-label {
          font-size: 12px;
          font-weight: 500;
          color: #888;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .field-input {
          background: #0f0f0f;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 14px;
          color: #e0e0e0;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.15s ease;
          width: 100%;
        }
        .field-input::placeholder { color: #333; }
        .field-input:focus { border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201,168,76,0.08); }

        .login-error {
          background: rgba(224,82,82,0.1);
          border: 1px solid rgba(224,82,82,0.2);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #e05252;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-btn {
          background: #c9a84c;
          color: #0a0a0a;
          border: none;
          border-radius: 8px;
          padding: 13px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
          letter-spacing: 0.02em;
        }
        .login-btn:hover:not(:disabled) {
          background: #d4b45a;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(201,168,76,0.3);
        }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}