import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Immobilier";
  const phone    = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const email    = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const fb       = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  const ig       = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const year     = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__line" />

      <div className="container">
        <div className="footer__grid">

          {/* Brand */}
          <div className="footer__brand">
            {/* <div className="footer__logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1"/>
                <path d="M12 2v20M2 7l10 5 10-5" stroke="currentColor" strokeWidth="1"/>
              </svg>
              <span>{siteName}</span>
            </div> */}
            <div className="footer__logo">
              <Image
                src="/logo.png"
                alt={siteName}
                width={140}
                height={140}
                className="footer__logo-img"
              />
            </div>
            <p className="footer__tagline">
              L'immobilier d'exception au nord du Maroc. Vente, location et vacances.
            </p>

            {/* Contact details */}
            <div className="footer__contact">
              {phone && (
                <a href={`tel:${phone}`} className="footer__contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="footer__contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {email}
                </a>
              )}
            </div>

            {/* Social icons */}
            {(ig || fb || waNumber) && (
              <div className="footer__socials">
                {ig && (
                  <a href={ig} target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="17" height="17">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                    </svg>
                  </a>
                )}
                {fb && (
                  <a href={fb} target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                  </a>
                )}
                {waNumber && (
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="footer__social footer__social--wa" aria-label="WhatsApp">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="footer__col">
            <h4 className="footer__heading">Explorer</h4>
            <nav className="footer__nav">
              <Link href="/vente"     className="footer__link">Acheter un bien</Link>
              <Link href="/location"  className="footer__link">Louer un bien</Link>
              <Link href="/vacances"  className="footer__link">Vacances</Link>
              <Link href="/recherche" className="footer__link">Recherche avancée</Link>
              <Link href="/contact"   className="footer__link">Contact</Link>
            </nav>
          </div>

          {/* Cities */}
          <div className="footer__col">
            <h4 className="footer__heading">Villes</h4>
            <nav className="footer__nav">
              {["Tanger", "Tétouan", "M'diq", "Martil", "Al Hoceima"].map(c => (
                <Link key={c} href={`/vente?city=${encodeURIComponent(c)}`} className="footer__link">
                  {c}
                </Link>
              ))}
            </nav>
          </div>

        </div>

        <div className="footer__bottom">
          <p>© {year} {siteName}. Tous droits réservés.</p>
          <span className="footer__bottom-tag">Immobilier au Maroc</span>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--surface);
          padding: 80px 0 0;
          margin-top: 120px;
          position: relative;
        }
          .footer__logo {
  margin-bottom: 16px;
  margin-top: -60px;
}
.footer__logo-img {
  height: 140px; width: auto;
  object-fit: contain;
  opacity: 0.9;
}
        .footer__line {
          position: absolute; top: 0; left: 40px; right: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }
        .footer__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 60px; padding-bottom: 60px;
        }
        @media (max-width: 768px) {
          .footer__grid { grid-template-columns: 1fr; gap: 40px; }
        }

        .footer__logo {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display);
          font-size: 18px; color: var(--white); margin-bottom: 16px;
        }
        .footer__logo svg { color: var(--gold); }

        .footer__tagline {
          font-size: 14px; color: var(--muted);
          line-height: 1.7; max-width: 280px; margin-bottom: 20px;
        }

        /* Contact details */
        .footer__contact {
          display: flex; flex-direction: column; gap: 10px;
          margin-bottom: 24px;
        }
        .footer__contact-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--muted-2);
          text-decoration: none; transition: color 0.2s ease;
        }
        .footer__contact-item:hover { color: var(--gold); }
        .footer__contact-item svg { color: var(--gold); flex-shrink: 0; }

        /* Social icons */
        .footer__socials { display: flex; gap: 8px; }
        .footer__social {
          width: 36px; height: 36px; border-radius: var(--r-sm);
          background: var(--surface-3);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--muted-2); text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer__social:hover {
          border-color: var(--gold); color: var(--gold);
          background: rgba(184,151,90,0.08);
          transform: translateY(-2px);
        }
        .footer__social--wa:hover {
          border-color: rgba(37,211,102,0.4);
          color: #4cd880;
          background: rgba(37,211,102,0.08);
        }

        .footer__heading {
          font-family: var(--font-ui);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 24px;
        }
        .footer__nav { display: flex; flex-direction: column; gap: 14px; }
        .footer__link {
          font-size: 14px; color: var(--muted);
          text-decoration: none; transition: color 0.2s ease;
        }
        .footer__link:hover { color: var(--white); }

        .footer__bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 0; border-top: 1px solid var(--border);
          font-size: 12px; color: var(--muted);
          letter-spacing: 0.04em; flex-wrap: wrap; gap: 12px;
        }
        .footer__bottom-tag {
          padding: 4px 12px; border: 1px solid var(--border);
          border-radius: 2px; font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted);
        }
      `}</style>
    </footer>
  );
}