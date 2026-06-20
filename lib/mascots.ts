import type { MascotKey } from "@/types/localStorage";

export interface MascotDescriptor {
  key: MascotKey;
  name: string;
  file: string;
  alt: string;
}

export const MASCOT_LIBRARY: readonly MascotDescriptor[] = [
  { key: "cat", name: "Mochi", file: "/mascots/cat.svg", alt: "A friendly yellow cat" },
  { key: "owl", name: "Hoot", file: "/mascots/owl.svg", alt: "A round tawny owl" },
  { key: "panda", name: "Pipa", file: "/mascots/panda.svg", alt: "A round black-and-white panda" },
  { key: "dragon", name: "Api", file: "/mascots/dragon.svg", alt: "A small green dragon" },
  { key: "fox", name: "Ren", file: "/mascots/fox.svg", alt: "An orange fox" },
  { key: "rabbit", name: "Usa", file: "/mascots/rabbit.svg", alt: "A cream-coloured rabbit with long ears" },
  { key: "koala", name: "Euc", file: "/mascots/koala.svg", alt: "A grey koala" },
  { key: "penguin", name: "Pingo", file: "/mascots/penguin.svg", alt: "A small penguin" },
] as const;

export function findMascot(key: MascotKey): MascotDescriptor {
  const match = MASCOT_LIBRARY.find((m) => m.key === key);
  if (!match) {
    throw new Error(`Unknown mascot key: ${key}`);
  }
  return match;
}