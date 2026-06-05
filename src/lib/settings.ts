import "server-only";
import { prisma } from "./prisma";
import type { SiteSettings } from "@prisma/client";

export type { SiteSettings };

/** يقرأ إعدادات الموقع (ينشئ الصف الافتراضي إن لم يوجد) */
export async function getSettings(): Promise<SiteSettings> {
  return prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}
