import { NextResponse, type NextRequest } from "next/server";

import { currentTeacher } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string; studentId: string }> },
) {
  const session = await currentTeacher(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { code, studentId } = await params;
  const classroom = await prisma.classroom.findUnique({
    where: { code: code.toUpperCase() },
    select: { id: true, teacherId: true, name: true, code: true },
  });
  if (!classroom || classroom.teacherId !== session.teacherId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      progressLogs: {
        orderBy: { completedAt: "asc" },
        select: {
          id: true,
          lessonId: true,
          cultureId: true,
          wpm: true,
          accuracy: true,
          timeSpentSec: true,
          completedAt: true,
        },
      },
      speedSessions: {
        orderBy: { completedAt: "desc" },
        take: 20,
        select: { id: true, wpm: true, accuracy: true, durationSec: true, completedAt: true },
      },
    },
  });
  if (!student || student.classCode !== classroom.code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    classroom,
    student: {
      id: student.id,
      nickname: student.nickname,
      mascot: student.mascot,
      level: student.level,
      xp: student.xp,
      uiLanguage: student.uiLanguage,
      homeCulture: student.homeCulture,
      createdAt: student.createdAt.toISOString(),
      lastSeenAt: student.lastSeenAt.toISOString(),
      progressLogs: student.progressLogs.map((l) => ({
        ...l,
        completedAt: l.completedAt.toISOString(),
      })),
      speedSessions: student.speedSessions.map((s) => ({
        ...s,
        completedAt: s.completedAt.toISOString(),
      })),
    },
  });
}