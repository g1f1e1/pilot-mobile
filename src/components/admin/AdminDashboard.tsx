"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { ChartIcon, UsersIcon, TicketIcon, GiftIcon, LogOutIcon, SparklesIcon } from "@/components/icons";
import { StatsTab } from "./StatsTab";
import { CustomersTab } from "./CustomersTab";
import { InvoicesTab } from "./InvoicesTab";
import { PrizesTab } from "./PrizesTab";
import { CustomizeTab } from "./CustomizeTab";
import { cn } from "@/lib/utils";

type Tab = "stats" | "customers" | "invoices" | "prizes" | "customize";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "stats", label: "الإحصائيات", icon: <ChartIcon className="h-5 w-5" /> },
  { id: "customers", label: "العملاء", icon: <UsersIcon className="h-5 w-5" /> },
  { id: "invoices", label: "الفواتير", icon: <TicketIcon className="h-5 w-5" /> },
  { id: "prizes", label: "الجوائز", icon: <GiftIcon className="h-5 w-5" /> },
  { id: "customize", label: "التخصيص", icon: <SparklesIcon className="h-5 w-5" /> },
];

export function AdminDashboard({ username }: { username: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("stats");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      {/* الترويسة */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-2/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo size="sm" withSubtitle={false} />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-cream">لوحة تحكم بايلوت موبايل</p>
              <p className="text-xs text-cream/50">مرحبًا، {username}</p>
            </div>
          </div>
          <Button onClick={logout} variant="outline" size="sm">
            <LogOutIcon className="h-4 w-4" /> خروج
          </Button>
        </div>
      </header>

      {/* التبويبات */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all",
                tab === t.id
                  ? "bg-gradient-to-l from-gold-dark via-gold to-gold-light text-ink shadow-lg"
                  : "glass text-cream/70 hover:text-cream"
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div>
          {tab === "stats" && <StatsTab />}
          {tab === "customers" && <CustomersTab />}
          {tab === "invoices" && <InvoicesTab />}
          {tab === "prizes" && <PrizesTab />}
          {tab === "customize" && <CustomizeTab />}
        </div>
      </div>
    </div>
  );
}
