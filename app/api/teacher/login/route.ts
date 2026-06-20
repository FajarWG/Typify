import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { setSessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(120),
});

export async function POST(req: NextRequest) {
  const body: unknown = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login payload" }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const teacher = await prisma.teacher.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!teacher) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const ok = await verifyPassword(teacher.passwordHash, password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = await signSession({ teacherId: teacher.id, email: teacher.email });
  const res = NextResponse.json({ teacher: { id: teacher.id, email: teacher.email, name: teacher.name } });
  res.headers.append("Set-Cookie", setSessionCookie(token));
  return res;
}