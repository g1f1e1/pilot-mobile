import type { Metadata, Viewport } from "next";
import { Tajawal, El_Messiri } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { getSettings } from "@/lib/settings";
import { fontSlug } from "@/lib/fonts";

export const dynamic = "force-dynamic";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const messiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-messiri",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Pilot Mobile | بايلوت موبايل — أحدث الهواتف الذكية في كربلاء",
    description: s.tagline,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const s = await getSettings();
  const slug = fontSlug(s.fontFamily);
  const fam = s.fontFamily;

  // حقن الثيم (ألوان + خط) ديناميكياً عبر متغيرات CSS على body
  const themeVars = {
    "--color-ink": s.colorBg,
    "--color-ink-2": `color-mix(in srgb, ${s.colorBg} 82%, #0a1f18)`,
    "--color-pine": s.colorPine,
    "--color-pine-700": `color-mix(in srgb, ${s.colorPine} 70%, black)`,
    "--color-pine-300": `color-mix(in srgb, ${s.colorPine} 65%, white)`,
    "--color-gold": s.colorGold,
    "--color-gold-light": `color-mix(in srgb, ${s.colorGold} 55%, white)`,
    "--color-gold-dark": `color-mix(in srgb, ${s.colorGold} 60%, black)`,
    "--color-cream": s.colorCream,
    "--font-tajawal": `'${fam}', sans-serif`,
    "--font-messiri": `'${fam}', serif`,
  } as React.CSSProperties;

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${messiri.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={`https://fonts.googleapis.com/css2?family=${slug}&display=swap`} rel="stylesheet" />
        <meta name="theme-color" content={s.colorBg} />
      </head>
      <body className="bg-pilot min-h-full" style={themeVars}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
