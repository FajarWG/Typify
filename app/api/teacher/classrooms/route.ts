import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { currentTeacher, generateClassCode } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const CreateClassroomSchema = z.object({
  name: z.string().min(2).max(60),
});

export async function GET(req: NextRequest) {
  const session = await currentTeacher(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const classrooms = await prisma.classroom.findMany({
    where: { teacherId: session.teacherId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      name: true,
      createdAt: true,
      _count: { select: { students: true } },
    },
  });
  return NextResponse.json({
    classrooms: classrooms.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      createdAt: c.createdAt.toISOString(),
      studentCount: c._count.students,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await currentTeacher(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body: unknown = await req.json().catch(() => null);
  const parsed = CreateClassroomSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateClassCode();
    try {
      const classroom = await prisma.classroom.create({
        data: { code, name: parsed.data.name, teacherId: session.teacherId },
        select: { id: true, code: true, name: true, createdAt: true },
      });
      return NextResponse.json({ classroom });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes("Unique") || attempt === 4) {
        return NextResponse.json({ error: "Could not create class" }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ error: "Could not allocate code" }, { status: 500 });
}