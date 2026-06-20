"use client";

import styles from "./Keyboard.module.css";

const ROWS: { keys: { primary: string; shift: string }[]; offset?: string }[] = [
  { keys: [
    { primary: "1", shift: "!" },
    { primary: "2", shift: "@" },
    { primary: "3", shift: "#" },
    { primary: "4", shift: "$" },
    { primary: "5", shift: "%" },
    { primary: "6", shift: "^" },
    { primary: "7", shift: "&" },
    { primary: "8", shift: "*" },
    { primary: "9", shift: "(" },
    { primary: "0", shift: ")" },
  ]},
  { keys: [
    { primary: "q", shift: "Q" },
    { primary: "w", shift: "W" },
    { primary: "e", shift: "E" },
    { primary: "r", shift: "R" },
    { primary: "t", shift: "T" },
    { primary: "y", shift: "Y" },
    { primary: "u", shift: "U" },
    { primary: "i", shift: "I" },
    { primary: "o", shift: "O" },
    { primary: "p", shift: "P" },
  ]},
  { keys: [
    { primary: "a", shift: "A" },
    { primary: "s", shift: "S" },
    { primary: "d", shift: "D" },
    { primary: "f", shift: "F" },
    { primary: "g", shift: "G" },
    { primary: "h", shift: "H" },
    { primary: "j", shift: "J" },
    { primary: "k", shift: "K" },
    { primary: "l", shift: "L" },
    { primary: ";", shift: ":" },
  ], offset: "0.5rem"},
  { keys: [
    { primary: "z", shift: "Z" },
    { primary: "x", shift: "X" },
    { primary: "c", shift: "C" },
    { primary: "v", shift: "V" },
    { primary: "b", shift: "B" },
    { primary: "n", shift: "N" },
    { primary: "m", shift: "M" },
    { primary: ",", shift: "<" },
    { primary: ".", shift: ">" },
    { primary: "/", shift: "?" },
  ], offset: "1rem"},
];

interface KeyboardProps {
  nextKey: string | null;
  shiftActive?: boolean;
  spaceHighlighted?: boolean;
}

function matchesNext(expected: string, candidate: { primary: string; shift: string }): boolean {
  if (expected === candidate.primary) return true;
  if (expected === candidate.shift) return true;
  return false;
}

export function Keyboard({ nextKey, shiftActive = false, spaceHighlighted = false }: KeyboardProps) {
  return (
    <div className={styles.keyboard} aria-hidden>
      {ROWS.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={styles.row}
          style={row.offset ? { marginLeft: row.offset } : undefined}
        >
          {row.keys.map((k) => {
            const isActive = nextKey !== null && matchesNext(nextKey, k);
            const label = shiftActive ? k.shift : k.primary;
            return (
              <span
                key={k.primary}
                className={[
                  styles.key,
                  isActive ? styles.keyActive : "",
                  shiftActive && k.shift !== k.primary.toUpperCase() ? styles.keyShift : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {label}
              </span>
            );
          })}
        </div>
      ))}
      <div className={styles.spaceRow}>
        <span
          className={[
            styles.spaceKey,
            spaceHighlighted ? styles.spaceKeyActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          space
        </span>
      </div>
    </div>
  );
}