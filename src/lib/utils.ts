import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** دمج أصناف Tailwind بأمان */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** تنسيق التاريخ بالعربي */
export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-IQ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** تنظيف وتوحيد رقم الهاتف العراقي إلى الصيغة المحلية 07XXXXXXXXX */
export function normalizePhone(phone: string) {
  let p = (phone || "").replace(/[\s\-()]/g, "").trim();
  if (p.startsWith("+964")) p = "0" + p.slice(4);
  else if (p.startsWith("00964")) p = "0" + p.slice(5);
  else if (p.startsWith("964")) p = "0" + p.slice(3);
  return p;
}

/**
 * تحقق صارم: رقم عراقي مكوّن من 11 خانة يبدأ بـ 077 أو 078 فقط.
 * أمثلة صحيحة: 0770xxxxxxx · 0780xxxxxxx · 0771xxxxxxx ...
 */
export function isValidIraqiPhone(phone: string) {
  const p = normalizePhone(phone);
  return /^07[78]\d{8}$/.test(p);
}
