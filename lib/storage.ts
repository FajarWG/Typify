// Typify · SSR-safe localStorage adapter
//
// Goals:
//   1. Safe to import in server components — never throws on `window`.
//   2. Versioned reads — stale shape gets discarded and a fresh default
//      is written so the next render sees a valid blob.
//   3. Tiny surface area — typed `get/set/remove` per storage key, plus
//      `resetAll` for the Settings → Reset Data flow.
//
// Browser-only callers should use this directly. The migration helpers
// live next to the shape definitions in types/localStorage.ts.

import {
  createDefaultClassroomLink,
  createDefaultProgress,
  createDefaultQuests,
  createDefaultSettings,
  createDefaultSpeedTest,
  createDefaultSync,
  createDefaultUnlocks,
  STORAGE_KEYS,
  TYPIFY_STORAGE_VERSION,
  type AnyState,
  type ClassroomLinkState,
  type ProgressState,
  type QuestState,
  type SettingsState,
  type SpeedTestState,
  type StudentProfile,
  type StorageKey,
  type SyncState,
  type UnlockState,
} from "@/types/localStorage";

const DEFAULT_FACTORIES = {
  [STORAGE_KEYS.profile]: (): StudentProfile => {
    throw new Error("StudentProfile cannot be defaulted — write it during onboarding.");
  },
  [STORAGE_KEYS.progress]: createDefaultProgress,
  [STORAGE_KEYS.speedTest]: createDefaultSpeedTest,
  [STORAGE_KEYS.quests]: createDefaultQuests,
  [STORAGE_KEYS.unlocks]: createDefaultUnlocks,
  [STORAGE_KEYS.settings]: createDefaultSettings,
  [STORAGE_KEYS.classroomLink]: createDefaultClassroomLink,
  [STORAGE_KEYS.sync]: createDefaultSync,
} as const;

type FactoryForKey = {
  [K in StorageKey]: typeof DEFAULT_FACTORIES[K];
};

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRaw(key: StorageKey): string | null {
  if (!hasStorage()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: StorageKey, value: string): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage full or disabled — fail quietly, the app should still run
  }
}

function removeRaw(key: StorageKey): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // best effort
  }
}

function isValidState(value: unknown): value is AnyState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as { version?: unknown; shape?: unknown };
  return (
    candidate.version === TYPIFY_STORAGE_VERSION &&
    typeof candidate.shape === "string"
  );
}

function parseOrNull(raw: string | null): AnyState | null {
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValidState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export function getProfile(): StudentProfile | null {
  const parsed = parseOrNull(readRaw(STORAGE_KEYS.profile));
  return parsed && parsed.shape === "profile" ? parsed : null;
}

export function setProfile(profile: StudentProfile): void {
  writeRaw(STORAGE_KEYS.profile, JSON.stringify(profile));
}

export function getProgress(): ProgressState {
  const parsed = parseOrNull(readRaw(STORAGE_KEYS.progress));
  if (parsed && parsed.shape === "progress") return parsed;
  const fresh = createDefaultProgress();
  writeRaw(STORAGE_KEYS.progress, JSON.stringify(fresh));
  return fresh;
}

export function setProgress(state: ProgressState): void {
  writeRaw(STORAGE_KEYS.progress, JSON.stringify(state));
}

export function getSpeedTest(): SpeedTestState {
  const parsed = parseOrNull(readRaw(STORAGE_KEYS.speedTest));
  if (parsed && parsed.shape === "speed-test") return parsed;
  const fresh = createDefaultSpeedTest();
  writeRaw(STORAGE_KEYS.speedTest, JSON.stringify(fresh));
  return fresh;
}

export function setSpeedTest(state: SpeedTestState): void {
  writeRaw(STORAGE_KEYS.speedTest, JSON.stringify(state));
}

export function getQuests(): QuestState {
  const parsed = parseOrNull(readRaw(STORAGE_KEYS.quests));
  if (parsed && parsed.shape === "quests") return parsed;
  const fresh = createDefaultQuests();
  writeRaw(STORAGE_KEYS.quests, JSON.stringify(fresh));
  return fresh;
}

export function setQuests(state: QuestState): void {
  writeRaw(STORAGE_KEYS.quests, JSON.stringify(state));
}

export function getUnlocks(): UnlockState {
  const parsed = parseOrNull(readRaw(STORAGE_KEYS.unlocks));
  if (parsed && parsed.shape === "unlocks") return parsed;
  const fresh = createDefaultUnlocks();
  writeRaw(STORAGE_KEYS.unlocks, JSON.stringify(fresh));
  return fresh;
}

export function setUnlocks(state: UnlockState): void {
  writeRaw(STORAGE_KEYS.unlocks, JSON.stringify(state));
}

export function getSettings(): SettingsState {
  const parsed = parseOrNull(readRaw(STORAGE_KEYS.settings));
  if (parsed && parsed.shape === "settings") return parsed;
  const fresh = createDefaultSettings();
  writeRaw(STORAGE_KEYS.settings, JSON.stringify(fresh));
  return fresh;
}

export function setSettings(state: SettingsState): void {
  writeRaw(STORAGE_KEYS.settings, JSON.stringify(state));
}

export function getClassroomLink(): ClassroomLinkState {
  const parsed = parseOrNull(readRaw(STORAGE_KEYS.classroomLink));
  if (parsed && parsed.shape === "classroom-link") return parsed;
  const fresh = createDefaultClassroomLink();
  writeRaw(STORAGE_KEYS.classroomLink, JSON.stringify(fresh));
  return fresh;
}

export function setClassroomLink(state: ClassroomLinkState): void {
  writeRaw(STORAGE_KEYS.classroomLink, JSON.stringify(state));
}

export function getSync(): SyncState {
  const parsed = parseOrNull(readRaw(STORAGE_KEYS.sync));
  if (parsed && parsed.shape === "sync") return parsed;
  const fresh = createDefaultSync();
  writeRaw(STORAGE_KEYS.sync, JSON.stringify(fresh));
  return fresh;
}

export function setSync(state: SyncState): void {
  writeRaw(STORAGE_KEYS.sync, JSON.stringify(state));
}

export function resetAll(): void {
  for (const key of Object.values(STORAGE_KEYS)) {
    removeRaw(key);
  }
}

// -----------------------------------------------------------------------------
// Typed wrapper used by the hooks layer (next phase).
// -----------------------------------------------------------------------------

export function getDefaultFor<K extends StorageKey>(key: K): ReturnType<FactoryForKey[K]> {
  const factory = DEFAULT_FACTORIES[key] as () => ReturnType<FactoryForKey[K]>;
  return factory();
}