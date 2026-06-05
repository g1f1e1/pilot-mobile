// خطوط عربية جاهزة للاختيار من لوحة التحكم (تُحمّل من Google Fonts)

export const FONT_OPTIONS = [
  { name: "Tajawal", slug: "Tajawal:wght@400;500;700;800" },
  { name: "Cairo", slug: "Cairo:wght@400;600;700;900" },
  { name: "El Messiri", slug: "El+Messiri:wght@400;500;600;700" },
  { name: "Almarai", slug: "Almarai:wght@400;700;800" },
  { name: "Reem Kufi", slug: "Reem+Kufi:wght@400;500;700" },
  { name: "Markazi Text", slug: "Markazi+Text:wght@400;500;700" },
  { name: "Amiri", slug: "Amiri:wght@400;700" },
  { name: "Changa", slug: "Changa:wght@400;600;700;800" },
];

export function fontSlug(name: string): string {
  return FONT_OPTIONS.find((f) => f.name === name)?.slug ?? FONT_OPTIONS[0].slug;
}
