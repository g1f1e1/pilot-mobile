import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/adminGuard";

export async function GET() {
  const denied = await guardAdmin();
  if (denied) return denied;

  const prizes = await prisma.prize.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ ok: true, data: prizes });
}

export async function PUT(request: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    if (!Array.isArray(body.prizes)) {
      return NextResponse.json({ ok: false, error: "بيانات غير صالحة." }, { status: 400 });
    }

    await prisma.$transaction(
      body.prizes.map(
        (p: {
          id: string;
          label: string;
          weight: number;
          active: boolean;
          icon?: string;
          image?: string;
        }) =>
          prisma.prize.update({
            where: { id: p.id },
            data: {
              label: String(p.label),
              weight: Math.max(0, Math.floor(Number(p.weight) || 0)),
              active: Boolean(p.active),
              ...(typeof p.icon === "string" ? { icon: p.icon } : {}),
              ...(typeof p.image === "string" ? { image: p.image } : {}),
            },
          })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PRIZES PUT error:", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ أثناء حفظ الجوائز." }, { status: 500 });
  }
}
