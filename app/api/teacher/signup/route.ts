import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const SignupSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(8).max(120),
  name: z.string().min(2).max(60),
});

export async function POST(req: NextRequest) {
  const body: unknown = await req.json().catch(() => null);
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid signup payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { email, password, name } = parsed.data;
  const existing = await prisma.teacher.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }
  const passwordHash = await hashPassword(password);
  const teacher = await prisma.teacher.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name,
    },
    select: { id: true, email: true, name: true },
  });
  return NextResponse.json({ teacher });
}