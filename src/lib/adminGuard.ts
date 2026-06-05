import { NextResponse } from "next/server";
import { getAdminSession } from "./session";

/** يتحقق من جلسة الأدمن في مسارات API — يرجع null إن كان مصرّحًا، أو رد 401 */
export async function guardAdmin(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "غير مصرّح." }, { status: 401 });
  }
  return null;
}
