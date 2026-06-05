"use client";

// مؤثرات صوتية مولّدة برمجيًا (بدون ملفات) عبر Web Audio API

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tick(ac: AudioContext, t: number, freq: number, vol = 0.06) {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = "square";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  o.connect(g).connect(ac.destination);
  o.start(t);
  o.stop(t + 0.07);
}

/** صوت دوران العجلة مع تباطؤ تدريجي */
export function playSpin(durationMs = 5000) {
  const ac = getCtx();
  if (!ac) return;
  const start = ac.currentTime;
  const dur = durationMs / 1000;
  const ticks = 44;
  for (let k = 1; k <= ticks; k++) {
    const r = k / ticks; // نسبة الدوران (تتقدّم بثبات)
    const p = 1 - Math.pow(1 - r, 1 / 3); // زمن متباطئ (يكبر الفاصل قرب النهاية)
    tick(ac, start + p * dur, 1000 - r * 150);
  }
}

/** نغمة فوز فخمة */
export function playWin() {
  const ac = getCtx();
  if (!ac) return;
  const start = ac.currentTime + 0.05;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // Do Mi Sol Do
  notes.forEach((freq, i) => {
    const t = start + i * 0.12;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + 0.55);
  });
}

/** نغمة قصيرة عند فتح العجلة */
export function playReveal() {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime + 0.02;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(300, t);
  o.frequency.exponentialRampToValueAtTime(900, t + 0.2);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
  o.connect(g).connect(ac.destination);
  o.start(t);
  o.stop(t + 0.45);
}
