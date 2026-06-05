import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return new Response("غير مصرّح", { status: 401 });
  }

  const items = await prisma.participation.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = ["الاسم", "رقم الهاتف", "كود الفاتورة", "الجائزة", "تاريخ التسجيل"];
  const rows = items.map((p) => [
    p.fullName,
    `="${p.phone}"`, // للحفاظ على الصفر في Excel
    p.invoiceCode,
    p.prizeLabel,
    formatDate(p.createdAt),
  ]);

  const csv = [header, ...rows]
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  // BOM لدعم العربية في Excel
  const body = "﻿" + csv;

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pilot-mobile-customers-${Date.now()}.csv"`,
    },
  });
}
