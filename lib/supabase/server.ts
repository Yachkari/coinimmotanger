import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ── Server-side Supabase client ──────────────────────────────
// Use this in Server Components, API routes, and Server Actions
// Uses the anon key by default — still subject to RLS
// Pass useServiceRole=true in API routes that need admin access

export async function createClient(useServiceRole = false) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    useServiceRole
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!   // bypasses RLS — server only
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll called from a Server Component — safe to ignore
          }
        },
      },
    }
  );
}