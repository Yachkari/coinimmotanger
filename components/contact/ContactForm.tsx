"use client";

import { useState } from "react";
import type { Listing } from "@/types";
import { buildWhatsAppLink } from "@/lib/utils";
import { Send } from "lucide-react";

interface Props {
  listing: Listing;
}

export default function ContactForm({ listing }: Props) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [message, setMessage] = useState(
    `Bonjour, je suis intéressé(e) par ce bien : "${listing.title}". Pouvez-vous me donner plus d'informations ?`
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const waLink = buildWhatsAppLink(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!,
    listing.title
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id:    listing.id,
          listing_title: listing.title,
          name, email, phone, message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? data.errors?.[0] ?? "Erreur d'envoi.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="cf-success">
        <span className="cf-success-icon">✓</span>
        <h3>Message envoyé !</h3>
        <p>Nous vous répondrons dans les plus brefs délais.</p>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="cf-wa-btn">
          Aussi disponible sur WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="cf-root">
      <h3 className="cf-title">Demande d'information</h3>

      <a href={waLink} target="_blank" rel="noopener noreferrer" className="cf-wa-top">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Contacter via WhatsApp
      </a>

      <div className="cf-divider"><span>ou par email</span></div>

      <form onSubmit={handleSubmit} className="cf-form">
        <div className="cf-field">
          <label className="cf-label">Nom complet *</label>
          <input
            className="cf-input" value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Votre nom" required
          />
        </div>

        <div className="cf-field">
          <label className="cf-label">Email *</label>
          <input
            type="email" className="cf-input" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.com" required
          />
        </div>

        <div className="cf-field">
          <label className="cf-label">Téléphone</label>
          <input
            type="tel" className="cf-input" value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+212 6XX XXX XXX"
          />
        </div>

        <div className="cf-field">
          <label className="cf-label">Message *</label>
          <textarea
            className="cf-input" value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4} required
          />
        </div>

        {error && <p className="cf-error">⚠ {error}</p>}

        <button type="submit" className="cf-submit" disabled={loading}>
          {loading ? "Envoi…" : <><Send size={15} /> Envoyer le message</>}
        </button>
      </form>

      <style>{`
        .cf-root {
          background: var(--white); border-radius: var(--radius-lg);
          border: 1px solid var(--border); padding: 28px;
        }
        .cf-title {
          font-family: var(--font-display);
          font-size: 22px; font-weight: 600; color: var(--charcoal);
          margin-bottom: 20px;
        }
        .cf-wa-top {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: #25D366; color: white; border-radius: var(--radius-md);
          padding: 13px; text-decoration: none; font-size: 14px; font-weight: 500;
          transition: all 0.2s ease;
        }
        .cf-wa-top:hover { background: #20ba5a; transform: translateY(-1px); }

        .cf-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0; color: var(--muted); font-size: 13px;
        }
        .cf-divider::before, .cf-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        .cf-form { display: flex; flex-direction: column; gap: 16px; }
        .cf-field { display: flex; flex-direction: column; gap: 7px; }
        .cf-label {
          font-size: 11px; font-weight: 600; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .cf-input {
          background: var(--cream); border: 1.5px solid var(--border);
          border-radius: var(--radius-sm); padding: 11px 13px;
          font-size: 14px; color: var(--ink);
          font-family: var(--font-body); outline: none; width: 100%;
          transition: border-color 0.15s ease; resize: vertical;
        }
        .cf-input:focus { border-color: var(--terracotta); background: white; }

        .cf-error {
          font-size: 13px; color: var(--terracotta);
          background: rgba(196,113,79,0.08);
          border: 1px solid rgba(196,113,79,0.2);
          border-radius: var(--radius-sm); padding: 10px 14px;
        }

        .cf-submit {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--terracotta); color: white; border: none;
          border-radius: var(--radius-md); padding: 13px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          font-family: var(--font-body); transition: all 0.2s ease;
        }
        .cf-submit:hover:not(:disabled) {
          background: var(--terra-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(196,113,79,0.3);
        }
        .cf-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .cf-success {
          background: var(--white); border-radius: var(--radius-lg);
          border: 1px solid var(--border); padding: 40px 28px;
          text-align: center;
        }
        .cf-success-icon {
          display: inline-flex; width: 52px; height: 52px;
          align-items: center; justify-content: center;
          background: rgba(90,138,106,0.12); color: #5a8a6a;
          border-radius: 50%; font-size: 22px; margin-bottom: 16px;
        }
        .cf-success h3 {
          font-family: var(--font-display); font-size: 22px;
          color: var(--charcoal); margin-bottom: 8px;
        }
        .cf-success p { font-size: 14px; color: var(--muted); margin-bottom: 20px; }
        .cf-wa-btn {
          display: inline-block; background: #25D366; color: white;
          padding: 10px 20px; border-radius: 30px; font-size: 13px;
          font-weight: 500; text-decoration: none; transition: background 0.2s ease;
        }
        .cf-wa-btn:hover { background: #20ba5a; }
      `}</style>
    </div>
  );
}