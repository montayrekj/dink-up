'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/game-store';
import TapZone from '@/components/tap-zone';
import NetStrip from '@/components/net-strip';
import WinBanner from '@/components/win-banner';
import SettingsModal from '@/components/settings-modal';

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

function SwapHorizIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <path d="M4 7h16m0 0-4-4m4 4-4 4" />
      <path d="M20 17H4m0 0 4 4m-4-4 4-4" />
    </svg>
  );
}

function FlashToast({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
      <div className="flash-toast bg-black/80 text-white font-black px-7 py-4 rounded-2xl text-3xl shadow-2xl">
        {message}
      </div>
    </div>
  );
}

export default function Home() {
  const {
    mode,
    scoringMode,
    winScore,
    setWinScore,
    newGame,
    isGameOver,
    flashMessage,
    clearFlashMessage,
    decrementScore,
    team1Name,
    team2Name,
    team1Score,
    team2Score,
    servingPlayer,
    swapPlayers,
  } = useGameStore();

  const isGameStart =
    team1Score === 0 && team2Score === 0 && !isGameOver && servingPlayer === 2;

  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!flashMessage) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ msg: flashMessage, key: Date.now() });
    clearFlashMessage();
    timerRef.current = setTimeout(() => setToast(null), 1600);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [flashMessage, clearFlashMessage]);

  const t1Label = mode === 'singles' ? team1Name : 'T1';
  const t2Label = mode === 'singles' ? team2Name : 'T2';

  return (
    <main className="h-full flex flex-col relative overflow-hidden bg-[#07101e]">
      <header className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-white/10 shrink-0">
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Settings"
        >
          <SettingsIcon />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-base tracking-widest uppercase">
            Dink Up
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase tracking-wide">
            {mode}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
              scoringMode === 'service'
                ? 'bg-yellow-900/60 text-yellow-400'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {scoringMode}
          </span>
        </div>
        <Link
          href="/history"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Game history"
        >
          <HistoryIcon />
        </Link>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        {mode === 'singles' ? (
          <TapZone player={3} row="top" />
        ) : (
          <div className="relative flex flex-1 overflow-hidden">
            <TapZone player={3} row="top" hasSibling />
            <TapZone player={4} row="top" />
            {isGameStart && (
              <button
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 border border-white/20 text-white rounded-full p-2 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  swapPlayers(2);
                }}
                aria-label="Swap Team 2 players"
              >
                <SwapHorizIcon />
              </button>
            )}
          </div>
        )}

        <NetStrip />

        {mode === 'singles' ? (
          <TapZone player={1} row="bottom" />
        ) : (
          <div className="relative flex flex-1 overflow-hidden">
            <TapZone player={1} row="bottom" hasSibling />
            <TapZone player={2} row="bottom" />
            {isGameStart && (
              <button
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 border border-white/20 text-white rounded-full p-2 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  swapPlayers(1);
                }}
                aria-label="Swap Team 1 players"
              >
                <SwapHorizIcon />
              </button>
            )}
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-t border-white/10 shrink-0 gap-2">
        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-xs mr-0.5">Win</span>
          {([11, 15, 21] as const).map((n) => (
            <button
              key={n}
              onClick={() => setWinScore(n)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                winScore === n
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => decrementScore(1)}
            className="px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-300 text-xs font-semibold border border-blue-900/60 hover:bg-blue-900/60 active:bg-blue-900 transition-colors"
            aria-label={`Undo point for ${t1Label}`}
          >
            −{t1Label}
          </button>
          <button
            onClick={() => decrementScore(2)}
            className="px-2.5 py-1 rounded-full bg-green-950/80 text-green-300 text-xs font-semibold border border-green-900/60 hover:bg-green-900/60 active:bg-green-900 transition-colors"
            aria-label={`Undo point for ${t2Label}`}
          >
            −{t2Label}
          </button>
        </div>

        <button
          onClick={newGame}
          className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 text-xs font-semibold transition-colors"
        >
          New Game
        </button>
      </footer>

      {toast && <FlashToast key={toast.key} message={toast.msg} />}
      {isGameOver && <WinBanner />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </main>
  );
}
