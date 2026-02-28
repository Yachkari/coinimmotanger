import { getListings } from "@/lib/supabase/queries";
import { getListingsPageMetadata } from "@/lib/seo";
import type { ListingFiltersWithPagination, ListingPurpose } from "@/types";
import { notFound } from "next/navigation";
import ListingsContent from "@/components/listings/ListingsContent";

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

  return (
    <ListingsContent
      purpose={purpose as ListingPurpose}
      listings={listings}
      total={total}
      totalPages={totalPages}
      page={page}
      limit={limit}
      currentFilters={sp}
    />
  );
}