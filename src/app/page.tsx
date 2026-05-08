"use client";

import { useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/store/game-store";
import ScorePanel from "@/components/score-panel";
import WinBanner from "@/components/win-banner";
import SettingsModal from "@/components/settings-modal";

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <polyline points="12 8 12 12 14 14" />
      <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
    </svg>
  );
}

export default function Home() {
  const { winScore, setWinScore, newGame, isGameOver } = useGameStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <main className="h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700 shrink-0">
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Settings"
        >
          <SettingsIcon />
        </button>
        <span className="text-white font-black text-base tracking-widest uppercase">
          Dink Up
        </span>
        <Link
          href="/history"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Game history"
        >
          <HistoryIcon />
        </Link>
      </header>

      {/* Score area */}
      <div className="flex flex-1 overflow-hidden">
        <ScorePanel team={1} />
        <div className="w-px bg-slate-700 shrink-0" />
        <ScorePanel team={2} />
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-3 py-2.5 bg-slate-800 border-t border-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-xs mr-1">Win at</span>
          {([11, 15, 21] as const).map((n) => (
            <button
              key={n}
              onClick={() => setWinScore(n)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                winScore === n
                  ? "bg-green-600 text-white"
                  : "bg-slate-700 text-slate-400 hover:bg-slate-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          onClick={newGame}
          className="px-3 py-1 rounded-full bg-slate-700 text-slate-400 hover:bg-slate-600 text-sm font-semibold transition-colors"
        >
          New Game
        </button>
      </footer>

      {isGameOver && <WinBanner />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </main>
  );
}
