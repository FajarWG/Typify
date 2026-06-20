# Typify

> A playful cultural touch-typing adventure for students worldwide (ages 7–18).

Typify teaches 10-finger typing through bite-sized lessons and mini-games built around cultural vocabulary from Indonesia, Japan, and the Anglosphere. The typing drill is the side effect; the cultural story — a country's food, clothing, places, traditions — is the reason kids come back.

Students stay anonymous (no email, no password). When a teacher issues a class code, the kid's progress flows into a teacher dashboard with real-time charts and a printable summary. Everything else lives offline-first in `localStorage` and only syncs when a classroom is connected.

---

## Highlights

- **Offline-first student experience** — full lesson runner + 3 mini-games + speed test work without network; a background queue syncs to the server when online and a class code is set.
- **Three languages, two keyboards** — UI ships in English, Bahasa Indonesia, and 日本語; typing supports QWERTY and a 50-kana Romaji IME with live composition.
- **Three cultures, room to grow** — adding Germany or Brazil = drop one JSON file in `content/cultures/` and one per-lesson JSON in `content/lessons/`. No schema changes.
- **Teacher dashboard** — argon2id + JWT auth, classroom CRUD, real-time per-student progress, hand-built SVG charts (no chart library), printable PDF summary via the browser print dialog.
- **Accessibility baked in** — skip-to-main-content link, global focus rings, `aria-live` regions, `prefers-reduced-motion` honoured in 18+ CSS files, dyslexia-friendly font toggle, high-contrast theme, keyboard-only onboarding.
- **XP, levels, accessories, stickers** — 6 accessories unlocked by level, 14 stickers unlocked by achievements; rewards fire a coral star-burst celebration (Hum signature move #7).

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router) + React 19 + TypeScript strict | Server components for auth + dashboards, client components for the typing surfaces |
| Styling | **CSS Modules + design tokens** | Tokens live in `tokens.css`; Hum theme uses OKLCH palettes with multi-accent support |
| Typography | **Plus Jakarta Sans** + JetBrains Mono + OpenDyslexic (opt-in) | All self-hosted via `next/font/google` + `@fontsource/opendyslexic` — no third-party font calls at runtime |
| Animation | **Motion** (the post-rename `framer-motion`) + CSS keyframes | CSS-first for accent animations; `motion` reserved for the explicit moments |
| Database | **PostgreSQL** via Prisma 7 + `@prisma/adapter-pg` | SQLite via `libsql` for local dev; the schema is provider-portable |
| Auth | **Hand-rolled** argon2id (`hash-wasm`) + HS256 JWT (`jose`) | No third-party auth library — students never log in, only teachers do |
| i18n | `react-i18next` + 3 locale JSON files | Language switch persists in `localStorage`; provider reads the profile on mount |
| Validation | `zod` | Every API route validates input before touching the DB |

---

## Architecture

```
┌──────────────────────────────┐    ┌──────────────────────────────┐
│  STUDENT (offline-first)     │    │  TEACHER (online)            │
│                              │    │                              │
│  • Onboarding                │    │  • Signup / Login (JWT cookie)│
│  • Lesson runner             │    │  • Classroom CRUD            │
│  • Mini-games                │    │  • Real-time class detail    │
│  • Speed test                │    │  • Printable summary (PDF)   │
│  • Quests + profile          │    │                              │
│  • Sticker scrapbook         │    │                              │
│                              │    │                              │
│  localStorage ─── sync queue │    │  Postgres                    │
└──────────────────────────┬───┘    └──────────────────────────────┘
                           │
                  POST /api/student/sync
                  (anonymousId + classCode)
                           │
                           ▼
                  ┌────────────────────┐
                  │  Postgres           │
                  │  (Prisma + adapter) │
                  └────────────────────┘
```

The sync queue flushes pending `localStorage` ops every 8 s + on the `online` window event. Independent-track kids accumulate ops locally — nothing leaves the device.

---

## Project structure

