'use client';

import { useGameStore } from '@/store/game-store';

function SwapVertIcon() {
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
      <path d="M7 16V4m0 0L3 8m4-4 4 4" />
      <path d="M17 8v12m0 0 4-4m-4 4-4-4" />
    </svg>
  );
}

export default function NetStrip() {
  const {
    team1Score,
    team2Score,
    servingPlayer,
    isFirstServe,
    isSecondServer,
    isGameOver,
    mode,
    scoringMode,
    swapTeams,
  } = useGameStore();

  const showServerNum = scoringMode === 'service' && mode === 'doubles';
  const serverNumDisplay = showServerNum
    ? isFirstServe || isSecondServer
      ? 2
      : 1
    : null;
  const isGameStart =
    team1Score === 0 && team2Score === 0 && !isGameOver && servingPlayer === 2;

  return (
    <div
      className="relative shrink-0 overflow-visible"
      style={{ height: '2px' }}
    >
      {/* Net line */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-black" />

      {/* Score badge floating over the line */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-baseline gap-2.5 bg-white rounded-xl px-5 py-2 shadow-lg">
        <span className="text-4xl font-black text-blue-700 tabular-nums leading-none">
          {team1Score}
        </span>
        <span className="text-lg font-light text-slate-400 select-none">—</span>
        <span className="text-4xl font-black text-green-700 tabular-nums leading-none">
          {team2Score}
        </span>
        {showServerNum && (
          <>
            <span className="text-lg font-light text-slate-400 select-none">
              —
            </span>
            <span className="text-4xl font-black text-amber-600 tabular-nums leading-none">
              {serverNumDisplay}
            </span>
          </>
        )}
      </div>

      {/* Swap teams button — only at game start */}
      {isGameStart && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/15 hover:bg-white/30 border border-white/25 text-white rounded-full p-1.5 transition-colors"
          onClick={swapTeams}
          aria-label="Swap teams"
        >
          <SwapVertIcon />
        </button>
      )}
    </div>
  );
}
