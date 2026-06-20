"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { getProfile, getSettings, setSettings } from "@/lib/storage";
import { setUILanguage } from "@/components/I18nProvider";
import { getI18n, LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from "@/i18n";

import styles from "./settings.module.css";

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const profile = getProfile();
  const settings = getSettings();

  const update = (patch: Partial<typeof settings>): void => {
    const next = { ...getSettings(), ...patch };
    setSettings(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("typify:settings-updated"));
      window.location.reload();
    }
  };

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
        <label className={styles.field}>
          <span className={styles.label}>{t("settings.language")}</span>
          <select
            className={styles.select}
            value={profile?.uiLanguage ?? "en"}
            onChange={(e) => {
              const lang = e.target.value as "en" | "id" | "ja";
              void getI18n().changeLanguage(lang);
              setUILanguage(lang);
            }}
          >
            {SUPPORTED_LANGUAGES.map((l: (typeof SUPPORTED_LANGUAGES)[number]) => (
              <option key={l} value={l}>
                {LANGUAGE_LABELS[l]}
              </option>
            ))}
          </select>
        </label>

        <ToggleField
          label={t("settings.leaderboardOptIn")}
          checked={settings.classroomOptIn}
          onChange={(v) => update({ classroomOptIn: v })}
        />
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
            // Wipe storage
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