# Dink Up

A mobile-first PWA pickleball scorer. Install it on your phone and keep score hands-free — tap your side of the screen to add a point.

## Features

- **Singles & doubles** — four-zone court layout for doubles; two-zone for singles
- **Rally or service scoring** — toggle between rally point and traditional service point (side-out) scoring
- **Proper doubles server rotation** — tracks server 1 / server 2, the traditional first-serve rule, and position switching after each scored point; ball indicator follows the correct service court
- **Score display** — shows `team1 – team2` (or `team1 – team2 – serverNum` in doubles service mode); numbers are color-coded by team
- **Court-inspired design** — blue main court with green kitchen/NVZ zones; thin net line with floating score badge
- **Per-team undo** — subtract a point from either team without affecting serve state
- **Configurable win score** — play to 11, 15, or 21 (win by 2 enforced)
- **Player & team names** — rename all four players (doubles) or two teams (singles) in Settings
- **Flash toasts** — "Side Out!" and "Server 2" notifications on serve changes
- **Game history** — completed games saved locally with score, duration, mode, and date
- **Offline-first PWA** — install to home screen; works with no network via Serwist service worker + IndexedDB (Dexie)

## Tech stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router, webpack mode) |
| PWA / SW | [Serwist](https://serwist.pages.dev) `@serwist/next` |
| Styling | Tailwind CSS v4 |
| State | Zustand v5 |
| Persistence | Dexie v4 (IndexedDB) |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Building for production

```bash
npm run build
npm run start
```

The service worker and precache manifest are generated into `public/sw.js` during the build.

> **Note:** `dev` and `build` use `--webpack` because Serwist injects a webpack plugin incompatible with Turbopack. Follow [serwist/serwist#54](https://github.com/serwist/serwist/issues/54) for Turbopack support.

## PWA installation

Open the deployed URL in Chrome or Safari on your phone and tap **Add to Home Screen**. The app launches in standalone mode and works fully offline after the first load.

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with PWA viewport meta
│   ├── page.tsx            # Main scorer screen (court + header + footer)
│   ├── manifest.ts         # Web app manifest (Next.js route)
│   ├── apple-icon.tsx      # iOS apple-touch-icon via ImageResponse
│   ├── globals.css         # Tailwind v4 imports + flash-toast animation
│   └── history/
│       └── page.tsx        # Game history list
├── components/
│   ├── tap-zone.tsx        # Tappable court half (handles singles & doubles)
│   ├── net-strip.tsx       # 1px net line with floating score badge
│   ├── pickleball-icon.tsx # Serve indicator SVG icon
│   ├── win-banner.tsx      # Game-over overlay
│   └── settings-modal.tsx  # Mode, scoring, names, and win score settings
├── lib/
│   └── db.ts               # Dexie schema (v3) — games table
├── store/
│   └── game-store.ts       # Zustand store: scoring logic, serve rotation, history
└── sw.ts                   # Serwist service worker entry point
public/
├── icon-192.svg            # Manifest icon
└── icon-512.svg            # Maskable manifest icon
tsconfig.sw.json            # Separate TS config for the SW file (webworker lib)
```

## Scoring rules

### Rally scoring
Any side can score on any rally. The team that wins the rally scores a point and their tapped player becomes the server. First to reach the win score by 2+ points wins.

### Service scoring (traditional)
Only the serving team can score. Tapping the receiving side causes a serve rotation with no point awarded.

**Doubles serve rotation:**
1. Game starts with Team 1's right-side player as "Server 2" (traditional first-serve rule — Team 1 gets only one server to start).
2. After the first side-out, both teams get two servers per possession.
3. On each side-out, the incoming team's **right-side player** (from their perspective) serves first as Server 1.
4. Each time the serving team scores, players switch sides — the server moves to the other court.
5. When Server 1 loses a rally, Server 2 (their partner) takes over. When Server 2 loses, it's a side-out.

**Singles:** straightforward side-out on any rally loss by the server.