```
app/
├── api/                     # Server-side route handlers
│   ├── student/sync/        # Anonymous progress ingest
│   └── teacher/             # Auth + classroom CRUD + student detail
├── games/[gameId]/          # falling-words / word-match / speed-round
├── lessons/[lessonId]/      # Typing runner + done screen
├── speed-test/              # Standalone 30-second sprint
├── teacher/                 # Auth + dashboard + printable summary
├── onboarding/              # 6-step flow with warmup
├── privacy/                 # Child-friendly privacy copy (3 languages)
├── profile/                 # Mascot + accessories + stats + scrapbook
├── settings/                # Language, keyboard, culture, a11y, reset
└── ...

components/                 # All client components
├── onboarding/              # Step components + push button + indicator
├── typing/                  # LessonRunner + on-screen keyboard
├── games/                   # FallingWordsGame, WordMatchGame, SpeedTest
├── charts/                  # Hand-built SVG primitives
└── profile/                 # ProfileView

content/                     # Modular content (no DB changes for new cultures)
├── cultures/index.ts        # 3 cultures × 12 words + fun facts
└── lessons/                 # 7 lesson JSON modules × 3 culture tracks

lib/
├── auth.ts                  # argon2id + JWT + cookie helpers + class-code generator
├── db.ts                    # Prisma client singleton (provider-aware)
├── progression.ts           # XP curve + accessories + stickers + unlock evaluator
├── rewards.ts               # grantRewards() — XP + unlocks + event firing
├── sync.ts                  # Queue-based flusher → /api/student/sync
├── typing/engine.ts         # Latin eval + Romaji IME + WPM/accuracy
├── storage.ts               # SSR-safe localStorage adapter with shape-versioning
└── ...

types/localStorage.ts        # Versioned storage contracts + default factories
i18n/locales/                # en.json + id.json + ja.json + privacy-{lang}.json
tokens.css                   # Hum theme — OKLCH palette + type scale + 4-pt space + motion
public/
├── mascots/                 # 8 hand-built SVG mascots
├── accessories/             # 6 hat/glasses/scarf/etc SVGs
└── stickers/                # 14 achievement stickers
```

---

## Getting started

### Prerequisites

- [bun](https://bun.sh) 1.2+ (or Node 20+ with `npm`/`pnpm`)
- A PostgreSQL database (or SQLite for local dev — see `lib/db.ts`)
- 32+ character random string for `AUTH_SECRET` (run `openssl rand -base64 48`)

### Setup

```bash
# 1. Install
bun install

# 2. Configure
cp .env.example .env  # then edit DATABASE_URL + AUTH_SECRET
# OR just edit .env directly

# 3. Apply schema (works without CREATEDB privilege)
bunx prisma db push

# 4. Generate the Prisma client
bunx prisma generate

# 5. Run
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000). On first launch you'll be guided through the onboarding flow (language → keyboard → track → name → mascot → optional warmup).

### Switching between SQLite and PostgreSQL

`lib/db.ts` picks the driver adapter from `DATABASE_URL`:

| Prefix | Driver |
| --- | --- |
| `file:./dev.db`, `:memory:` | libsql (SQLite) — local dev |
| `postgres://`, `postgresql://` | pg (PostgreSQL) — production |

The schema's `provider` field also needs to match. Set `datasource db { provider = "postgresql" }` in `prisma/schema.prisma` for Postgres, or `"sqlite"` for local dev. Run `bunx prisma db push` after switching.

---

## Adding a fourth culture (e.g., Germany)

1. **Add the word bank** — `content/cultures/index.ts`:

   ```ts
   const deBank: CultureBank = {
     code: "de",
     flag: "🇩🇪",
     fact: { en: "...", id: "...", ja: "..." },
     words: [
       { id: "brot", emoji: "🍞", display: "Brot", translations: { en: "bread", id: "roti", ja: "パン" } },
       // 11 more words
     ],
   };
   ```

2. **Register it** in the `CULTURE_BANKS` map.

3. **Add lessons** — `content/lessons/<id>.json`, fill in the `tracks.de` array with phrases for each lesson.

4. **Add translations** to existing lesson JSONs' `tracks.de` arrays.

5. **Update the home culture picker** in `app/settings/page.tsx` (one `CULTURE_LABELS` entry).

That's it — no schema migration, no API change. The onboarding, games, lessons, and progress tracking all derive from the same JSON.

---

## Available scripts

```bash
bun run dev         # Next.js dev server with hot reload
bun run build       # Production build
bun run start       # Start the production build
bun run lint        # ESLint (Next 16 + core-web-vitals + TypeScript)
bun run tsc --noEmit  # TypeScript typecheck

bunx prisma db push            # Apply schema to DB (no CREATEDB required)
bunx prisma generate           # Regenerate typed client
bunx prisma studio             # Open the DB in a browser (dev only)
bunx prisma migrate dev        # Track migrations (requires CREATEDB privilege)
```

---

## Privacy

Students never provide an email, password, or real name. All data on the device is anonymous — identified by a uuid generated on first launch. The only data that leaves the device is what the student explicitly chooses to share by entering a teacher's class code:

- Lesson completion (lesson id, WPM, accuracy, time)
- Speed test results (WPM, accuracy, duration)
- Quest completion timestamps (daily, kid's local date)
- Sticker / accessory unlock events

The `/privacy` page explains this in plain language in all three UI languages.

---

## Deployment

- **Frontend**: Vercel, Netlify, or any Node 20+ host with Next.js 16 support.
- **Database**: PostgreSQL 14+. The schema uses only standard SQL types — no PG-specific extensions.
- **Environment**:
  - `DATABASE_URL` — Postgres connection string
  - `AUTH_SECRET` — 32+ character random string for JWT signing

Migrate before deploy:

```bash
bunx prisma migrate deploy
```

If your DB user can't `CREATE DATABASE` (some hosted Postgres providers restrict this), use `bunx prisma db push` for the initial deploy and grant `CREATEDB` for ongoing schema changes.

---

## License

MIT.