// Typify · typing engine
// Pure functions over typing state. No React, no DOM — easy to test.
// Handles:
//   - Latin-track input (id, en): direct character-by-character comparison.
//   - Romaji-track input (ja): basic IME composition over a 50-kana set.
//     Each typed romaji sequence maps to one kana. Digraphs (kya, sha) are
//     deferred to a later phase.

import type { LessonPhrase, LessonPhraseLatin, LessonPhraseRomaji } from "@/content/lessons/types";
import type { CultureCode } from "@/types/localStorage";

// -----------------------------------------------------------------------------
// Romaji → kana map (no digraphs, no dakuten — Phase 4 baseline).
// -----------------------------------------------------------------------------

export const ROMAJI_TABLE: Record<string, string> = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  sa: "さ", shi: "し", su: "す", se: "せ", so: "そ",
  ta: "た", chi: "ち", tsu: "つ", te: "て", to: "と",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", fu: "ふ", he: "へ", ho: "ほ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を", n: "ん",
  // punctuation (kept here so the IME handles them too)
  ".": "。", ",": "、", "!": "！", "?": "？", " ": " ",
};

function romajiPrefixes(): string[] {
  const keys = Object.keys(ROMAJI_TABLE);
  keys.sort((a, b) => b.length - a.length);
  return keys;
}

const ROMAJI_PREFIXES = romajiPrefixes();

function commitRomaji(buffer: string): { kana: string; remaining: string } | null {
  for (const key of ROMAJI_PREFIXES) {
    if (key === " " || key === "." || key === "," || key === "!" || key === "?") continue;
    if (buffer.startsWith(key)) {
      return { kana: ROMAJI_TABLE[key], remaining: buffer.slice(key.length) };
    }
  }
  return null;
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export interface TypingStats {
  totalKeystrokes: number;
  correctKeystrokes: number;
  mistakes: number;
  wpm: number;
  accuracy: number;
  elapsedSec: number;
}

export function isLatinPhrase(p: LessonPhrase): p is LessonPhraseLatin {
  return typeof (p as LessonPhraseLatin).text === "string";
}

export function targetForPhrase(p: LessonPhrase, culture: CultureCode): string {
  if (culture === "ja" && !isLatinPhrase(p)) {
    const r = p as LessonPhraseRomaji;
    return r.display;
  }
  return (p as LessonPhraseLatin).text;
}

export function inputLengthForPhrase(p: LessonPhrase, culture: CultureCode): number {
  if (culture === "ja" && !isLatinPhrase(p)) {
    return (p as LessonPhraseRomaji).input.length;
  }
  return (p as LessonPhraseLatin).text.length;
}

export function computeStats(
  totalKeystrokes: number,
  correctKeystrokes: number,
  elapsedSec: number,
): TypingStats {
  const safeElapsed = Math.max(elapsedSec, 1);
  const minutes = safeElapsed / 60;
  const wpm = minutes > 0 ? correctKeystrokes / 5 / minutes : 0;
  const accuracy = totalKeystrokes > 0 ? correctKeystrokes / totalKeystrokes : 1;
  return {
    totalKeystrokes,
    correctKeystrokes,
    mistakes: totalKeystrokes - correctKeystrokes,
    wpm: Math.round(wpm * 10) / 10,
    accuracy: Math.max(0, Math.min(1, accuracy)),
    elapsedSec: safeElapsed,
  };
}

// -----------------------------------------------------------------------------
// Latin engine
// -----------------------------------------------------------------------------

export interface LatinEval {
  matched: number;          // characters advanced
  isCorrect: boolean;       // whether this keystroke was correct
  nextTarget: string;       // the new target cursor (next expected character)
}

export function evaluateLatinKeystroke(
  target: string,
  cursor: number,
  key: string,
): LatinEval {
  const expected = target[cursor] ?? "";
  if (expected === "") {
    return { matched: 0, isCorrect: false, nextTarget: "" };
  }
  if (key === expected) {
    return { matched: 1, isCorrect: true, nextTarget: target.slice(cursor + 1) };
  }
  return { matched: 0, isCorrect: false, nextTarget: target.slice(cursor) };
}

// -----------------------------------------------------------------------------
// Romaji engine
// -----------------------------------------------------------------------------

export interface RomajiState {
  pending: string;        // romaji typed but not yet committed to a kana
  committed: string;       // kana already produced
}

export function createRomajiState(): RomajiState {
  return { pending: "", committed: "" };
}

export interface RomajiEval {
  isCorrect: boolean;
  committedKana: string;   // the kana that was committed by this keystroke, if any
  state: RomajiState;
}

export function evaluateRomajiKeystroke(state: RomajiState, key: string): RomajiEval {
  // backspace: pop last romaji from buffer (and last kana if pending is empty)
  if (key === "Backspace") {
    if (state.pending.length > 0) {
      return {
        isCorrect: true,
        committedKana: "",
        state: { ...state, pending: state.pending.slice(0, -1) },
      };
    }
    return {
      isCorrect: true,
      committedKana: "",
      state: { ...state, committed: state.committed.slice(0, -1) },
    };
  }
  // ignore modifier keys and unknown chars
  if (key.length !== 1) return { isCorrect: true, committedKana: "", state };
  const lower = key.toLowerCase();
  const nextBuffer = state.pending + lower;
  // try longest match first
  const commit = commitRomaji(nextBuffer);
  if (commit) {
    return {
      isCorrect: true,
      committedKana: commit.kana,
      state: { pending: commit.remaining, committed: state.committed + commit.kana },
    };
  }
  // punctuation handling
  if (ROMAJI_TABLE[lower]) {
    return {
      isCorrect: true,
      committedKana: ROMAJI_TABLE[lower],
      state: { pending: "", committed: state.committed + ROMAJI_TABLE[lower] },
    };
  }
  // buffer exceeded max romaji length without a commit → invalid keystroke
  if (nextBuffer.length >= 4) {
    return { isCorrect: false, committedKana: "", state };
  }
  // partial commit candidate — keep the buffer
  return { isCorrect: true, committedKana: "", state: { ...state, pending: nextBuffer } };
}

// -----------------------------------------------------------------------------
// Helpers used by the lesson runner
// -----------------------------------------------------------------------------

export function nextExpectedCharacter(target: string, cursor: number): string {
  return target[cursor] ?? "";
}

export function isPhraseComplete(target: string, cursor: number): boolean {
  return cursor >= target.length;
}