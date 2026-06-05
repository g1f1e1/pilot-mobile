import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/adminGuard";

const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

// نخزّن الصورة كـ data URL (base64) داخل قاعدة البيانات.
// هذا يجعل الموقع يعمل على الإنترنت (Vercel) دون الحاجة لتخزين ملفات على الخادم.
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
    // حدّ 2 ميجا لإبقاء الصفحة سريعة (الصورة تُحفظ داخل قاعدة البيانات).
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "حجم الصورة أكبر من 2 ميجابايت. استخدم صورة أصغر." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = bytes.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ ok: true, url: dataUrl });
  } catch (err) {
    console.error("UPLOAD error:", err);
    return NextResponse.json({ ok: false, error: "تعذّر رفع الصورة." }, { status: 500 });
  }
}
