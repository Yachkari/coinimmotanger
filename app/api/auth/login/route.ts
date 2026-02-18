import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSession, destroySession } from "@/lib/auth";

// ── POST /api/auth/login ─────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe obligatoires." },
        { status: 400 }
      );
    }

    if (!verifyCredentials(email, password)) {
      // Delay response slightly to slow brute force attempts
      await new Promise((r) => setTimeout(r, 800));
      return NextResponse.json(
        { error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    await createSession();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}