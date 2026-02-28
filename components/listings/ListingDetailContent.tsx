'use client'

import { useLanguage } from '@/components/language/LanguageProvider'
import { t, tr } from '@/lib/translations'
import { formatPrice, formatSurface, formatFloor, formatType, formatPurpose } from '@/lib/utils'
import ContactForm from '@/components/contact/ContactForm'
import ListingCard from '@/components/listings/ListingCard'
import ListingGallery from '@/components/listings/ListingGallery'
import { MapPin, Maximize2, Bed, Bath, Layers, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Listing, ListingImage } from '@/types'

interface Props {
  purpose:    string
  listing:    Listing
  related:    Listing[]
  amenities:  { key: string; label: string }[]
  structured: object
  images:     ListingImage[]   // ← was { url: string; order: number }[]
}

const STATUS_MAP: Record<string, string> = {
  vendu:   'badge-vendu',
  loue:    'badge-loue',
  reserve: 'badge-reserve',
}

export default function ListingDetailContent({
  purpose, listing, related, amenities, structured, images,
}: Props) {
  const { lang } = useLanguage()

  // ── The key feature: EN title/description fallback ──────────────────────
  const title = lang === 'en'
    ? (listing.title_en ?? listing.title)
    : listing.title

  const description = lang === 'en'
    ? (listing.description_en ?? listing.description)
    : listing.description

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
      />

      <div className="dp page-enter">

        {/* ── Gallery ── */}
        <ListingGallery images={images} title={title} />

        {/* ── Breadcrumb ── */}
        <div className="dp__breadcrumb">
          <div className="container dp__breadcrumb-inner">
            <Link href={`/${purpose}`} className="dp__back">
              <ArrowLeft size={14} />
              {formatPurpose(listing.purpose)}
            </Link>
            <span className="dp__bc-sep">/</span>
            <span className="dp__bc-cur">{listing.city}</span>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className="container dp__body">

          {/* Left — listing info */}
          <div className="dp__main">

            {/* Header */}
            <div className="dp__header">
              <div className="dp__badges">
                <span className="dp__purpose-badge">{formatPurpose(listing.purpose)}</span>
                <span className="dp__type-badge">{formatType(listing.type)}</span>
                {listing.reference && (
                  <span className="dp__ref-badge">{listing.reference}</span>
                )}
                {listing.status !== 'disponible' && (
                  <span className={`badge ${STATUS_MAP[listing.status] ?? ''}`}>
                    {tr(t.badge[listing.status as keyof typeof t.badge] ?? t.badge.disponible, lang)}
                  </span>
                )}
              </div>

              <h1 className="dp__title">{title}</h1>

              <div className="dp__location">
                <MapPin size={14} style={{ color: 'var(--gold)' }} />
                {listing.city}{listing.neighborhood ? `, ${listing.neighborhood}` : ''}
                {listing.address && <span className="dp__address">· {listing.address}</span>}
              </div>

              <div className="dp__price-row">
                <span className="dp__price">
                  {formatPrice(listing.price, listing.price_period)}
                </span>
               <a 
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dp__wa-quick"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Specs bar */}
            <div className="dp__specs">
              {listing.surface && (
                <div className="dp__spec">
                  <Maximize2 size={18} style={{ color: 'var(--gold)' }} />
                  <span className="dp__spec-val">{formatSurface(listing.surface)}</span>
                  <span className="dp__spec-lbl">{tr(t.detail.surface, lang)}</span>
                </div>
              )}
              {listing.rooms && (
                <div className="dp__spec">
                  <Layers size={18} style={{ color: 'var(--gold)' }} />
                  <span className="dp__spec-val">{listing.rooms}</span>
                  <span className="dp__spec-lbl">{lang === 'fr' ? 'Pièces' : 'Rooms'}</span>
                </div>
              )}
              {listing.bedrooms && (
                <div className="dp__spec">
                  <Bed size={18} style={{ color: 'var(--gold)' }} />
                  <span className="dp__spec-val">{listing.bedrooms}</span>
                  <span className="dp__spec-lbl">{tr(t.detail.bedrooms, lang)}</span>
                </div>
              )}
              {listing.bathrooms && (
                <div className="dp__spec">
                  <Bath size={18} style={{ color: 'var(--gold)' }} />
                  <span className="dp__spec-val">{listing.bathrooms}</span>
                  <span className="dp__spec-lbl">{tr(t.detail.bathrooms, lang)}</span>
                </div>
              )}
              {listing.floor !== null && (
                <div className="dp__spec">
                  <span style={{ fontSize: 18, color: 'var(--gold)' }}>⬡</span>
                  <span className="dp__spec-val">{formatFloor(listing.floor)}</span>
                  <span className="dp__spec-lbl">{tr(t.detail.floor, lang)}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="dp__section reveal">
                <span className="eyebrow">{tr(t.detail.description, lang)}</span>
                <p className="dp__description">{description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="dp__section reveal reveal-delay-1">
                <span className="eyebrow">{tr(t.detail.amenities, lang)}</span>
                <div className="dp__amenities">
                  {amenities.map(({ key, label }) => (
                    <span key={key} className="dp__amenity">{label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — sticky contact */}
          <aside className="dp__aside">
            <ContactForm listing={listing} />
          </aside>
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <section className="dp__related">
            <div className="container">
              <span className="eyebrow">
                {lang === 'fr' ? 'Similaires' : 'Similar properties'}
              </span>
              <h2 className="dp__related-title">
                {lang === 'fr' ? 'Vous aimerez aussi' : 'You might also like'}
              </h2>
              <div className="dp__related-grid">
                {related.map((l, i) => (
                  <div key={l.id} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                    <ListingCard listing={l} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <style>{`
        .dp__breadcrumb {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
        }
        .dp__breadcrumb-inner { display: flex; align-items: center; gap: 10px; }
        .dp__back {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: var(--gold);
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; transition: gap 0.2s ease;
        }
        .dp__back:hover { gap: 10px; }
        .dp__bc-sep { color: var(--border-hover); }
        .dp__bc-cur { font-size: 12px; color: var(--muted); }

        .dp__body {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 60px; padding-top: 56px; padding-bottom: 80px;
          align-items: start;
        }
        @media (max-width: 1100px) {
          .dp__body { grid-template-columns: 1fr; }
          .dp__aside { order: -1; }
        }

        .dp__header { margin-bottom: 40px; }
        .dp__badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .dp__purpose-badge, .dp__type-badge {
          font-size: 10px; font-weight: 600; padding: 5px 12px;
          border-radius: 2px; text-transform: uppercase; letter-spacing: 0.1em;
        }
        .dp__purpose-badge {
          background: rgba(184,151,90,0.12); color: var(--gold);
          border: 1px solid rgba(184,151,90,0.25);
        }
        .dp__type-badge {
          background: var(--surface-3); color: var(--muted-2);
          border: 1px solid var(--border);
        }
        .dp__title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 400; color: var(--white);
          line-height: 1.15; margin-bottom: 14px;
        }
        .dp__location {
          display: flex; align-items: center; gap: 6px;
          font-size: 14px; color: var(--muted-2); margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .dp__address { color: var(--muted); }
        .dp__price-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .dp__price {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 500; color: var(--gold);
        }
        .dp__wa-quick {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 2px;
          background: rgba(37,211,102,0.1);
          border: 1px solid rgba(37,211,102,0.2);
          color: #4cd880; font-size: 13px; font-weight: 500;
          text-decoration: none; transition: all 0.2s ease;
        }
        .dp__wa-quick:hover { background: rgba(37,211,102,0.18); }

        .dp__specs {
          display: flex; flex-wrap: wrap; gap: 0;
          border: 1px solid var(--border);
          border-radius: var(--r-md); overflow: hidden;
          margin-bottom: 48px; background: var(--surface-2);
        }
        .dp__spec {
          flex: 1; min-width: 100px;
          display: flex; flex-direction: column;
          align-items: center; gap: 6px;
          padding: 24px 16px;
          border-right: 1px solid var(--border);
          transition: background 0.2s ease;
        }
        .dp__spec:last-child { border-right: none; }
        .dp__spec:hover { background: var(--surface-3); }
        .dp__spec-val {
          font-family: var(--font-display);
          font-size: 22px; font-weight: 500; color: var(--white);
          text-align: center;
        }
        .dp__spec-lbl {
          font-size: 11px; color: var(--muted);
          letter-spacing: 0.06em; text-align: center;
          text-transform: uppercase;
        }

        .dp__section { margin-bottom: 48px; }
        .dp__description {
          font-size: 16px; color: var(--muted-2);
          line-height: 1.85; white-space: pre-wrap;
          margin-top: 8px;
        }
        .dp__amenities { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .dp__amenity {
          padding: 8px 16px; border-radius: 2px;
          background: var(--surface-3);
          border: 1px solid var(--border);
          font-size: 13px; color: var(--muted-2);
          transition: all 0.2s ease;
        }
        .dp__amenity:hover { border-color: var(--gold); color: var(--gold); }

        // .dp__aside { position: sticky; top: 90px; }
        .dp__aside { position: static; }

        .dp__related {
          padding: 80px 0; border-top: 1px solid var(--border);
          background: var(--surface);
        }
        .dp__related-title {
          font-size: clamp(28px, 4vw, 40px); font-weight: 400;
          margin: 8px 0 40px;
        }
        .dp__related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        .dp__ref-badge {
          font-size: 10px; font-weight: 700; padding: 5px 12px;
          border-radius: 2px; text-transform: uppercase; letter-spacing: 0.1em;
          background: rgba(201,168,76,0.08);
          color: var(--gold);
          border: 1px solid rgba(201,168,76,0.2);
          font-family: var(--font-ui);
        }
      `}</style>
    </>
  )
}