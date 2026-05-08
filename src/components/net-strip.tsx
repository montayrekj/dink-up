'use client';

import { useGameStore } from '@/store/game-store';

export default function NetStrip() {
  const {
    team1Score,
    team2Score,
    isFirstServe,
    isSecondServer,
    mode,
    scoringMode,
  } = useGameStore();

  const showServerNum = scoringMode === 'service' && mode === 'doubles';
  // server 2 = either the traditional first-serve rule or the second server of this possession
  const serverNumDisplay = showServerNum ? (isFirstServe || isSecondServer ? 2 : 1) : null;

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
    </div>
  );
}
