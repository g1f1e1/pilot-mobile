"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { PrizeWheel, type WheelHandle } from "@/components/wheel/PrizeWheel";
import { ResultModal, type ResultPrize } from "./ResultModal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { TicketIcon, UsersIcon, PhoneCallIcon, XIcon } from "@/components/icons";
import { playReveal, playWin } from "@/lib/sound";
import { isValidIraqiPhone } from "@/lib/utils";
import type { SiteSettings } from "@prisma/client";

export interface PlayPrize {
  id: string;
  label: string;
  color: string;
  icon: string;
  image: string;
}

export function PlaySection({
  prizes,
  settings,
}: {
  prizes: PlayPrize[];
  settings: SiteSettings;
}) {
  const wheelRef = useRef<WheelHandle>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [invoiceCode, setInvoiceCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<ResultPrize | null>(null);

  async function handlePlay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 3) return setError("يرجى إدخال الاسم الكامل.");
    if (!isValidIraqiPhone(phone))
      return setError("رقم غير صحيح. يجب أن يكون 11 رقمًا عراقيًا يبدأ بـ 077 أو 078.");
    if (!invoiceCode.trim()) return setError("يرجى إدخال كود الفاتورة.");

    setLoading(true);
    try {
      const res = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, invoiceCode }),
      });
      const data = await res.json().catch(() => ({ ok: false, error: "رد غير صالح من الخادم." }));

      if (!data.ok) {
        setError(data.error || "حدث خطأ. حاول مرة أخرى.");
        setLoading(false);
        return;
      }

      const index = prizes.findIndex((p) => p.id === data.prize.id);
      const won = prizes[index >= 0 ? index : 0];
      playReveal();
      setSpinning(true);
      setLoading(false);

      wheelRef.current?.spin(index >= 0 ? index : 0, () => {
        playWin();
        setResult({ label: won.label, icon: won.icon, color: won.color, image: won.image });
        setSpinning(false);
      });
    } catch {
      setError("تعذّر الاتصال بالخادم. تحقق من الإنترنت.");
      setLoading(false);
    }
  }

  function closeResult() {
    setResult(null);
    setFullName("");
    setPhone("");
    setInvoiceCode("");
  }

  return (
    <section id="play" className="relative mx-auto w-full max-w-6xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <span className="mb-3 inline-block rounded-full glass-gold px-4 py-1 text-sm text-gold">
          🎡 عجلة الجوائز
        </span>
        <h2 className="text-4xl font-bold text-gold-gradient sm:text-5xl" style={{ fontFamily: "var(--font-messiri), serif" }}>
          {settings.playTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-cream/70">{settings.playSubtitle}</p>
      </motion.div>

      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-2 lg:order-1"
        >
          <PrizeWheel ref={wheelRef} prizes={prizes} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-1 lg:order-2"
        >
          <GlassCard gold className="p-8">
            <h3 className="mb-6 text-2xl font-bold text-cream">سجّل بياناتك للمشاركة</h3>
            <form onSubmit={handlePlay} className="space-y-4">
              <Field
                icon={<UsersIcon className="h-5 w-5" />}
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={setFullName}
              />
              <Field
                icon={<PhoneCallIcon className="h-5 w-5" />}
                placeholder="رقم الهاتف (07XXXXXXXXX)"
                value={phone}
                onChange={(v) => setPhone(v.replace(/[^\d+]/g, ""))}
                inputMode="tel"
                maxLength={14}
                dir="ltr"
              />
              <Field
                icon={<TicketIcon className="h-5 w-5" />}
                placeholder="كود الفاتورة (مثال: PLT-XXXXXX)"
                value={invoiceCode}
                onChange={setInvoiceCode}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300"
                >
                  <XIcon className="h-4 w-4 shrink-0" />
                  {error}
                </motion.p>
              )}

              <Button type="submit" variant="gold" size="lg" disabled={loading || spinning} className="w-full">
                {loading ? "جارٍ التحقق..." : spinning ? "العجلة تدور..." : "ابدأ اللعب 🎯"}
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-cream/50">
              كل فاتورة وكل رقم هاتف يُستخدم مرة واحدة فقط. بياناتك محفوظة بأمان لدى بايلوت موبايل.
            </p>
          </GlassCard>
        </motion.div>
      </div>

      <ResultModal prize={result} onClose={closeResult} />
    </section>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChange,
  inputMode,
  maxLength,
  dir,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "tel" | "text";
  maxLength?: number;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/40 px-4 py-3 transition-colors focus-within:border-gold/60">
      <span className="text-gold/70">{icon}</span>
      <input
        type="text"
        inputMode={inputMode}
        maxLength={maxLength}
        dir={dir}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-cream placeholder:text-cream/40 focus:outline-none"
      />
    </div>
  );
}
