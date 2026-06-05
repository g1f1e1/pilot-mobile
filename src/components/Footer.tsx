import Link from "next/link";
import { Logo } from "./Logo";
import { InstagramIcon, TikTokIcon, MapPinIcon } from "./icons";
import type { SiteSettings } from "@prisma/client";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative mt-10 border-t border-white/10 bg-ink-2/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center">
        <Logo size="md" logoUrl={settings.logoUrl} brandWord={settings.brandWord} />
        <p className="max-w-md text-sm leading-relaxed text-cream/60">{settings.address}</p>
        <div className="flex items-center gap-4">
          <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full glass text-gold transition-colors hover:bg-gold/10">
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-11 w-11 items-center justify-center rounded-full glass text-gold transition-colors hover:bg-gold/10">
            <TikTokIcon className="h-5 w-5" />
          </a>
          <a href={settings.maps} target="_blank" rel="noopener noreferrer" aria-label="Maps" className="flex h-11 w-11 items-center justify-center rounded-full glass text-gold transition-colors hover:bg-gold/10">
            <MapPinIcon className="h-5 w-5" />
          </a>
        </div>
        <div className="flex flex-col items-center gap-1 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} Pilot Mobile — جميع الحقوق محفوظة.</p>
          <Link href="/admin" className="transition-colors hover:text-gold/70">
            لوحة التحكم
          </Link>
        </div>
      </div>
    </footer>
  );
}
