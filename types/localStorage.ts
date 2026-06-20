// Typify · client-side storage contracts
// Every persisted blob carries a `version` field so future migrations can
// upgrade stale data in place instead of nuking the kid's progress.
//
// Storage shape is JSON-serialisable, framework-free, and importable from
// both server components and client components. The SSR-safe adapter lives
// in lib/storage.ts.

export const TYPIFY_STORAGE_VERSION = 1 as const;

export type UILanguage = "en" | "id" | "ja";
export type KeyboardLayout = "qwerty" | "romaji";
export type CultureCode = "id" | "ja" | "en";
export type MascotKey =
  | "cat"
  | "owl"
  | "panda"
  | "dragon"
  | "fox"
  | "rabbit"
  | "koala"
  | "penguin";

export type QuestCode =
  | "complete-lesson"
  | "play-minigame"
  | "speed-test";

export interface Versioned<TShape extends string = string> {
  version: typeof TYPIFY_STORAGE_VERSION;
  shape: TShape;
}

// -----------------------------------------------------------------------------
// Profile · the kid's identity. Written once during onboarding.
// -----------------------------------------------------------------------------

export interface StudentProfile {
  version: typeof TYPIFY_STORAGE_VERSION;
  shape: "profile";
  anonymousId: string;
  nickname: string;
  mascot: MascotKey;
  primaryColor: string;
  homeCulture: CultureCode;
  uiLanguage: UILanguage;
  keyboardLayout: KeyboardLayout;
  level: number;
  xp: number;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export function createDefaultProfile(
  init: Omit<StudentProfile, "version" | "shape" | "level" | "xp" | "onboardingCompleted" | "createdAt" | "updatedAt">,
): StudentProfile {
  const now = new Date().toISOString();
  return {
    ...init,
    version: TYPIFY_STORAGE_VERSION,
    shape: "profile",
    level: 1,
    xp: 0,
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

// -----------------------------------------------------------------------------
// Progress · lesson unlocks and best results per lesson.
// -----------------------------------------------------------------------------

export interface LessonResult {
  lessonId: string;
  cultureId: CultureCode;
  wpm: number;
  accuracy: number;
  timeSpentSec: number;
  phrasesCompleted: number;
  phrasesTotal: number;
  completedAt: string;
}

export interface ProgressState {
  version: typeof TYPIFY_STORAGE_VERSION;
  shape: "progress";
  unlockedLessonIds: string[];
  completedLessonIds: string[];
  bestLessonResults: Record<string, LessonResult>;
}

export function createDefaultProgress(): ProgressState {
  return {
    version: TYPIFY_STORAGE_VERSION,
    shape: "progress",
    unlockedLessonIds: ["home-row"],
    completedLessonIds: [],
    bestLessonResults: {},
  };
}

// -----------------------------------------------------------------------------
// Speed test · personal best + recent sessions.
// -----------------------------------------------------------------------------

export interface SpeedTestResult {
  wpm: number;
  accuracy: number;
  durationSec: number;
  cultureId: CultureCode | null;
  createdAt: string;
}

export interface SpeedTestState {
  version: typeof TYPIFY_STORAGE_VERSION;
  shape: "speed-test";
  personalBest: SpeedTestResult | null;
  recent: SpeedTestResult[];
}

export function createDefaultSpeedTest(): SpeedTestState {
  return {
    version: TYPIFY_STORAGE_VERSION,
    shape: "speed-test",
    personalBest: null,
    recent: [],
  };
}

// -----------------------------------------------------------------------------
// Daily quests · refreshed at the kid's local midnight.
// -----------------------------------------------------------------------------

export interface QuestCompletionEntry {
  questCode: QuestCode;
  localDate: string;
  completedAt: string;
}

export interface QuestState {
  version: typeof TYPIFY_STORAGE_VERSION;
  shape: "quests";
  lastResetDate: string;
  completed: QuestCompletionEntry[];
}

export function createDefaultQuests(): QuestState {
  return {
    version: TYPIFY_STORAGE_VERSION,
    shape: "quests",
    lastResetDate: "",
    completed: [],
  };
}

// -----------------------------------------------------------------------------
// Avatar unlocks · stickers and accessories earned by the kid.
// -----------------------------------------------------------------------------

export interface UnlockState {
  version: typeof TYPIFY_STORAGE_VERSION;
  shape: "unlocks";
  accessories: string[];
  stickers: string[];
}

export function createDefaultUnlocks(): UnlockState {
  return {
    version: TYPIFY_STORAGE_VERSION,
    shape: "unlocks",
    accessories: [],
    stickers: [],
  };
}

// -----------------------------------------------------------------------------
// Settings · accessibility toggles and preferences.
// -----------------------------------------------------------------------------

export interface SettingsState {
  version: typeof TYPIFY_STORAGE_VERSION;
  shape: "settings";
  soundEnabled: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  classroomOptIn: boolean;
}

export function createDefaultSettings(): SettingsState {
  return {
    version: TYPIFY_STORAGE_VERSION,
    shape: "settings",
    soundEnabled: false,
    highContrast: false,
    dyslexiaFont: false,
    classroomOptIn: false,
  };
}

// -----------------------------------------------------------------------------
// Classroom link · set during onboarding if the kid joined via a code.
// -----------------------------------------------------------------------------

export interface ClassroomLinkState {
  version: typeof TYPIFY_STORAGE_VERSION;
  shape: "classroom-link";
  classCode: string | null;
  linkedAt: string | null;
}

export function createDefaultClassroomLink(): ClassroomLinkState {
  return {
    version: TYPIFY_STORAGE_VERSION,
    shape: "classroom-link",
    classCode: null,
    linkedAt: null,
  };
}

// -----------------------------------------------------------------------------
// Sync queue · offline-first writes pending upload to the server.
// -----------------------------------------------------------------------------

export type SyncOp =
  | { type: "progress"; payload: LessonResult; createdAt: string }
  | { type: "speed-test"; payload: SpeedTestResult; createdAt: string }
  | { type: "quest"; payload: { questCode: QuestCode; localDate: string }; createdAt: string }
  | {
      type: "unlock";
      payload: { kind: "accessory" | "sticker"; key: string };
      createdAt: string;
    };

export interface SyncState {
  version: typeof TYPIFY_STORAGE_VERSION;
  shape: "sync";
  lastSyncedAt: string | null;
  pendingOps: SyncOp[];
}

export function createDefaultSync(): SyncState {
  return {
    version: TYPIFY_STORAGE_VERSION,
    shape: "sync",
    lastSyncedAt: null,
    pendingOps: [],
  };
}

// -----------------------------------------------------------------------------
// Storage keys · the single source of truth for localStorage key names.
// -----------------------------------------------------------------------------

export const STORAGE_KEYS = {
  profile: "typify:profile",
  progress: "typify:progress",
  speedTest: "typify:speed-test",
  quests: "typify:quests",
  unlocks: "typify:unlocks",
  settings: "typify:settings",
  classroomLink: "typify:classroom-link",
  sync: "typify:sync",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export type AnyState =
  | StudentProfile
  | ProgressState
  | SpeedTestState
  | QuestState
  | UnlockState
  | SettingsState
  | ClassroomLinkState
  | SyncState;