'use client';

import { useGameStore } from '@/store/game-store';
import { PickleballIcon } from './score-panel';

interface PlayerCellProps {
  player: 1 | 2 | 3 | 4;
  /** Bottom row cells get an undo button and bottom border removed */
  isBottom?: boolean;
}

export default function PlayerCell({
  player,
  isBottom = false,
}: PlayerCellProps) {
  const {
    playerNames,
    team1Score,
    team2Score,
    servingPlayer,
    isGameOver,
    incrementScore,
    decrementScore,
  } = useGameStore();

  const team: 1 | 2 = player <= 2 ? 1 : 2;
  const name = playerNames[player - 1] || `Player ${player}`;
  const score = team === 1 ? team1Score : team2Score;
  const isServing = servingPlayer === player;

  const bgClass =
    team === 1
      ? 'bg-blue-950 active:bg-blue-900'
      : 'bg-green-950 active:bg-green-900';
  const nameClass = team === 1 ? 'text-blue-400' : 'text-green-400';
  const ballClass = team === 1 ? 'text-blue-300' : 'text-green-300';

  const borderClass = [
    !isBottom && 'border-b border-slate-700',
    (player === 1 || player === 2) && 'border-r border-slate-700',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors overflow-hidden ${bgClass} ${borderClass}`}
      onClick={() => !isGameOver && incrementScore(player)}
      role="button"
      aria-label={`Add point for ${name}`}
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === 'Enter' && !isGameOver && incrementScore(player)
      }
    >
      {/* Serve indicator */}
      <div
        className={`absolute top-2 right-2 transition-opacity duration-200 ${
          isServing ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden
      >
        <PickleballIcon className={`w-5 h-5 ${ballClass}`} />
      </div>

      {/* Player name */}
      <p className={`text-xs font-bold uppercase tracking-widest ${nameClass}`}>
        {name}
      </p>

      {/* Team score — same for both players on a team */}
      <span className="text-6xl font-black text-white tabular-nums leading-none">
        {score}
      </span>

      {/* "serving" label */}
      <p
        className={`text-xs text-slate-500 transition-opacity duration-200 ${
          isServing ? 'opacity-100' : 'opacity-0'
        }`}
      >
        serving
      </p>

      {/* Undo button — only on the bottom cell of each column */}
      {isBottom && (
        <button
          className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-700/50 text-slate-500 text-xs font-medium hover:bg-slate-600/60 hover:text-slate-300 active:bg-slate-600/80 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            decrementScore(team);
          }}
          aria-label={`Undo point for ${name}'s team`}
        >
          undo
        </button>
      )}
    </div>
  );
}
