import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-me"
);

export interface AdminTokenPayload {
  sub: string; // admin id
  username: string;
  [key: string]: unknown;
}

/** إنشاء توكن JWT صالح 7 أيام */
export async function createToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/** التحقق من التوكن وإرجاع الحمولة أو null */
export async function verifyToken(
  token: string
): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}

/** تجزئة كلمة المرور */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/** مقارنة كلمة المرور مع التجزئة */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const ADMIN_COOKIE = "pilot_admin_token";
