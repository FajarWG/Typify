// Typify · onboarding completion
//
// Converts the in-memory onboarding state into a StudentProfile, generates
// a fresh anonymousId, writes it to localStorage, and dispatches the
// "profile-updated" event so other parts of the app (nav, home greeting)
// can re-read the profile without a hard reload.

import {
  PRIMARY_COLOR_PALETTE,
  type OnboardingState,
} from "@/lib/onboarding/state";
import {
  createDefaultProfile,
  STORAGE_KEYS,
  type StudentProfile,
} from "@/types/localStorage";
import {
  getClassroomLink,
  setClassroomLink,
  setProfile,
} from "@/lib/storage";

function generateAnonymousId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // fallback for environments without crypto.randomUUID
  return `tpy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function colourForKey(key: string): string {
  const hit = PRIMARY_COLOR_PALETTE.find((c) => c.key === key);
  return hit ? hit.value : PRIMARY_COLOR_PALETTE[0].value;
}

export function finaliseOnboarding(state: OnboardingState): StudentProfile | null {
  if (state.step !== "done") return null;
  if (state.mascot === null) return null;

  const profile = createDefaultProfile({
    anonymousId: generateAnonymousId(),
    nickname: state.name.trim(),
    mascot: state.mascot,
    primaryColor: colourForKey(state.primaryColor),
    homeCulture: "id", // default until first culture visit; settings can change
    uiLanguage: state.uiLanguage,
    keyboardLayout: state.keyboardLayout,
  });

  const classroom = getClassroomLink();
  const nextClassroom =
    state.track === "classroom" && state.classCode.length > 0
      ? { ...classroom, classCode: state.classCode, linkedAt: new Date().toISOString() }
      : classroom;
  setClassroomLink(nextClassroom);

  setProfile({ ...profile, onboardingCompleted: true });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("typify:profile-updated", { detail: { key: STORAGE_KEYS.profile } }));
  }
  return profile;
}