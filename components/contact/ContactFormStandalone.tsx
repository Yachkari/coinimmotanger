"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { t, tr } from "@/lib/translations";

export default function ContactFormStandalone() {
  const { lang } = useLanguage();

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone,
          message: subject ? `[${subject}]\n\n${message}` : message,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? tr(t.contact.errorBody, lang)); return; }
      setSuccess(true);
    } catch {
      setError(lang === 'fr' ? 'Erreur réseau.' : 'Network error.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="csf csf--success">
        <div className="csf__success-icon">✓</div>
        <h3 className="csf__success-title">{tr(t.contact.successTitle, lang)}</h3>
        <p className="csf__success-text">{tr(t.contact.successBody, lang)}</p>
        {wa && (
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="csf__wa-btn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {lang === 'fr' ? 'Continuer sur WhatsApp' : 'Continue on WhatsApp'}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="csf">
      <div className="csf__header">
        <h2 className="csf__title">{tr(t.contact.pageTitle, lang)}</h2>
        <p className="csf__sub">{lang === 'fr' ? 'Nous répondons généralement en moins de 24h.' : 'We usually reply within 24 hours.'}</p>
      </div>

      <form onSubmit={handleSubmit} className="csf__form">
        <div className="csf__row">
          <div className="csf__field">
            <label className="csf__label">{tr(t.contact.name, lang)} *</label>
            <input
              className="csf__input"
              value={name} onChange={e => setName(e.target.value)}
              placeholder={tr(t.contact.namePlaceholder, lang)} required
            />
          </div>
          <div className="csf__field">
            <label className="csf__label">{tr(t.contact.phone, lang)}</label>
            <input
              type="tel" className="csf__input"
              value={phone} onChange={e => setPhone(e.target.value)}
              placeholder={tr(t.contact.phonePlaceholder, lang)}
            />
          </div>
        </div>

        <div className="csf__field">
          <label className="csf__label">{tr(t.contact.email, lang)} *</label>
          <input
            type="email" className="csf__input"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder={tr(t.contact.emailPlaceholder, lang)} required
          />
        </div>

        <div className="csf__field">
          <label className="csf__label">{tr(t.contact.subject, lang)}</label>
          <select className="csf__input" value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">{lang === 'fr' ? 'Choisir un sujet' : 'Choose a subject'}</option>
            <option value="Achat">    {lang === 'fr' ? 'Je souhaite acheter un bien' : 'I want to buy a property'  }</option>
            <option value="Location"> {lang === 'fr' ? 'Je cherche une location'     : 'I\'m looking to rent'      }</option>
            <option value="Vacances"> {lang === 'fr' ? 'Location vacances'           : 'Vacation rental'           }</option>
            <option value="Estimation">{lang === 'fr' ? 'Estimation de mon bien'     : 'Property valuation'        }</option>
            <option value="Autre">    {lang === 'fr' ? 'Autre demande'               : 'Other enquiry'             }</option>
          </select>
        </div>

        <div className="csf__field">
          <label className="csf__label">{tr(t.contact.message, lang)} *</label>
          <textarea
            className="csf__input"
            value={message} onChange={e => setMessage(e.target.value)}
            placeholder={tr(t.contact.messagePlaceholder, lang)}
            rows={5} required
          />
        </div>

        {error && <p className="csf__error">⚠ {error}</p>}

        <button type="submit" className="csf__submit" disabled={loading}>
          {loading
            ? <span className="csf__spinner" />
            : <><Send size={15} /> {tr(t.contact.send, lang)}</>
          }
        </button>
      </form>

      <style>{`
        .csf {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
        }
        .csf__header { padding: 28px 28px 0; margin-bottom: 24px; }
        .csf__title {
          font-family: var(--font-display);
          font-size: 24px; font-weight: 400;
          color: var(--white); margin-bottom: 6px;
        }
        .csf__sub { font-size: 13px; color: var(--muted); }
        .csf__form { padding: 0 28px 28px; display: flex; flex-direction: column; gap: 16px; }
        .csf__row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .csf__row { grid-template-columns: 1fr; } }
        .csf__field { display: flex; flex-direction: column; gap: 7px; }
        .csf__label {
          font-size: 10px; font-weight: 600;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em;
        }
        .csf__input {
          background: var(--surface-3); border: 1px solid var(--border);
          border-radius: var(--r-sm); padding: 12px 14px;
          font-size: 14px; color: var(--off-white);
          font-family: var(--font-ui); outline: none; width: 100%;
          transition: border-color 0.2s ease; resize: vertical; appearance: none;
        }
        .csf__input::placeholder { color: var(--muted); }
        .csf__input:focus { border-color: var(--gold); }
        .csf__input option { background: var(--surface-3); }
        .csf__error {
          font-size: 13px; color: #c45c5c;
          background: rgba(196,92,92,0.1); border: 1px solid rgba(196,92,92,0.2);
          border-radius: var(--r-sm); padding: 10px 14px;
        }
        .csf__submit {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: var(--gold); color: var(--black); border: none;
          border-radius: var(--r-sm); padding: 15px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: var(--font-ui); letter-spacing: 0.08em; text-transform: uppercase;
          transition: all 0.25s ease;
        }
        .csf__submit:hover:not(:disabled) { background: var(--gold-light); box-shadow: 0 6px 24px rgba(184,151,90,0.3); }
        .csf__submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .csf__spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.2); border-top-color: var(--black);
          animation: spin-slow 0.7s linear infinite; display: inline-block;
        }
        .csf--success {
          padding: 60px 40px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        .csf__success-icon {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(74,155,111,0.15); color: #4a9b6f;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 4px;
        }
        .csf__success-title { font-family: var(--font-display); font-size: 28px; color: var(--white); font-weight: 400; }
        .csf__success-text { font-size: 14px; color: var(--muted); }
        .csf__wa-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(37,211,102,0.1); color: #4cd880;
          border: 1px solid rgba(37,211,102,0.2);
          padding: 12px 24px; border-radius: var(--r-sm);
          font-size: 13px; font-weight: 500;
          text-decoration: none; transition: all 0.2s ease; margin-top: 8px;
        }
        .csf__wa-btn:hover { background: rgba(37,211,102,0.18); }
      `}</style>
    </div>
  );
}