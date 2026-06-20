// Typify · reward orchestration
// The single function called by lessons / speed test / games / quests
// when the kid completes something. Applies XP, evaluates unlocks,
// fires a celebration event the UI can listen for.

import {
  evaluateUnlocks,
  lessonXp,
  levelFromXp,
  xpProgressInLevel,
  type AccessoryKey,
  type StickerKey,
  type UnlockInputs,
} from "@/lib/progression";
import {
  getProfile,
  getProgress,
  getQuests,
  getSettings,
  getSpeedTest,
  getSync,
  getUnlocks,
  setProfile,
  setQuests,
  setSync,
  setUnlocks,
} from "@/lib/storage";
import type { SyncOp } from "@/types/localStorage";

export interface RewardResult {
  xpGained: number;
  newLevel: number | null;
  leveledUp: boolean;
  newAccessories: AccessoryKey[];
  newStickers: StickerKey[];
  progressInLevel?: {
    current: number;
    nextLevel: number;
    nextLevelXp: number;
  };
}

interface RewardOptions {
  xp: number;
  questCode?: "complete-lesson" | "play-minigame" | "speed-test";
  metadata?: { stickerKey?: StickerKey; accessoryKey?: AccessoryKey };
}

function emptyInputs(): UnlockInputs {
  return {
    progress: getProgress(),
    speedTest: getSpeedTest(),
    unlocks: getUnlocks(),
    quests: getQuests(),
    settings: getSettings(),
    level: 1,
  };
}

function fireEvent(detail: object): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("typify:rewards", { detail }));
}

export function grantRewards(options: RewardOptions): RewardResult {
  const profile = getProfile();
  if (!profile) {
    return { xpGained: 0, newLevel: null, leveledUp: false, newAccessories: [], newStickers: [] };
  }
  const before = emptyInputs();
  const levelBefore = levelFromXp(profile.xp);

  // 1. XP + level
  const newXp = profile.xp + options.xp;
  const newLevel = levelFromXp(newXp);
  setProfile({ ...profile, xp: newXp, level: newLevel });

  // 2. Daily quest
  if (options.questCode) {
    const today = new Date().toISOString().slice(0, 10);
    const quests = getQuests();
    const already = quests.completed.some(
      (q) => q.questCode === options.questCode && q.localDate === today,
    );
    if (!already) {
      setQuests({
        ...quests,
        completed: [
          ...quests.completed,
          {
            questCode: options.questCode,
            localDate: today,
            completedAt: new Date().toISOString(),
          },
        ],
      });
    }
  }

  // 3. Push accessory/sticker unlock ops to the sync queue
  const pendingOps: SyncOp[] = [];
  if (options.metadata?.stickerKey) {
    pendingOps.push({
      type: "unlock",
      payload: { kind: "sticker", key: options.metadata.stickerKey },
      createdAt: new Date().toISOString(),
    });
  }
  if (options.metadata?.accessoryKey) {
    pendingOps.push({
      type: "unlock",
      payload: { kind: "accessory", key: options.metadata.accessoryKey },
      createdAt: new Date().toISOString(),
    });
  }
  if (pendingOps.length > 0) {
    const sync = getSync();
    setSync({ ...sync, pendingOps: [...sync.pendingOps, ...pendingOps] });
  }

  // 4. Evaluate new unlocks against post-update state
  const after = emptyInputs();
  after.level = newLevel;
  const result = evaluateUnlocks(before, after);
  if (result.newAccessories.length > 0 || result.newStickers.length > 0) {
    setUnlocks({
      ...after.unlocks,
      accessories: Array.from(new Set([...after.unlocks.accessories, ...result.newAccessories])),
      stickers: Array.from(new Set([...after.unlocks.stickers, ...result.newStickers])),
    });
  }

  const leveledUp = newLevel > levelBefore;
  const progressInLevel = xpProgressInLevel(newXp);
  const out: RewardResult = {
    xpGained: options.xp,
    newLevel,
    leveledUp,
    newAccessories: result.newAccessories,
    newStickers: result.newStickers,
    progressInLevel: {
      current: progressInLevel.current,
      nextLevel: progressInLevel.nextLevel,
      nextLevelXp: progressInLevel.nextLevelXp,
    },
  };
  fireEvent({ ...out });
  return out;
}

export { lessonXp, xpProgressInLevel };