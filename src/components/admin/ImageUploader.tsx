"use client";

import { useRef, useState } from "react";
import { DownloadIcon, XIcon } from "@/components/icons";

export function ImageUploader({
  value,
  onChange,
  rounded = "rounded-2xl",
  height = "h-28",
}: {
  value: string;
  onChange: (url: string) => void;
  rounded?: string;
  height?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await res.json().catch(() => ({ ok: false, error: "رد غير صالح." }));
      if (d.ok) onChange(d.url);
      else setErr(d.error || "فشل الرفع.");
    } catch {
      setErr("تعذّر الاتصال بالخادم.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className={`flex ${height} w-28 shrink-0 items-center justify-center overflow-hidden border border-white/15 bg-ink/40 ${rounded}`}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="معاينة" className="h-full w-full object-contain" />
        ) : (
          <span className="text-xs text-cream/40">لا توجد صورة</span>
        )}
      </div>
      <div className="space-y-2">
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl border border-gold/50 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
        >
          <DownloadIcon className="h-4 w-4 rotate-180" />
          {busy ? "جارٍ الرفع..." : "رفع صورة"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="ms-2 inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
          >
            <XIcon className="h-3.5 w-3.5" /> إزالة
          </button>
        )}
        {err && <p className="text-xs text-red-300">{err}</p>}
        <p className="text-xs text-cream/40">PNG / JPG / WEBP / SVG — حتى 4 ميجا.</p>
      </div>
    </div>
  );
}
