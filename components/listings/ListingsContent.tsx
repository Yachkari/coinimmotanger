'use client'

import { useLanguage } from '@/components/language/LanguageProvider'
import { t, tr } from '@/lib/translations'
import ListingCard from '@/components/listings/ListingCard'
import ListingFilters from '@/components/listings/ListingFilters'
import Pagination from '@/components/listings/Pagination'
import type { Listing, ListingPurpose } from '@/types'
import { useState } from 'react'

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
  const [filtersOpen, setFiltersOpen] = useState(false)

  const TITLES: Record<ListingPurpose, { fr: string; en: string }> = {
    vente:    { fr: 'Biens à Vendre',     en: 'Properties for Sale' },
    location: { fr: 'Biens à Louer',      en: 'Properties for Rent' },
    vacances: { fr: 'Locations Vacances', en: 'Vacation Rentals'    },
  }

  const SUBTITLES: Record<ListingPurpose, { fr: string; en: string }> = {
    vente:    { fr: 'Appartements, villas et maisons à acquérir', en: 'Apartments, villas and houses to buy'   },
    location: { fr: 'Location longue durée au nord du Maroc',     en: 'Long-term rental in northern Morocco'  },
    vacances: { fr: 'Séjours et courts séjours en bord de mer',   en: 'Seaside stays and short-term rentals'  },
  }

  const title    = TITLES[purpose][lang]
  const subtitle = SUBTITLES[purpose][lang]

  const countLabel = lang === 'fr'
    ? `${total} bien${total !== 1 ? 's' : ''}`
    : `${total} propert${total !== 1 ? 'ies' : 'y'}`

  const pageLabel = lang === 'fr'
    ? `Page ${page} sur ${totalPages}`
    : `Page ${page} of ${totalPages}`

  const activeFilterCount = Object.keys(currentFilters).filter(
    k => !['page', 'limit', 'orderBy'].includes(k) && currentFilters[k]
  ).length

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
            <button type="button" className="lp__filter-btn" onClick={() => setFiltersOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="20" y2="12"/>
                <line x1="12" y1="18" x2="20" y2="18"/>
              </svg>
              {lang === 'fr' ? 'Filtres' : 'Filters'}
              {activeFilterCount > 0 && (
                <span className="lp__filter-badge">{activeFilterCount}</span>
              )}
            </button>
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

      {/* Mobile filter drawer — outside lp__body so it overlays everything */}
      <div
        className={`lp__drawer-overlay ${filtersOpen ? 'lp__drawer-overlay--open' : ''}`}
        onClick={() => setFiltersOpen(false)}
      />
      <div className={`lp__drawer ${filtersOpen ? 'lp__drawer--open' : ''}`}>
        <div className="lp__drawer-head">
          <span>{lang === 'fr' ? 'Filtres' : 'Filters'}</span>
          <button type="button" onClick={() => setFiltersOpen(false)} className="lp__drawer-close">✕</button>
        </div>
        <div className="lp__drawer-body">
          <ListingFilters purpose={purpose} currentFilters={currentFilters} />
        </div>
      </div>

      <style>{`
        /* ── Hero ─────────────────────────────────── */
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
        .lp__meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
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

        /* ── Filter button (mobile only) ──────────── */
        .lp__filter-btn {
          display: none;
          align-items: center; gap: 8px;
          padding: 6px 16px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 30px;
          color: var(--off-white); font-size: 12px;
          font-family: var(--font-ui); font-weight: 500;
          cursor: pointer; transition: all 0.2s ease;
          letter-spacing: 0.04em;
        }
        .lp__filter-btn:hover { border-color: var(--gold); color: var(--gold); }
        .lp__filter-badge {
          background: var(--gold); color: var(--black);
          font-size: 10px; font-weight: 700;
          width: 18px; height: 18px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Layout ───────────────────────────────── */
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
          .lp__filter-btn { display: flex; }
        }
        .lp__sidebar { position: static; }

        /* ── Results ──────────────────────────────── */
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

        /* ── Empty ────────────────────────────────── */
        .lp__empty {
          padding: 80px 40px; text-align: center;
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          background: var(--surface-2);
        }
        .lp__empty-icon { display: block; font-size: 48px; color: var(--muted); margin-bottom: 20px; }
        .lp__empty h3 { font-family: var(--font-display); font-size: 24px; color: var(--white); margin-bottom: 8px; }
        .lp__empty p { font-size: 14px; color: var(--muted); }

        /* ── Drawer overlay ───────────────────────── */
        .lp__drawer-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .lp__drawer-overlay--open {
          opacity: 1; pointer-events: all;
        }

        /* ── Drawer panel ─────────────────────────── */
        .lp__drawer {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: min(360px, 90vw); z-index: 201;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .lp__drawer--open { transform: translateX(0); }
        .lp__drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          font-size: 14px; font-weight: 600; color: var(--white);
          letter-spacing: 0.04em; flex-shrink: 0;
        }
        .lp__drawer-close {
          background: none; border: none; color: var(--muted);
          font-size: 16px; cursor: pointer; padding: 4px 8px;
          transition: color 0.2s ease; font-family: var(--font-ui);
        }
        .lp__drawer-close:hover { color: var(--white); }
        .lp__drawer-body {
          flex: 1; overflow-y: auto; padding: 20px;
        }
      `}</style>
    </div>
  )
}