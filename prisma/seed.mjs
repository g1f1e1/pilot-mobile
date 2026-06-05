// زرع البيانات الأولية لـ Pilot Mobile
// آمن للتشغيل المتكرر (idempotent): لا يحذف أي تخصيصات عند إعادة النشر.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// 10 جوائز — الوزن (weight) يحدد احتمالية الظهور (كل ما زاد الرقم زادت الفرصة)
const PRIZES = [
  { label: "حظ أوفر",          weight: 30, color: "#0F4C39", icon: "repeat",   order: 0 },
  { label: "محاولة أخرى",      weight: 24, color: "#0A3528", icon: "rotate",   order: 1 },
  { label: "خصم 5%",           weight: 15, color: "#C8A24E", icon: "percent",  order: 2 },
  { label: "خصم 10%",          weight: 9,  color: "#0F4C39", icon: "percent",  order: 3 },
  { label: "كفر فاخر",         weight: 6,  color: "#0A3528", icon: "shield",   order: 4 },
  { label: "شاحن سريع",        weight: 5,  color: "#C8A24E", icon: "bolt",     order: 5 },
  { label: "سماعة بلوتوث",     weight: 4,  color: "#0F4C39", icon: "headset",  order: 6 },
  { label: "إكسسوارات مميزة",  weight: 4,  color: "#0A3528", icon: "sparkles", order: 7 },
  { label: "ساعة ذكية",        weight: 2,  color: "#C8A24E", icon: "watch",    order: 8 },
  { label: "الجائزة الكبرى",   weight: 1,  color: "#7A1F1F", icon: "trophy",   order: 9 },
];

// توليد أكواد فواتير تجريبية فريدة بصيغة PLT-#####
function generateInvoiceCodes(count) {
  const codes = new Set();
  while (codes.size < count) {
    const n = Math.floor(10000 + Math.random() * 89999);
    codes.add(`PLT-${n}`);
  }
  return [...codes];
}

async function main() {
  console.log("🌱 بدء زرع البيانات...");

  // 1) الجوائز — تُنشأ فقط إذا لم تكن موجودة (حتى لا تُمحى تعديلات الإدارة)
  const prizeCount = await prisma.prize.count();
  if (prizeCount === 0) {
    for (const p of PRIZES) {
      await prisma.prize.create({ data: p });
    }
    console.log(`✅ تم إنشاء ${PRIZES.length} جوائز`);
  } else {
    console.log(`ℹ️  يوجد ${prizeCount} جائزة مسبقًا — تم التخطي`);
  }

  // 2) أكواد فواتير تجريبية (إن لم تكن موجودة)
  const existing = await prisma.invoice.count();
  if (existing === 0) {
    const fixed = ["PLT-84931", "PLT-12491", "PLT-59322", "PLT-10001", "PLT-20002"];
    const random = generateInvoiceCodes(45);
    const all = [...new Set([...fixed, ...random])];
    await prisma.invoice.createMany({ data: all.map((code) => ({ code })) });
    console.log(`✅ تم إنشاء ${all.length} كود فاتورة تجريبي`);
    console.log(`   أكواد جاهزة للتجربة: ${fixed.join(", ")}`);
  } else {
    console.log(`ℹ️  يوجد ${existing} فاتورة مسبقًا — تم التخطي`);
  }

  // 3) حساب الأدمن (upsert آمن)
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "pilot2026";
  const hash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { username },
    update: {},
    create: { username, password: hash },
  });
  console.log(`✅ حساب الأدمن جاهز — المستخدم: ${username}`);

  // 4) صف الإعدادات (id=1) — يُنشأ إن لم يوجد
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  console.log("✅ إعدادات الموقع جاهزة");

  console.log("🎉 اكتمل زرع البيانات.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
