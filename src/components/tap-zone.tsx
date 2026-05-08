"use client";

import { useGameStore } from "@/store/game-store";
import PickleballIcon from "./pickleball-icon";

interface TapZoneProps {
  /** Player slot. In singles: 1 = Team 1, 3 = Team 2. In doubles: 1-4. */
  player: 1 | 2 | 3 | 4;
  /** Which half of the court this zone occupies */
  row: "top" | "bottom";
  /** Doubles only: true for the left player — adds a right-edge service line */
  hasSibling?: boolean;
}

// Court surface colors
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

  // Kitchen line position (% from top of this zone)
  // Top zone: kitchen is at the bottom (near the net) → 68% down
  // Bottom zone: kitchen is at the top (near the net) → 32% down
  const kitchenPct = row === "top" ? "68%" : "32%";

  // Main-court vertical extent (service lines must NOT cross into the kitchen)
  // Top zone main court: from top-0 to 68% down
  // Bottom zone main court: from 32% down to bottom-0
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
      {/* ── Court layers ── */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Kitchen / NVZ zone — different surface color */}
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

        {/* Kitchen line — more prominent; marks the NVZ boundary */}
        <div
          className="absolute left-0 right-0 h-px bg-white/50"
          style={{ top: kitchenPct }}
        />

        {/* Center service-box line (singles) — main court only, not into kitchen */}
        {showCenterLine && (
          <div
            className="absolute w-px bg-white/25"
            style={{ left: "50%", ...mainCourtSpan }}
          />
        )}

        {/* Partner divider (doubles left-player) — main court only */}
        {hasSibling && (
          <div
            className="absolute right-0 w-px bg-white/25"
            style={mainCourtSpan}
          />
        )}

      </div>

      {/* ── Serve ball — centered, large but not oversized ── */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
          isServing ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        <PickleballIcon className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.65)]" />
      </div>

      {/* ── Name label at the outer (back-of-court) edge ── */}
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
