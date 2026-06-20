// Typify · settings snapshot store
// Referentially-stable snapshot for useSyncExternalStore.

import { getSettings } from "@/lib/storage";
import type { SettingsState } from "@/types/localStorage";

const DEFAULT: SettingsState = {
  version: 1,
  shape: "settings",
  soundEnabled: false,
  highContrast: false,
  dyslexiaFont: false,
  classroomOptIn: false,
  keyboardLayout: "qwerty",
  homeCulture: "id",
};
let cached: SettingsState = DEFAULT;
let lastRaw: string | null | undefined = undefined;
let initialized = false;

function read(): SettingsState {
  if (typeof window === "undefined") return DEFAULT;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem("typify:settings");
  } catch {
    return DEFAULT;
  }
  if (!initialized || raw !== lastRaw) {
    lastRaw = raw;
    const parsed = raw === null ? null : getSettings();
    cached = parsed ?? DEFAULT;
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
  window.addEventListener("typify:settings-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("typify:settings-updated", handler);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot(): SettingsState {
  return read();
}

function getServerSnapshot(): SettingsState {
  return DEFAULT;
}

export { subscribe, getSnapshot, getServerSnapshot };