'use client'

import { useLanguage } from '@/components/language/LanguageProvider'
import { t, tr } from '@/lib/translations'
import ListingCard from '@/components/listings/ListingCard'
import Pagination from '@/components/listings/Pagination'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { CITY_NAMES } from '@/constants/cities'
import { TYPE_OPTIONS, PURPOSE_OPTIONS, SORT_OPTIONS } from '@/constants/filters'
import type { Listing } from '@/types'

const PER_PAGE_OPTIONS = ['6', '9', '12', '24']

interface Props {
  sp:         Record<string, string>
  listings:   Listing[]
  total:      number
  totalPages: number
  page:       number
  limit:      number
  hasFilters: boolean
}

export default function RechercheContent({
  sp, listings, total, totalPages, page, limit, hasFilters,
}: Props) {
  const { lang } = useLanguage()

  const countLabel = lang === 'fr'
    ? `${total} bien${total !== 1 ? 's' : ''} trouvé${total !== 1 ? 's' : ''}`
    : `${total} propert${total !== 1 ? 'ies' : 'y'} found`

  const pageLabel = lang === 'fr'
    ? `Page ${page} sur ${totalPages}`
    : `Page ${page} of ${totalPages}`

  return (
    <div className="rp page-enter">

      {/* ── Hero header ── */}
      <div className="rp__hero">
        <div className="container">
          <span className="eyebrow">{lang === 'fr' ? 'Recherche' : 'Search'}</span>
          <h1 className="rp__title">{lang === 'fr' ? 'Tous nos biens' : 'All properties'}</h1>
          {hasFilters && <p className="rp__sub">{countLabel}</p>}
        </div>
      </div>

      {/* ── Sticky filter bar ── */}
      <div className="rp__bar">
        <div className="container">
          <form method="GET" action="/recherche" className="rp__form">

            <select name="purpose" className="rp__select" defaultValue={sp.purpose ?? ''}>
              <option value="">{lang === 'fr' ? 'Acheter / Louer / Vacances' : 'Buy / Rent / Vacation'}</option>
              {PURPOSE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select name="type" className="rp__select" defaultValue={sp.type ?? ''}>
              <option value="">{tr(t.filters.allTypes, lang)}</option>
              {TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select name="city" className="rp__select" defaultValue={sp.city ?? ''}>
              <option value="">{tr(t.filters.allCities, lang)}</option>
              {CITY_NAMES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="number" name="minPrice"
              className="rp__input"
              placeholder={lang === 'fr' ? 'Prix min (MAD)' : 'Min price (MAD)'}
              defaultValue={sp.minPrice ?? ''} min={0}
            />

            <input
              type="number" name="maxPrice"
              className="rp__input"
              placeholder={lang === 'fr' ? 'Prix max (MAD)' : 'Max price (MAD)'}
              defaultValue={sp.maxPrice ?? ''} min={0}
            />

            <select name="orderBy" className="rp__select" defaultValue={sp.orderBy ?? 'date_desc'}>
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select name="limit" className="rp__select" defaultValue={sp.limit ?? '9'}>
              {PER_PAGE_OPTIONS.map(v => (
                <option key={v} value={v}>{v} / {lang === 'fr' ? 'page' : 'page'}</option>
              ))}
            </select>

            <input type="hidden" name="page" value="1" />

            <button type="submit" className="rp__submit">
              <Search size={15} />
              {tr(t.nav.search, lang)}
            </button>

            {hasFilters && (
              <Link href="/recherche" className="rp__clear">
                {tr(t.filters.reset, lang)}
              </Link>
            )}
          </form>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="container rp__results">

        {/* No filters yet — quick links */}
        {!hasFilters && (
          <>
            <p className="rp__hint">
              {lang === 'fr'
                ? 'Utilisez les filtres ci-dessus pour trouver votre bien idéal.'
                : 'Use the filters above to find your ideal property.'}
            </p>
            <div className="rp__quicklinks">
              {[
                {
                  href: '/vente',
                  label: lang === 'fr' ? 'Biens à vendre'     : 'Properties for sale',
                  sub:   lang === 'fr' ? 'Appartements, villas, maisons' : 'Apartments, villas, houses',
                  emoji: '🏛',
                },
                {
                  href: '/location',
                  label: lang === 'fr' ? 'Biens à louer'      : 'Properties for rent',
                  sub:   lang === 'fr' ? 'Location longue durée'         : 'Long-term rental',
                  emoji: '🔑',
                },
                {
                  href: '/vacances',
                  label: lang === 'fr' ? 'Locations vacances' : 'Vacation rentals',
                  sub:   lang === 'fr' ? 'Séjours & courts séjours'      : 'Stays & short-term rentals',
                  emoji: '☀️',
                },
              ].map(({ href, label, sub, emoji }, i) => (
                <Link
                  key={href}
                  href={href}
                  className="rp__quicklink reveal"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <span className="rp__ql-emoji">{emoji}</span>
                  <div>
                    <span className="rp__ql-label">{label}</span>
                    <span className="rp__ql-sub">{sub}</span>
                  </div>
                  <span className="rp__ql-arrow">→</span>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Filters applied, no results */}
        {hasFilters && listings.length === 0 && (
          <div className="rp__empty">
            <span className="rp__empty-icon">○</span>
            <h3>{tr(t.listings.noResults, lang)}</h3>
            <p>{tr(t.listings.noResultsSub, lang)}</p>
            <Link href="/recherche" className="btn btn-gold" style={{ marginTop: 24 }}>
              {tr(t.filters.reset, lang)}
            </Link>
          </div>
        )}

        {/* Results */}
        {listings.length > 0 && (
          <>
            <div className="rp__results-bar">
              <p className="rp__count">
                {countLabel}
                {totalPages > 1 && (
                  <span className="rp__page-info"> · {pageLabel}</span>
                )}
              </p>
            </div>

            <div className="rp__grid">
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

      <style>{`
        .rp__hero {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: calc(var(--nav-h) + 60px) 0 52px;
          position: relative; overflow: hidden;
        }
        .rp__hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 80% 50%, rgba(184,151,90,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .rp__title {
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 400; color: var(--white);
          margin-bottom: 10px; margin-top: 8px;
        }
        .rp__sub { font-size: 14px; color: var(--muted); letter-spacing: 0.04em; margin-top: 8px; }

        .rp__bar {
          background: var(--surface-2);
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
          position: sticky; top: 0; z-index: 100;
          backdrop-filter: blur(20px);
        }
        .rp__form { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }

        .rp__select, .rp__input {
          background: var(--surface-3);
          border: 1px solid var(--border);
          border-radius: var(--r-sm);
          padding: 10px 14px;
          font-size: 13px; color: var(--off-white);
          font-family: var(--font-ui);
          outline: none;
          transition: border-color 0.2s ease;
          appearance: none; min-width: 130px;
          cursor: pointer;
        }
        .rp__select:focus, .rp__input:focus { border-color: var(--gold); }
        .rp__select option { background: var(--surface-3); color: var(--off-white); }
        .rp__input::placeholder { color: var(--muted); }

        .rp__submit {
          display: flex; align-items: center; gap: 8px;
          background: var(--gold); color: var(--black);
          border: none; border-radius: var(--r-sm);
          padding: 10px 20px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: var(--font-ui);
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: all 0.2s ease; white-space: nowrap;
        }
        .rp__submit:hover { background: var(--gold-light); box-shadow: 0 4px 16px rgba(184,151,90,0.3); }

        .rp__clear {
          font-size: 12px; color: var(--muted);
          text-decoration: none; padding: 10px 14px;
          border-radius: var(--r-sm);
          border: 1px solid var(--border);
          transition: all 0.15s ease; white-space: nowrap;
          letter-spacing: 0.04em;
        }
        .rp__clear:hover { border-color: var(--gold); color: var(--gold); }

        @media (max-width: 768px) {
          .rp__form { flex-direction: column; }
          .rp__select, .rp__input, .rp__submit, .rp__clear { width: 100%; }
        }

        .rp__results { padding: 48px 0 100px; }
        .rp__hint { font-size: 14px; color: var(--muted); margin-bottom: 40px; letter-spacing: 0.02em; }

        .rp__quicklinks {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .rp__quicklink {
          display: flex; align-items: center; gap: 20px;
          padding: 28px 24px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          position: relative; overflow: hidden;
        }
        .rp__quicklink::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(184,151,90,0.06) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .rp__quicklink:hover { border-color: rgba(184,151,90,0.3); transform: translateY(-3px); box-shadow: var(--shadow-card), var(--shadow-glow); }
        .rp__quicklink:hover::before { opacity: 1; }
        .rp__quicklink:hover .rp__ql-arrow { color: var(--gold); transform: translateX(4px); }
        .rp__ql-emoji { font-size: 28px; flex-shrink: 0; }
        .rp__ql-label { display: block; font-family: var(--font-display); font-size: 20px; font-weight: 500; color: var(--white); margin-bottom: 4px; }
        .rp__ql-sub { display: block; font-size: 12px; color: var(--muted); letter-spacing: 0.02em; }
        .rp__ql-arrow { margin-left: auto; font-size: 18px; color: var(--muted); transition: all 0.25s ease; flex-shrink: 0; }

        .rp__results-bar { margin-bottom: 28px; }
        .rp__count { font-size: 13px; color: var(--muted); letter-spacing: 0.02em; }
        .rp__page-info { color: var(--muted); }

        .rp__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        @media (max-width: 640px) { .rp__grid { grid-template-columns: 1fr; } }

        .rp__empty {
          padding: 80px 40px; text-align: center;
          border: 1px solid var(--border); border-radius: var(--r-lg);
          background: var(--surface-2);
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .rp__empty-icon { display: block; font-size: 48px; color: var(--muted); margin-bottom: 8px; }
        .rp__empty h3 { font-family: var(--font-display); font-size: 24px; color: var(--white); }
        .rp__empty p { font-size: 14px; color: var(--muted); }
      `}</style>
    </div>
  )
}