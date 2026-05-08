"use client";

import { useGameStore } from "@/store/game-store";

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { team1Name, team2Name, setTeamName, winScore, setWinScore } =
    useGameStore();

  return (
    <div
      className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl p-6 flex flex-col gap-5 max-w-sm w-full mx-4 border border-slate-600 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white">Game Settings</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Team 1 Name
          </label>
          <input
            type="text"
            value={team1Name}
            onChange={(e) => setTeamName(1, e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
            placeholder="Team 1"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Team 2 Name
          </label>
          <input
            type="text"
            value={team2Name}
            onChange={(e) => setTeamName(2, e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-green-500 placeholder:text-slate-500"
            placeholder="Team 2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Win Score
          </label>
          <div className="flex gap-2">
            {([11, 15, 21] as const).map((n) => (
              <button
                key={n}
                onClick={() => setWinScore(n)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  winScore === n
                    ? "bg-green-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="py-3 rounded-xl bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-semibold transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
