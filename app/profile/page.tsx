"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import {
  subscribe as subscribeProfile,
  getSnapshot as getProfileSnapshot,
} from "@/lib/profileStore";
import {
  subscribe as subscribeProgress,
  getSnapshot as getProgressSnapshot,
} from "@/lib/progressStore";

import { ProfileView } from "@/components/profile/ProfileView";

interface Snapshot {
  profile: {
    nickname: string;
    mascot: import("@/types/localStorage").MascotKey;
    primaryColor: string;
    level: number;
    xp: number;
    uiLanguage: import("@/types/localStorage").UILanguage;
    homeCulture: import("@/types/localStorage").CultureCode;
  };
  stats: {
    lessonsCompleted: number;
    speedBestWpm: number | null;
    speedBestAccuracy: number | null;
    culturesExplored: number;
  };
  unlocks: {
    accessories: string[];
    stickers: string[];
  };
}

function readSpeedAndUnlocks(): Pick<Snapshot, "stats" | "unlocks"> {
  if (typeof window === "undefined") {
    return {
      stats: { lessonsCompleted: 0, speedBestWpm: null, speedBestAccuracy: null, culturesExplored: 0 },
      unlocks: { accessories: [], stickers: [] },
    };
  }
  const read = (key: string): unknown => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const speed = read("typify:speed-test") as { personalBest?: { wpm: number; accuracy: number } } | null;
  const unlocks = read("typify:unlocks") as { accessories?: string[]; stickers?: string[] } | null;
  return {
    stats: {
      speedBestWpm: speed?.personalBest?.wpm ?? null,
      speedBestAccuracy: speed?.personalBest?.accuracy ?? null,
      lessonsCompleted: 0,
      culturesExplored: 0,
    },
    unlocks: {
      accessories: unlocks?.accessories ?? [],
      stickers: unlocks?.stickers ?? [],
    },
  };
}

function buildSnapshot(): Snapshot | null {
  const profile = getProfileSnapshot();
  if (!profile) return null;
  const progress = getProgressSnapshot();
  const { stats, unlocks } = readSpeedAndUnlocks();
  const culturesExplored = new Set(
    Object.values(progress.bestLessonResults).map((r) => r.cultureId),
  ).size;
  return {
    profile: {
      nickname: profile.nickname,
      mascot: profile.mascot,
      primaryColor: profile.primaryColor,
      level: profile.level,
      xp: profile.xp,
      uiLanguage: profile.uiLanguage,
      homeCulture: profile.homeCulture,
    },
    stats: {
      lessonsCompleted: progress.completedLessonIds.length,
      culturesExplored,
      speedBestWpm: stats.speedBestWpm,
      speedBestAccuracy: stats.speedBestAccuracy,
    },
    unlocks,
  };
}

function subscribe(_cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (): void => _cb();
  // Inherit the profile + progress subscribers so a profile/quest update
  // invalidates the snapshot too.
  const profileUnsub = subscribeProfile(handler);
  const progressUnsub = subscribeProgress(handler);
  const onStorage = (): void => _cb();
  window.addEventListener("typify:rewards", onStorage);
  window.addEventListener("typify:settings-updated", onStorage);
  window.addEventListener("typify:quests-updated", onStorage);
  window.addEventListener("typify:speed-test-saved", onStorage);
  return () => {
    profileUnsub();
    progressUnsub();
    window.removeEventListener("typify:rewards", onStorage);
    window.removeEventListener("typify:settings-updated", onStorage);
    window.removeEventListener("typify:quests-updated", onStorage);
    window.removeEventListener("typify:speed-test-saved", onStorage);
  };
}

function getServerSnapshot(): Snapshot | null {
  return null;
}

export default function ProfilePage() {
  const router = useRouter();
  const data = useSyncExternalStore(subscribe, buildSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!data) {
      const id = window.setTimeout(() => {
        if (!getProfileSnapshot()) router.replace("/onboarding");
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [data, router]);

  if (!data) {
    return <main style={{ minHeight: "100dvh", background: "var(--color-paper)" }} />;
  }

  return <ProfileView {...data} />;
}