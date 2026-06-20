"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { findMascot } from "@/lib/mascots";
import {
  useClassroomDetail,
  useStudentDetail,
} from "@/lib/dashboard";
import { AccuracyBars, WpmTrendChart } from "@/components/charts/Charts";

import styles from "./class-detail.module.css";

export default function ClassDetailPage() {
  const params = useParams<{ code: string }>();
  const code = params.code;
  const { t } = useTranslation();
  const { data, error, loading } = useClassroomDetail(code);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  if (loading) {
    return (
      <main className={styles.shell}>
        <p>{t("common.loading")}</p>
      </main>
    );
  }
  if (error || !data) {
    return (
      <main className={styles.shell}>
        <p className={styles.errorMsg}>{error ?? "Not found"}</p>
        <Link href="/teacher/dashboard">{t("teacher.dashboard")}</Link>
      </main>
    );
  }

  const { classroom, students } = data;

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/teacher/dashboard" className={styles.backLink}>
          ← {t("common.back")}
        </Link>
        <span className="mono-label">{classroom.code}</span>
        <Link
          href={`/teacher/dashboard/${classroom.code}/print`}
          className={styles.exportLink}
          target="_blank"
        >
          {t("teacher.exportSummary")} ↗
        </Link>
      </header>

      <h1 className={styles.title}>{classroom.name}</h1>

      <section className={styles.summary}>
        <SummaryStat label="Students" value={String(students.length)} />
        <SummaryStat
          label="Avg accuracy"
          value={
            students.length === 0
              ? "—"
              : `${Math.round(
                  (students.reduce((s, x) => s + (x.avgAccuracy ?? 0), 0) / students.length) * 100,
                )}%`
          }
        />
        <SummaryStat
          label="Avg WPM"
          value={
            students.length === 0
              ? "—"
              : (students.reduce((s, x) => s + (x.avgWpm ?? 0), 0) / students.length).toFixed(1)
          }
        />
      </section>

      <section className={styles.tableWrap}>
        <h2 className={styles.sectionTitle}>{t("nav.lessons")}</h2>
        {students.length === 0 ? (
          <p className={styles.empty}>{t("teacher.noStudents")}</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nickname</th>
                <th>Lessons</th>
                <th>Avg WPM</th>
                <th>Avg acc</th>
                <th>Best speed</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className={s.id === selectedStudent ? styles.rowSelected : ""}
                  onClick={() => setSelectedStudent(s.id)}
                >
                  <td>
                    <span className={styles.studentCell}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={findMascot(s.mascot as never).file} alt="" width={24} height={24} />
                      <span>{s.nickname}</span>
                    </span>
                  </td>
                  <td className={styles.numCell}>{s.lessonsCompleted}</td>
                  <td className={styles.numCell}>{s.avgWpm !== null ? s.avgWpm.toFixed(1) : "—"}</td>
                  <td className={styles.numCell}>
                    {s.avgAccuracy !== null ? `${Math.round(s.avgAccuracy * 100)}%` : "—"}
                  </td>
                  <td className={styles.numCell}>{s.bestSpeedWpm !== null ? s.bestSpeedWpm.toFixed(1) : "—"}</td>
                  <td className={styles.dimCell}>{timeAgo(s.lastSeenAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selectedStudent && <StudentDetailPanel code={code} studentId={selectedStudent} />}
    </main>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

function StudentDetailPanel({ code, studentId }: { code: string; studentId: string }) {
  const { data, loading } = useStudentDetail(code, studentId);
  if (loading) return <p className={styles.loading}>…</p>;
  if (!data) return null;

  const trend = data.progressLogs.map((l) => ({ date: l.completedAt, wpm: l.wpm }));
  const accuracyByDay = data.progressLogs.map((l) => ({ date: l.completedAt, accuracy: l.accuracy }));

  return (
    <section className={styles.detailPanel}>
      <h2 className={styles.sectionTitle}>{data.nickname}</h2>
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <span className={styles.chartLabel}>WPM over time</span>
          <WpmTrendChart values={trend} />
        </div>
        <div className={styles.chartCard}>
          <span className={styles.chartLabel}>Accuracy per lesson</span>
          <AccuracyBars values={accuracyByDay} />
        </div>
      </div>
      <p className={styles.dimText}>
        Level {data.level} · {data.xp} XP · culture {data.homeCulture} · ui {data.uiLanguage}
      </p>
    </section>
  );
}

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - t);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  return `${day}d`;
}