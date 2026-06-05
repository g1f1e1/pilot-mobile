import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { guardAdmin } from "@/lib/adminGuard";

const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "لم يتم اختيار ملف." }, { status: 400 });
    }
    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json(
        { ok: false, error: "نوع الملف غير مدعوم. استخدم PNG أو JPG أو WEBP أو SVG." },
        { status: 400 }
      );
    }
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "حجم الصورة أكبر من 4 ميجابايت." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);

    return NextResponse.json({ ok: true, url: `/uploads/${name}` });
  } catch (err) {
    console.error("UPLOAD error:", err);
    return NextResponse.json({ ok: false, error: "تعذّر رفع الصورة." }, { status: 500 });
  }
}
