import type { Metadata } from "next";
import type { Listing, ListingPurpose, PropertyType } from "@/types";
import { formatPrice, formatType, formatPurpose } from "@/lib/utils";

// ── Site-wide defaults ───────────────────────────────────────

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Immobilier";
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL  ?? "https://example.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;


// ── Root / homepage metadata ─────────────────────────────────

export function getHomeMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} — Appartements, Villas & Maisons`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      `Trouvez votre bien immobilier idéal : appartements, villas et maisons à vendre, ` +
      `à louer ou en vacances. Consultez nos meilleures offres dès maintenant.`,
    metadataBase: new URL(SITE_URL),
    alternates: {
    canonical: '/',
  },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}


// ── Listings grid page metadata ──────────────────────────────
// e.g. /vente → "Appartements & Villas à Vendre | Immobilier"

export function getListingsPageMetadata(
  purpose: ListingPurpose,
  count?: number
): Metadata {
  const purposeLabels: Record<ListingPurpose, string> = {
    vente:     "à Vendre",
    location:  "à Louer",
    vacances:  "en Vacances",
  };

  const title = `Biens Immobiliers ${purposeLabels[purpose]}`;
  const description =
    count !== undefined
      ? `Découvrez nos ${count} biens immobiliers ${purposeLabels[purpose].toLowerCase()}. ` +
        `Appartements, villas, maisons et studios disponibles.`
      : `Parcourez notre sélection de biens immobiliers ${purposeLabels[purpose].toLowerCase()}. ` +
        `Appartements, villas et maisons disponibles.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
  };
}


// ── Listing detail page metadata ─────────────────────────────
// Dynamically generated from the listing data

export function getListingMetadata(listing: Listing): Metadata {
  // Use manual override if the admin set one, otherwise auto-generate
  const title =
    listing.meta_title ??
    buildListingTitle(listing);

  const description =
    listing.meta_description ??
    buildListingDescription(listing);

  // Use first image as OG image if available
  const ogImage =
    listing.listing_images?.[listing.cover_image_index]?.url ??
    listing.listing_images?.[0]?.url ??
    DEFAULT_OG_IMAGE;

  const canonical = `${SITE_URL}/${listing.purpose}/${listing.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}


// ── JSON-LD structured data for listing detail page ──────────
// Injected as <script type="application/ld+json"> in the page head
// Enables rich results in Google Search

export function getListingStructuredData(listing: Listing): object {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description ?? undefined,
    url: `${SITE_URL}/${listing.purpose}/${listing.slug}`,
    datePosted: listing.created_at,
    ...(listing.price && {
      offers: {
        "@type": "Offer",
        price: listing.price,
        priceCurrency: "MAD",
        availability:
          listing.status === "disponible"
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
      },
    }),
    ...(listing.listing_images?.length && {
      image: listing.listing_images
        .slice(0, 5)
        .map((img) => img.url),
    }),
    ...(listing.surface && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: listing.surface,
        unitCode: "MTK", // square meters
      },
    }),
    ...(listing.city && {
      address: {
        "@type": "PostalAddress",
        addressLocality: listing.city,
        addressRegion: listing.neighborhood ?? undefined,
        addressCountry: "MA",
      },
    }),
  };
}


// ── Organization structured data for homepage ────────────────

export function getOrganizationStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["French", "Arabic"],
    },
  };
}


// ── Internal helpers ─────────────────────────────────────────

function buildListingTitle(listing: Listing): string {
  const type    = formatType(listing.type);
  const purpose = formatPurpose(listing.purpose);
  const city    = listing.city;
  const rooms   = listing.bedrooms ? `${listing.bedrooms} ch.` : null;
  const price   = formatPrice(listing.price, listing.price_period);

  // e.g. "Villa 4 ch. à Vendre à Tanger — 4 500 000 MAD"
  return [type, rooms, purpose, `à ${city}`, "—", price]
    .filter(Boolean)
    .join(" ");
}

function buildListingDescription(listing: Listing): string {
  if (listing.description) {
    // Take first 160 characters of the description
    const clean = listing.description.replace(/\s+/g, " ").trim();
    return clean.length > 160 ? clean.slice(0, 157) + "..." : clean;
  }

  // Fallback auto-generated description
  const parts = [
    formatType(listing.type),
    listing.surface ? `de ${listing.surface} m²` : null,
    listing.bedrooms ? `avec ${listing.bedrooms} chambres` : null,
    `à ${listing.city}`,
    listing.neighborhood ? `(${listing.neighborhood})` : null,
    formatPurpose(listing.purpose).toLowerCase(),
    `à ${formatPrice(listing.price, listing.price_period)}.`,
  ];

  return parts.filter(Boolean).join(" ");
}