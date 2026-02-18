import slugifyLib from "slugify";

// ── Slug generation ──────────────────────────────────────────
// Converts listing titles into clean, SEO-friendly URL segments
//
// generateSlug("Villa Moderne - Tanger, Malabata 4 Ch!")
// → "villa-moderne-tanger-malabata-4-ch"
//
// generateSlug("Appartement 3 pièces", "location")
// → "appartement-3-pieces-location"

export function generateSlug(title: string, suffix?: string): string {
  const base = slugifyLib(title, {
    lower: true,
    strict: true,       // removes all special chars except separators
    locale: "fr",       // handles French accents: é→e, è→e, ç→c, etc.
    trim: true,
  });

  if (suffix) {
    const cleanSuffix = slugifyLib(suffix, { lower: true, strict: true });
    return `${base}-${cleanSuffix}`;
  }

  return base;
}


// ── Make a slug unique by appending a short timestamp ────────
// Used when a slug already exists in the DB
//
// uniqueSlug("villa-tanger") → "villa-tanger-a1b2"

export function uniqueSlug(base: string): string {
  const timestamp = Date.now().toString(36).slice(-4); // short alphanumeric
  return `${base}-${timestamp}`;
}


// ── Build a rich slug from listing fields ────────────────────
// This is what you call in the admin form to auto-generate the slug
//
// buildListingSlug("Villa", "Tanger", "Malabata", "vente")
// → "villa-tanger-malabata-vente"

export function buildListingSlug(
  type: string,
  city: string,
  neighborhood?: string | null,
  purpose?: string
): string {
  const parts = [type, city, neighborhood, purpose]
    .filter(Boolean)
    .join(" ");

  return generateSlug(parts);
}