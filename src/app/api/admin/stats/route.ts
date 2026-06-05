import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/adminGuard";

export async function GET() {
  const denied = await guardAdmin();
  if (denied) return denied;

  const [participations, distinctPhones, prizeGroups, invoiceCount, usedCount] =
    await Promise.all([
      prisma.participation.count(),
      prisma.participation.groupBy({ by: ["phone"] }),
      prisma.participation.groupBy({
        by: ["prizeLabel"],
        _count: { prizeLabel: true },
      }),
      prisma.invoice.count(),
      prisma.invoice.count({ where: { isUsed: true } }),
    ]);

  const topPrizes = prizeGroups
    .map((g) => ({ label: g.prizeLabel, count: g._count.prizeLabel }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({
    ok: true,
    stats: {
      customers: distinctPhones.length,
      participations,
      invoicesTotal: invoiceCount,
      invoicesUsed: usedCount,
      invoicesRemaining: invoiceCount - usedCount,
      topPrizes,
    },
  });
}
