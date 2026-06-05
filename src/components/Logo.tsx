"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PlaneIcon } from "./icons";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withSubtitle?: boolean;
  card?: boolean;
  logoUrl?: string;
  brandWord?: string;
}

// عرض صورة الشعار حسب الحجم
const imgWidths: Record<NonNullable<LogoProps["size"]>, number> = {
  sm: 130,
  md: 190,
  lg: 280,
  xl: 360,
};

const fb = {
  sm: { word: "text-2xl", sub: "text-[8px] tracking-[0.45em]", plane: "h-4 w-4", pad: "px-5 py-3" },
  md: { word: "text-4xl", sub: "text-[10px] tracking-[0.5em]", plane: "h-6 w-6", pad: "px-7 py-4" },
  lg: { word: "text-6xl", sub: "text-xs tracking-[0.55em]", plane: "h-8 w-8", pad: "px-10 py-7" },
  xl: { word: "text-7xl", sub: "text-sm tracking-[0.6em]", plane: "h-10 w-10", pad: "px-12 py-9" },
};

/**
 * الشعار: يعرض صورة الشركة الأصلية من /logo.png إن وُجدت،
 * وإلا يعرض نسخة احتياطية مرسومة بالهوية (أخضر/ذهبي + طائرة + بايلوت).
 * 👈 لاستخدام شعارك الأصلي: احفظ الصورة باسم logo.png داخل مجلد public.
 */
export function Logo({
  className,
  size = "md",
  withSubtitle = true,
  card = false,
  logoUrl = "/logo.png",
  brandWord = "بايلوت",
}: LogoProps) {
  const [imgOk, setImgOk] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const w = imgWidths[size];

  // يلتقط حالة فشل التحميل حتى لو حدث الخطأ قبل ربط onError (صورة مفقودة)
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setImgOk(false);
  }, []);

  // الصورة الأصلية (فيها الخلفية الخضراء والشعار كامل)
  if (imgOk && logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        ref={imgRef}
        src={logoUrl}
        alt="Pilot Mobile — بايلوت موبايل"
        width={w}
        style={{ width: w, height: "auto" }}
        onError={() => setImgOk(false)}
        className={cn("select-none rounded-2xl shadow-2xl", className)}
      />
    );
  }

  // النسخة الاحتياطية المرسومة
  const s = fb[size];
  const inner = (
    <div className="flex flex-col items-center justify-center gap-2 select-none">
      <PlaneIcon
        className={cn("text-gold drop-shadow-[0_2px_8px_rgba(200,162,78,0.5)]", s.plane)}
      />
      <span
        className={cn("font-bold leading-none text-gold-gradient", s.word)}
        style={{ fontFamily: "var(--font-messiri), serif" }}
      >
        {brandWord}
      </span>
      {withSubtitle && (
        <span className={cn("font-medium uppercase text-gold/80", s.sub)}>PILOT&nbsp;MOBILE</span>
      )}
    </div>
  );

  if (card) {
    return (
      <div className={cn("inline-flex items-center justify-center rounded-3xl bg-pine gold-ring shadow-2xl", s.pad, className)}>
        {inner}
      </div>
    );
  }
  return <div className={className}>{inner}</div>;
}
