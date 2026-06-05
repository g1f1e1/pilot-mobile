"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons";
import { ImageUploader } from "./ImageUploader";
import { FONT_OPTIONS } from "@/lib/fonts";

type Settings = Record<string, string>;

export function CustomizeTab() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setS(d.settings);
      });
  }, []);

  function set(key: string, val: string) {
    setS((prev) => (prev ? { ...prev, [key]: val } : prev));
  }

  async function save() {
    if (!s) return;
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    const d = await res.json().catch(() => ({ ok: false }));
    setMsg(d.ok ? "✅ تم الحفظ! حدّث صفحة الموقع لرؤية التغييرات." : "فشل الحفظ.");
    setSaving(false);
  }

  if (!s) return <p className="text-cream/60">جارٍ التحميل...</p>;

  return (
    <div className="space-y-6">
      {/* الشعار والهوية */}
      <GlassCard gold className="p-6">
        <h3 className="mb-4 text-lg font-bold text-cream">🖼️ الشعار والهوية</h3>
        <label className="mb-2 block text-sm text-cream/70">صورة الشعار (تظهر في أعلى الموقع والفوتر)</label>
        <ImageUploader value={s.logoUrl} onChange={(url) => set("logoUrl", url)} />
        <div className="mt-4">
          <Label>اسم العلامة (يظهر إذا لم توجد صورة)</Label>
          <Input value={s.brandWord} onChange={(v) => set("brandWord", v)} />
        </div>
      </GlassCard>

      {/* الألوان */}
      <GlassCard className="p-6">
        <h3 className="mb-4 text-lg font-bold text-cream">🎨 ألوان الموقع</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ColorField label="الخلفية" value={s.colorBg} onChange={(v) => set("colorBg", v)} />
          <ColorField label="الأخضر الأساسي" value={s.colorPine} onChange={(v) => set("colorPine", v)} />
          <ColorField label="الذهبي" value={s.colorGold} onChange={(v) => set("colorGold", v)} />
          <ColorField label="لون النص" value={s.colorCream} onChange={(v) => set("colorCream", v)} />
        </div>
      </GlassCard>

      {/* الخط */}
      <GlassCard className="p-6">
        <h3 className="mb-4 text-lg font-bold text-cream">🔤 خط الموقع</h3>
        <select
          value={s.fontFamily}
          onChange={(e) => set("fontFamily", e.target.value)}
          className="w-full max-w-xs rounded-2xl border border-white/10 bg-ink/40 px-4 py-3 text-cream focus:border-gold/60 focus:outline-none"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.name} value={f.name} className="bg-ink-2">
              {f.name}
            </option>
          ))}
        </select>
      </GlassCard>

      {/* النصوص */}
      <GlassCard className="p-6">
        <h3 className="mb-4 text-lg font-bold text-cream">✍️ نصوص الموقع</h3>
        <div className="space-y-4">
          <div><Label>عنوان الترحيب</Label><Input value={s.welcome} onChange={(v) => set("welcome", v)} /></div>
          <div><Label>النص التسويقي</Label><TextArea value={s.tagline} onChange={(v) => set("tagline", v)} /></div>
          <div><Label>عنوان قسم العجلة</Label><Input value={s.playTitle} onChange={(v) => set("playTitle", v)} /></div>
          <div><Label>وصف قسم العجلة</Label><TextArea value={s.playSubtitle} onChange={(v) => set("playSubtitle", v)} /></div>
          <div><Label>عنوان قسم الموقع</Label><Input value={s.contactTitle} onChange={(v) => set("contactTitle", v)} /></div>
        </div>
      </GlassCard>

      {/* التواصل */}
      <GlassCard className="p-6">
        <h3 className="mb-4 text-lg font-bold text-cream">📞 معلومات التواصل</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>العنوان</Label><Input value={s.address} onChange={(v) => set("address", v)} /></div>
          <div><Label>رقم الهاتف (للاتصال — بصيغة دولية)</Label><Input value={s.phone} onChange={(v) => set("phone", v)} dir="ltr" /></div>
          <div><Label>رقم الهاتف (للعرض)</Label><Input value={s.phoneDisplay} onChange={(v) => set("phoneDisplay", v)} dir="ltr" /></div>
          <div><Label>رابط إنستغرام</Label><Input value={s.instagram} onChange={(v) => set("instagram", v)} dir="ltr" /></div>
          <div><Label>رابط تيك توك</Label><Input value={s.tiktok} onChange={(v) => set("tiktok", v)} dir="ltr" /></div>
          <div><Label>رابط خرائط جوجل</Label><Input value={s.maps} onChange={(v) => set("maps", v)} dir="ltr" /></div>
        </div>
      </GlassCard>

      <div className="sticky bottom-4 flex items-center gap-4">
        <Button onClick={save} variant="gold" size="lg" disabled={saving}>
          <CheckIcon className="h-5 w-5" /> {saving ? "جارٍ الحفظ..." : "حفظ كل التغييرات"}
        </Button>
        {msg && <p className="text-sm text-gold">{msg}</p>}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm text-cream/70">{children}</label>;
}

function Input({ value, onChange, dir }: { value: string; onChange: (v: string) => void; dir?: "ltr" | "rtl" }) {
  return (
    <input
      value={value ?? ""}
      dir={dir}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-ink/40 px-4 py-2.5 text-cream focus:border-gold/60 focus:outline-none"
    />
  );
}

function TextArea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value ?? ""}
      rows={2}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-ink/40 px-4 py-2.5 text-cream focus:border-gold/60 focus:outline-none"
    />
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-ink/40 px-3 py-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
        />
        <input
          value={value ?? ""}
          dir="ltr"
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-cream focus:outline-none"
        />
      </div>
    </div>
  );
}
