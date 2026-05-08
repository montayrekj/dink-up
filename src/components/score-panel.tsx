"use client";

import { useGameStore } from "@/store/game-store";

export function PickleballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="M12 1 Q7 6 12 12 Q17 18 12 23"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M1 12 Q6 7 12 12 Q18 17 23 12"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface ScorePanelProps {
  team: 1 | 2;
}

export default function ScorePanel({ team }: ScorePanelProps) {
  const {
    team1Name,
    team2Name,
    team1Score,
    team2Score,
    servingPlayer,
    isGameOver,
    incrementScore,
    decrementScore,
  } = useGameStore();

  // In singles, Team 1 maps to player slot 1, Team 2 to player slot 3
  const playerSlot: 1 | 3 = team === 1 ? 1 : 3;
  const name = team === 1 ? team1Name : team2Name;
  const score = team === 1 ? team1Score : team2Score;
  const isServing = team === 1 ? servingPlayer <= 2 : servingPlayer >= 3;

  const bgClass =
    team === 1
      ? "bg-blue-950 active:bg-blue-900"
      : "bg-green-950 active:bg-green-900";
  const nameClass = team === 1 ? "text-blue-400" : "text-green-400";
  const ballClass = team === 1 ? "text-blue-300" : "text-green-300";

  return (
    <div
      className={`relative flex-1 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${bgClass}`}
      onClick={() => !isGameOver && incrementScore(playerSlot)}
      role="button"
      aria-label={`Add point to ${name}`}
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && !isGameOver && incrementScore(playerSlot)
      }
    >
      <div
        className={`absolute top-3 right-3 transition-opacity duration-200 ${
          isServing ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <PickleballIcon className={`w-6 h-6 ${ballClass}`} />
      </div>

      <p className={`text-xs font-bold uppercase tracking-widest ${nameClass}`}>
        {name}
      </p>

      <span className="text-8xl font-black text-white tabular-nums leading-none">
        {score}
      </span>

      <p
        className={`text-xs font-medium transition-opacity duration-200 ${
          isServing ? "opacity-60 text-slate-400" : "opacity-0"
        }`}
      >
        serving
      </p>

      <button
        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-700/50 text-slate-500 text-xs font-medium hover:bg-slate-600/60 hover:text-slate-300 active:bg-slate-600/80 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          decrementScore(team);
        }}
        aria-label={`Undo point for ${name}`}
      >
        undo
      </button>
    </div>
  );
}
