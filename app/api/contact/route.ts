import { NextRequest, NextResponse } from "next/server";
import { createContactMessage } from "@/lib/supabase/queries";
import { sendContactEmail, sendConfirmationEmail } from "@/lib/resend";
import type { CreateContactMessagePayload } from "@/types";

// ── POST /api/contact ────────────────────────────────────────
// Public — receives contact form submissions
// 1. Validates input
// 2. Saves message to DB
// 3. Sends notification email to admin
// 4. Sends confirmation email to client

export async function POST(req: NextRequest) {
  try {
    const body: CreateContactMessagePayload = await req.json();

    // ── Validation ───────────────────────────────────────────

    const errors: string[] = [];

    if (!body.name?.trim()) {
      errors.push("Le nom est obligatoire.");
    }

    if (!body.email?.trim()) {
      errors.push("L'email est obligatoire.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push("L'adresse email n'est pas valide.");
    }

    if (!body.message?.trim()) {
      errors.push("Le message est obligatoire.");
    } else if (body.message.trim().length < 10) {
      errors.push("Le message doit contenir au moins 10 caractères.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // ── Sanitize ─────────────────────────────────────────────

    const payload: CreateContactMessagePayload = {
      listing_id:    body.listing_id    ?? undefined,
      listing_title: body.listing_title ?? undefined,
      name:          body.name.trim(),
      email:         body.email.trim().toLowerCase(),
      phone:         body.phone?.trim() ?? undefined,
      message:       body.message.trim(),
    };

    // ── Save to DB ───────────────────────────────────────────

    const dbResult = await createContactMessage(payload);

    if (dbResult.error) {
      console.error("[POST /api/contact] DB error:", dbResult.error);
      // Don't fail the request — still try to send the email
    }

    // ── Send emails (in parallel, non-blocking) ──────────────

    await Promise.allSettled([
      sendContactEmail(payload),
      sendConfirmationEmail(payload.name, payload.email, payload.listing_title),
    ]);

    return NextResponse.json(
      { success: true, message: "Votre message a bien été envoyé." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}