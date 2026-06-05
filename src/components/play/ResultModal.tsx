"use client";

import { motion, AnimatePresence } from "framer-motion";
import { prizeIcons } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export interface ResultPrize {
  label: string;
  icon: string;
  color: string;
  image?: string;
}

const SOFT = ["حظ أوفر", "محاولة أخرى"];

function Confetti() {
  const pieces = Array.from({ length: 36 });
  const colors = ["#c8a24e", "#e7cc84", "#1e6b50", "#f4efe3"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const duration = 1.8 + Math.random() * 1.6;
        const color = colors[i % colors.length];
        const size = 6 + Math.random() * 8;
        return (
          <motion.span
            key={i}
            initial={{ y: -40, x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: "110vh", rotate: 360 + Math.random() * 360, opacity: [1, 1, 0] }}
            transition={{ duration, delay, ease: "easeIn" }}
            style={{
              position: "absolute",
              top: 0,
              left: `${left}%`,
              width: size,
              height: size * 0.5,
              background: color,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}

export function ResultModal({
  prize,
  onClose,
}: {
  prize: ResultPrize | null;
  onClose: () => void;
}) {
  const isSoft = prize ? SOFT.includes(prize.label) : false;
  const isGrand = prize?.label.includes("الكبرى") ?? false;
  const Icon = prize ? prizeIcons[prize.icon] ?? prizeIcons.gift : null;

  return (
    <AnimatePresence>
      {prize && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {!isSoft && <Confetti />}
          <motion.div
            initial={{ scale: 0.7, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 16, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-gold relative w-full max-w-md rounded-3xl p-8 text-center shadow-2xl"
          >
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gold-light to-gold-dark shadow-[0_0_40px_-5px_rgba(200,162,78,0.8)]">
              {prize.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={prize.image} alt={prize.label} className="h-full w-full object-cover" />
              ) : (
                Icon && <Icon className="h-12 w-12 text-ink" />
              )}
            </div>

            <p className="mb-1 text-sm font-medium text-gold/80">
              {isSoft ? "النتيجة" : isGrand ? "🎉 مبروووك! 🎉" : "🎁 مبروك! لقد ربحت"}
            </p>
            <h3
              className="mb-3 text-3xl font-bold text-gold-gradient"
              style={{ fontFamily: "var(--font-messiri), serif" }}
            >
              {prize.label}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-cream/70">
              {isSoft
                ? "حظ أوفر في المرة القادمة! تابعنا لمزيد من العروض والجوائز."
                : "يرجى إظهار هذه الشاشة عند زيارة متجر بايلوت موبايل لاستلام جائزتك."}
            </p>

            <Button onClick={onClose} variant="gold" size="md" className="w-full">
              تم
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
