import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ListingPurpose, ListingStatus, PropertyType } from "@/types";

// ── Tailwind class merging ───────────────────────────────────
// Usage: className={cn("base-class", condition && "conditional-class")}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// ── Price formatting ─────────────────────────────────────────
// formatPrice(1200000)           → "1 200 000 MAD"
// formatPrice(3500, "mois")      → "3 500 MAD / mois"
// formatPrice(450, "nuit")       → "450 MAD / nuit"

export function formatPrice(
  price: number,
  period?: string | null
): string {
  // Manual formatting — consistent on server and client
  const formatted = Math.round(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const base = `${formatted} MAD`;
  return period ? `${base} / ${period}` : base;
}

// ── Surface formatting ───────────────────────────────────────
// formatSurface(110) → "110 m²"

export function formatSurface(surface: number | null): string {
  if (!surface) return "N/A";
  return `${surface} m²`;
}


// ── Rooms label ──────────────────────────────────────────────
// formatRooms(4) → "4 pièces"
// formatRooms(1) → "1 pièce"

export function formatRooms(rooms: number | null): string {
  if (!rooms) return "N/A";
  return `${rooms} ${rooms === 1 ? "pièce" : "pièces"}`;
}


// ── Floor label ──────────────────────────────────────────────
// formatFloor(0)    → "Rez-de-chaussée"
// formatFloor(null) → "Rez-de-chaussée"
// formatFloor(3)    → "3ème étage"
// formatFloor(1)    → "1er étage"

export function formatFloor(floor: number | null): string {
  if (floor === null || floor === 0) return "Rez-de-chaussée";
  if (floor === 1) return "1er étage";
  return `${floor}ème étage`;
}


// ── Purpose label ────────────────────────────────────────────

export function formatPurpose(purpose: ListingPurpose): string {
  const map: Record<ListingPurpose, string> = {
    vente: "À Vendre",
    location: "À Louer",
    vacances: "Vacances",
  };
  return map[purpose];
}


// ── Property type label ──────────────────────────────────────

export function formatType(type: PropertyType): string {
  const map: Record<PropertyType, string> = {
    appartement: "Appartement",
    villa: "Villa",
    maison: "Maison",
    studio: "Studio",
    bureau: "Bureau",
    terrain: "Terrain",
  };
  return map[type];
}


// ── Status label & color ─────────────────────────────────────

export function formatStatus(status: ListingStatus): {
  label: string;
  color: string;
} {
  const map: Record<ListingStatus, { label: string; color: string }> = {
    disponible: { label: "Disponible", color: "bg-green-100 text-green-800" },
    vendu:      { label: "Vendu",      color: "bg-red-100 text-red-800"     },
    loue:       { label: "Loué",       color: "bg-orange-100 text-orange-800" },
    reserve:    { label: "Réservé",    color: "bg-yellow-100 text-yellow-800" },
  };
  return map[status];
}


// ── Purpose → route path ─────────────────────────────────────
// purposeToPath("vente") → "/vente"

export function purposeToPath(purpose: ListingPurpose): string {
  return `/${purpose}`;
}


// ── Full listing URL ─────────────────────────────────────────
// listingUrl("vente", "villa-tanger-malabata") → "/vente/villa-tanger-malabata"

export function listingUrl(purpose: ListingPurpose, slug: string): string {
  return `/${purpose}/${slug}`;
}


// ── Truncate text ────────────────────────────────────────────
// truncate("Long description...", 100) → "Long descri..."

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}


// ── Get cover image URL from a listing ───────────────────────

export function getCoverImage(
  images: { url: string; order: number }[],
  coverIndex: number = 0
): string | null {
  if (!images || images.length === 0) return null;
  const sorted = [...images].sort((a, b) => a.order - b.order);
  return sorted[coverIndex]?.url ?? sorted[0]?.url ?? null;
}


// ── WhatsApp link builder ─────────────────────────────────────
// Builds a pre-filled wa.me link
// listingTitle is optional — omit for the generic site-wide button

export function buildWhatsAppLink(
  phoneNumber: string,
  listingTitle?: string
): string {
  const message = listingTitle
    ? `Bonjour, je suis intéressé(e) par le bien : "${listingTitle}". Pouvez-vous me donner plus d'informations ?`
    : `Bonjour, je souhaite avoir des informations sur vos biens disponibles.`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}


// ── Relative time ────────────────────────────────────────────
// relativeTime("2024-01-01") → "il y a 3 mois"

export function relativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "aujourd'hui";
  if (diffDays === 1) return "hier";
  if (diffDays < 7) return `il y a ${diffDays} jours`;
  if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaines`;
  if (diffDays < 365) return `il y a ${Math.floor(diffDays / 30)} mois`;
  return `il y a ${Math.floor(diffDays / 365)} ans`;
}