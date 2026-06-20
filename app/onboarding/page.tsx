"use client";

import { useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { PushButton } from "@/components/onboarding/PushButton";
import { StepWelcome } from "@/components/onboarding/StepWelcome";
import { StepLanguage } from "@/components/onboarding/StepLanguage";
import { StepKeyboard } from "@/components/onboarding/StepKeyboard";
import { StepTrack } from "@/components/onboarding/StepTrack";
import { StepClassCode } from "@/components/onboarding/StepClassCode";
import { StepName } from "@/components/onboarding/StepName";
import { StepMascot } from "@/components/onboarding/StepMascot";
import { StepWarmup } from "@/components/onboarding/StepWarmup";
import {
  INITIAL_ONBOARDING_STATE,
  currentStepNumber,
  isStepValid,
  onboardingReducer,
  totalSteps,
} from "@/lib/onboarding/state";
import { finaliseOnboarding } from "@/lib/onboarding/complete";
import { getProfile } from "@/lib/storage";

import styles from "@/components/onboarding/onboarding.module.css";

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(onboardingReducer, INITIAL_ONBOARDING_STATE);

  useEffect(() => {
    const profile = getProfile();
    if (profile && profile.onboardingCompleted) {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (state.step === "done") {
      finaliseOnboarding(state);
      router.replace("/");
    }
  }, [state, router]);

  if (state.step === "done") {
    return null;
  }

  const total = totalSteps(state.track);
  const current = currentStepNumber(state);
  const valid = isStepValid(state);
  const showBack = state.step !== "welcome";

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <StepIndicator current={current} total={total} />
        <span className="mono-label">{t("app.name")}</span>
      </header>

      <section className={styles.stage} aria-live="polite">
        {state.step === "welcome" && (
          <StepWelcome onContinue={() => dispatch({ type: "next" })} />
        )}
        {state.step === "language" && (
          <StepLanguage
            value={state.uiLanguage}
            onSelect={(language) => dispatch({ type: "setLanguage", language })}
          />
        )}
        {state.step === "keyboard" && (
          <StepKeyboard
            value={state.keyboardLayout}
            onSelect={(keyboard) => dispatch({ type: "setKeyboard", keyboard })}
          />
        )}
        {state.step === "track" && (
          <StepTrack
            value={state.track}
            onSelect={(track) => dispatch({ type: "setTrack", track })}
          />
        )}
        {state.step === "classCode" && (
          <StepClassCode
            value={state.classCode}
            onChange={(code) => dispatch({ type: "setClassCode", code })}
          />
        )}
        {state.step === "name" && (
          <StepName
            value={state.name}
            onChange={(name) => dispatch({ type: "setName", name })}
          />
        )}
        {state.step === "mascot" && (
          <StepMascot
            mascot={state.mascot}
            primaryColor={state.primaryColor}
            onMascot={(mascot) => dispatch({ type: "setMascot", mascot })}
            onColor={(color) => dispatch({ type: "setPrimaryColor", color })}
          />
        )}
        {state.step === "warmup" && (
          <StepWarmup
            onStart={() => dispatch({ type: "next" })}
            onSkip={() => dispatch({ type: "skipWarmup" })}
          />
        )}
      </section>

      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.backLink}
          onClick={() => dispatch({ type: "back" })}
          disabled={!showBack}
        >
          {showBack ? t("common.back") : ""}
        </button>
        {state.step !== "welcome" && state.step !== "warmup" && (
          <PushButton
            size="lg"
            tone="pear"
            disabled={!valid}
            onClick={() => dispatch({ type: "next" })}
          >
            {t("common.continue")}
          </PushButton>
        )}
      </footer>
    </main>
  );
}