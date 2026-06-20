import type { LessonDefinition } from "./types";

import homeRow from "./home-row.json";
import topRow from "./top-row.json";
import bottomRow from "./bottom-row.json";
import allLetters from "./all-letters.json";
import shortSentences from "./short-sentences.json";
import numbers from "./numbers.json";
import shiftSymbols from "./shift-symbols.json";

export const LESSONS: readonly LessonDefinition[] = [
  homeRow,
  topRow,
  bottomRow,
  allLetters,
  shortSentences,
  numbers,
  shiftSymbols,
].sort((a, b) => a.order - b.order) as readonly LessonDefinition[];

export type { LessonDefinition, LessonPhrase, LessonPhraseLatin, LessonPhraseRomaji, LessonTrack } from "./types";

export function findLesson(id: string): LessonDefinition | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function lessonTrack(lesson: LessonDefinition, culture: "id" | "en" | "ja"): readonly (LessonDefinition["tracks"][keyof LessonDefinition["tracks"]])[number][] {
  return lesson.tracks[culture];
}