// Typify · onboarding state machine
//
// The flow is strictly linear with one branch: after "pick your track",
// the classroom branch asks for a class code; the independent branch skips
// that step. The reducer is the single source of truth for which step
// renders. When the user reaches "done", the orchestrator writes a
// StudentProfile to localStorage and navigates home.

import type {
  KeyboardLayout,
  MascotKey,
  UILanguage,
} from "@/types/localStorage";

export type OnboardingStep =
  | "welcome"
  | "language"
  | "keyboard"
  | "track"
  | "classCode"
  | "name"
  | "mascot"
  | "warmup"
  | "done";

export type OnboardingTrack = "classroom" | "independent";

export const PRIMARY_COLOR_PALETTE = [
  { key: "pear", value: "oklch(86% 0.18 95)" },
  { key: "cyan", value: "oklch(66% 0.18 235)" },
  { key: "coral", value: "oklch(68% 0.24 18)" },
  { key: "mint", value: "oklch(80% 0.16 150)" },
  { key: "lavender", value: "oklch(74% 0.16 305)" },
] as const;

export type PrimaryColorKey = (typeof PRIMARY_COLOR_PALETTE)[number]["key"];

export interface OnboardingState {
  step: OnboardingStep;
  uiLanguage: UILanguage;
  keyboardLayout: KeyboardLayout;
  track: OnboardingTrack | null;
  classCode: string;
  name: string;
  mascot: MascotKey | null;
  primaryColor: PrimaryColorKey;
}

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  step: "welcome",
  uiLanguage: "en",
  keyboardLayout: "qwerty",
  track: null,
  classCode: "",
  name: "",
  mascot: null,
  primaryColor: "pear",
};

export type OnboardingAction =
  | { type: "setLanguage"; language: UILanguage }
  | { type: "setKeyboard"; keyboard: KeyboardLayout }
  | { type: "setTrack"; track: OnboardingTrack }
  | { type: "setClassCode"; code: string }
  | { type: "setName"; name: string }
  | { type: "setMascot"; mascot: MascotKey }
  | { type: "setPrimaryColor"; color: PrimaryColorKey }
  | { type: "next" }
  | { type: "back" }
  | { type: "skipWarmup" };

const STEP_ORDER: Record<OnboardingStep, OnboardingStep | null> = {
  welcome: "language",
  language: "keyboard",
  keyboard: "track",
  track: "classCode", // updated by reducer if independent
  classCode: "name",
  name: "mascot",
  mascot: "warmup",
  warmup: "done",
  done: null,
};

function advanceFrom(state: OnboardingState): OnboardingState {
  if (state.step === "track") {
    return { ...state, step: state.track === "classroom" ? "classCode" : "name" };
  }
  const next = STEP_ORDER[state.step];
  return next ? { ...state, step: next } : state;
}

function retreatFrom(state: OnboardingState): OnboardingState {
  switch (state.step) {
    case "language":
      return { ...state, step: "welcome" };
    case "keyboard":
      return { ...state, step: "language" };
    case "track":
      return { ...state, step: "keyboard" };
    case "classCode":
      return { ...state, step: "track" };
    case "name":
      // independent learners skip classCode, so retreat goes back to track
      return { ...state, step: "track" };
    case "mascot":
      return { ...state, step: "name" };
    case "warmup":
      return { ...state, step: "mascot" };
    default:
      return state;
  }
}

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case "setLanguage":
      return { ...state, uiLanguage: action.language };
    case "setKeyboard":
      return { ...state, keyboardLayout: action.keyboard };
    case "setTrack":
      return { ...state, track: action.track };
    case "setClassCode":
      return { ...state, classCode: action.code.trim().toUpperCase() };
    case "setName":
      return { ...state, name: action.name };
    case "setMascot":
      return { ...state, mascot: action.mascot };
    case "setPrimaryColor":
      return { ...state, primaryColor: action.color };
    case "next":
      return advanceFrom(state);
    case "back":
      return retreatFrom(state);
    case "skipWarmup":
      return { ...state, step: "done" };
    default:
      return state;
  }
}

export function isStepValid(state: OnboardingState): boolean {
  switch (state.step) {
    case "welcome":
      return true;
    case "language":
      return true;
    case "keyboard":
      return true;
    case "track":
      return state.track !== null;
    case "classCode":
      return /^[A-Z0-9-]{4,12}$/.test(state.classCode);
    case "name":
      return state.name.trim().length >= 2 && state.name.trim().length <= 24;
    case "mascot":
      return state.mascot !== null;
    case "warmup":
      return true;
    default:
      return false;
  }
}

export function totalSteps(track: OnboardingTrack | null): number {
  // 1 (welcome) + 5 mandatory + warmup = 7 if classroom, 6 if independent
  return track === "classroom" ? 7 : track === "independent" ? 6 : 7;
}

export function currentStepNumber(state: OnboardingState): number {
  const order: OnboardingStep[] =
    state.track === "independent"
      ? ["welcome", "language", "keyboard", "track", "name", "mascot", "warmup"]
      : ["welcome", "language", "keyboard", "track", "classCode", "name", "mascot", "warmup"];
  const idx = order.indexOf(state.step);
  return idx === -1 ? order.length : idx + 1;
}