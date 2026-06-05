"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { XIcon } from "@/components/icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "فشل تسجيل الدخول.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" card />
        </div>
        <GlassCard gold className="p-8">
          <h1 className="mb-1 text-center text-2xl font-bold text-cream">
            لوحة التحكم
          </h1>
          <p className="mb-6 text-center text-sm text-cream/60">
            تسجيل دخول الإدارة
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-ink/40 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/60 focus:outline-none"
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-ink/40 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/60 focus:outline-none"
            />
            {error && (
              <p className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300">
                <XIcon className="h-4 w-4 shrink-0" />
                {error}
              </p>
            )}
            <Button type="submit" variant="gold" size="lg" disabled={loading} className="w-full">
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </main>
  );
}
