import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { setAdminSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "يرجى إدخال اسم المستخدم وكلمة المرور." },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username: String(username) },
    });
    if (!admin || !(await verifyPassword(String(password), admin.password))) {
      return NextResponse.json(
        { ok: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة." },
        { status: 401 }
      );
    }

    await setAdminSession({ sub: admin.id, username: admin.username });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "حدث خطأ. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
