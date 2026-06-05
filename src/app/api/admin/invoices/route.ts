import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/adminGuard";

export async function GET() {
  const denied = await guardAdmin();
  if (denied) return denied;

  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
  });
  const used = invoices.filter((i) => i.isUsed).length;

  return NextResponse.json({
    ok: true,
    data: invoices,
    summary: { total: invoices.length, used, remaining: invoices.length - used },
  });
}

// أبجدية بدون أحرف ملتبسة (0/O، 1/I) — أكواد قوية يصعب تخمينها
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function genCode() {
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `PLT-${s}`;
}

export async function POST(request: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    let codes: string[] = [];

    if (Array.isArray(body.codes)) {
      codes = body.codes.map((c: unknown) => String(c).trim().toUpperCase()).filter(Boolean);
    } else if (typeof body.codesText === "string") {
      codes = body.codesText
        .split(/[\n,]+/)
        .map((c: string) => c.trim().toUpperCase())
        .filter(Boolean);
    }

    // توليد تلقائي
    if (body.generate && Number(body.generate) > 0) {
      const set = new Set<string>();
      const target = Math.min(Number(body.generate), 500);
      while (set.size < target) set.add(genCode());
      codes.push(...set);
    }

    if (codes.length === 0) {
      return NextResponse.json({ ok: false, error: "لم يتم تقديم أي أكواد." }, { status: 400 });
    }

    const unique = [...new Set(codes)];

    // SQLite لا يدعم skipDuplicates — نستبعد الموجود مسبقًا يدويًا
    const existing = await prisma.invoice.findMany({
      where: { code: { in: unique } },
      select: { code: true },
    });
    const existingSet = new Set(existing.map((e) => e.code));
    const toCreate = unique.filter((c) => !existingSet.has(c));

    let created = 0;
    if (toCreate.length > 0) {
      const result = await prisma.invoice.createMany({
        data: toCreate.map((code) => ({ code })),
      });
      created = result.count;
    }

    return NextResponse.json({
      ok: true,
      created,
      skipped: unique.length - toCreate.length,
    });
  } catch (err) {
    console.error("INVOICE POST error:", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ أثناء إضافة الأكواد." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "معرّف مفقود." }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      return NextResponse.json({ ok: false, error: "غير موجود." }, { status: 404 });
    }
    if (invoice.isUsed) {
      return NextResponse.json(
        { ok: false, error: "لا يمكن حذف فاتورة مستخدمة (مرتبطة بمشاركة)." },
        { status: 409 }
      );
    }

    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("INVOICE DELETE error:", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ أثناء الحذف." }, { status: 500 });
  }
}
