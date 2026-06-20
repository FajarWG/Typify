// Typify · sync queue flusher
// Watches the localStorage `typify:sync` blob and flushes pending ops to
// the server. Runs on a timer when the kid is online and on the
// `online` window event. Safe to call from any client component mount.

import {
  getClassroomLink,
  getProfile,
  getSync,
  setSync,
} from "@/lib/storage";
import type { LessonResult, SpeedTestResult, SyncOp } from "@/types/localStorage";

const FLUSH_INTERVAL_MS = 8000;
const MAX_RETRIES = 3;

type SyncSuccessPayload = {
  progressLogs: Array<{
    lessonId: string;
    cultureId: "id" | "en" | "ja";
    wpm: number;
    accuracy: number;
    timeSpentSec: number;
    completedAt?: string;
  }>;
  speedSessions: Array<{
    wpm: number;
    accuracy: number;
    durationSec: number;
    cultureId: "id" | "en" | "ja" | null;
    completedAt?: string;
  }>;
  questCompletions: Array<{
    questCode: "complete-lesson" | "play-minigame" | "speed-test";
    localDate: string;
  }>;
};

function toSyncPayload(ops: SyncOp[]): SyncSuccessPayload {
  const progressLogs: SyncSuccessPayload["progressLogs"] = [];
  const speedSessions: SyncSuccessPayload["speedSessions"] = [];
  const questCompletions: SyncSuccessPayload["questCompletions"] = [];
  for (const op of ops) {
    if (op.type === "progress") {
      const r = op.payload as LessonResult;
      progressLogs.push({
        lessonId: r.lessonId,
        cultureId: r.cultureId,
        wpm: r.wpm,
        accuracy: r.accuracy,
        timeSpentSec: r.timeSpentSec,
        completedAt: r.completedAt,
      });
    } else if (op.type === "speed-test") {
      const s = op.payload as SpeedTestResult;
      speedSessions.push({
        wpm: s.wpm,
        accuracy: s.accuracy,
        durationSec: s.durationSec,
        cultureId: s.cultureId,
        completedAt: s.createdAt,
      });
    } else if (op.type === "quest") {
      questCompletions.push({
        questCode: op.payload.questCode,
        localDate: op.payload.localDate,
      });
    }
  }
  return { progressLogs, speedSessions, questCompletions };
}

async function flushOnce(): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
  const sync = getSync();
  if (sync.pendingOps.length === 0) return true;
  const profile = getProfile();
  if (!profile || !profile.onboardingCompleted) return false;
  const link = getClassroomLink();
  if (!link.classCode) return false;

  const ops = sync.pendingOps.slice(0, 50);
  const payload = toSyncPayload(ops);

  try {
    const res = await fetch("/api/student/sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        anonymousId: profile.anonymousId,
        classCode: link.classCode,
        ...payload,
      }),
    });
    if (!res.ok) {
      // bump retry counter, drop ops after MAX_RETRIES to avoid infinite loop
      const failed = sync.pendingOps.filter((op) => ops.includes(op));
      const stale = failed.filter((op) => (op as SyncOp & { retries?: number }).retries ?? 0 >= MAX_RETRIES);
      const stillPending = sync.pendingOps.filter((op) => !stale.includes(op));
      setSync({ ...sync, pendingOps: stillPending });
      return false;
    }
    const remaining = sync.pendingOps.filter((op) => !ops.includes(op));
    setSync({ ...sync, pendingOps: remaining, lastSyncedAt: new Date().toISOString() });
    return true;
  } catch {
    return false;
  }
}

let started = false;
let intervalId: number | null = null;

export function startSyncLoop(): () => void {
  if (typeof window === "undefined") return () => {};
  if (started) return () => stopSyncLoop();
  started = true;

  const tick = (): void => {
    void flushOnce();
  };
  intervalId = window.setInterval(tick, FLUSH_INTERVAL_MS);
  window.addEventListener("online", tick);
  // First attempt on next tick so we don't block the caller
  window.setTimeout(tick, 1000);
  return stopSyncLoop;
}

export function stopSyncLoop(): void {
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
  if (typeof window !== "undefined") {
    window.removeEventListener("online", () => {});
  }
  started = false;
}

export function flushSyncNow(): Promise<boolean> {
  return flushOnce();
}