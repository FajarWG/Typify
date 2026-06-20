"use client";

import { useParams } from "next/navigation";

import { LessonRunner } from "@/components/typing/LessonRunner";

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  return <LessonRunner lessonId={params.lessonId} />;
}