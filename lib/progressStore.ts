// Typify · progress snapshot store
// Referentially-stable snapshot for useSyncExternalStore. See profileStore
// for the rationale.

import { getProgress } from "@/lib/storage";
import type { ProgressState } from "@/types/localStorage";

const EMPTY: ProgressState = {
  version: 1,
  shape: "progress",
  unlockedLessonIds: ["home-row"],
  completedLessonIds: [],
  bestLessonResults: {},
};
let cached: ProgressState = EMPTY;
let lastRaw: string | null | undefined = undefined;
let initialized = false;

function read(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem("typify:progress");
  } catch {
    return EMPTY;
  }
  if (!initialized || raw !== lastRaw) {
    lastRaw = raw;
    const parsed = raw === null ? null : getProgress();
    cached = parsed ?? EMPTY;
    initialized = true;
  }
  return cached;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (): void => {
    initialized = false;
    callback();
  };
  window.addEventListener("typify:progress-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("typify:progress-updated", handler);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot(): ProgressState {
  return read();
}

function getServerSnapshot(): ProgressState {
  return EMPTY;
}

export { subscribe, getSnapshot, getServerSnapshot };