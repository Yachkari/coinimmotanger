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

  return (
    <div className="lp-root">
      <div className="lp-hero">
        <div className="container">
          <span className="lp-eyebrow">Immobilier</span>
          <h1 className="lp-title">{TITLES[purpose as ListingPurpose]}</h1>
          <p className="lp-sub">{total} bien{total !== 1 ? "s" : ""} disponible{total !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="container lp-body">
        <aside className="lp-sidebar">
          <ListingFilters
            purpose={purpose as ListingPurpose}
            currentFilters={sp}
          />
        </aside>

        <div className="lp-content">
          {listings.length === 0 ? (
            <div className="lp-empty">
              <span className="lp-empty-icon">🔍</span>
              <h3>Aucun bien trouvé</h3>
              <p>Essayez de modifier vos filtres pour voir plus de résultats.</p>
            </div>
          ) : (
            <>
              {/* Results header */}
              <div className="lp-results-header">
                <p className="lp-results-count">
                  {total} bien{total !== 1 ? "s" : ""}
                  {totalPages > 1 && ` · Page ${page} sur ${totalPages}`}
                </p>
              </div>

              <div className="lp-grid stagger">
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
        </div>
      </div>

      <style>{`
        .lp-hero {
          background: var(--charcoal);
          padding: 120px 0 48px;
        }
        .lp-eyebrow {
          display: block; font-size: 11px; font-weight: 600;
          color: var(--terra-light); text-transform: uppercase;
          letter-spacing: 0.12em; margin-bottom: 12px;
        }
        .lp-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 56px); font-weight: 600;
          color: var(--cream); margin-bottom: 8px;
        }
        .lp-sub { font-size: 15px; color: var(--muted); }

        .lp-body {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px; padding-top: 40px; padding-bottom: 80px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .lp-body { grid-template-columns: 1fr; }
          .lp-sidebar { display: none; }
        }

        .lp-sidebar { position: sticky; top: 90px; }

        .lp-results-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
        }
        .lp-results-count { font-size: 14px; color: var(--muted); }

        .lp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .lp-empty {
          padding: 80px 40px; text-align: center;
          background: var(--white); border-radius: var(--radius-lg);
          border: 1px solid var(--border);
        }
        .lp-empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
        .lp-empty h3 {
          font-family: var(--font-display); font-size: 24px;
          color: var(--charcoal); margin-bottom: 8px;
        }
        .lp-empty p { color: var(--muted); font-size: 15px; }
      `}</style>
    </div>
  );
}