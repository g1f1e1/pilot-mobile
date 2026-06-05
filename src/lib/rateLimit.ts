// حماية بسيطة ضد كثرة المحاولات (Rate Limiting) — في الذاكرة.
// ملاحظة: للإنتاج على عدة خوادم يُفضّل استخدام Redis/Upstash.

const hits = new Map<string, number[]>();

/**
 * يرجع true إذا كانت المحاولة مسموحة، و false إذا تجاوز الحد.
 * @param key مفتاح التمييز (عادة IP)
 * @param limit أقصى عدد محاولات ضمن النافذة
 * @param windowMs طول النافذة بالمللي ثانية
 */
export function rateLimit(key: string, limit = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);

  // تنظيف دوري بسيط لتفادي تضخّم الذاكرة
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return true;
}
