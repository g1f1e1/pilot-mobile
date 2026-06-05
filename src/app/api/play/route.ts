import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pickWeightedPrize } from "@/lib/prizes";
import { isValidIraqiPhone, normalizePhone } from "@/lib/utils";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // حماية ضد التخمين/التكرار: 8 محاولات كحد أقصى كل دقيقة لكل IP
    if (!rateLimit(`play:${ip}`, 8, 60_000)) {
      return NextResponse.json(
        { ok: false, error: "محاولات كثيرة جدًا. يرجى الانتظار دقيقة ثم المحاولة مرة أخرى." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const fullName = String(body.fullName ?? "").trim();
    const phoneRaw = String(body.phone ?? "");
    const phone = normalizePhone(phoneRaw);
    const invoiceCode = String(body.invoiceCode ?? "").trim().toUpperCase();

    // ===== التحقق من المدخلات =====
    if (fullName.length < 3) {
      return NextResponse.json(
        { ok: false, error: "يرجى إدخال الاسم الكامل (3 أحرف على الأقل)." },
        { status: 400 }
      );
    }
    if (!isValidIraqiPhone(phone)) {
      return NextResponse.json(
        { ok: false, error: "رقم غير صحيح. يجب أن يكون 11 رقمًا عراقيًا يبدأ بـ 077 أو 078." },
        { status: 400 }
      );
    }
    if (!invoiceCode) {
      return NextResponse.json(
        { ok: false, error: "يرجى إدخال كود الفاتورة." },
        { status: 400 }
      );
    }

    // منع مشاركة نفس رقم الهاتف أكثر من مرة
    const phoneUsed = await prisma.participation.findFirst({ where: { phone } });
    if (phoneUsed) {
      await prisma.log.create({
        data: { action: "DUPLICATE_PHONE", detail: phone, ip },
      });
      return NextResponse.json(
        { ok: false, error: "هذا الرقم شارك مسبقًا. يُسمح بمشاركة واحدة لكل رقم هاتف." },
        { status: 409 }
      );
    }

    // ===== التحقق من الفاتورة =====
    const invoice = await prisma.invoice.findUnique({ where: { code: invoiceCode } });
    if (!invoice) {
      await prisma.log.create({
        data: { action: "INVALID_INVOICE", detail: invoiceCode, ip },
      });
      return NextResponse.json(
        { ok: false, error: "كود الفاتورة غير صحيح أو غير موجود." },
        { status: 404 }
      );
    }
    if (invoice.isUsed) {
      await prisma.log.create({
        data: { action: "USED_INVOICE", detail: invoiceCode, ip },
      });
      return NextResponse.json(
        { ok: false, error: "تم استخدام هذه الفاتورة مسبقًا. لا يمكن اللعب بها مرة أخرى." },
        { status: 409 }
      );
    }

    // ===== اختيار الجائزة من السيرفر (المصدر الوحيد) =====
    const prizes = await prisma.prize.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    const prize = pickWeightedPrize(prizes);
    if (!prize) {
      return NextResponse.json(
        { ok: false, error: "لا توجد جوائز متاحة حاليًا." },
        { status: 503 }
      );
    }

    // ===== حجز الفاتورة بشكل ذرّي (منع الاستخدام المزدوج) =====
    const claimed = await prisma.invoice.updateMany({
      where: { code: invoiceCode, isUsed: false },
      data: { isUsed: true, usedAt: new Date() },
    });
    if (claimed.count === 0) {
      return NextResponse.json(
        { ok: false, error: "تم استخدام هذه الفاتورة للتو. حاول بفاتورة أخرى." },
        { status: 409 }
      );
    }

    // ===== تسجيل المشاركة =====
    const participation = await prisma.participation.create({
      data: {
        fullName,
        phone,
        invoiceCode,
        prizeId: prize.id,
        prizeLabel: prize.label,
        ip,
      },
    });

    await prisma.log.create({
      data: {
        action: "PLAY",
        detail: `${fullName} (${phone}) → ${prize.label} [${invoiceCode}]`,
        ip,
      },
    });

    return NextResponse.json({
      ok: true,
      prize: { id: prize.id, label: prize.label },
      participationId: participation.id,
    });
  } catch (err) {
    console.error("PLAY error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ غير متوقع. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
