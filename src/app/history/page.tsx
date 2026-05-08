"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, type Game } from "@/lib/db";

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function GameRow({ game }: { game: Game }) {
  const isDoubles = game.mode === "doubles";

  const team1Label = isDoubles
    ? `${game.playerNames[0]} & ${game.playerNames[1]}`
    : game.team1Name;
  const team2Label = isDoubles
    ? `${game.playerNames[2]} & ${game.playerNames[3]}`
    : game.team2Name;

  return (
    <li className="px-4 py-3.5 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        {/* Mode badge */}
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 mr-1.5">
          {game.mode}
        </span>

        <div className="mt-0.5 flex flex-col gap-0.5">
          <span
            className={`font-semibold leading-snug ${
              game.winner === 1 ? "text-yellow-400" : "text-slate-300"
            }`}
          >
            {game.winner === 1 && "🏆 "}
            {team1Label}
          </span>
          <span className="text-slate-600 text-xs">vs</span>
          <span
            className={`font-semibold leading-snug ${
              game.winner === 2 ? "text-yellow-400" : "text-slate-300"
            }`}
          >
            {game.winner === 2 && "🏆 "}
            {team2Label}
          </span>
        </div>

        <p className="text-slate-500 text-xs mt-1">
          {formatDate(game.playedAt)} · {formatDuration(game.durationSeconds)}
        </p>
      </div>

      <div className="text-right shrink-0 pt-5">
        <p className="text-xl font-black tabular-nums text-white">
          {game.team1Score}
          <span className="text-slate-600 mx-1">–</span>
          {game.team2Score}
        </p>
        <p className="text-xs text-slate-500">to {game.winScore}</p>
      </div>
    </li>
  );
}

export default function HistoryPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.games
      .orderBy("playedAt")
      .reverse()
      .limit(50)
      .toArray()
      .then((g) => {
        setGames(g);
        setLoading(false);
      });
  }, []);

  return (
    <main className="h-full flex flex-col bg-slate-900 text-white overflow-hidden">
      <header className="flex items-center gap-2 px-3 py-3 bg-slate-800 border-b border-slate-700 shrink-0">
        <Link
          href="/"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Back"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="font-bold text-base">Game History</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-slate-600 text-sm">
            Loading…
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2">
            <p className="text-slate-500 text-sm">No games recorded yet</p>
            <Link href="/" className="text-green-500 text-sm hover:underline">
              Start playing →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {games.map((game) => (
              <GameRow key={game.id} game={game} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
