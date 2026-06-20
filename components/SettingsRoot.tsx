"use client";

import { useEffect } from "react";

import { getSettings } from "@/lib/storage";

/**
 * SettingsRoot
 * Reads the persisted SettingsState on mount and applies data-* attributes
 * to <html> so global CSS (high-contrast + dyslexia font) responds to the
 * user's preferences without reloading the page. Also subscribes to the
 * `typify:settings-updated` event so changes apply live.
 */
export function SettingsRoot() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const apply = (): void => {
      const settings = getSettings();
      document.documentElement.dataset["contrast"] = settings.highContrast ? "high" : "normal";
      document.documentElement.dataset["dyslexia"] = settings.dyslexiaFont ? "on" : "off";
    };
    apply();
    window.addEventListener("typify:settings-updated", apply);
    return () => window.removeEventListener("typify:settings-updated", apply);
  }, []);
  return null;
}