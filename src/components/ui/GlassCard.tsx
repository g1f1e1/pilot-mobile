import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function GlassCard({
  children,
  className,
  gold = false,
}: {
  children: ReactNode;
  className?: string;
  gold?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl p-6 shadow-2xl",
        gold ? "glass-gold" : "glass",
        className
      )}
    >
      {children}
    </div>
  );
}
