"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { findMascot } from "@/lib/mascots";
import { getProfile } from "@/lib/storage";

import styles from "./speed-done.module.css";

export default function SpeedTestDonePage() {
  return (
    <Suspense fallback={null}>
      <Done />
    </Suspense>
  );
}

function Done() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const profile = getProfile();
  const mascot = profile ? findMascot(profile.mascot) : findMascot("cat");
  const wpm = Number(params.get("wpm") ?? 0);
  const accuracyPct = Number(params.get("accuracy") ?? 0);
  const isPB = params.get("pb") === "1";

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <div className={styles.mascotBurst}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mascot.file} alt={mascot.alt} width={120} height={120} />
        </div>
        {isPB ? (
          <>
            <span className="mono-label">{t("speedTest.personalBest")}</span>
            <h1 className={styles.title}>{t("mascot.newRecord")}</h1>
          </>
        ) : (
          <>
            <span className="mono-label">{t("mascot.allDone")}</span>
            <h1 className={styles.title}>{t("mascot.keepGoing")}</h1>
          </>
        )}
        <dl className={styles.stats}>
          <div className={styles.statRow}>
            <dt className={styles.statLabel}>WPM</dt>
            <dd className={styles.statValue}>{wpm.toFixed(1)}</dd>
          </div>
          <div className={styles.statRow}>
            <dt className={styles.statLabel}>Acc</dt>
            <dd className={styles.statValue}>{accuracyPct}%</dd>
          </div>
        </dl>
        <div className={styles.actions}>
          <Link href="/speed-test" className={styles.primary}>
            {t("common.tryAgain")}
          </Link>
          <Link href="/" className={styles.secondary}>
            {t("nav.home")}
          </Link>
        </div>
      </section>
    </main>
  );
}