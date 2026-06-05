"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { UsersIcon, GiftIcon, TicketIcon, StarIcon } from "@/components/icons";

interface Stats {
  customers: number;
  participations: number;
  invoicesTotal: number;
  invoicesUsed: number;
  invoicesRemaining: number;
  topPrizes: { label: string; count: number }[];
}

const GOLD = "#c8a24e";
const PINE = "#1e6b50";

export function StatsTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStats(d.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-cream/60">جارٍ تحميل الإحصائيات...</p>;
  if (!stats) return <p className="text-red-300">تعذّر تحميل الإحصائيات.</p>;

  const cards = [
    { label: "عدد العملاء", value: stats.customers, icon: <UsersIcon className="h-6 w-6" /> },
    { label: "عدد المشاركات", value: stats.participations, icon: <StarIcon className="h-6 w-6" /> },
    { label: "الفواتير المستخدمة", value: stats.invoicesUsed, icon: <TicketIcon className="h-6 w-6" /> },
    { label: "الفواتير المتبقية", value: stats.invoicesRemaining, icon: <GiftIcon className="h-6 w-6" /> },
  ];

  const pieData = [
    { name: "مستخدمة", value: stats.invoicesUsed },
    { name: "متبقية", value: stats.invoicesRemaining },
  ];

  return (
    <div className="space-y-6">
      {/* البطاقات */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <GlassCard key={c.label} className="p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-pine text-gold">
              {c.icon}
            </div>
            <p className="text-3xl font-bold text-gold-gradient">{c.value}</p>
            <p className="mt-1 text-sm text-cream/60">{c.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* أكثر الجوائز ظهورًا */}
        <GlassCard className="p-6">
          <h3 className="mb-5 text-lg font-bold text-cream">أكثر الجوائز ظهورًا</h3>
          {stats.topPrizes.length === 0 ? (
            <p className="text-cream/50">لا توجد بيانات بعد.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topPrizes} layout="vertical" margin={{ right: 20 }}>
                <XAxis type="number" stroke="#f4efe3" fontSize={12} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="label"
                  stroke="#f4efe3"
                  fontSize={12}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    background: "#081b14",
                    border: "1px solid rgba(200,162,78,0.3)",
                    borderRadius: 12,
                    color: "#f4efe3",
                  }}
                  cursor={{ fill: "rgba(200,162,78,0.08)" }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {stats.topPrizes.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? GOLD : PINE} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        {/* الفواتير */}
        <GlassCard className="p-6">
          <h3 className="mb-5 text-lg font-bold text-cream">حالة الفواتير</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                <Cell fill={GOLD} />
                <Cell fill={PINE} />
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#081b14",
                  border: "1px solid rgba(200,162,78,0.3)",
                  borderRadius: 12,
                  color: "#f4efe3",
                }}
              />
              <Legend wrapperStyle={{ color: "#f4efe3" }} />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
