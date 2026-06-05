"use client";

import { useEffect, useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PlusIcon, TrashIcon, CheckIcon, XIcon } from "@/components/icons";
import { formatDate } from "@/lib/utils";

interface Invoice {
  id: string;
  code: string;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
}

interface Summary {
  total: number;
  used: number;
  remaining: number;
}

export function InvoicesTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, used: 0, remaining: 0 });
  const [codesText, setCodesText] = useState("");
  const [generate, setGenerate] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/invoices");
    const data = await res.json();
    if (data.ok) {
      setInvoices(data.data);
      setSummary(data.summary);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addCodes() {
    setMsg(null);
    const body: Record<string, unknown> = {};
    if (codesText.trim()) body.codesText = codesText;
    if (generate.trim()) body.generate = Number(generate);
    if (!body.codesText && !body.generate) {
      setMsg("أدخل أكوادًا أو عدد الأكواد المراد توليدها.");
      return;
    }
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({ ok: false, error: "رد غير صالح من الخادم." }));
      if (data.ok) {
        const skipped = data.skipped ? ` (تم تجاهل ${data.skipped} مكرر)` : "";
        setMsg(`✅ تم إضافة ${data.created} كود فاتورة${skipped}.`);
        setCodesText("");
        setGenerate("");
        load();
      } else {
        setMsg(data.error || "فشل الإضافة.");
      }
    } catch {
      setMsg("تعذّر الاتصال بالخادم.");
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/invoices?id=${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({ ok: false, error: "رد غير صالح من الخادم." }));
      if (data.ok) load();
      else setMsg(data.error || "فشل الحذف.");
    } catch {
      setMsg("تعذّر الاتصال بالخادم.");
    }
  }

  return (
    <div className="space-y-6">
      {/* الملخص */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="p-5 text-center">
          <p className="text-3xl font-bold text-gold-gradient">{summary.total}</p>
          <p className="mt-1 text-sm text-cream/60">إجمالي الفواتير</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="text-3xl font-bold text-gold-gradient">{summary.used}</p>
          <p className="mt-1 text-sm text-cream/60">مستخدمة</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="text-3xl font-bold text-gold-gradient">{summary.remaining}</p>
          <p className="mt-1 text-sm text-cream/60">متبقية</p>
        </GlassCard>
      </div>

      {/* إضافة أكواد */}
      <GlassCard gold className="p-6">
        <h3 className="mb-4 text-lg font-bold text-cream">إضافة أكواد فواتير</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-cream/70">
              أكواد يدوية (كل كود في سطر أو مفصولة بفاصلة)
            </label>
            <textarea
              value={codesText}
              onChange={(e) => setCodesText(e.target.value)}
              rows={4}
              placeholder={"PLT-11111\nPLT-22222"}
              className="w-full rounded-2xl border border-white/10 bg-ink/40 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/60 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-cream/70">
              توليد أكواد تلقائيًا (العدد)
            </label>
            <input
              type="number"
              value={generate}
              onChange={(e) => setGenerate(e.target.value)}
              placeholder="مثال: 50"
              className="w-full rounded-2xl border border-white/10 bg-ink/40 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/60 focus:outline-none"
            />
            <p className="mt-2 text-xs text-cream/40">
              تُولّد بصيغة PLT-##### تلقائيًا (حد أقصى 500).
            </p>
          </div>
        </div>
        {msg && <p className="mt-4 text-sm text-gold">{msg}</p>}
        <Button onClick={addCodes} variant="gold" size="md" className="mt-4">
          <PlusIcon className="h-5 w-5" /> إضافة
        </Button>
      </GlassCard>

      {/* القائمة */}
      <GlassCard className="overflow-hidden p-0">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full min-w-[600px] text-right text-sm">
            <thead className="sticky top-0 bg-ink-2">
              <tr className="border-b border-white/10 text-cream/60">
                <th className="px-4 py-3 font-medium">كود الفاتورة</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">تاريخ الإنشاء</th>
                <th className="px-4 py-3 font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-cream/50">
                    جارٍ التحميل...
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-gold">{inv.code}</td>
                    <td className="px-4 py-3">
                      {inv.isUsed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-xs text-red-300">
                          <CheckIcon className="h-3.5 w-3.5" /> مستخدمة
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-300">
                          متاحة
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-cream/50">
                      {formatDate(inv.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => remove(inv.id)}
                        disabled={inv.isUsed}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-300 transition-colors hover:bg-red-500/15 disabled:opacity-30 disabled:hover:bg-transparent"
                        title={inv.isUsed ? "لا يمكن حذف فاتورة مستخدمة" : "حذف"}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
