import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { Hero } from "@/components/Hero";
import { PlaySection, type PlayPrize } from "@/components/play/PlaySection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [prizes, settings] = await Promise.all([
    prisma.prize.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    getSettings(),
  ]);

  const playPrizes: PlayPrize[] = prizes.map((p) => ({
    id: p.id,
    label: p.label,
    color: p.color,
    icon: p.icon,
    image: p.image,
  }));

  return (
    <main className="relative">
      <Hero settings={settings} />
      <PlaySection prizes={playPrizes} settings={settings} />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
