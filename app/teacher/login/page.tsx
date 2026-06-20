"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import styles from "./auth.module.css";

export default function TeacherLoginPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <Link href="/" className={styles.backLink}>
          ← {t("common.back")}
        </Link>
        <span className="mono-label">{t("teacher.signIn")}</span>
        <h1 className={styles.title}>{t("teacher.loginPrompt")}</h1>

        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const email = (form.elements.namedItem("email") as HTMLInputElement).value;
            const password = (form.elements.namedItem("password") as HTMLInputElement).value;
            const errorEl = form.querySelector(`.${styles.error}`) as HTMLElement;
            errorEl.textContent = "";
            const res = await fetch("/api/teacher/login", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
              errorEl.textContent = t("common.error");
              return;
            }
            router.push("/teacher/dashboard");
          }}
        >
          <label className={styles.field}>
            <span className={styles.label}>{t("teacher.email")}</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{t("teacher.password")}</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              className={styles.input}
            />
          </label>
          <p className={styles.error} role="alert" />
          <button type="submit" className={styles.submit}>
            {t("teacher.signIn")}
          </button>
        </form>

        <p className={styles.altPrompt}>
          <Link href="/teacher/signup">{t("teacher.signup")}</Link>
        </p>
      </section>
    </main>
  );
}