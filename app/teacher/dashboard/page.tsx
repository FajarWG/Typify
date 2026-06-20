"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useClassrooms, createClassroom, type ClassroomSummary } from "@/lib/dashboard";

import styles from "./dashboard.module.css";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data, error, loading, refresh } = useClassrooms();

  if (loading) {
    return (
      <main className={styles.shell}>
        <p>{t("common.loading")}</p>
      </main>
    );
  }
  if (error) {
    return (
      <main className={styles.shell}>
        <p className={styles.errorMsg}>{error}</p>
        <Link href="/teacher/login">{t("teacher.signIn")}</Link>
      </main>
    );
  }

  const classrooms = data ?? [];

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← {t("common.back")}
        </Link>
        <span className="mono-label">{t("teacher.dashboard")}</span>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={async () => {
            await fetch("/api/teacher/logout", { method: "POST" });
            router.push("/teacher/login");
          }}
        >
          {t("teacher.logout")}
        </button>
      </header>

      <section className={styles.createRow}>
        <h1 className={styles.title}>{t("teacher.dashboard")}</h1>
        <form
          className={styles.createForm}
          onSubmit={async (e) => {
            e.preventDefault();
            const input = (e.currentTarget.elements.namedItem("name") as HTMLInputElement);
            const name = input.value.trim();
            if (!name) return;
            const created = await createClassroom(name);
            if (created) {
              input.value = "";
              void refresh();
            }
          }}
        >
          <input
            name="name"
            type="text"
            placeholder={t("teacher.createClass")}
            minLength={2}
            maxLength={60}
            required
            className={styles.createInput}
          />
          <button type="submit" className={styles.createBtn}>
            + {t("teacher.createClass")}
          </button>
        </form>
      </section>

      {classrooms.length === 0 ? (
        <p className={styles.empty}>{t("teacher.noClasses")}</p>
      ) : (
        <ul className={styles.list}>
          {classrooms.map((c) => (
            <ClassroomRow key={c.id} classroom={c} />
          ))}
        </ul>
      )}
    </main>
  );
}

function ClassroomRow({ classroom }: { classroom: ClassroomSummary }) {
  const { t } = useTranslation();
  return (
    <li className={styles.item}>
      <Link href={`/teacher/dashboard/${classroom.code}`} className={styles.card}>
        <div className={styles.cardHead}>
          <span className={styles.code}>{classroom.code}</span>
          <span className={styles.count}>{classroom.studentCount} kids</span>
        </div>
        <h2 className={styles.cardTitle}>{classroom.name}</h2>
        <span className={styles.cardCta}>
          {t("teacher.dashboard")} →
        </span>
      </Link>
    </li>
  );
}