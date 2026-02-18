import { createClient } from "@/lib/supabase/server";
import type {
  Listing,
  ListingImage,
  ContactMessage,
  CreateListingPayload,
  UpdateListingPayload,
  CreateContactMessagePayload,
  ListingFiltersWithPagination,
  PaginatedListings,
  DashboardStats,
  ApiResponse,
} from "@/types";

// ============================================================
// LISTINGS — READ
// ============================================================

// ── Get all listings with optional filters & pagination ──────

export async function getListings(
  filters: ListingFiltersWithPagination = {}
): Promise<ApiResponse<PaginatedListings>> {
  try {
    const supabase = await createClient();

    const {
      purpose,
      type,
      city,
      minPrice,
      maxPrice,
      minSurface,
      maxSurface,
      rooms,
      bedrooms,
      amenities,
      status,   // default: only show available listings
      search,
      page = 1,
      limit = 12,
      orderBy = "date_desc",
    } = filters;

    // Count query (for pagination total)
    let countQuery = supabase
      .from("listings")
      .select("id", { count: "exact", head: true });

    // Main data query
    let dataQuery = supabase
      .from("listings")
      .select(`*, listing_images(id, url, alt, order)`);

    // ── Apply filters to both queries ────────────────────────

    const applyFilters = (q: typeof dataQuery) => {
      if (purpose)    q = q.eq("purpose", purpose);
      if (type)       q = q.eq("type", type);
      if (city)       q = q.eq("city", city);
      if (status)     q = q.eq("status", status);
      if (minPrice)   q = q.gte("price", minPrice);
      if (maxPrice)   q = q.lte("price", maxPrice);
      if (minSurface) q = q.gte("surface", minSurface);
      if (maxSurface) q = q.lte("surface", maxSurface);
      if (rooms)      q = q.gte("rooms", rooms);
      if (bedrooms)   q = q.gte("bedrooms", bedrooms);

      // Amenities: listing must contain ALL selected amenities
      if (amenities && amenities.length > 0) {
        q = q.contains("amenities", amenities);
      }

      // Full-text search across title, description, city, neighborhood
      if (search) {
        q = q.or(
          `title.ilike.%${search}%,description.ilike.%${search}%,` +
          `city.ilike.%${search}%,neighborhood.ilike.%${search}%`
        );
      }

      return q;
    };

    countQuery = applyFilters(countQuery as typeof dataQuery) as typeof countQuery;
    dataQuery  = applyFilters(dataQuery);

    // ── Ordering ─────────────────────────────────────────────

    const orderMap: Record<string, { column: string; ascending: boolean }> = {
      date_desc:    { column: "created_at", ascending: false },
      date_asc:     { column: "created_at", ascending: true  },
      price_asc:    { column: "price",      ascending: true  },
      price_desc:   { column: "price",      ascending: false },
      surface_desc: { column: "surface",    ascending: false },
    };

    const order = orderMap[orderBy] ?? orderMap.date_desc;
    dataQuery = dataQuery.order(order.column, { ascending: order.ascending });

    // ── Pagination ────────────────────────────────────────────

    const from = (page - 1) * limit;
    const to   = from + limit - 1;
    dataQuery = dataQuery.range(from, to);

    // ── Execute both queries in parallel ─────────────────────

    const [countResult, dataResult] = await Promise.all([
      countQuery,
      dataQuery,
    ]);

    if (countResult.error) throw countResult.error;
    if (dataResult.error)  throw dataResult.error;

    const total = countResult.count ?? 0;

    return {
      data: {
        listings:   dataResult.data as Listing[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      error: null,
    };
  } catch (err) {
    console.error("[getListings]", err);
    return { data: null, error: "Impossible de charger les annonces." };
  }
}


// ── Get featured listings for homepage ───────────────────────

export async function getFeaturedListings(
  limit = 6
): Promise<ApiResponse<Listing[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("listings")
      .select(`*, listing_images(id, url, alt, order)`)
      .eq("is_featured", true)
      .eq("status", "disponible")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: data as Listing[], error: null };
  } catch (err) {
    console.error("[getFeaturedListings]", err);
    return { data: null, error: "Impossible de charger les annonces." };
  }
}


