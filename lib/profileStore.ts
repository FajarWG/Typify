// Typify · profile snapshot store
//
// useSyncExternalStore requires referentially-stable snapshots. Calling
// `getProfile()` on every render returns a fresh object (JSON.parse runs),
// which React interprets as "the store changed" → infinite re-render loop.
// We cache the parsed profile at the module level and only invalidate it
// when something actually mutates the profile key.

import { getProfile } from "@/lib/storage";
import type { StudentProfile } from "@/types/localStorage";

const NO_PROFILE: StudentProfile | null = null;
let cached: StudentProfile | null | typeof NO_PROFILE = null;
let lastRaw: string | null | undefined = undefined;
let initialized = false;

function read(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem("typify:profile");
  } catch {
    return null;
  }
  if (!initialized || raw !== lastRaw) {
    lastRaw = raw;
    cached = raw === null ? NO_PROFILE : getProfile();
    initialized = true;
  }
  return cached;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (): void => {
    // Force re-read on next getSnapshot by clearing the cache marker.
    initialized = false;
    callback();
  };
  window.addEventListener("typify:profile-updated", handler);
  window.addEventListener("storage", handler);
  listeners.add(handler);
  return () => {
    window.removeEventListener("typify:profile-updated", handler);
    window.removeEventListener("storage", handler);
    listeners.delete(handler);
  };
}

function getSnapshot(): StudentProfile | null {
  return read();
}

function getServerSnapshot(): StudentProfile | null {
  return null;
}

/**
 * Subscribe to profile changes from anywhere in the app. Calls the listener
 * once per `typify:profile-updated` event. Returns an unsubscribe function.
 */
export function onProfileChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (): void => callback();
  window.addEventListener("typify:profile-updated", handler);
  return () => window.removeEventListener("typify:profile-updated", handler);
}

/**
 * Invalidate the cached profile snapshot. Call after writing the profile.
 * Most callers don't need this — setProfile() already fires the event —
 * but it's useful for tests or out-of-band writes.
 */
export function invalidateProfileSnapshot(): void {
  initialized = false;
  for (const l of listeners) l();
}

export { subscribe, getSnapshot, getServerSnapshot };