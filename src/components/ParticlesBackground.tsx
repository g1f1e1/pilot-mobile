"use client";

import { useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

/** خلفية جزيئات ذهبية ناعمة تطفو ببطء */
export function ParticlesBackground({ className }: { className?: string }) {
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 50, density: { enable: true } },
        color: { value: ["#c8a24e", "#e7cc84", "#1e6b50"] },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: { enable: true, speed: 0.6, sync: false },
        },
        size: { value: { min: 1, max: 3 } },
        move: {
          enable: true,
          speed: 0.5,
          direction: "top",
          random: true,
          straight: false,
          outModes: { default: "out" },
        },
        links: {
          enable: true,
          distance: 130,
          color: "#c8a24e",
          opacity: 0.12,
          width: 1,
        },
      },
      interactivity: {
        events: { onHover: { enable: true, mode: "grab" } },
        modes: { grab: { distance: 160, links: { opacity: 0.25 } } },
      },
    }),
    []
  );

  return (
    <ParticlesProvider
      init={async (engine: Engine) => {
        await loadSlim(engine);
      }}
    >
      <Particles id="pilot-particles" className={className} options={options} />
    </ParticlesProvider>
  );
}