// ── Get a single listing by slug (for detail page) ───────────

export async function getListingBySlug(
  slug: string
): Promise<ApiResponse<Listing>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("listings")
      .select(`*, listing_images(id, url, alt, order)`)
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return { data: data as Listing, error: null };
  } catch (err) {
    console.error("[getListingBySlug]", err);
    return { data: null, error: "Annonce introuvable." };
  }
}


// ── Get a single listing by ID (for admin edit form) ─────────

export async function getListingById(
  id: string
): Promise<ApiResponse<Listing>> {
  try {
    const supabase = await createClient(true); // service role

    const { data, error } = await supabase
      .from("listings")
      .select(`*, listing_images(id, url, alt, order)`)
      .eq("id", id)
      .single();

    if (error) throw error;
    return { data: data as Listing, error: null };
  } catch (err) {
    console.error("[getListingById]", err);
    return { data: null, error: "Annonce introuvable." };
  }
}


// ── Get all listing slugs (for sitemap generation) ───────────

export async function getAllSlugs(): Promise<
  ApiResponse<{ slug: string; purpose: string; updated_at: string }[]>
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("listings")
      .select("slug, purpose, updated_at")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error("[getAllSlugs]", err);
    return { data: null, error: "Erreur lors de la génération du sitemap." };
  }
}


// ── Get related listings (same type/city, different slug) ────

export async function getRelatedListings(
  listing: Listing,
  limit = 3
): Promise<ApiResponse<Listing[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("listings")
      .select(`*, listing_images(id, url, alt, order)`)
      .eq("purpose", listing.purpose)
      .eq("city", listing.city)
      .eq("status", "disponible")
      .neq("id", listing.id)
      .limit(limit);

    if (error) throw error;
    return { data: data as Listing[], error: null };
  } catch (err) {
    console.error("[getRelatedListings]", err);
    return { data: null, error: "Erreur." };
  }
}


// ============================================================
// LISTINGS — WRITE (require service role key)
// ============================================================

// ── Create a new listing ─────────────────────────────────────

export async function createListing(
  payload: CreateListingPayload
): Promise<ApiResponse<Listing>> {
  try {
    const supabase = await createClient(true);

    const { error: insertError } = await supabase
      .from("listings")
      .insert(payload);

    // Slug collision → fetch the existing one (same slug = same listing intent)
    // This handles React StrictMode double-invoke and accidental double submits
    if (insertError && insertError.code !== "23505") {
      throw insertError;
    }

    // Whether insert succeeded or slug already existed, fetch by slug
    const { data, error: fetchError } = await supabase
      .from("listings")
      .select("*")
      .eq("slug", payload.slug)
      .single();

    if (fetchError) throw fetchError;

    return { data: data as Listing, error: null };
  } catch (err) {
    console.error("[createListing]", err);
    return { data: null, error: "Impossible de créer l'annonce." };
  }
}

// ── Update an existing listing ───────────────────────────────

export async function updateListing(
  id: string,
  payload: UpdateListingPayload
): Promise<ApiResponse<Listing>> {
  try {
    const supabase = await createClient(true);

    // Strip fields that don't belong in the listings table
    const { listing_images, created_at, updated_at, ...cleanPayload } =
      payload as UpdateListingPayload & {
        listing_images?: unknown;
        created_at?: unknown;
        updated_at?: unknown;
      };

    const { error: updateError } = await supabase
      .from("listings")
      .update(cleanPayload)
      .eq("id", id);

    if (updateError) throw updateError;

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (listingError) throw listingError;

    const { data: images } = await supabase
      .from("listing_images")
      .select("id, url, alt, order")
      .eq("listing_id", id)
      .order("order");

    return {
      data: { ...listing, listing_images: images ?? [] } as Listing,
      error: null,
    };
  } catch (err) {
    console.error("[updateListing] CAUGHT:", err);
    return { data: null, error: "Impossible de modifier l'annonce." };
  }
}


// ── Delete a listing (images cascade-delete via FK) ──────────

export async function deleteListing(
  id: string
): Promise<ApiResponse<boolean>> {
  try {
    const supabase = await createClient(true);

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { data: true, error: null };
  } catch (err) {
    console.error("[deleteListing]", err);
    return { data: null, error: "Impossible de supprimer l'annonce." };
  }
}


