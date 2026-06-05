import type { Prize } from "@prisma/client";

/**
 * اختيار جائزة عشوائية موزونة من السيرفر.
 * كل ما زاد وزن الجائزة (weight) زادت احتمالية ظهورها.
 * هذا هو المصدر الوحيد لتحديد الجائزة — العجلة في الواجهة مجرد Animation.
 */
export function pickWeightedPrize(prizes: Prize[]): Prize | null {
  const active = prizes.filter((p) => p.active && p.weight > 0);
  if (active.length === 0) return null;

  const total = active.reduce((sum, p) => sum + p.weight, 0);
  let r = Math.random() * total;

  for (const p of active) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return active[active.length - 1];
}
