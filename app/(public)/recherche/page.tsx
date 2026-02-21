import { getListings } from "@/lib/supabase/queries";
import type { ListingFiltersWithPagination, ListingPurpose, PropertyType } from "@/types";
import ListingCard from "@/components/listings/ListingCard";

import Link from "next/link";
import { Search } from "lucide-react";
import { CITY_NAMES } from "@/constants/cities";
import { TYPE_OPTIONS, PURPOSE_OPTIONS, SORT_OPTIONS } from "@/constants/filters";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Pagination from "@/components/listings/PaginationWrapper";


export const metadata = {
  title: "Recherche — Tous les biens",
  description: "Recherchez parmi tous nos biens immobiliers : appartements, villas, maisons à vendre, louer ou en vacances.",
};

const PER_PAGE_OPTIONS = ["6", "9", "12", "24"];

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function RecherchePage({ searchParams }: Props) {
  const sp = await searchParams;

  const limit = sp.limit ? Number(sp.limit) : 9;
  const page  = sp.page  ? Number(sp.page)  : 1;

  const filters: ListingFiltersWithPagination = {
    purpose:  sp.purpose  as ListingPurpose ?? undefined,
    type:     sp.type     as PropertyType   ?? undefined,
    city:     sp.city                       ?? undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    bedrooms: sp.bedrooms ? Number(sp.bedrooms) : undefined,
    orderBy:  sp.orderBy  as any            ?? "date_desc",
    page,
    limit,
  };

  const hasFilters = !!(sp.purpose || sp.type || sp.city || sp.minPrice || sp.maxPrice || sp.bedrooms);

  const result     = await getListings(filters);
  const listings   = result.data?.listings   ?? [];
  const total      = result.data?.total      ?? 0;
  const totalPages = result.data?.totalPages ?? 1;

  return (
    <div className="rp page-enter">

      {/* ── Hero header ── */}
      <div className="rp__hero">
        <div className="container">
          <span className="eyebrow">Recherche</span>
          <h1 className="rp__title">Tous nos biens</h1>
          {hasFilters && (
            <p className="rp__sub">
              {total} résultat{total !== 1 ? "s" : ""} trouvé{total !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* ── Sticky filter bar ── */}
      <div className="rp__bar">
        <div className="container">
          <form method="GET" action="/recherche" className="rp__form">

            <select name="purpose" className="rp__select" defaultValue={sp.purpose ?? ""}>
              <option value="">Acheter / Louer / Vacances</option>
              {PURPOSE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select name="type" className="rp__select" defaultValue={sp.type ?? ""}>
              <option value="">Tous les types</option>
              {TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select name="city" className="rp__select" defaultValue={sp.city ?? ""}>
              <option value="">Toutes les villes</option>
              {CITY_NAMES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="number" name="minPrice"
              className="rp__input" placeholder="Prix min (MAD)"
              defaultValue={sp.minPrice ?? ""} min={0}
            />

            <input
              type="number" name="maxPrice"
              className="rp__input" placeholder="Prix max (MAD)"
              defaultValue={sp.maxPrice ?? ""} min={0}
            />

            <select name="orderBy" className="rp__select" defaultValue={sp.orderBy ?? "date_desc"}>
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select name="limit" className="rp__select" defaultValue={sp.limit ?? "9"}>
              {PER_PAGE_OPTIONS.map(v => (
                <option key={v} value={v}>{v} / page</option>
              ))}
            </select>

            <input type="hidden" name="page" value="1" />

            <button type="submit" className="rp__submit">
              <Search size={15} />
              Rechercher
            </button>

            {hasFilters && (
              <Link href="/recherche" className="rp__clear">
                Effacer
              </Link>
            )}
          </form>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="container rp__results">

        {/* No filters yet — show quick links */}
        {!hasFilters && (
          <>
            <p className="rp__hint">Utilisez les filtres ci-dessus pour trouver votre bien idéal.</p>
            <div className="rp__quicklinks">
              {[
                { href: "/vente",    label: "Biens à vendre",    sub: "Appartements, villas, maisons", emoji: "🏛" },
                { href: "/location", label: "Biens à louer",     sub: "Location longue durée",         emoji: "🔑" },
                { href: "/vacances", label: "Locations vacances", sub: "Séjours & courts séjours",      emoji: "☀️" },
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
            <h3>Aucun bien trouvé</h3>
            <p>Essayez de modifier vos critères de recherche.</p>
            <Link href="/recherche" className="btn btn-gold" style={{ marginTop: 24 }}>
              Réinitialiser les filtres
            </Link>
          </div>
        )}

        {/* Results */}
        {listings.length > 0 && (
          <>
            <div className="rp__results-bar">
              <p className="rp__count">
                {total} bien{total !== 1 ? "s" : ""} trouvé{total !== 1 ? "s" : ""}
                {totalPages > 1 && (
                  <span className="rp__page-info"> · Page {page} sur {totalPages}</span>
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
        /* ── Hero ──────────────────────────────────── */
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
        .rp__sub {
          font-size: 14px; color: var(--muted);
          letter-spacing: 0.04em; margin-top: 8px;
        }

        /* ── Filter bar ────────────────────────────── */
        .rp__bar {
          background: var(--surface-2);
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
          position: sticky; top: 0; z-index: 100;
          backdrop-filter: blur(20px);
        }
        .rp__form {
          display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
        }

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
        .rp__select:focus, .rp__input:focus {
          border-color: var(--gold);
        }
        .rp__select option {
          background: var(--surface-3);
          color: var(--off-white);
        }
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
        .rp__submit:hover {
          background: var(--gold-light);
          box-shadow: 0 4px 16px rgba(184,151,90,0.3);
        }

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

        /* ── Results area ──────────────────────────── */
        .rp__results { padding: 48px 0 100px; }

        .rp__hint {
          font-size: 14px; color: var(--muted);
          margin-bottom: 40px; letter-spacing: 0.02em;
        }

        /* Quick links */
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
        .rp__quicklink:hover {
          border-color: rgba(184,151,90,0.3);
          transform: translateY(-3px);
          box-shadow: var(--shadow-card), var(--shadow-glow);
        }
        .rp__quicklink:hover::before { opacity: 1; }
        .rp__quicklink:hover .rp__ql-arrow { color: var(--gold); transform: translateX(4px); }

        .rp__ql-emoji { font-size: 28px; flex-shrink: 0; }
        .rp__ql-label {
          display: block;
          font-family: var(--font-display);
          font-size: 20px; font-weight: 500; color: var(--white);
          margin-bottom: 4px;
        }
        .rp__ql-sub {
          display: block; font-size: 12px; color: var(--muted);
          letter-spacing: 0.02em;
        }
        .rp__ql-arrow {
          margin-left: auto; font-size: 18px; color: var(--muted);
          transition: all 0.25s ease; flex-shrink: 0;
        }

        /* Results bar */
        .rp__results-bar { margin-bottom: 28px; }
        .rp__count {
          font-size: 13px; color: var(--muted); letter-spacing: 0.02em;
        }
        .rp__page-info { color: var(--muted); }

        /* Grid */
        .rp__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        @media (max-width: 640px) { .rp__grid { grid-template-columns: 1fr; } }

        /* Empty */
        .rp__empty {
          padding: 80px 40px; text-align: center;
          border: 1px solid var(--border); border-radius: var(--r-lg);
          background: var(--surface-2);
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .rp__empty-icon {
          display: block; font-size: 48px; color: var(--muted);
          margin-bottom: 8px;
        }
        .rp__empty h3 {
          font-family: var(--font-display);
          font-size: 24px; color: var(--white);
        }
        .rp__empty p { font-size: 14px; color: var(--muted); }
      `}</style>
    </div>
  );
}