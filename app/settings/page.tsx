"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { setProfile, setSettings } from "@/lib/storage";
import { setUILanguage } from "@/components/I18nProvider";
import { getI18n, LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from "@/i18n";
import {
  subscribe as subscribeProfile,
  getSnapshot as getProfileSnapshot,
  getServerSnapshot as getProfileServerSnapshot,
} from "@/lib/profileStore";
import {
  subscribe as subscribeSettings,
  getSnapshot as getSettingsSnapshot,
  getServerSnapshot as getSettingsServerSnapshot,
} from "@/lib/settingsStore";
import { useSyncExternalStore } from "react";
import type {
  CultureCode,
  KeyboardLayout,
  UILanguage,
} from "@/types/localStorage";

import styles from "./settings.module.css";

const CULTURE_LABELS: Record<CultureCode, { key: string; flag: string }> = {
  id: { key: "Indonesia", flag: "🇮🇩" },
  ja: { key: "Nippon", flag: "🇯🇵" },
  en: { key: "Anglosphere", flag: "🇬🇧" },
};

const KEYBOARD_LABELS: Record<KeyboardLayout, { key: string }> = {
  qwerty: { key: "QWERTY" },
  romaji: { key: "Romaji" },
};

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getProfileServerSnapshot,
  );
  const initial = useSyncExternalStore(
    subscribeSettings,
    getSettingsSnapshot,
    getSettingsServerSnapshot,
  );
  const [settings, setLocal] = useState(initial);

  function toggle<K extends keyof typeof initial>(key: K, value: (typeof initial)[K]): void {
    const next = { ...settings, [key]: value };
    setLocal(next);
    setSettings(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("typify:settings-updated"));
    }
  }

  function changeCulture(c: CultureCode): void {
    toggle("homeCulture", c);
    if (profile) {
      setProfile({ ...profile, homeCulture: c });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("typify:profile-updated"));
      }
    }
  }

  function changeKeyboard(k: KeyboardLayout): void {
    toggle("keyboardLayout", k);
    if (profile) {
      setProfile({ ...profile, keyboardLayout: k });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("typify:profile-updated"));
      }
    }
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => router.push("/")}
          aria-label={t("common.back")}
        >
          ← {t("common.back")}
        </button>
        <span className="mono-label">{t("settings.title")}</span>
      </header>

      <h1 className={styles.title}>{t("settings.title")}</h1>

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Interface</h2>

        <label className={styles.field}>
          <span className={styles.label}>{t("settings.language")}</span>
          <select
            className={styles.select}
            value={profile?.uiLanguage ?? "en"}
            onChange={(e) => {
              const lang = e.target.value as UILanguage;
              void getI18n().changeLanguage(lang);
              setUILanguage(lang);
              if (profile) {
                setProfile({ ...profile, uiLanguage: lang });
              }
            }}
          >
            {SUPPORTED_LANGUAGES.map((l: (typeof SUPPORTED_LANGUAGES)[number]) => (
              <option key={l} value={l}>
                {LANGUAGE_LABELS[l]}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("settings.keyboard")}</span>
          <div className={styles.pillRow} role="radiogroup" aria-label={t("settings.keyboard")}>
            {(Object.keys(KEYBOARD_LABELS) as KeyboardLayout[]).map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={settings.keyboardLayout === k}
                className={[styles.pill, settings.keyboardLayout === k ? styles.pillActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => changeKeyboard(k)}
              >
                {KEYBOARD_LABELS[k].key}
              </button>
            ))}
          </div>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("settings.culture")}</span>
          <div className={styles.pillRow} role="radiogroup" aria-label={t("settings.culture")}>
            {(Object.keys(CULTURE_LABELS) as CultureCode[]).map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={settings.homeCulture === c}
                className={[styles.pill, settings.homeCulture === c ? styles.pillActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => changeCulture(c)}
              >
                <span aria-hidden>{CULTURE_LABELS[c].flag}</span>
                <span>{CULTURE_LABELS[c].key}</span>
              </button>
            ))}
          </div>
        </label>
      </section>

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Accessibility</h2>

        <ToggleField
          label={t("settings.sound")}
          checked={settings.soundEnabled}
          onChange={(v) => toggle("soundEnabled", v)}
        />
        <ToggleField
          label={t("settings.highContrast")}
          checked={settings.highContrast}
          onChange={(v) => toggle("highContrast", v)}
        />
        <ToggleField
          label={t("settings.dyslexiaFont")}
          checked={settings.dyslexiaFont}
          onChange={(v) => toggle("dyslexiaFont", v)}
        />
        <ToggleField
          label={t("settings.leaderboardOptIn")}
          checked={settings.classroomOptIn}
          onChange={(v) => toggle("classroomOptIn", v)}
        />
      </section>

      <section className={styles.linkRow}>
        <a href="/privacy" className={styles.linkBtn}>
          {t("privacy.title")} ↗
        </a>
      </section>

      <section className={styles.dangerZone}>
        <h2 className={styles.dangerTitle}>{t("settings.resetData")}</h2>
        <ResetConfirm />
      </section>
    </main>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={styles.toggle}>
      <span className={styles.label}>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.toggleTrack} aria-hidden>
        <span className={styles.toggleKnob} />
      </span>
    </label>
  );
}

function ResetConfirm() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <details className={styles.resetDetails}>
      <summary className={styles.resetSummary}>{t("settings.resetData")}</summary>
      <form
        className={styles.resetForm}
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.currentTarget.elements.namedItem("confirm") as HTMLInputElement).value;
          if (input === "reset") {
            for (const k of Object.keys(window.localStorage)) {
              if (k.startsWith("typify:")) window.localStorage.removeItem(k);
            }
            router.push("/onboarding");
          }
        }}
      >
        <p className={styles.resetLead}>{t("settings.resetConfirmPrompt")}</p>
        <input
          name="confirm"
          type="text"
          placeholder={t("settings.resetWord")}
          className={styles.resetInput}
          autoComplete="off"
        />
        <button type="submit" className={styles.resetBtn}>
          {t("settings.resetData")}
        </button>
      </form>
    </details>
  );
}