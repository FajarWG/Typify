"use client";

import { I18nextProvider, useTranslation } from "react-i18next";
import { useEffect, useSyncExternalStore } from "react";

import { getI18n } from "@/i18n";
import { getProfile } from "@/lib/storage";
import { isSupportedLanguage } from "@/i18n";
import type { UILanguage } from "@/types/localStorage";

function subscribeInit(callback: () => void): () => void {
  const i18n = getI18n();
  if (i18n.isInitialized) return () => {};
  i18n.on("initialized", callback);
  return () => {
    i18n.off("initialized", callback);
  };
}

function getInitSnapshot(): boolean {
  return getI18n().isInitialized;
}

function getServerInitSnapshot(): boolean {
  return false;
}

function LanguageSync(): null {
  const { i18n } = useTranslation();
  const profileLanguage = useSyncExternalStore(
    (cb) => {
      const handler = (): void => cb();
      window.addEventListener("typify:language-changed", handler);
      return () => window.removeEventListener("typify:language-changed", handler);
    },
    () => {
      const profile = getProfile();
      return profile?.uiLanguage ?? null;
    },
    () => null,
  );

  useEffect(() => {
    if (profileLanguage === null) return;
    if (isSupportedLanguage(profileLanguage) && i18n.language !== profileLanguage) {
      void i18n.changeLanguage(profileLanguage);
    }
  }, [i18n, profileLanguage]);

  return null;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const initialized = useSyncExternalStore(
    subscribeInit,
    getInitSnapshot,
    getServerInitSnapshot,
  );

  if (!initialized) {
    return null;
  }
  return (
    <I18nextProvider i18n={getI18n()}>
      <LanguageSync />
      {children}
    </I18nextProvider>
  );
}

export function setUILanguage(lang: UILanguage): void {
  const i18n = getI18n();
  void i18n.changeLanguage(lang);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("typify:language-changed"));
  }
}