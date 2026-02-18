import Link from "next/link";

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Immobilier";
  const phone    = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const email    = process.env.CONTACT_RECIPIENT_EMAIL;
  const year     = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-mark">◆</span>
              <span>{siteName}</span>
            </div>
            <p className="footer-tagline">
              Votre partenaire de confiance pour l'immobilier au Maroc.
              Appartements, villas et maisons à vendre, louer et en vacances.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Rechercher</h4>
            <nav className="footer-nav">
              <Link href="/vente"    className="footer-link">Acheter un bien</Link>
              <Link href="/location" className="footer-link">Louer un bien</Link>
              <Link href="/vacances" className="footer-link">Location vacances</Link>
              <Link href="/recherche" className="footer-link">Recherche avancée</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <nav className="footer-nav">
              {phone && (
                <a
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  WhatsApp
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="footer-link">
                  {email}
                </a>
              )}
            </nav>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {year} {siteName}. Tous droits réservés.</p>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--charcoal);
          color: var(--sand);
          padding: 64px 0 0;
          margin-top: 80px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
        }
        .footer-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-size: 20px;
          font-weight: 600; color: var(--cream);
          margin-bottom: 16px;
        }
        .logo-mark { color: var(--terracotta); }
        .footer-tagline {
          font-size: 14px; color: var(--muted); line-height: 1.7;
          max-width: 300px;
        }
        .footer-heading {
          font-family: var(--font-body); font-size: 11px;
          font-weight: 600; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 20px;
        }
        .footer-nav { display: flex; flex-direction: column; gap: 12px; }
        .footer-link {
          font-size: 14px; color: var(--sand);
          text-decoration: none; transition: color 0.2s ease;
        }
        .footer-link:hover { color: var(--terra-light); }
        .footer-bottom {
          padding: 24px 0;
          font-size: 13px; color: var(--muted); text-align: center;
        }
      `}</style>
    </footer>
  );
}