// Typify · cultural word bank
// Each culture has 12 words used by the mini-games.
// `display` is the word as written in its native script.
// `translations` provides the same meaning in each of the 3 UI languages
// so a kid can match the cultural word to their own language.
//
// Cultures ship here as TS modules so adding a fourth culture means
// adding one file + registering it in the index. No DB migration.

import type { CultureCode, UILanguage } from "@/types/localStorage";

export interface CultureWord {
  id: string;
  emoji: string; // single emoji stands in for an illustration in v1
  display: string;
  translations: Record<UILanguage, string>;
}

export interface CultureBank {
  code: CultureCode;
  flag: string;
  fact: Record<UILanguage, string>;
  words: CultureWord[];
}

const idBank: CultureBank = {
  code: "id",
  flag: "🇮🇩",
  fact: {
    en: "Indonesia is made up of more than 17,000 islands. It is the largest archipelago in the world.",
    id: "Indonesia terdiri dari lebih dari 17.000 pulau. Ini adalah kepulauan terbesar di dunia.",
    ja: "インドネシアは 17,000 以上の 島で できているんだ。せかいで いちばん おおきな しまぐに。",
  },
  words: [
    { id: "nasi", emoji: "🍚", display: "nasi", translations: { en: "rice", id: "nasi", ja: "ごはん" } },
    { id: "rumah", emoji: "🏠", display: "rumah", translations: { en: "house", id: "rumah", ja: "いえ" } },
    { id: "kucing", emoji: "🐱", display: "kucing", translations: { en: "cat", id: "kucing", ja: "ねこ" } },
    { id: "batik", emoji: "👕", display: "batik", translations: { en: "fabric art", id: "batik", ja: "バティック" } },
    { id: "kopi", emoji: "☕", display: "kopi", translations: { en: "coffee", id: "kopi", ja: "コーヒー" } },
    { id: "ikan", emoji: "🐟", display: "ikan", translations: { en: "fish", id: "ikan", ja: "さかな" } },
    { id: "gunung", emoji: "⛰️", display: "gunung", translations: { en: "mountain", id: "gunung", ja: "やま" } },
    { id: "pantai", emoji: "🏖️", display: "pantai", translations: { en: "beach", id: "pantai", ja: "うみ" } },
    { id: "angklung", emoji: "🎵", display: "angklung", translations: { en: "bamboo instrument", id: "angklung", ja: "アンクリュン" } },
    { id: "wayang", emoji: "🎭", display: "wayang", translations: { en: "puppet", id: "wayang", ja: "ワヤン" } },
    { id: "sambal", emoji: "🌶️", display: "sambal", translations: { en: "chilli paste", id: "sambal", ja: "サンバル" } },
    { id: "tari", emoji: "💃", display: "tari", translations: { en: "dance", id: "tari", ja: "ダンス" } },
  ],
};

const jaBank: CultureBank = {
  code: "ja",
  flag: "🇯🇵",
  fact: {
    en: "Japan has more than 6,800 islands, and Mt. Fuji last erupted in 1707.",
    id: "Jepang punya lebih dari 6.800 pulau, dan Gunung Fuji terakhir meletus pada 1707.",
    ja: "にほんは 6,800 こ以上の しまから できていて、ふじさんは 1707ねんに さいごに ふんかしたよ。",
  },
  words: [
    { id: "neko", emoji: "🐱", display: "ねこ", translations: { en: "cat", id: "kucing", ja: "ねこ" } },
    { id: "sushi", emoji: "🍣", display: "すし", translations: { en: "sushi", id: "sushi", ja: "すし" } },
    { id: "kimono", emoji: "👘", display: "きもの", translations: { en: "kimono", id: "kimono", ja: "きもの" } },
    { id: "mizu", emoji: "💧", display: "みず", translations: { en: "water", id: "air", ja: "みず" } },
    { id: "sakura", emoji: "🌸", display: "さくら", translations: { en: "cherry blossom", id: "sakura", ja: "さくら" } },
    { id: "fuji", emoji: "🗻", display: "ふじ", translations: { en: "Mt. Fuji", id: "Gunung Fuji", ja: "ふじさん" } },
    { id: "hashi", emoji: "🍣", display: "はし", translations: { en: "chopsticks", id: "sumpit", ja: "はし" } },
    { id: "koinobori", emoji: "🎏", display: "こいのぼり", translations: { en: "carp streamer", id: "koinobori", ja: "こいのぼり" } },
    { id: "matcha", emoji: "🍵", display: "まっちゃ", translations: { en: "matcha", id: "matcha", ja: "まっちゃ" } },
    { id: "ramen", emoji: "🍜", display: "ラーメン", translations: { en: "ramen", id: "ramen", ja: "ラーメン" } },
    { id: "torii", emoji: "⛩️", display: "とりい", translations: { en: "shrine gate", id: "torii", ja: "とりい" } },
    { id: "koto", emoji: "🎼", display: "こと", translations: { en: "string instrument", id: "koto", ja: "こと" } },
  ],
};

const enBank: CultureBank = {
  code: "en",
  flag: "🇬🇧",
  fact: {
    en: "Big Ben is the nickname for the bell inside the Elizabeth Tower in London. The tower leans slightly to the north-west.",
    id: "Big Ben adalah julukan untuk lonceng di Menara Elizabeth, London. Menaranya miring sedikit ke arah barat laut.",
    ja: "ビッグベンは ロンドンの エリザベスとうのなかのかね。とうは すこし ほくせい に かたむいているよ。",
  },
  words: [
    { id: "tea", emoji: "🍵", display: "tea", translations: { en: "tea", id: "teh", ja: "おちゃ" } },
    { id: "bus", emoji: "🚌", display: "bus", translations: { en: "bus", id: "bus", ja: "バス" } },
    { id: "rain", emoji: "🌧️", display: "rain", translations: { en: "rain", id: "hujan", ja: "あめ" } },
    { id: "king", emoji: "👑", display: "king", translations: { en: "king", id: "raja", ja: "おうさま" } },
    { id: "flag", emoji: "🚩", display: "flag", translations: { en: "flag", id: "bendera", ja: "はた" } },
    { id: "tea-time", emoji: "🥪", display: "tea time", translations: { en: "afternoon snack", id: "waktu minum teh", ja: "おやつのじかん" } },
    { id: "post", emoji: "📮", display: "post box", translations: { en: "mailbox", id: "kotak pos", ja: "ポスト" } },
    { id: "pub", emoji: "🍺", display: "pub", translations: { en: "pub", id: "kedai minum", ja: "パブ" } },
    { id: "bridge", emoji: "🌉", display: "bridge", translations: { en: "bridge", id: "jembatan", ja: "はし" } },
    { id: "fox", emoji: "🦊", display: "fox", translations: { en: "fox", id: "rubah", ja: "きつね" } },
    { id: "bell", emoji: "🔔", display: "bell", translations: { en: "bell", id: "lonceng", ja: "かね" } },
    { id: "umbrella", emoji: "☂️", display: "umbrella", translations: { en: "umbrella", id: "payung", ja: "かさ" } },
  ],
};

export const CULTURE_BANKS: Record<CultureCode, CultureBank> = {
  id: idBank,
  ja: jaBank,
  en: enBank,
};

export function getCultureBank(code: CultureCode): CultureBank {
  return CULTURE_BANKS[code];
}

export function translateWord(
  word: CultureWord,
  to: UILanguage,
): string {
  return word.translations[to] ?? word.display;
}