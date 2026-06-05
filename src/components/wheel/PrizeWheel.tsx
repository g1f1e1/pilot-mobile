"use client";

import { forwardRef, useImperativeHandle, useRef, useState, useCallback } from "react";
import { playSpin } from "@/lib/sound";

export interface WheelPrize {
  id: string;
  label: string;
  color: string;
  icon: string;
  image?: string;
}

export interface WheelHandle {
  spin: (index: number, onDone: () => void) => void;
}

const SPIN_MS = 5200;
const SIZE = 400;
const C = SIZE / 2;
const R = 192;

// رموز تعبيرية لكل نوع جائزة (تظهر داخل العجلة بشكل واضح وملوّن)
const EMOJI: Record<string, string> = {
  repeat: "🔄",
  rotate: "🔁",
  percent: "💯",
  shield: "🛡️",
  bolt: "⚡",
  headset: "🎧",
  sparkles: "✨",
  watch: "⌚",
  trophy: "🏆",
  gift: "🎁",
  star: "⭐",
};

// تقريب ثابت لتفادي اختلاف التقريب بين السيرفر والمتصفح (hydration)
const r3 = (n: number) => Math.round(n * 1000) / 1000;

function polar(angleDeg: number, radius: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: r3(C + radius * Math.sin(a)), y: r3(C - radius * Math.cos(a)) };
}

function slicePath(start: number, end: number) {
  const p0 = polar(start, R);
  const p1 = polar(end, R);
  const large = end - start > 180 ? 1 : 0;
  return `M ${C} ${C} L ${p0.x} ${p0.y} A ${R} ${R} 0 ${large} 1 ${p1.x} ${p1.y} Z`;
}

// تقسيم النص الطويل إلى سطرين متوازنين
function wrapLabel(label: string): string[] {
  const words = label.trim().split(/\s+/);
  if (words.length < 2 || label.length <= 8) return [label];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export const PrizeWheel = forwardRef<WheelHandle, { prizes: WheelPrize[] }>(
  function PrizeWheel({ prizes }, ref) {
    const n = prizes.length;
    const seg = 360 / n;
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const onDoneRef = useRef<(() => void) | null>(null);

    const handleEnd = useCallback(() => {
      if (!spinning) return;
      setSpinning(false);
      onDoneRef.current?.();
      onDoneRef.current = null;
    }, [spinning]);

    useImperativeHandle(ref, () => ({
      spin(index, onDone) {
        if (spinning) return;
        onDoneRef.current = onDone;
        setSpinning(true);
        playSpin(SPIN_MS);

        const targetCenter = index * seg + seg / 2;
        const desiredMod = (360 - (targetCenter % 360)) % 360;
        const currentMod = ((rotation % 360) + 360) % 360;
        const delta = ((desiredMod - currentMod) + 360) % 360;
        const next = rotation + 360 * 6 + delta;
        requestAnimationFrame(() => setRotation(next));
      },
    }));

    return (
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        <div className="absolute inset-0 rounded-full bg-gold/20 blur-3xl animate-glow" />

        {/* المؤشر العلوي */}
        <div className="absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[16px] border-r-[16px] border-t-[30px] border-l-transparent border-r-transparent border-t-gold drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" />
        </div>

        <div className="absolute inset-0 rounded-full p-[7px] bg-gradient-to-br from-gold-light via-gold to-gold-dark shadow-[0_0_60px_-10px_rgba(200,162,78,0.7)]">
          <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-ink/40">
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="h-full w-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? `transform ${SPIN_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`
                  : "none",
              }}
              onTransitionEnd={handleEnd}
            >
              {prizes.map((p, i) => {
                const start = i * seg;
                const mid = start + seg / 2;
                const flip = mid > 90 && mid < 270;
                const rot = flip ? mid + 180 : mid;
                const ep = polar(mid, R * 0.74); // موضع الأيقونة/الصورة
                const lp = polar(mid, R * 0.43); // موضع النص
                const lines = wrapLabel(p.label);
                const emoji = EMOJI[p.icon] ?? "🎁";

                return (
                  <g key={p.id}>
                    <path d={slicePath(start, start + seg)} fill={p.color} stroke="#c8a24e" strokeWidth={1.5} />

                    {/* أيقونة أو صورة */}
                    {p.image ? (
                      <image
                        href={p.image}
                        x={ep.x - 18}
                        y={ep.y - 18}
                        width={36}
                        height={36}
                        preserveAspectRatio="xMidYMid slice"
                        transform={`rotate(${rot} ${ep.x} ${ep.y})`}
                      />
                    ) : (
                      <text
                        x={ep.x}
                        y={ep.y}
                        fontSize={24}
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${rot} ${ep.x} ${ep.y})`}
                      >
                        {emoji}
                      </text>
                    )}

                    {/* النص */}
                    <text
                      x={lp.x}
                      y={lp.y}
                      fill="#f8f4ea"
                      fontSize={13}
                      fontWeight={700}
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${rot} ${lp.x} ${lp.y})`}
                      style={{ fontFamily: "var(--font-tajawal), sans-serif", paintOrder: "stroke" }}
                      stroke="rgba(0,0,0,0.35)"
                      strokeWidth={0.6}
                    >
                      {lines.length === 1 ? (
                        lines[0]
                      ) : (
                        <>
                          <tspan x={lp.x} dy="-0.55em">{lines[0]}</tspan>
                          <tspan x={lp.x} dy="1.1em">{lines[1]}</tspan>
                        </>
                      )}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* محور العجلة */}
            <div className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark shadow-lg ring-4 ring-ink">
              <span className="text-xs font-bold text-ink" style={{ fontFamily: "var(--font-messiri), serif" }}>
                PILOT
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
