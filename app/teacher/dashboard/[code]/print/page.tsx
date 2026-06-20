"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { findMascot } from "@/lib/mascots";
import { useClassroomDetail } from "@/lib/dashboard";
import { AccuracyBars, WpmTrendChart } from "@/components/charts/Charts";

import styles from "./print.module.css";

export default function PrintSummaryPage() {
  const params = useParams<{ code: string }>();
  const { t } = useTranslation();
  const { data, loading } = useClassroomDetail(params.code, 0);

  if (loading || !data) {
    return (
      <main className={styles.shell}>
        <p>{t("common.loading")}</p>
      </main>
    );
  }

  const { classroom, students } = data;
  const avg = (sel: (s: (typeof students)[number]) => number | null): string => {
    if (students.length === 0) return "—";
    const vals = students.map(sel).filter((v): v is number => v !== null);
    if (vals.length === 0) return "—";
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <span className="mono-label">{classroom.code}</span>
          <h1 className={styles.title}>{classroom.name}</h1>
          <p className={styles.sub}>{t("teacher.exportSummary")}</p>
        </div>
        <button type="button" className={styles.printBtn} onClick={() => window.print()}>
          {t("teacher.exportSummary")}
        </button>
      </header>

      <section className={styles.statRow}>
        <Stat label="Students" value={String(students.length)} />
        <Stat label="Avg accuracy" value={`${Math.round(parseFloat(avg((s) => s.avgAccuracy)) * 100)}%`} />
        <Stat label="Avg WPM" value={avg((s) => s.avgWpm)} />
        <Stat label="Best speed" value={avg((s) => s.bestSpeedWpm)} />
      </section>

      <section className={styles.studentsSection}>
        <h2 className={styles.sectionTitle}>{t("nav.lessons")}</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nickname</th>
              <th>Lessons</th>
              <th>Avg WPM</th>
              <th>Avg accuracy</th>
              <th>Best speed</th>
              <th>Time spent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>
                  <span className={styles.studentCell}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={findMascot(s.mascot as never).file} alt="" width={28} height={28} />
                    <span>{s.nickname}</span>
                  </span>
                </td>
                <td className={styles.numCell}>{s.lessonsCompleted}</td>
                <td className={styles.numCell}>{s.avgWpm !== null ? s.avgWpm.toFixed(1) : "—"}</td>
                <td className={styles.numCell}>
                  {s.avgAccuracy !== null ? `${Math.round(s.avgAccuracy * 100)}%` : "—"}
                </td>
                <td className={styles.numCell}>{s.bestSpeedWpm !== null ? s.bestSpeedWpm.toFixed(1) : "—"}</td>
                <td className={styles.numCell}>{Math.round(s.totalTimeSec / 60)} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.aggregateSection}>
        <h2 className={styles.sectionTitle}>Class totals</h2>
        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <span className={styles.chartLabel}>WPM trend</span>
            <WpmTrendChart
              values={students
                .flatMap((s) => s.lastSeenAt ? [{ date: s.lastSeenAt, wpm: s.bestSpeedWpm ?? 0 }] : [])
                .sort((a, b) => a.date.localeCompare(b.date))}
            />
          </div>
          <div className={styles.chartCard}>
            <span className={styles.chartLabel}>Accuracy distribution</span>
            <AccuracyBars
              values={students
                .filter((s) => s.avgAccuracy !== null)
                .map((s) => ({ date: s.nickname, accuracy: s.avgAccuracy ?? 0 }))}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}