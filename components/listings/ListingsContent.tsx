'use client'

import { useLanguage } from '@/components/language/LanguageProvider'
import { t, tr } from '@/lib/translations'
import ListingCard from '@/components/listings/ListingCard'
import ListingFilters from '@/components/listings/ListingFilters'
import Pagination from '@/components/listings/Pagination'
import type { Listing, ListingPurpose } from '@/types'

interface Props {
  purpose:        ListingPurpose
  listings:       Listing[]
  total:          number
  totalPages:     number
  page:           number
  limit:          number
  currentFilters: Record<string, string>
}

export default function ListingsContent({
  purpose, listings, total, totalPages, page, limit, currentFilters,
}: Props) {
  const { lang } = useLanguage()

  const TITLES: Record<ListingPurpose, { fr: string; en: string }> = {
    vente:    { fr: 'Biens à Vendre',      en: 'Properties for Sale'   },
    location: { fr: 'Biens à Louer',       en: 'Properties for Rent'   },
    vacances: { fr: 'Locations Vacances',  en: 'Vacation Rentals'      },
  }

  const SUBTITLES: Record<ListingPurpose, { fr: string; en: string }> = {
    vente:    { fr: 'Appartements, villas et maisons à acquérir',    en: 'Apartments, villas and houses to buy'        },
    location: { fr: 'Location longue durée au nord du Maroc',        en: 'Long-term rental in northern Morocco'        },
    vacances: { fr: 'Séjours et courts séjours en bord de mer',      en: 'Seaside stays and short-term rentals'        },
  }

  const title    = TITLES[purpose][lang]
  const subtitle = SUBTITLES[purpose][lang]

  const countLabel = lang === 'fr'
    ? `${total} bien${total !== 1 ? 's' : ''}`
    : `${total} propert${total !== 1 ? 'ies' : 'y'}`

  const pageLabel = lang === 'fr'
    ? `Page ${page} sur ${totalPages}`
    : `Page ${page} of ${totalPages}`

  return (
    <div className="lp page-enter">

      {/* Hero header */}
      <div className="lp__hero">
        <div className="container">
          <span className="eyebrow">{lang === 'fr' ? 'Immobilier' : 'Real Estate'}</span>
          <h1 className="lp__title">{title}</h1>
          <p className="lp__sub">{subtitle}</p>
          <div className="lp__meta">
            <span className="lp__count-pill">
              <span className="lp__count-dot" />
              {countLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Body: sidebar + grid */}
      <div className="container lp__body">

        <aside className="lp__sidebar">
          <ListingFilters purpose={purpose} currentFilters={currentFilters} />
        </aside>

        <div className="lp__content">
          {listings.length === 0 ? (
            <div className="lp__empty">
              <span className="lp__empty-icon">○</span>
              <h3>{tr(t.listings.noResults, lang)}</h3>
              <p>{tr(t.listings.noResultsSub, lang)}</p>
            </div>
          ) : (
            <>
              <div className="lp__results-bar">
                <p className="lp__results-count">
                  {countLabel}
                  {totalPages > 1 && (
                    <span className="lp__page-info"> · {pageLabel}</span>
                  )}
                </p>
              </div>

              <div className="lp__grid">
                {listings.map((listing, i) => (
                  <div
                    key={listing.id}
                    className="reveal"
                    style={{ transitionDelay: `${i * 0.06}s` }}
                  >
                    <ListingCard listing={listing} priority={i < 3} />
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
              />
            </>
          )}
        </div>
      </div>

      <style>{`
        .lp__hero {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: calc(var(--nav-h) + 60px) 0 52px;
          position: relative; overflow: hidden;
        }
        .lp__hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 20% 50%, rgba(184,151,90,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .lp__title {
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 400; color: var(--white);
          margin-bottom: 10px; margin-top: 8px;
        }
        .lp__sub {
          font-size: 15px; color: var(--muted);
          margin-bottom: 24px; letter-spacing: 0.01em;
        }
        .lp__meta { display: flex; align-items: center; gap: 12px; }
        .lp__count-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(184,151,90,0.1);
          border: 1px solid rgba(184,151,90,0.2);
          color: var(--gold); font-size: 12px; font-weight: 500;
          padding: 6px 14px; border-radius: 30px;
          letter-spacing: 0.04em;
        }
        .lp__count-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold); flex-shrink: 0;
        }
        .lp__body {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
          padding-top: 48px; padding-bottom: 100px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .lp__body { grid-template-columns: 1fr; }
          .lp__sidebar { display: none; }
        }
        .lp__sidebar { position: sticky; top: calc(var(--nav-h) + 20px); }
        .lp__results-bar {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .lp__results-count { font-size: 13px; color: var(--muted); letter-spacing: 0.02em; }
        .lp__page-info { color: var(--muted); }
        .lp__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        @media (max-width: 640px) { .lp__grid { grid-template-columns: 1fr; } }
        .lp__empty {
          padding: 80px 40px; text-align: center;
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          background: var(--surface-2);
        }
        .lp__empty-icon { display: block; font-size: 48px; color: var(--muted); margin-bottom: 20px; }
        .lp__empty h3 { font-family: var(--font-display); font-size: 24px; color: var(--white); margin-bottom: 8px; }
        .lp__empty p { font-size: 14px; color: var(--muted); }
      `}</style>
    </div>
  )
}