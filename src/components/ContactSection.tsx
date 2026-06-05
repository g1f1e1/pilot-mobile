"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";
import { Button } from "./ui/Button";
import { MapPinIcon, InstagramIcon, TikTokIcon, PhoneCallIcon } from "./icons";
import type { SiteSettings } from "@prisma/client";

export function ContactSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="contact" className="relative mx-auto w-full max-w-5xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <span className="mb-3 inline-block rounded-full glass-gold px-4 py-1 text-sm text-gold">
          📍 موقعنا
        </span>
        <h2
          className="text-4xl font-bold text-gold-gradient sm:text-5xl"
          style={{ fontFamily: "var(--font-messiri), serif" }}
        >
          {settings.contactTitle}
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="flex h-full flex-col justify-between gap-6">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pine text-gold">
                  <MapPinIcon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-cream">العنوان</h3>
              </div>
              <p className="leading-relaxed text-cream/75">{settings.address}</p>
            </div>
            <Button href={settings.maps} target="_blank" rel="noopener noreferrer" variant="gold" size="md" className="w-full">
              <MapPinIcon className="h-5 w-5" /> افتح في خرائط جوجل
            </Button>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard gold className="flex h-full flex-col justify-between gap-6">
            <div>
              <h3 className="mb-4 text-xl font-bold text-cream">تابعنا وتواصل معنا</h3>
              <p className="text-cream/75">
                تابع جديد العروض والهواتف على حساباتنا، أو اتصل بنا مباشرة.
              </p>
            </div>
            <div className="grid gap-3">
              <Button href={`tel:${settings.phone}`} variant="pine" size="md" className="w-full">
                <PhoneCallIcon className="h-5 w-5" /> اتصل بنا — {settings.phoneDisplay}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button href={settings.instagram} target="_blank" rel="noopener noreferrer" variant="glass" size="md">
                  <InstagramIcon className="h-5 w-5" /> إنستغرام
                </Button>
                <Button href={settings.tiktok} target="_blank" rel="noopener noreferrer" variant="glass" size="md">
                  <TikTokIcon className="h-5 w-5" /> تيك توك
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
