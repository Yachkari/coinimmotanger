import { NextRequest, NextResponse } from "next/server";
import { getListings, createListing } from "@/lib/supabase/queries";
import { generateSlug, uniqueSlug } from "@/lib/slugify";
import type { ListingFiltersWithPagination, CreateListingPayload } from "@/types";
import type { ListingPurpose, PropertyType, ListingStatus } from "@/types";

// ── GET /api/listings ────────────────────────────────────────
// Public — returns paginated, filtered listings
// Query params mirror ListingFiltersWithPagination

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const filters: ListingFiltersWithPagination = {
    purpose:    (searchParams.get("purpose")   as ListingPurpose)   ?? undefined,
  type:       (searchParams.get("type")      as PropertyType)     ?? undefined,
  status:     (searchParams.get("status")    as ListingStatus)    ?? "disponible",
  orderBy:    (searchParams.get("orderBy")   as ListingFiltersWithPagination["orderBy"]) ?? "date_desc",
  city:       searchParams.get("city")                            ?? undefined,
  search:     searchParams.get("search")                          ?? undefined,
  minPrice:   searchParams.get("minPrice")   ? Number(searchParams.get("minPrice"))      : undefined,
  maxPrice:   searchParams.get("maxPrice")   ? Number(searchParams.get("maxPrice"))      : undefined,
  minSurface: searchParams.get("minSurface") ? Number(searchParams.get("minSurface"))    : undefined,
  maxSurface: searchParams.get("maxSurface") ? Number(searchParams.get("maxSurface"))    : undefined,
  rooms:      searchParams.get("rooms")      ? Number(searchParams.get("rooms"))         : undefined,
  bedrooms:   searchParams.get("bedrooms")   ? Number(searchParams.get("bedrooms"))      : undefined,
  page:       searchParams.get("page")       ? Number(searchParams.get("page"))          : 1,
  limit:      searchParams.get("limit")      ? Number(searchParams.get("limit"))         : 12,
  amenities:  searchParams.get("amenities")  ? searchParams.get("amenities")!.split(",") : undefined,
  };

  const result = await getListings(filters);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
}


// ── POST /api/listings ───────────────────────────────────────
// Admin only — creates a new listing
// Requires service role key via server-side auth check

export async function POST(req: NextRequest) {
  try {
    const isAdmin = req.headers.get("x-admin-token") ===
                    process.env.ADMIN_API_TOKEN;
    if (!isAdmin) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body: CreateListingPayload = await req.json();

    if (!body.title || !body.type || !body.purpose || !body.price || !body.city) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants : titre, type, objectif, prix, ville." },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    if (!body.slug) {
      body.slug = generateSlug(
        `${body.type} ${body.city} ${body.neighborhood ?? ""} ${body.purpose}`
      );
    }

    const result = await createListing(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Always 201 — createListing now handles slug collisions gracefully
    return NextResponse.json(result.data, { status: 201 });

  } catch (err) {
    console.error("[POST /api/listings]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}