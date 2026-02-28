import { getListingBySlug, getRelatedListings } from "@/lib/supabase/queries";
import { getListingMetadata, getListingStructuredData } from "@/lib/seo";
import { getListingAmenities } from "@/constants/amenities";
import { notFound } from "next/navigation";
import ListingDetailContent from "@/components/listings/ListingDetailContent";

interface Props {
  params: Promise<{ purpose: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result   = await getListingBySlug(slug);
  if (!result.data) return {};
  return getListingMetadata(result.data);
}

export default async function ListingDetailPage({ params }: Props) {
  const { purpose, slug } = await params;
  const result            = await getListingBySlug(slug);

  if (!result.data) notFound();

  const listing    = result.data;
  const related    = await getRelatedListings(listing, 3);
  const amenities  = getListingAmenities(listing.amenities ?? []);
  const structured = getListingStructuredData(listing);
  const images     = (listing.listing_images ?? []).sort((a, b) => a.order - b.order);

  return (
    <ListingDetailContent
      purpose={purpose}
      listing={listing}
      related={related.data ?? []}
      amenities={amenities}
      structured={structured}
      images={images}
    />
  );
}