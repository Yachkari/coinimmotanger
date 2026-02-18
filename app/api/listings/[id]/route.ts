import { NextRequest, NextResponse } from "next/server";
import {
  getListingById,
  updateListing,
  deleteListing,
  deleteListingImage,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import type { UpdateListingPayload } from "@/types";

// ── Auth helper ───────────────────────────────────────────────

function isAdmin(req: NextRequest): boolean {
  return (
    req.headers.get("x-admin-token") === process.env.ADMIN_API_TOKEN
  );
}


// ── GET /api/listings/[id] ───────────────────────────────────
// Admin only — get full listing by ID (includes all images)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const result = await getListingById(id);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result.data);
}


// ── PUT /api/listings/[id] ───────────────────────────────────
// Admin only — update an existing listing

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body: UpdateListingPayload = await req.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Aucune donnée à mettre à jour." },
        { status: 400 }
      );
    }

    const result = await updateListing(id, body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (err) {
    console.error("[PUT /api/listings/[id]]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}


// ── DELETE /api/listings/[id] ────────────────────────────────
// Admin only — delete listing + cascade deletes its images in DB
// Also cleans up image files from Supabase Storage

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { id } = await params;

    // 1. Fetch listing with images before deleting
    const listing = await getListingById(id);

    if (listing.error || !listing.data) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }

    // 2. Delete image files from Supabase Storage
    const images = listing.data.listing_images ?? [];

    if (images.length > 0) {
      const supabase = await createClient(true);

      // Extract storage paths from URLs
      // URL format: https://xxx.supabase.co/storage/v1/object/public/listing-images/PATH
      const storagePaths = images
        .map((img) => {
          const url = img.url;
          const marker = "/listing-images/";
          const idx = url.indexOf(marker);
          return idx !== -1 ? url.slice(idx + marker.length) : null;
        })
        .filter((p): p is string => p !== null);

      if (storagePaths.length > 0) {
        await supabase.storage
          .from("listing-images")
          .remove(storagePaths);
      }
    }

    // 3. Delete the listing (DB images cascade-delete via FK)
    const result = await deleteListing(id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/listings/[id]]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}