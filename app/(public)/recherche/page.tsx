import { getListings } from "@/lib/supabase/queries";
import type { ListingFiltersWithPagination, ListingPurpose, PropertyType } from "@/types";
import ListingCard from "@/components/listings/ListingCard";
import Pagination from "@/components/listings/Pagination";
import Link from "next/link";
import { Search } from "lucide-react";
import { CITY_NAMES } from "@/constants/cities";
import { TYPE_OPTIONS, PURPOSE_OPTIONS, SORT_OPTIONS } from "@/constants/filters";

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
    <div className="rp-root">

      {/* Header */}
      <div className="rp-hero">
        <div className="container">
          <span className="rp-eyebrow">Recherche</span>
          <h1 className="rp-title">Tous nos biens</h1>
          {hasFilters && (
            <p className="rp-sub">{total} résultat{total !== 1 ? "s" : ""} trouvé{total !== 1 ? "s" : ""}</p>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div className="rp-filters-wrap">
        <div className="container">
          <form method="GET" action="/recherche" className="rp-filters">
            <select name="purpose" className="rp-select" defaultValue={sp.purpose ?? ""}>
              <option value="">Acheter / Louer / Vacances</option>
              {PURPOSE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select name="type" className="rp-select" defaultValue={sp.type ?? ""}>
              <option value="">Tous les types</option>
              {TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select name="city" className="rp-select" defaultValue={sp.city ?? ""}>
              <option value="">Toutes les villes</option>
              {CITY_NAMES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="number" name="minPrice" className="rp-select"
              placeholder="Prix min (MAD)" defaultValue={sp.minPrice ?? ""} min={0}
            />
            <input
              type="number" name="maxPrice" className="rp-select"
              placeholder="Prix max (MAD)" defaultValue={sp.maxPrice ?? ""} min={0}
            />

            <select name="orderBy" className="rp-select" defaultValue={sp.orderBy ?? "date_desc"}>
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Per page */}
            <select name="limit" className="rp-select" defaultValue={sp.limit ?? "9"}>
              {PER_PAGE_OPTIONS.map(v => (
                <option key={v} value={v}>{v} par page</option>
              ))}
            </select>

            {/* Reset page on new search */}
            <input type="hidden" name="page" value="1" />

            <button type="submit" className="rp-search-btn">
              <Search size={16} />
              Rechercher
            </button>

            {hasFilters && (
              <Link href="/recherche" className="rp-clear-btn">
                Effacer
              </Link>
            )}
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="container rp-results">
        {!hasFilters && (
          <p className="rp-hint">Utilisez les filtres ci-dessus pour trouver votre bien idéal.</p>
        )}

        {hasFilters && listings.length === 0 && (
          <div className="rp-empty">
            <span>🔍</span>
            <h3>Aucun bien trouvé</h3>
            <p>Essayez de modifier vos critères de recherche.</p>
            <Link href="/recherche" className="rp-empty-btn">Réinitialiser</Link>
          </div>
        )}

        {listings.length > 0 && (
          <>
            <p className="rp-count">
              {total} bien{total !== 1 ? "s" : ""} trouvé{total !== 1 ? "s" : ""}
              {totalPages > 1 && ` · Page ${page} sur ${totalPages}`}
            </p>
            <div className="rp-grid stagger">
              {listings.map((listing, i) => (
                <div key={listing.id} className="anim-fade-up">
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

        {!hasFilters && (
          <div className="rp-quicklinks stagger">
            {[
              { href: "/vente",    label: "Biens à vendre",    emoji: "🏛" },
              { href: "/location", label: "Biens à louer",     emoji: "🔑" },
              { href: "/vacances", label: "Locations vacances", emoji: "☀️" },
            ].map(({ href, label, emoji }) => (
              <Link key={href} href={href} className="rp-quicklink anim-fade-up">
                <span>{emoji}</span>
                <span>{label}</span>
                <span className="rp-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .rp-hero {
          background: var(--charcoal); padding: 120px 0 48px;
        }
        .rp-eyebrow {
          display: block; font-size: 11px; font-weight: 600;
          color: var(--terra-light); text-transform: uppercase;
          letter-spacing: 0.12em; margin-bottom: 12px;
        }
        .rp-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 56px); font-weight: 600; color: var(--cream);
        }
        .rp-sub { font-size: 15px; color: var(--muted); margin-top: 8px; }

        .rp-filters-wrap {
          background: var(--white); border-bottom: 1px solid var(--border);
          padding: 16px 0; position: sticky; top: 0; z-index: 100;
          box-shadow: var(--shadow-sm);
        }
        .rp-filters {
          display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
        }
        .rp-select {
          background: var(--cream); border: 1.5px solid var(--border);
          border-radius: 8px; padding: 10px 14px; font-size: 13px;
          color: var(--ink); font-family: var(--font-body); outline: none;
          transition: border-color 0.15s ease; appearance: none; min-width: 130px;
        }
        .rp-select:focus { border-color: var(--terracotta); }

        .rp-search-btn {
          display: flex; align-items: center; gap: 8px;
          background: var(--terracotta); color: white; border: none;
          border-radius: 8px; padding: 10px 20px; font-size: 13px;
          font-weight: 500; cursor: pointer; font-family: var(--font-body);
          transition: all 0.2s ease; white-space: nowrap;
        }
        .rp-search-btn:hover { background: var(--terra-dark); }

        .rp-clear-btn {
          font-size: 13px; color: var(--muted); text-decoration: none;
          padding: 10px 14px; border-radius: 8px;
          border: 1.5px solid var(--border); transition: all 0.15s ease; white-space: nowrap;
        }
        .rp-clear-btn:hover { border-color: var(--terracotta); color: var(--terracotta); }

        .rp-results { padding: 40px 0 80px; }
        .rp-count { font-size: 14px; color: var(--muted); margin-bottom: 24px; }
        .rp-hint  { font-size: 15px; color: var(--muted); margin-bottom: 32px; }

        .rp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .rp-empty {
          padding: 80px 40px; text-align: center;
          background: var(--white); border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .rp-empty span { font-size: 48px; }
        .rp-empty h3 { font-family: var(--font-display); font-size: 24px; color: var(--charcoal); }
        .rp-empty p  { font-size: 15px; color: var(--muted); }
        .rp-empty-btn {
          margin-top: 8px; background: var(--terracotta); color: white;
          padding: 10px 24px; border-radius: 30px; font-size: 14px;
          text-decoration: none; transition: background 0.2s ease;
        }
        .rp-empty-btn:hover { background: var(--terra-dark); }

        .rp-quicklinks {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px; margin-top: 8px;
        }
        .rp-quicklink {
          display: flex; align-items: center; gap: 16px; padding: 24px;
          border-radius: var(--radius-lg); background: var(--white);
          border: 1.5px solid var(--border); text-decoration: none;
          font-size: 16px; color: var(--charcoal); font-weight: 500;
          transition: all 0.2s ease;
        }
        .rp-quicklink:hover {
          border-color: var(--terracotta); transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .rp-arrow { margin-left: auto; color: var(--muted); font-size: 18px; }
        .rp-quicklink:hover .rp-arrow { color: var(--terracotta); }

        @media (max-width: 768px) {
          .rp-filters { flex-direction: column; }
          .rp-select, .rp-search-btn, .rp-clear-btn { width: 100%; }
        }
      `}</style>
    </div>
  );
}