"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { SpeedTest } from "@/components/games/SpeedTest";

import styles from "./speed-test-page.module.css";

export default function SpeedTestPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <main className={styles.shell}>
      <button
        type="button"
        className={styles.exitBtn}
        onClick={() => router.push("/")}
      >
        ← {t("common.back")}
      </button>
      <SpeedTest showHeader finishHref="/speed-test/done" />
    </main>
  );
}