"use client";

import { useGameStore } from "@/store/game-store";
import PickleballIcon from "./pickleball-icon";

interface TapZoneProps {
  player: 1 | 2 | 3 | 4;
  row: "top" | "bottom";
  hasSibling?: boolean;
}

const COURT_BLUE = "#1a4878";
const KITCHEN_GREEN = "#155e3a";

export default function TapZone({ player, row, hasSibling = false }: TapZoneProps) {
  const {
    mode,
    team1Name,
    team2Name,
    playerNames,
    servingPlayer,
    isGameOver,
    incrementScore,
  } = useGameStore();

  const team: 1 | 2 = player <= 2 ? 1 : 2;

  const displayName =
    mode === "singles"
      ? team === 1
        ? team1Name
        : team2Name
      : playerNames[player - 1] || `Player ${player}`;

  const isServing = servingPlayer === player;

  const kitchenPct = row === "top" ? "68%" : "32%";

  const mainCourtSpan =
    row === "top"
      ? { top: 0, height: kitchenPct }
      : { top: kitchenPct, bottom: 0 };

  const showCenterLine = mode === "singles";

  return (
    <div
      className="relative flex-1 overflow-hidden cursor-pointer transition-[filter] duration-75 active:brightness-110"
      style={{ background: COURT_BLUE, touchAction: "manipulation" }}
      onClick={() => !isGameOver && incrementScore(player)}
      role="button"
      aria-label={`Score for ${displayName}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !isGameOver && incrementScore(player)}
    >
      <div className="absolute inset-0 pointer-events-none">
        {row === "top" ? (
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{ top: kitchenPct, background: KITCHEN_GREEN }}
          />
        ) : (
          <div
            className="absolute left-0 right-0 top-0"
            style={{ height: kitchenPct, background: KITCHEN_GREEN }}
          />
        )}

        <div
          className="absolute left-0 right-0 h-px bg-white/50"
          style={{ top: kitchenPct }}
        />

        {showCenterLine && (
          <div
            className="absolute w-px bg-white/25"
            style={{ left: "50%", ...mainCourtSpan }}
          />
        )}

        {hasSibling && (
          <div
            className="absolute right-0 w-px bg-white/25"
            style={mainCourtSpan}
          />
        )}
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
          isServing ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        <PickleballIcon className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.65)]" />
      </div>

      <div
        className={`absolute left-0 right-0 flex justify-center pointer-events-none px-2 ${
          row === "top" ? "top-2.5" : "bottom-2.5"
        }`}
      >
        <span className={`text-xs font-bold uppercase tracking-[0.15em] ${row === "top" ? "text-green-300/80" : "text-blue-300/80"}`}>
          {displayName}
        </span>
      </div>
    </div>
  );
}
