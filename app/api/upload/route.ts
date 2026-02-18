import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addListingImages } from "@/lib/supabase/queries";

const BUCKET          = "listing-images";
const MAX_FILE_SIZE   = 5 * 1024 * 1024;    // 5MB per image
const MAX_FILES       = 15;                  // max images per listing
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg", 
  "image/jfif",
  "image/pjpeg",  // another jpeg variant
  "image/png",
  "image/webp",
  "image/avif",
];

// ── Auth helper ───────────────────────────────────────────────

function isAdmin(req: NextRequest): boolean {
  return req.headers.get("x-admin-token") === process.env.ADMIN_API_TOKEN;
}


// ── POST /api/upload ─────────────────────────────────────────
// Admin only — uploads one or more images to Supabase Storage
// then saves their URLs to the listing_images table
//
// Expects multipart/form-data with:
//   - listing_id: string
//   - files:      File[] (multiple)

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const formData   = await req.formData();
    const listing_id = formData.get("listing_id") as string;
    const files      = formData.getAll("files") as File[];

    // ── Validation ───────────────────────────────────────────

    if (!listing_id) {
      return NextResponse.json(
        { error: "listing_id est obligatoire." },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Aucun fichier reçu." },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} images par annonce.` },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Type non supporté: ${file.type}. Utilisez JPEG, PNG, WebP ou AVIF.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `${file.name} dépasse la limite de 5MB.` },
          { status: 400 }
        );
      }
    }

    // ── Upload to Supabase Storage ───────────────────────────

    const supabase      = await createClient(true);
    const uploadedImages: { listing_id: string; url: string; alt: string; order: number }[] = [];
    const errors: string[] = [];

    // Get current image count to set correct order offset
    const { data: existingImages } = await supabase
      .from("listing_images")
      .select("order")
      .eq("listing_id", listing_id)
      .order("order", { ascending: false })
      .limit(1);

    const orderOffset = existingImages?.[0]?.order != null
      ? existingImages[0].order + 1
      : 0;

    await Promise.all(
      files.map(async (file, index) => {
        try {
          const ext       = file.name.split(".").pop() ?? "jpg";
          const timestamp = Date.now();
          const path      = `${listing_id}/${timestamp}-${index}.${ext}`;

          const arrayBuffer = await file.arrayBuffer();
          const buffer      = new Uint8Array(arrayBuffer);

          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(path, buffer, {
              contentType:  file.type,
              cacheControl: "3600",
              upsert:       false,
            });

          if (uploadError) throw uploadError;

          // Build the public URL
          const { data: { publicUrl } } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(path);

          uploadedImages.push({
            listing_id,
            url:   publicUrl,
            alt:   file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
            order: orderOffset + index,
          });
        } catch (err) {
          console.error(`[upload] Failed to upload ${file.name}:`, err);
          errors.push(file.name);
        }
      })
    );

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { error: "Aucune image n'a pu être uploadée." },
        { status: 500 }
      );
    }

    // ── Save URLs to listing_images table ────────────────────

    const dbResult = await addListingImages(uploadedImages);

    if (dbResult.error) {
      return NextResponse.json({ error: dbResult.error }, { status: 500 });
    }

    return NextResponse.json({
      success:  true,
      images:   dbResult.data,
      failed:   errors,          // any files that failed
    }, { status: 201 });

  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}


// ── DELETE /api/upload ───────────────────────────────────────
// Admin only — deletes a single image from Storage + DB
//
// Body: { image_id: string, url: string }

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { image_id, url } = await req.json();

    if (!image_id || !url) {
      return NextResponse.json(
        { error: "image_id et url sont obligatoires." },
        { status: 400 }
      );
    }

    const supabase = await createClient(true);

    // Extract storage path from public URL
    const marker = `/${BUCKET}/`;
    const idx    = url.indexOf(marker);

    if (idx !== -1) {
      const storagePath = url.slice(idx + marker.length);
      await supabase.storage.from(BUCKET).remove([storagePath]);
    }

    // Delete from DB
    const { error } = await supabase
      .from("listing_images")
      .delete()
      .eq("id", image_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/upload]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}