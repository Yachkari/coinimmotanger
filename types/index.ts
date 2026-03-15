// ============================================================
// IMMOBILIER — Global TypeScript Types
// Every component, query, and API route imports from here
// ============================================================


// ── Enums (mirror the PostgreSQL enums in Supabase) ─────────

export type PropertyType =
  | "appartement"
  | "villa"
  | "maison"
  | "studio"
  | "bureau"
  | "terrain"
   | "local industriel"
  | "local commercial"
  | "Ryad"
  | "Ferme";

export type ListingPurpose = "vente" | "location" | "vacances";

export type ListingStatus = "disponible" | "vendu" | "loue" | "reserve";


// ── Core Models ──────────────────────────────────────────────

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  alt: string | null;
  order: number;
  created_at: string;
}

export interface Listing {
  id: string;
  slug: string;

  // Core info
  title: string;
  description: string | null;
  type: PropertyType;
  purpose: ListingPurpose;
  status: ListingStatus;

  // Pricing
  price: number;
  price_period: string | null;   // null = sale | "nuit" | "semaine" | "mois"

  // Property details
  surface: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;

  // Location
  city: string;
  neighborhood: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;

  // Features
  amenities: string[];

  // Display
  is_featured: boolean;
  cover_image_index: number;

  // SEO overrides
  meta_title: string | null;
  meta_description: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Joined relation — present when queried with images
  listing_images?: ListingImage[];

  //reference
  reference_code?: string | null;
  reference?:      string | null;
  geo_code?: string | null;

  //eng
  title_en?:       string | null;
description_en?: string | null;
}

export interface ContactMessage {
  id: string;
  listing_id: string | null;
  listing_title: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}


// ── Form Payloads (used in admin forms & API routes) ─────────

export type CreateListingPayload = Omit<
  Listing,
  "id" | "created_at" | "updated_at" | "listing_images"
>;

export type UpdateListingPayload = Partial<CreateListingPayload>;

export interface CreateContactMessagePayload {
  listing_id?: string;
  listing_title?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}


// ── Filter & Search ──────────────────────────────────────────

export interface ListingFilters {
  purpose?: ListingPurpose;
  type?: PropertyType;
  city?: string;
  neighborhood?:string;
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  maxSurface?: number;
  rooms?: number;
  bedrooms?: number;
  amenities?: string[];
  status?: ListingStatus;
  search?: string;
}

export interface ListingFiltersWithPagination extends ListingFilters {
  page?: number;
  limit?: number;
  orderBy?: "price_asc" | "price_desc" | "date_desc" | "date_asc" | "surface_desc";
}


// ── API Response wrappers ────────────────────────────────────

export interface ApiSuccess<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedListings {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


// ── SEO ──────────────────────────────────────────────────────

export interface PageMetadata {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
}


// ── Amenity definition (used in constants/amenities.ts) ──────

export interface AmenityDefinition {
  key: string;        // stored in DB e.g. "piscine"
  label: string;      // displayed in UI e.g. "Piscine"
  icon: string;       // lucide icon name e.g. "Waves"
}


// ── Admin dashboard stats ────────────────────────────────────

export interface DashboardStats {
  totalListings: number;
  availableListings: number;
  soldListings: number;
  rentedListings: number;
  unreadMessages: number;
  featuredListings: number;
}