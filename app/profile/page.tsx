"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

import {
  getProfile,
  getProgress,
  getSpeedTest,
  getUnlocks,
} from "@/lib/storage";

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

function buildSnapshot(): Snapshot | null {
  const profile = getProfile();
  if (!profile) return null;
  const progress = getProgress();
  const speed = getSpeedTest();
  const unlocks = getUnlocks();
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
      speedBestWpm: speed.personalBest?.wpm ?? null,
      speedBestAccuracy: speed.personalBest?.accuracy ?? null,
      culturesExplored,
    },
    unlocks: {
      accessories: unlocks.accessories,
      stickers: unlocks.stickers,
    },
  };
}

function subscribe(_cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (): void => _cb();
  window.addEventListener("typify:profile-updated", handler);
  window.addEventListener("typify:progress-updated", handler);
  window.addEventListener("typify:rewards", handler);
  window.addEventListener("typify:settings-updated", handler);
  return () => {
    window.removeEventListener("typify:profile-updated", handler);
    window.removeEventListener("typify:progress-updated", handler);
    window.removeEventListener("typify:rewards", handler);
    window.removeEventListener("typify:settings-updated", handler);
  };
}

function getServerSnapshot(): Snapshot | null {
  return null;
}

export default function ProfilePage() {
  const router = useRouter();
  const data = useSyncExternalStore(subscribe, buildSnapshot, getServerSnapshot);

  if (!data) {
    if (typeof window !== "undefined") {
      // Defer to give the event loop a chance to update localStorage
      const id = window.setTimeout(() => {
        const p = getProfile();
        if (!p) router.replace("/onboarding");
      }, 0);
      window.clearTimeout(id);
    }
    return <main style={{ minHeight: "100dvh", background: "var(--color-paper)" }} />;
  }

  return <ProfileView {...data} />;
}