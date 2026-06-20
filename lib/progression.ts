// Typify · progression
// XP + level + unlock rules. Pure functions so the test surface is tiny
// and the calling components can fire-and-forget.

import type { ProgressState, QuestState, SettingsState, SpeedTestState, UnlockState } from "@/types/localStorage";

// -----------------------------------------------------------------------------
// Level curve
// -----------------------------------------------------------------------------

export function xpForLevel(level: number): number {
  // Quadratic-ish: level n requires 50 * (n-1)^2 XP to reach it
  if (level <= 1) return 0;
  return 50 * (level - 1) * (level - 1);
}

export function levelFromXp(xp: number): number {
  if (xp < 0) return 1;
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

export function xpProgressInLevel(xp: number): { current: number; nextLevel: number; nextLevelXp: number } {
  const current = levelFromXp(xp);
  const base = xpForLevel(current);
  const nextLevelXp = xpForLevel(current + 1);
  return { current: xp - base, nextLevel: current + 1, nextLevelXp: nextLevelXp - base };
}

// -----------------------------------------------------------------------------
// XP awards (sources)
// -----------------------------------------------------------------------------

export const XP_AWARDS = {
  lessonComplete: 20,
  speedTestComplete: 10,
  miniGameComplete: 15,
  questComplete: 5,
} as const;

export function lessonXp(accuracy: number): number {
  // Accuracy bonus: extra 10 XP at 100%
  if (accuracy >= 1) return XP_AWARDS.lessonComplete + 10;
  if (accuracy >= 0.9) return XP_AWARDS.lessonComplete + 5;
  return XP_AWARDS.lessonComplete;
}

// -----------------------------------------------------------------------------
// Unlock catalogue
// -----------------------------------------------------------------------------

export type AccessoryKey = "hat" | "glasses" | "scarf" | "badge" | "headband" | "cape";

export interface AccessoryDef {
  key: AccessoryKey;
  name: string;
  unlockLevel: number;
  file: string;
}

export const ACCESSORIES: readonly AccessoryDef[] = [
  { key: "hat", name: "Cozy hat", unlockLevel: 2, file: "/accessories/hat.svg" },
  { key: "glasses", name: "Round glasses", unlockLevel: 3, file: "/accessories/glasses.svg" },
  { key: "headband", name: "Sport headband", unlockLevel: 4, file: "/accessories/headband.svg" },
  { key: "scarf", name: "Striped scarf", unlockLevel: 5, file: "/accessories/scarf.svg" },
  { key: "badge", name: "Star badge", unlockLevel: 10, file: "/accessories/badge.svg" },
  { key: "cape", name: "Hero cape", unlockLevel: 15, file: "/accessories/cape.svg" },
];

export type StickerKey =
  | "first-lesson"
  | "speed-novice"
  | "speed-30"
  | "speed-50"
  | "high-accuracy"
  | "perfect-game"
  | "culture-id"
  | "culture-ja"
  | "culture-en"
  | "explorer"
  | "level-5"
  | "level-10"
  | "streak-3"
  | "early-bird";

export interface StickerDef {
  key: StickerKey;
  name: string;
  file: string;
  condition: string;
}

export const STICKERS: readonly StickerDef[] = [
  { key: "first-lesson", name: "First key", file: "/stickers/first-lesson.svg", condition: "Complete your first lesson" },
  { key: "speed-novice", name: "Speed tester", file: "/stickers/speed-novice.svg", condition: "Finish your first speed test" },
  { key: "speed-30", name: "30 WPM", file: "/stickers/speed-30.svg", condition: "Reach 30 WPM" },
  { key: "speed-50", name: "50 WPM", file: "/stickers/speed-50.svg", condition: "Reach 50 WPM" },
  { key: "high-accuracy", name: "Perfect keys", file: "/stickers/high-accuracy.svg", condition: "100% accuracy on a lesson" },
  { key: "perfect-game", name: "Game master", file: "/stickers/perfect-game.svg", condition: "All 8 rounds correct in a game" },
  { key: "culture-id", name: "Indonesia", file: "/stickers/culture-id.svg", condition: "Complete any Indonesian lesson" },
  { key: "culture-ja", name: "Nippon", file: "/stickers/culture-ja.svg", condition: "Complete any Japanese lesson" },
  { key: "culture-en", name: "Anglosphere", file: "/stickers/culture-en.svg", condition: "Complete any English lesson" },
  { key: "explorer", name: "Explorer", file: "/stickers/explorer.svg", condition: "Play all 3 mini-games" },
  { key: "level-5", name: "Five up", file: "/stickers/level-5.svg", condition: "Reach level 5" },
  { key: "level-10", name: "Ten up", file: "/stickers/level-10.svg", condition: "Reach level 10" },
  { key: "streak-3", name: "Three in a row", file: "/stickers/streak-3.svg", condition: "Finish 3 lessons in a row" },
  { key: "early-bird", name: "Early bird", file: "/stickers/early-bird.svg", condition: "Play before 8am local time" },
];

// -----------------------------------------------------------------------------
// Unlock evaluator
// Returns the keys that are newly unlocked given the current state.
// -----------------------------------------------------------------------------

export interface UnlockInputs {
  progress: ProgressState;
  speedTest: SpeedTestState;
  unlocks: UnlockState;
  quests: QuestState;
  settings: SettingsState;
  level: number;
}

export interface UnlockResult {
  newAccessories: AccessoryKey[];
  newStickers: StickerKey[];
  xpGained: number;
}

const EARLY_BIRD_HOUR = 8;

export function evaluateUnlocks(
  before: UnlockInputs,
  after: UnlockInputs,
): UnlockResult {
  const result: UnlockResult = {
    newAccessories: [],
    newStickers: [],
    xpGained: after.level > before.level ? 0 : 0,
  };

  // Accessories: any with unlockLevel ≤ current level
  for (const a of ACCESSORIES) {
    if (a.unlockLevel <= after.level && !after.unlocks.accessories.includes(a.key)) {
      result.newAccessories.push(a.key);
    }
  }

  // Stickers: compute each condition against `after`
  const completedLessons = after.progress.completedLessonIds.length;
  const bestWpm = after.speedTest.personalBest?.wpm ?? 0;
  const culturesTouched = new Set(after.progress.bestLessonResults ? Object.values(after.progress.bestLessonResults).map((r) => r.cultureId) : []);
  const bestAccuracy = Object.values(after.progress.bestLessonResults).reduce<number>(
    (acc, r) => Math.max(acc, r.accuracy),
    0,
  );

  const stickersToCheck: Array<[StickerKey, boolean]> = [
    ["first-lesson", completedLessons >= 1],
    ["speed-novice", after.speedTest.recent.length >= 1],
    ["speed-30", bestWpm >= 30],
    ["speed-50", bestWpm >= 50],
    ["high-accuracy", bestAccuracy >= 1],
    ["culture-id", culturesTouched.has("id")],
    ["culture-ja", culturesTouched.has("ja")],
    ["culture-en", culturesTouched.has("en")],
    ["level-5", after.level >= 5],
    ["level-10", after.level >= 10],
    ["early-bird", new Date().getHours() < EARLY_BIRD_HOUR],
  ];

  for (const [key, ok] of stickersToCheck) {
    if (ok && !after.unlocks.stickers.includes(key)) {
      result.newStickers.push(key);
    }
  }

  return result;
}