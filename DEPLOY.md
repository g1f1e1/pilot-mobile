# 🚀 نشر موقع Pilot Mobile على الإنترنت (مجاناً)

الموقع جاهز بالكامل على GitHub:
**https://github.com/g1f1e1/pilot-mobile**

تحتاج خطوتين فقط: (1) قاعدة بيانات مجانية، (2) استضافة Vercel مجانية.
الوقت المتوقع: ٥–١٠ دقائق.

---

## الخطوة 1: إنشاء قاعدة بيانات مجانية (Neon)

1. افتح: **https://neon.tech**
2. اضغط **Sign up** ثم **Continue with GitHub** (سجّل بنفس حساب GitHub).
3. اضغط **Create project** (اترك الإعدادات الافتراضية، اختر أقرب منطقة).
4. بعد الإنشاء ستظهر نافذة **Connection string** (رابط الاتصال).
   - اختر الخيار **"Direct connection"** (اتصال مباشر) — مهم.
   - انسخ الرابط كاملاً. يبدأ بـ: `postgresql://...`
   - احتفظ به مؤقتاً (سنلصقه في الخطوة التالية).

---

## الخطوة 2: النشر على Vercel

1. افتح: **https://vercel.com**
2. اضغط **Sign up** ثم **Continue with GitHub**.
3. من اللوحة اضغط **Add New… → Project**.
4. ابحث عن **pilot-mobile** واضغط **Import**.
5. قبل الضغط على Deploy، افتح قسم **Environment Variables** وأضِف هذه المتغيّرات:

| الاسم (Key) | القيمة (Value) |
|---|---|
| `DATABASE_URL` | رابط الاتصال الذي نسخته من Neon |
| `JWT_SECRET` | `etC3VkC01cEFPGanT35cr1RtI3IIwvGkDYsDuarLahmb0uLQYgrqyt3ixh36zY-w` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | اختر كلمة مرور قوية خاصة بك |

6. اضغط **Deploy** وانتظر حتى تكتمل (٢–٣ دقائق).
7. سيظهر رابط موقعك مثل: `https://pilot-mobile-xxxx.vercel.app`

---

## بعد النشر

- **الموقع:** `https://اسم-مشروعك.vercel.app`
- **لوحة التحكم:** `https://اسم-مشروعك.vercel.app/admin`
  - الدخول: `admin` + كلمة المرور التي اخترتها.
- ادخل لوحة التحكم → **التخصيص** لرفع شعارك وتعديل الألوان والنصوص.
- ادخل **الفواتير** لإضافة أكواد فواتيرك الحقيقية.

### أكواد تجريبية جاهزة (للتأكد أن العجلة تعمل):
`PLT-84931` · `PLT-12491` · `PLT-59322` · `PLT-10001` · `PLT-20002`

---

## ملاحظات أمان مهمة

- بعد التأكد أن الموقع يعمل، احذف الـ GitHub Token القديم من:
  GitHub → Settings → Developer settings → Personal access tokens.
- غيّر `ADMIN_PASSWORD` لكلمة مرور قوية (ليست `pilot2026`).