// ============================================================
// LISTING IMAGES
// ============================================================

// ── Add images to a listing ───────────────────────────────────

export async function addListingImages(
  images: Omit<ListingImage, "id" | "created_at">[]
): Promise<ApiResponse<ListingImage[]>> {
  try {
    const supabase = await createClient(true);

    const { data, error } = await supabase
      .from("listing_images")
      .insert(images)
      .select();

    if (error) throw error;
    return { data: data as ListingImage[], error: null };
  } catch (err) {
    console.error("[addListingImages]", err);
    return { data: null, error: "Impossible d'ajouter les images." };
  }
}


// ── Delete a single image ────────────────────────────────────

export async function deleteListingImage(
  imageId: string
): Promise<ApiResponse<boolean>> {
  try {
    const supabase = await createClient(true);

    const { error } = await supabase
      .from("listing_images")
      .delete()
      .eq("id", imageId);

    if (error) throw error;
    return { data: true, error: null };
  } catch (err) {
    console.error("[deleteListingImage]", err);
    return { data: null, error: "Impossible de supprimer l'image." };
  }
}


// ── Reorder listing images ────────────────────────────────────

export async function reorderListingImages(
  updates: { id: string; order: number }[]
): Promise<ApiResponse<boolean>> {
  try {
    const supabase = await createClient(true);

    await Promise.all(
      updates.map(({ id, order }) =>
        supabase.from("listing_images").update({ order }).eq("id", id)
      )
    );

    return { data: true, error: null };
  } catch (err) {
    console.error("[reorderListingImages]", err);
    return { data: null, error: "Impossible de réordonner les images." };
  }
}


// ============================================================
// CONTACT MESSAGES
// ============================================================

// ── Create a contact message (public form submission) ────────

export async function createContactMessage(
  payload: CreateContactMessagePayload
): Promise<ApiResponse<ContactMessage>> {
  try {
    const supabase = await createClient(); // anon — allowed by RLS

    const { data, error } = await supabase
      .from("contact_messages")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return { data: data as ContactMessage, error: null };
  } catch (err) {
    console.error("[createContactMessage]", err);
    return { data: null, error: "Impossible d'envoyer le message." };
  }
}


// ── Get all contact messages (admin only) ────────────────────

export async function getContactMessages(
  unreadOnly = false
): Promise<ApiResponse<ContactMessage[]>> {
  try {
    const supabase = await createClient(true);

    let query = supabase
      .from("contact_messages")
      .select()
      .order("created_at", { ascending: false });

    if (unreadOnly) query = query.eq("is_read", false);

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as ContactMessage[], error: null };
  } catch (err) {
    console.error("[getContactMessages]", err);
    return { data: null, error: "Impossible de charger les messages." };
  }
}


// ── Mark a message as read ────────────────────────────────────

export async function markMessageAsRead(
  id: string
): Promise<ApiResponse<boolean>> {
  try {
    const supabase = await createClient(true);

    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (error) throw error;
    return { data: true, error: null };
  } catch (err) {
    console.error("[markMessageAsRead]", err);
    return { data: null, error: "Erreur." };
  }
}


// ============================================================
// ADMIN DASHBOARD
// ============================================================

// ── Get dashboard stats in a single round-trip ───────────────

export async function getDashboardStats(): Promise<
  ApiResponse<DashboardStats>
> {
  try {
    const supabase = await createClient(true);

    const [total, available, sold, rented, reserved, featured, unread] =
  await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "disponible"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "vendu"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "loue"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "reserve"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("is_featured", true),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);

return {
  data: {
    totalListings:     total.count     ?? 0,
    availableListings: available.count ?? 0,
    soldListings: (sold.count ?? 0) + (rented.count ?? 0) + (reserved.count ?? 0),
    rentedListings: 0,
    featuredListings:  featured.count  ?? 0,
    unreadMessages:    unread.count    ?? 0,
  },
  error: null,
};
  } catch (err) {
    console.error("[getDashboardStats]", err);
    return { data: null, error: "Impossible de charger les statistiques." };
  }
}