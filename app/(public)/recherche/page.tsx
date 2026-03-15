import { getListings } from "@/lib/supabase/queries";
import type { ListingFiltersWithPagination, ListingPurpose, PropertyType } from "@/types";
import { Suspense } from "react";
import RechercheContent from "@/components/listings/RechercheContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recherche — Tous les biens",
  description: "Recherchez parmi tous nos biens immobiliers : appartements, villas, maisons à vendre, louer ou en vacances.",
};

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function RecherchePage({ searchParams }: Props) {
  const sp = await searchParams;

  const limit = sp.limit ? Number(sp.limit) : 9;
  const page  = sp.page  ? Number(sp.page)  : 1;

  const filters: ListingFiltersWithPagination = {
    purpose:  sp.purpose as ListingPurpose ?? undefined,
    type:     sp.type    as PropertyType   ?? undefined,
    city:     sp.city                      ?? undefined,
    neighborhood: sp.neighborhood              ?? undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    bedrooms: sp.bedrooms ? Number(sp.bedrooms) : undefined,
    orderBy:  sp.orderBy  as any           ?? "date_desc",
    page,
    limit,
  };

  const hasFilters = !!(sp.purpose || sp.type || sp.city || sp.neighborhood || sp.minPrice || sp.maxPrice || sp.bedrooms);

  const result     = await getListings(filters);
  const listings   = result.data?.listings   ?? [];
  const total      = result.data?.total      ?? 0;
  const totalPages = result.data?.totalPages ?? 1;

  return (
    <Suspense fallback={null}>
      <RechercheContent
        sp={sp}
        listings={listings}
        total={total}
        totalPages={totalPages}
        page={page}
        limit={limit}
        hasFilters={hasFilters}
      />
    </Suspense>
  );
}