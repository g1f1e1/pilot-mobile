"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { ParticlesBackground } from "./ParticlesBackground";
import { Button } from "./ui/Button";
import { MapPinIcon, InstagramIcon, TikTokIcon, PhoneCallIcon } from "./icons";
import type { SiteSettings } from "@prisma/client";

const PhoneScene = dynamic(() => import("./three/PhoneScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-24 animate-pulse rounded-2xl bg-gold/10" />
    </div>
  ),
});

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" as const },
  }),
};

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-10">
      <ParticlesBackground className="absolute inset-0 -z-10" />

      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 lg:block">
        <PhoneScene />
      </div>

      <div className="z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div custom={0} variants={fade} initial="hidden" animate="show">
          <Logo size="xl" card logoUrl={settings.logoUrl} brandWord={settings.brandWord} />
        </motion.div>

        <motion.h1
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-10 text-3xl font-bold leading-tight text-cream sm:text-5xl"
          style={{ fontFamily: "var(--font-messiri), serif" }}
        >
          {settings.welcome}
        </motion.h1>

        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-5 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg"
        >
          {settings.tagline}
        </motion.p>

        <motion.div custom={3} variants={fade} initial="hidden" animate="show" className="mt-9">
          <Button href="#play" variant="gold" size="lg" className="text-xl">
            🎁 العب واربح الآن
          </Button>
        </motion.div>

        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button href={settings.maps} target="_blank" rel="noopener noreferrer" variant="outline" size="md">
            <MapPinIcon className="h-5 w-5" /> الموقع على الخريطة
          </Button>
          <Button href={settings.instagram} target="_blank" rel="noopener noreferrer" variant="glass" size="md">
            <InstagramIcon className="h-5 w-5" /> إنستغرام
          </Button>
          <Button href={settings.tiktok} target="_blank" rel="noopener noreferrer" variant="glass" size="md">
            <TikTokIcon className="h-5 w-5" /> تيك توك
          </Button>
          <Button href={`tel:${settings.phone}`} variant="pine" size="md">
            <PhoneCallIcon className="h-5 w-5" /> اتصل بنا
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.2, duration: 1.8, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold/60"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-gold/40 p-1">
          <div className="h-2 w-1 rounded-full bg-gold" />
        </div>
      </motion.div>
    </section>
  );
}
