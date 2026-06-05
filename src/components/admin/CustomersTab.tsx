"use client";

import { useEffect, useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SearchIcon, DownloadIcon } from "@/components/icons";
import { formatDate } from "@/lib/utils";

interface Customer {
  id: string;
  fullName: string;
  phone: string;
  invoiceCode: string;
  prizeLabel: string;
  createdAt: string;
  shareCount: number;
}

export function CustomersTab() {
  const [items, setItems] = useState<Customer[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (query: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/participations?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.ok) setItems(data.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load("");
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(q), 350);
    return () => clearTimeout(t);
  }, [q, load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-ink/40 px-4 py-2.5 sm:max-w-md">
          <SearchIcon className="h-5 w-5 text-gold/70" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث بالاسم أو الهاتف أو كود الفاتورة..."
            className="w-full bg-transparent text-cream placeholder:text-cream/40 focus:outline-none"
          />
        </div>
        <Button href="/api/admin/export" variant="gold" size="md">
          <DownloadIcon className="h-5 w-5" /> تصدير Excel
        </Button>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-right text-sm">
            <thead>
              <tr className="border-b border-white/10 text-cream/60">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">رقم الهاتف</th>
                <th className="px-4 py-3 font-medium">كود الفاتورة</th>
                <th className="px-4 py-3 font-medium">الجائزة</th>
                <th className="px-4 py-3 font-medium">المشاركات</th>
                <th className="px-4 py-3 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-cream/50">
                    جارٍ التحميل...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-cream/50">
                    لا يوجد عملاء بعد.
                  </td>
                </tr>
              ) : (
                items.map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <td className="px-4 py-3 text-cream/50">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-cream">{c.fullName}</td>
                    <td className="px-4 py-3 text-cream/80" dir="ltr">{c.phone}</td>
                    <td className="px-4 py-3 text-gold">{c.invoiceCode}</td>
                    <td className="px-4 py-3 text-cream/80">{c.prizeLabel}</td>
                    <td className="px-4 py-3 text-center text-cream/80">{c.shareCount}</td>
                    <td className="px-4 py-3 text-xs text-cream/50">{formatDate(c.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
      {!loading && items.length > 0 && (
        <p className="text-sm text-cream/50">إجمالي النتائج: {items.length}</p>
      )}
    </div>
  );
}
