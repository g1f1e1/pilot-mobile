import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/adminGuard";

export async function GET(request: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const where = q
    ? {
        OR: [
          { fullName: { contains: q } },
          { phone: { contains: q } },
          { invoiceCode: { contains: q } },
          { prizeLabel: { contains: q } },
        ],
      }
    : {};

  const [items, grouped] = await Promise.all([
    prisma.participation.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.participation.groupBy({ by: ["phone"], _count: { phone: true } }),
  ]);

  const countMap = new Map(grouped.map((g) => [g.phone, g._count.phone]));

  const data = items.map((p) => ({
    id: p.id,
    fullName: p.fullName,
    phone: p.phone,
    invoiceCode: p.invoiceCode,
    prizeLabel: p.prizeLabel,
    createdAt: p.createdAt,
    shareCount: countMap.get(p.phone) ?? 1,
  }));

  return NextResponse.json({ ok: true, data });
}
