"use client";

import { useCallback, useEffect, useState } from "react";

export interface ClassroomSummary {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  studentCount: number;
}

export interface ClassroomStudentSummary {
  id: string;
  nickname: string;
  mascot: string;
  level: number;
  xp: number;
  uiLanguage: string;
  homeCulture: string;
  lastSeenAt: string;
  lessonsCompleted: number;
  speedTests: number;
  avgAccuracy: number | null;
  avgWpm: number | null;
  totalTimeSec: number;
  bestSpeedWpm: number | null;
}

export interface ClassroomDetail {
  classroom: { id: string; code: string; name: string; createdAt: string };
  students: ClassroomStudentSummary[];
}

export interface StudentProgressLog {
  id: string;
  lessonId: string;
  cultureId: string;
  wpm: number;
  accuracy: number;
  timeSpentSec: number;
  completedAt: string;
}

export interface StudentSpeedSession {
  id: string;
  wpm: number;
  accuracy: number;
  durationSec: number;
  completedAt: string;
}

export interface StudentDetail {
  id: string;
  nickname: string;
  mascot: string;
  level: number;
  xp: number;
  uiLanguage: string;
  homeCulture: string;
  createdAt: string;
  lastSeenAt: string;
  progressLogs: StudentProgressLog[];
  speedSessions: StudentSpeedSession[];
}

// -----------------------------------------------------------------------------
// A small data-fetching hook that satisfies react-hooks/set-state-in-effect.
// The trick: state transitions only happen inside async callbacks (fetch
// resolution, setInterval tick), never synchronously inside the effect body.
// Initial state is "loading" so the first render shows a spinner without any
// state mutation.
// -----------------------------------------------------------------------------

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

function useAsyncFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  pollMs = 0,
): AsyncState<T> & { refresh: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: true });
  const fetcherRef = useRef(fetcher);
  const keyRef = useRef(key);

  useEffect(() => {
    fetcherRef.current = fetcher;
    keyRef.current = key;
  });

  const run = useCallback(async () => {
    try {
      const data = await fetcherRef.current();
      if (keyRef.current !== key) return;
      setState({ data, error: null, loading: false });
    } catch {
      if (keyRef.current !== key) return;
      setState((s) => ({ ...s, error: "Network error", loading: false }));
    }
  }, [key]);

  useEffect(() => {
    void run();
    if (pollMs > 0) {
      const id = window.setInterval(() => {
        void run();
      }, pollMs);
      return () => window.clearInterval(id);
    }
    return undefined;
  }, [key, pollMs, run]);

  return { ...state, refresh: run };
}

import { useRef } from "react";

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export function useClassrooms() {
  const key = "classrooms";
  const { data, error, loading, refresh } = useAsyncFetch<{
    classrooms: ClassroomSummary[] | null;
  }>(
    key,
    async () => {
      const res = await fetch("/api/teacher/classrooms");
      if (!res.ok) throw new Error("Could not load classes");
      const json = (await res.json()) as { classrooms: ClassroomSummary[] };
      return { classrooms: json.classrooms };
    },
    0,
  );
  return {
    data: data?.classrooms ?? null,
    error,
    loading,
    refresh,
  };
}

export function useClassroomDetail(code: string, pollMs = 5000) {
  const key = `class/${code}`;
  const { data, error, loading, refresh } = useAsyncFetch<ClassroomDetail>(
    key,
    async () => {
      const res = await fetch(`/api/teacher/classrooms/${encodeURIComponent(code)}`);
      if (!res.ok) throw new Error("Could not load class");
      return (await res.json()) as ClassroomDetail;
    },
    pollMs,
  );
  return { data, error, loading, refresh };
}

export function useStudentDetail(code: string, studentId: string | null) {
  const key = studentId ? `student/${code}/${studentId}` : "student/none";
  const { data, error, loading, refresh } = useAsyncFetch<StudentDetail>(
    key,
    async () => {
      if (!studentId) throw new Error("No student");
      const res = await fetch(
        `/api/teacher/classrooms/${encodeURIComponent(code)}/students/${encodeURIComponent(studentId)}`,
      );
      if (!res.ok) throw new Error("Could not load student");
      const json = (await res.json()) as { student: StudentDetail };
      return json.student;
    },
    0,
  );
  if (!studentId) {
    return { data: null, error: null, loading: false, refresh };
  }
  return { data, error, loading, refresh };
}

export async function createClassroom(name: string): Promise<ClassroomSummary | null> {
  const res = await fetch("/api/teacher/classrooms", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { classroom: { id: string; code: string; name: string; createdAt: string } };
  return { ...json.classroom, studentCount: 0 };
}