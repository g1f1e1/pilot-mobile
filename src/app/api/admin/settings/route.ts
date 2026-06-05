import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/adminGuard";
import { getSettings } from "@/lib/settings";

// الحقول المسموح بتعديلها
const FIELDS = [
  "logoUrl",
  "brandWord",
  "welcome",
  "tagline",
  "playTitle",
  "playSubtitle",
  "contactTitle",
  "address",
  "phone",
  "phoneDisplay",
  "instagram",
  "tiktok",
  "maps",
  "colorBg",
  "colorPine",
  "colorGold",
  "colorCream",
  "fontFamily",
] as const;

export async function GET() {
  const denied = await guardAdmin();
  if (denied) return denied;
  const settings = await getSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(request: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;

  try {
    await getSettings(); // التأكد من وجود الصف
    const body = await request.json();
    const data: Record<string, string> = {};
    for (const f of FIELDS) {
      if (typeof body[f] === "string") data[f] = body[f];
    }

    const settings = await prisma.siteSettings.update({ where: { id: 1 }, data });
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    console.error("SETTINGS PUT error:", err);
    return NextResponse.json({ ok: false, error: "تعذّر حفظ الإعدادات." }, { status: 500 });
  }
}
