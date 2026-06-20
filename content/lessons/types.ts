// Typify · content shape (the contract every lesson file follows).
// Lesson files live in /content/lessons/<id>.json. Phrases are organized
// per culture track. The Japanese track uses romaji→kana pairs; Latin
// tracks use plain strings.

import type { CultureCode } from "@/types/localStorage";

export interface LessonPhraseLatin {
  text: string;
}

export interface LessonPhraseRomaji {
  display: string;
  input: string;
}

export type LessonPhrase = LessonPhraseLatin | LessonPhraseRomaji;

export type LessonTrack = {
  id: LessonPhrase[];
  en: LessonPhrase[];
  ja: LessonPhraseRomaji[];
};

export interface LessonDefinition {
  id: string;
  order: number;
  titleKey:
    | "lessons.homeRow"
    | "lessons.topRow"
    | "lessons.bottomRow"
    | "lessons.allLetters"
    | "lessons.shortSentences"
    | "lessons.numbers"
    | "lessons.shiftSymbols"
    | "lessons.specialCharacters";
  keySet: string[];
  tracks: LessonTrack;
}

export function isRomajiPhrase(p: LessonPhrase): p is LessonPhraseRomaji {
  return typeof (p as LessonPhraseRomaji).input === "string";
}

export function phraseToString(p: LessonPhrase, culture: CultureCode): string {
  if (culture === "ja" && isRomajiPhrase(p)) return p.display;
  return (p as LessonPhraseLatin).text;
}

export function phraseInputLength(p: LessonPhrase, culture: CultureCode): number {
  if (culture === "ja" && isRomajiPhrase(p)) return p.input.length;
  return (p as LessonPhraseLatin).text.length;
}