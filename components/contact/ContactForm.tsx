"use client";

import { useState } from "react";
import type { Listing } from "@/types";
import { buildWhatsAppLink, formatPrice } from "@/lib/utils";
import { Send, ArrowUpRight } from "lucide-react";

interface Props { listing: Listing; }

export default function ContactForm({ listing }: Props) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [message, setMessage] = useState(
    `Bonjour, je suis intéressé(e) par : "${listing.title}". Merci de me contacter.`
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id:    listing.id,
          listing_title: listing.title,
          name, email, phone, message,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? data.errors?.[0] ?? "Erreur d'envoi."); return; }
      setSuccess(true);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="cf cf--success">
        <div className="cf__success-icon">✓</div>
        <h3 className="cf__success-title">Message envoyé</h3>
        <p className="cf__success-text">Nous vous répondrons dans les plus brefs délais.</p>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="cf__wa-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Continuer sur WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="cf">
      {/* Listing preview */}
      <div className="cf__preview">
        <div className="cf__preview-info">
          <span className="cf__preview-label">Votre demande concerne</span>
          <span className="cf__preview-title">{listing.title}</span>
          <span className="cf__preview-price">{formatPrice(listing.price, listing.price_period)}</span>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="cf__wa">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Contacter via WhatsApp
        <ArrowUpRight size={14} style={{ marginLeft: "auto" }} />
      </a>

      <div className="cf__divider"><span>ou envoyer un email</span></div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="cf__form">
        <div className="cf__row">
          <div className="cf__field">
            <label className="cf__label">Nom *</label>
            <input className="cf__input" value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom" required />
          </div>
          <div className="cf__field">
            <label className="cf__label">Téléphone</label>
            <input type="tel" className="cf__input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+212 6XX XXX XXX" />
          </div>
        </div>

        <div className="cf__field">
          <label className="cf__label">Email *</label>
          <input type="email" className="cf__input" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" required />
        </div>

        <div className="cf__field">
          <label className="cf__label">Message *</label>
          <textarea className="cf__input" value={message} onChange={e => setMessage(e.target.value)} rows={4} required />
        </div>

        {error && <p className="cf__error">⚠ {error}</p>}

        <button type="submit" className="cf__submit" disabled={loading}>
          {loading ? <span className="cf__spinner" /> : <><Send size={14} /> Envoyer</>}
        </button>
      </form>

      <style>{`
        .cf {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
        }

        .cf__preview {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--surface-3);
        }
        .cf__preview-label {
          display: block; font-size: 10px; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 6px;
        }
        .cf__preview-title {
          display: block; font-family: var(--font-display);
          font-size: 16px; color: var(--white); margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cf__preview-price {
          display: block; font-size: 18px; color: var(--gold);
          font-family: var(--font-display); font-weight: 500;
        }

        .cf__wa {
          display: flex; align-items: center; gap: 10px;
          padding: 16px 24px;
          background: rgba(37,211,102,0.07);
          border-bottom: 1px solid rgba(37,211,102,0.15);
          color: #4cd880; font-size: 14px; font-weight: 500;
          text-decoration: none; transition: background 0.2s ease;
        }
        .cf__wa:hover { background: rgba(37,211,102,0.12); }

        .cf__divider {
          display: flex; align-items: center; gap: 12px;
          padding: 0 24px; margin: 20px 0 4px;
          font-size: 11px; color: var(--muted); letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .cf__divider::before, .cf__divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        .cf__form {
          padding: 4px 24px 24px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .cf__row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .cf__row { grid-template-columns: 1fr; } }

        .cf__field { display: flex; flex-direction: column; gap: 6px; }
        .cf__label {
          font-size: 10px; font-weight: 600; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .cf__input {
          background: var(--surface-3); border: 1px solid var(--border);
          border-radius: var(--r-sm); padding: 11px 13px;
          font-size: 14px; color: var(--off-white);
          font-family: var(--font-ui); outline: none; width: 100%;
          transition: border-color 0.2s ease; resize: vertical;
        }
        .cf__input::placeholder { color: var(--muted); }
        .cf__input:focus { border-color: var(--gold); background: var(--surface-2); }

        .cf__error {
          font-size: 13px; color: var(--red);
          background: rgba(196,92,92,0.1);
          border: 1px solid rgba(196,92,92,0.2);
          border-radius: var(--r-sm); padding: 10px 14px;
        }

        .cf__submit {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--gold); color: var(--black); border: none;
          border-radius: var(--r-sm); padding: 14px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: var(--font-ui);
          letter-spacing: 0.06em; text-transform: uppercase;
          transition: all 0.25s ease;
        }
        .cf__submit:hover:not(:disabled) {
          background: var(--gold-light);
          box-shadow: 0 6px 24px rgba(184,151,90,0.3);
        }
        .cf__submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .cf__spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.2); border-top-color: var(--black);
          animation: spin-slow 0.7s linear infinite; display: inline-block;
        }

        /* Success */
        .cf--success {
          padding: 48px 32px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .cf__success-icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(74,155,111,0.15); color: var(--green);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .cf__success-title {
          font-family: var(--font-display); font-size: 24px; color: var(--white);
        }
        .cf__success-text { font-size: 14px; color: var(--muted); }
        .cf__wa-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(37,211,102,0.1); color: #4cd880;
          border: 1px solid rgba(37,211,102,0.2);
          padding: 10px 20px; border-radius: 2px; font-size: 13px;
          font-weight: 500; text-decoration: none; transition: all 0.2s ease;
          margin-top: 8px;
        }
        .cf__wa-btn:hover { background: rgba(37,211,102,0.18); }
      `}</style>
    </div>
  );
}