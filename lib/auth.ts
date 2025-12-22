// Admin authentication utilities
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_PASSWORD || "change-me-in-production";

// Simple session token generation (in production, use a proper JWT or session library)
function generateSessionToken(): string {
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString("base64");
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === ADMIN_SESSION_SECRET;
}

export async function createAdminSession(): Promise<string> {
  const token = generateSessionToken();
  // In production, store this in a database or use proper session management
  return token;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);

  if (!session) return false;

  // In production, verify the session token properly
  // For now, if the cookie exists, we consider it valid
  return true;
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
