import { NextResponse, type NextRequest } from "next/server";

import { currentTeacher } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const session = await currentTeacher(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { code } = await params;
  const classroom = await prisma.classroom.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      students: {
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          anonymousId: true,
          nickname: true,
          mascot: true,
          level: true,
          xp: true,
          uiLanguage: true,
          homeCulture: true,
          lastSeenAt: true,
          _count: { select: { progressLogs: true, speedSessions: true } },
        },
      },
    },
  });
  if (!classroom || classroom.teacherId !== session.teacherId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Aggregate stats per student in a single query.
  const studentIds = classroom.students.map((s) => s.id);
  const aggregates = await prisma.progressLog.groupBy({
    by: ["studentId"],
    where: { studentId: { in: studentIds } },
    _avg: { accuracy: true, wpm: true },
    _sum: { timeSpentSec: true },
  });
  const aggMap = new Map(aggregates.map((a) => [a.studentId, a]));
  const speedBest = await prisma.speedTestSession.groupBy({
    by: ["studentId"],
    where: { studentId: { in: studentIds } },
    _max: { wpm: true },
  });
  const speedMap = new Map(speedBest.map((s) => [s.studentId, s]));

  return NextResponse.json({
    classroom: {
      id: classroom.id,
      code: classroom.code,
      name: classroom.name,
      createdAt: classroom.createdAt.toISOString(),
    },
    students: classroom.students.map((s) => {
      const agg = aggMap.get(s.id);
      const speed = speedMap.get(s.id);
      return {
        id: s.id,
        nickname: s.nickname,
        mascot: s.mascot,
        level: s.level,
        xp: s.xp,
        uiLanguage: s.uiLanguage,
        homeCulture: s.homeCulture,
        lastSeenAt: s.lastSeenAt.toISOString(),
        lessonsCompleted: s._count.progressLogs,
        speedTests: s._count.speedSessions,
        avgAccuracy: agg?._avg.accuracy ?? null,
        avgWpm: agg?._avg.wpm ?? null,
        totalTimeSec: agg?._sum.timeSpentSec ?? 0,
        bestSpeedWpm: speed?._max.wpm ?? null,
      };
    }),
  });
}