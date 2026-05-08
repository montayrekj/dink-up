# Dink Up 🏓

A mobile-first PWA pickleball scorer. Install it on your phone and keep score hands-free — tap your side of the screen to add a point, tap **undo** to subtract one.

## Features

- **Split-screen scorer** — each team owns half the screen; tap to score
- **Rally scoring** — point winner becomes server (indicated by a ball icon)
- **Configurable win score** — play to 11, 15, or 21 (win by 2 enforced)
- **Team name editing** — rename teams in Settings before or during a game
- **Game history** — completed games are saved locally with score, duration, and date
- **Offline-first PWA** — install to your home screen; works with no network via Serwist service worker + IndexedDB (Dexie)

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
npm run dev      # http://localhost:3000 (webpack mode)
```

## Building for production

```bash
npm run build
npm run start
```

The service worker and precache manifest are generated automatically into `public/sw.js` during the build.

> **Note:** `dev` and `build` use `--webpack` because Serwist injects a webpack plugin. Turbopack is not yet supported by `@serwist/next`; follow [serwist/serwist#54](https://github.com/serwist/serwist/issues/54) for progress.

## PWA installation

Open the deployed URL in Chrome or Safari on your phone and tap **Add to Home Screen**. The app will launch in standalone mode (no browser chrome) and work fully offline after the first load.

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with PWA viewport meta
│   ├── page.tsx            # Main scorer screen
│   ├── manifest.ts         # Web app manifest (Next.js route)
│   ├── globals.css         # Tailwind v4 imports + base styles
│   └── history/
│       └── page.tsx        # Game history list
├── components/
│   ├── score-panel.tsx     # Tappable score half for one team
│   ├── win-banner.tsx      # Game-over overlay
│   └── settings-modal.tsx  # Team names + win score settings
├── lib/
│   └── db.ts               # Dexie database schema
├── store/
│   └── game-store.ts       # Zustand game state + scoring logic
└── sw.ts                   # Serwist service worker entry point
public/
├── icon-192.svg            # Manifest icon (replace with PNG for best compatibility)
└── icon-512.svg            # Maskable manifest icon
tsconfig.sw.json            # Separate TS config for the SW file (webworker lib)
```

## Replacing icons

The manifest currently references SVG icons. For the best cross-browser PWA experience, generate PNG versions and update `src/app/manifest.ts`:

```bash
# Example using Inkscape
inkscape public/icon-192.svg -w 192 -h 192 -o public/icon-192.png
inkscape public/icon-512.svg -w 512 -h 512 -o public/icon-512.png
```

## Scoring rules

The app uses **rally scoring**: any team can score on any rally, and the team that wins the rally serves next. A game is won when a team reaches the win score with at least a 2-point lead.
