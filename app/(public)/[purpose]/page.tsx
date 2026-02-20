import { getListings } from "@/lib/supabase/queries";
import { getListingsPageMetadata } from "@/lib/seo";
import type { ListingFiltersWithPagination, ListingPurpose } from "@/types";
import ListingCard from "@/components/listings/ListingCard";
import ListingFilters from "@/components/listings/ListingFilters";
import Pagination from "@/components/listings/Pagination";
import { notFound } from "next/navigation";

const VALID_PURPOSES: ListingPurpose[] = ["vente", "location", "vacances"];

interface Props {
  params:       Promise<{ purpose: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props) {
  const { purpose } = await params;
  if (!VALID_PURPOSES.includes(purpose as ListingPurpose)) return {};
  return getListingsPageMetadata(purpose as ListingPurpose);
}

export default async function ListingsPage({ params, searchParams }: Props) {
  const { purpose } = await params;
  const sp          = await searchParams;

  if (!VALID_PURPOSES.includes(purpose as ListingPurpose)) notFound();

  const limit = sp.limit ? Number(sp.limit) : 9;
  const page  = sp.page  ? Number(sp.page)  : 1;

  const filters: ListingFiltersWithPagination = {
    purpose:  purpose as ListingPurpose,
    type:     sp.type     as any ?? undefined,
    city:     sp.city             ?? undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    bedrooms: sp.bedrooms ? Number(sp.bedrooms) : undefined,
    orderBy:  sp.orderBy  as any ?? "date_desc",
    page,
    limit,
  };

  const result     = await getListings(filters);
  const listings   = result.data?.listings   ?? [];
  const total      = result.data?.total      ?? 0;
  const totalPages = result.data?.totalPages ?? 1;

  const TITLES: Record<ListingPurpose, string> = {
    vente:    "Biens à Vendre",
    location: "Biens à Louer",
    vacances: "Locations Vacances",
  };

  const SUBTITLES: Record<ListingPurpose, string> = {
    vente:    "Appartements, villas et maisons à acquérir",
    location: "Location longue durée au nord du Maroc",
    vacances: "Séjours et courts séjours en bord de mer",
  };

  return (
    <div className="lp page-enter">

      {/* Hero header */}
      <div className="lp__hero">
        <div className="container">
          <span className="eyebrow">Immobilier</span>
          <h1 className="lp__title">{TITLES[purpose as ListingPurpose]}</h1>
          <p className="lp__sub">{SUBTITLES[purpose as ListingPurpose]}</p>
          <div className="lp__meta">
            <span className="lp__count-pill">
              <span className="lp__count-dot" />
              {total} bien{total !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Body: sidebar + grid */}
      <div className="container lp__body">

        {/* Sidebar filters */}
        <aside className="lp__sidebar">
          <ListingFilters purpose={purpose as ListingPurpose} currentFilters={sp} />
        </aside>

        {/* Results */}
        <div className="lp__content">
          {listings.length === 0 ? (
            <div className="lp__empty">
              <span className="lp__empty-icon">○</span>
              <h3>Aucun bien trouvé</h3>
              <p>Modifiez vos filtres pour voir plus de résultats.</p>
            </div>
          ) : (
            <>
              <div className="lp__results-bar">
                <p className="lp__results-count">
                  {total} bien{total !== 1 ? "s" : ""}
                  {totalPages > 1 && (
                    <span className="lp__page-info"> · Page {page} sur {totalPages}</span>
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
        }
        .lp__sidebar { position: sticky; top: calc(var(--nav-h) + 20px); }

        /* ── Results ──────────────────────────────── */
        .lp__results-bar {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .lp__results-count {
          font-size: 13px; color: var(--muted);
          letter-spacing: 0.02em;
        }
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
        .lp__empty-icon {
          display: block; font-size: 48px; color: var(--muted);
          margin-bottom: 20px;
        }
        .lp__empty h3 {
          font-family: var(--font-display);
          font-size: 24px; color: var(--white); margin-bottom: 8px;
        }
        .lp__empty p { font-size: 14px; color: var(--muted); }
      `}</style>
    </div>
  );
}