"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons";
import { ImageUploader } from "./ImageUploader";

interface Prize {
  id: string;
  label: string;
  weight: number;
  active: boolean;
  color: string;
  icon: string;
  image: string;
  order: number;
}

const ICON_OPTIONS = [
  { name: "gift", emoji: "🎁" },
  { name: "trophy", emoji: "🏆" },
  { name: "percent", emoji: "💯" },
  { name: "bolt", emoji: "⚡" },
  { name: "headset", emoji: "🎧" },
  { name: "watch", emoji: "⌚" },
  { name: "shield", emoji: "🛡️" },
  { name: "sparkles", emoji: "✨" },
  { name: "repeat", emoji: "🔄" },
  { name: "rotate", emoji: "🔁" },
  { name: "star", emoji: "⭐" },
];

export function PrizesTab() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/prizes")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setPrizes(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalWeight = prizes.reduce((s, p) => s + (p.active ? p.weight : 0), 0);

  function update(id: string, patch: Partial<Prize>) {
    setPrizes((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/prizes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prizes }),
    });
    const data = await res.json().catch(() => ({ ok: false }));
    setMsg(data.ok ? "✅ تم الحفظ! حدّث صفحة الموقع لرؤية التغييرات." : "فشل الحفظ.");
    setSaving(false);
  }

  if (loading) return <p className="text-cream/60">جارٍ التحميل...</p>;

  return (
    <div className="space-y-4">
      <GlassCard gold className="p-5">
        <p className="text-sm text-cream/70">
          عدّل اسم كل جائزة، احتماليتها (الوزن)، أيقونتها، وارفع لها صورة خاصة تظهر داخل العجلة.
          النسبة محسوبة من مجموع أوزان الجوائز المفعّلة.
        </p>
      </GlassCard>

      <div className="grid gap-4">
        {prizes.map((p) => (
          <GlassCard key={p.id} className="p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-block h-6 w-6 shrink-0 rounded-full ring-1 ring-white/20" style={{ background: p.color }} />
                  <input
                    value={p.label}
                    onChange={(e) => update(p.id, { label: e.target.value })}
                    className="min-w-[140px] flex-1 rounded-lg border border-white/10 bg-ink/40 px-3 py-2 text-cream focus:border-gold/60 focus:outline-none"
                  />
                  <button
                    onClick={() => update(p.id, { active: !p.active })}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${p.active ? "bg-gold" : "bg-white/15"}`}
                    title={p.active ? "مفعّلة" : "موقوفة"}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-all ${p.active ? "right-0.5" : "right-5"}`} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-cream/70">
                    الوزن:
                    <input
                      type="number"
                      min={0}
                      value={p.weight}
                      onChange={(e) => update(p.id, { weight: Number(e.target.value) })}
                      className="w-20 rounded-lg border border-white/10 bg-ink/40 px-3 py-1.5 text-cream focus:border-gold/60 focus:outline-none"
                    />
                  </label>
                  <span className="text-sm text-gold">
                    الاحتمالية: {p.active && totalWeight > 0 ? `${((p.weight / totalWeight) * 100).toFixed(1)}%` : "—"}
                  </span>
                  <label className="flex items-center gap-2 text-sm text-cream/70">
                    الأيقونة:
                    <select
                      value={p.icon}
                      onChange={(e) => update(p.id, { icon: e.target.value })}
                      className="rounded-lg border border-white/10 bg-ink/40 px-3 py-1.5 text-cream focus:border-gold/60 focus:outline-none"
                    >
                      {ICON_OPTIONS.map((o) => (
                        <option key={o.name} value={o.name} className="bg-ink-2">
                          {o.emoji} {o.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="lg:w-72">
                <p className="mb-2 text-sm text-cream/70">صورة الجائزة (تظهر بدل الأيقونة):</p>
                <ImageUploader value={p.image} onChange={(url) => update(p.id, { image: url })} rounded="rounded-xl" height="h-20" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="sticky bottom-4 flex items-center gap-4">
        <Button onClick={save} variant="gold" size="lg" disabled={saving}>
          <CheckIcon className="h-5 w-5" /> {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
        </Button>
        {msg && <p className="text-sm text-gold">{msg}</p>}
      </div>
    </div>
  );
}
