import { cookies } from "next/headers";

const SESSION_COOKIE  = "admin_session";
const SESSION_VALUE   = "authenticated";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

// ── Verify admin credentials ──────────────────────────────────

export function verifyCredentials(email: string, password: string): boolean {
  return (
    email    === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  );
}

// ── Set session cookie (call after successful login) ─────────

export async function createSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,       // not accessible from JS
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   MAX_AGE_SECONDS,
    path:     "/",
  });
}

// ── Clear session cookie (call on logout) ────────────────────

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// ── Check if current request has a valid session ─────────────

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}