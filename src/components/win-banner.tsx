"use client";

import { useGameStore } from "@/store/game-store";

export default function WinBanner() {
  const { winner, team1Name, team2Name, team1Score, team2Score, newGame } =
    useGameStore();

  const winnerName = winner === 1 ? team1Name : team2Name;

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-slate-800 rounded-2xl p-8 flex flex-col items-center gap-5 max-w-xs w-full mx-4 border border-slate-600 shadow-2xl">
        <div className="text-6xl">🏆</div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">{winnerName}</h2>
          <p className="text-green-400 font-semibold mt-0.5">wins!</p>
        </div>
        <p className="text-slate-400 text-2xl font-bold tabular-nums">
          {team1Score}
          <span className="text-slate-600 mx-2">–</span>
          {team2Score}
        </p>
        <button
          onClick={newGame}
          className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold text-lg transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
