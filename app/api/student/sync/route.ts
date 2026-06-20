import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { linkStudentToClassroom } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const SyncPayloadSchema = z.object({
  anonymousId: z.string().min(8).max(64),
  classCode: z.string().regex(/^TYPF-[A-Z0-9]{4}$/, "Invalid class code"),
  progressLogs: z
    .array(
      z.object({
        lessonId: z.string().min(1).max(64),
        cultureId: z.enum(["id", "en", "ja"]),
        wpm: z.number().min(0).max(300),
        accuracy: z.number().min(0).max(1),
        timeSpentSec: z.number().int().min(0).max(60 * 60 * 6),
        completedAt: z.string().datetime().optional(),
      }),
    )
    .max(500)
    .default([]),
  speedSessions: z
    .array(
      z.object({
        wpm: z.number().min(0).max(300),
        accuracy: z.number().min(0).max(1),
        durationSec: z.number().int().min(1).max(300),
        cultureId: z.enum(["id", "en", "ja"]).nullable().optional(),
        completedAt: z.string().datetime().optional(),
      }),
    )
    .max(100)
    .default([]),
  questCompletions: z
    .array(
      z.object({
        questCode: z.enum(["complete-lesson", "play-minigame", "speed-test"]),
        localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),
    )
    .max(20)
    .default([]),
});

export async function POST(req: NextRequest) {
  const body: unknown = await req.json().catch(() => null);
  const parsed = SyncPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid sync payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { anonymousId, classCode, progressLogs, speedSessions, questCompletions } = parsed.data;

  const link = await linkStudentToClassroom(anonymousId, classCode);
  if (!link.ok) {
    return NextResponse.json({ error: link.reason }, { status: 422 });
  }
  const student = await prisma.student.findUnique({ where: { anonymousId } });
  if (!student) {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }

  const now = new Date();
  if (progressLogs.length > 0) {
    await prisma.progressLog.createMany({
      data: progressLogs.map((l) => ({
        studentId: student.id,
        lessonId: l.lessonId,
        cultureId: l.cultureId,
        wpm: l.wpm,
        accuracy: l.accuracy,
        timeSpentSec: l.timeSpentSec,
        completedAt: l.completedAt ? new Date(l.completedAt) : now,
      })),
    });
  }
  if (speedSessions.length > 0) {
    await prisma.speedTestSession.createMany({
      data: speedSessions.map((s) => ({
        studentId: student.id,
        wpm: s.wpm,
        accuracy: s.accuracy,
        durationSec: s.durationSec,
        cultureId: s.cultureId ?? null,
        completedAt: s.completedAt ? new Date(s.completedAt) : now,
      })),
    });
  }
  if (questCompletions.length > 0) {
    for (const q of questCompletions) {
      await prisma.questCompletion.upsert({
        where: {
          studentId_questCode_localDate: {
            studentId: student.id,
            questCode: q.questCode,
            localDate: q.localDate,
          },
        },
        create: { studentId: student.id, questCode: q.questCode, localDate: q.localDate },
        update: {},
      });
    }
  }

  await prisma.student.update({
    where: { id: student.id },
    data: { lastSeenAt: now },
  });

  return NextResponse.json({
    ok: true,
    counts: {
      progressLogs: progressLogs.length,
      speedSessions: speedSessions.length,
      questCompletions: questCompletions.length,
    },
  });
}