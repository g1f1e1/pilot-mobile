import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, createToken, verifyToken, type AdminTokenPayload } from "./auth";

/** ضبط كوكي جلسة الأدمن (httpOnly) */
export async function setAdminSession(payload: AdminTokenPayload) {
  const token = await createToken(payload);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 أيام
  });
}

/** إنهاء جلسة الأدمن */
export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

/** قراءة جلسة الأدمن الحالية (أو null) */
export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
