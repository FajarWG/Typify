"use client";

import i18next, { type i18n as I18nInstance } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import id from "./locales/id.json";
import ja from "./locales/ja.json";

export const SUPPORTED_LANGUAGES = ["en", "id", "ja"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  ja: "日本語",
};

const resources = {
  en: { translation: en },
  id: { translation: id },
  ja: { translation: ja },
} as const;

let initialized = false;

export function getI18n(): I18nInstance {
  if (!initialized) {
    void i18next
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: DEFAULT_LANGUAGE,
        supportedLngs: [...SUPPORTED_LANGUAGES],
        nonExplicitSupportedLngs: true,
        interpolation: { escapeValue: false },
        detection: {
          order: ["localStorage", "navigator"],
          lookupLocalStorage: "typify:i18n",
          caches: ["localStorage"],
        },
        returnNull: false,
      });
    initialized = true;
  }
  return i18next;
}

export function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return typeof value === "string" && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}