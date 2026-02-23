import { MapPin, Phone, Mail, Clock } from "lucide-react";

import ContactFormStandalone from "@/components/contact/ContactFormStandalone";
// import ContactFormStandalone from "@/components/contact/ContactFormWrapper";
// import OfficeMap from "@/components/contact/OfficeMapWrapper"
import OfficeMap from "@/components/contact/OfficeMap";
import { Suspense } from "react";




export const metadata = {
  title: `Contact — ${process.env.NEXT_PUBLIC_SITE_NAME ?? "Immobilier"}`,
  description: "Contactez-nous pour toute demande concernant nos biens immobiliers.",
};

export default function ContactPage() {
  const phone   = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const email   = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const wa      = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const fb      = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  const ig      = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const address = process.env.NEXT_PUBLIC_OFFICE_ADDRESS;
  const lat     = parseFloat(process.env.NEXT_PUBLIC_OFFICE_LAT ?? "35.7595");
  const lng     = parseFloat(process.env.NEXT_PUBLIC_OFFICE_LNG ?? "-5.8340");

  return (
    <div className="cp page-enter">

      {/* Hero */}
      <div className="cp__hero">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1 className="cp__title">Parlons de<br /><em>votre projet</em></h1>
          <p className="cp__sub">
            Notre équipe est disponible pour répondre à toutes vos questions
            et vous accompagner dans votre projet immobilier.
          </p>
        </div>
      </div>

      {/* Body — form LEFT, info+map RIGHT */}
      <div className="container cp__body">

        {/* Left — form */}
        
        
          <div className="reveal">
            <Suspense fallback={null}>
               <ContactFormStandalone />
            </Suspense>
           
          </div>
        
        

        {/* Right — info cards + socials + map */}
        <div className="cp__info">

          <div className="cp__cards">
            {address && (
              <div className="cp__card reveal">
                <div className="cp__card-icon"><MapPin size={16} /></div>
                <div>
                  <span className="cp__card-label">Adresse</span>
                  <span className="cp__card-val">{address}</span>
                </div>
              </div>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="cp__card reveal reveal-delay-1">
                <div className="cp__card-icon"><Phone size={16} /></div>
                <div>
                  <span className="cp__card-label">Téléphone</span>
                  <span className="cp__card-val">{phone}</span>
                </div>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="cp__card reveal reveal-delay-2">
                <div className="cp__card-icon"><Mail size={16} /></div>
                <div>
                  <span className="cp__card-label">Email</span>
                  <span className="cp__card-val">{email}</span>
                </div>
              </a>
            )}
            {wa && (
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
                className="cp__card cp__card--wa reveal reveal-delay-3">
                <div className="cp__card-icon cp__card-icon--wa">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <span className="cp__card-label">WhatsApp</span>
                  <span className="cp__card-val">Réponse rapide garantie</span>
                </div>
              </a>
            )}
            <div className="cp__card reveal reveal-delay-4">
              <div className="cp__card-icon"><Clock size={16} /></div>
              <div>
                <span className="cp__card-label">Disponibilité</span>
                <span className="cp__card-val">Lun–Sam, 9h–19h</span>
              </div>
            </div>
          </div>

          {/* Social row */}
          {(fb || ig || wa) && (
            <div className="cp__social reveal reveal-delay-4">
              <span className="cp__social-label">Suivez-nous</span>
              <div className="cp__social-icons">
                {ig && (
                  <a href={ig} target="_blank" rel="noopener noreferrer" className="cp__social-icon" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="17" height="17">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                )}
                {fb && (
                  <a href={fb} target="_blank" rel="noopener noreferrer" className="cp__social-icon" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                )}
                {wa && (
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
                    className="cp__social-icon cp__social-icon--wa" aria-label="WhatsApp">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Map — flush to bottom of column */}
          <div className="reveal reveal-delay-3">
            <Suspense fallback={null}>
              <OfficeMap lat={lat} lng={lng} address={address} />
            </Suspense>
            
          </div>

        </div>
      </div>

      <style>{`
        .cp__hero {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: calc(var(--nav-h) + 80px) 0 72px;
          position: relative; overflow: hidden;
        }
        .cp__hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 70% 50%, rgba(184,151,90,.07) 0%, transparent 60%);
          pointer-events: none;
        }
        .cp__title {
          font-size: clamp(40px, 6vw, 72px); font-weight: 400;
          margin: 12px 0 16px; line-height: 1.05;
        }
        .cp__title em { font-style: italic; color: var(--gold); }
        .cp__sub { font-size: 16px; color: var(--muted-2); max-width: 520px; line-height: 1.7; }

        /* Layout: form LEFT, info RIGHT */
        .cp__body {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 64px;
          padding-top: 72px; padding-bottom: 100px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .cp__body { grid-template-columns: 1fr; gap: 48px; }
        }

        /* Info column stacks tightly */
        .cp__info { display: flex; flex-direction: column; gap: 20px; }

        .cp__cards { display: flex; flex-direction: column; gap: 8px; }
        .cp__card {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 20px;
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: var(--r-md); text-decoration: none;
          transition: all 0.25s cubic-bezier(.16,1,.3,1);
        }
        .cp__card:hover { border-color: rgba(184,151,90,.3); transform: translateX(4px); }
        .cp__card--wa:hover { border-color: rgba(37,211,102,.3); }

        .cp__card-icon {
          width: 36px; height: 36px; border-radius: var(--r-sm);
          background: rgba(184,151,90,.1); border: 1px solid rgba(184,151,90,.15);
          color: var(--gold); display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cp__card-icon--wa { background: rgba(37,211,102,.1); border-color: rgba(37,211,102,.15); color: #4cd880; }

        .cp__card-label {
          display: block; font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .12em;
          color: var(--muted); margin-bottom: 2px;
        }
        .cp__card-val { display: block; font-size: 13px; color: var(--white); }

        /* Social */
        .cp__social { padding-top: 16px; border-top: 1px solid var(--border); }
        .cp__social-label {
          display: block; font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .14em;
          color: var(--muted); margin-bottom: 12px;
        }
        .cp__social-icons { display: flex; gap: 8px; flex-wrap: wrap; }
        .cp__social-icon {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px;
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: var(--r-sm); color: var(--muted-2);
          text-decoration: none; font-size: 12px; font-weight: 500;
          transition: all .2s ease;
        }
        .cp__social-icon:hover {
          border-color: var(--gold); color: var(--gold);
          background: rgba(184,151,90,.06); transform: translateY(-2px);
        }
        .cp__social-icon--wa:hover {
          border-color: rgba(37,211,102,.4); color: #4cd880;
          background: rgba(37,211,102,.06);
        }
      `}</style>
    </div>
  );
}