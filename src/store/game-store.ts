"use client";

import { create } from "zustand";
import { db, type Game } from "@/lib/db";

interface GameState {
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  servingTeam: 1 | 2;
  winScore: 11 | 15 | 21;
  startedAt: Date;
  isGameOver: boolean;
  winner: 1 | 2 | null;
  history: Game[];
}

interface GameActions {
  setTeamName: (team: 1 | 2, name: string) => void;
  incrementScore: (team: 1 | 2) => void;
  decrementScore: (team: 1 | 2) => void;
  setServingTeam: (team: 1 | 2) => void;
  setWinScore: (score: 11 | 15 | 21) => void;
  newGame: () => void;
  loadHistory: () => Promise<void>;
}

function checkWinner(t1: number, t2: number, winScore: number): 1 | 2 | null {
  const wins = (s: number, o: number) => s >= winScore && s - o >= 2;
  if (wins(t1, t2)) return 1;
  if (wins(t2, t1)) return 2;
  return null;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  team1Name: "Team 1",
  team2Name: "Team 2",
  team1Score: 0,
  team2Score: 0,
  servingTeam: 1,
  winScore: 11,
  startedAt: new Date(),
  isGameOver: false,
  winner: null,
  history: [],

  setTeamName: (team, name) =>
    set(team === 1 ? { team1Name: name } : { team2Name: name }),

  incrementScore: (team) => {
    const s = get();
    if (s.isGameOver) return;

    const t1 = team === 1 ? s.team1Score + 1 : s.team1Score;
    const t2 = team === 2 ? s.team2Score + 1 : s.team2Score;
    const winner = checkWinner(t1, t2, s.winScore);

    if (winner) {
      db.games.add({
        team1Name: s.team1Name,
        team2Name: s.team2Name,
        team1Score: t1,
        team2Score: t2,
        winScore: s.winScore,
        winner,
        playedAt: new Date(),
        durationSeconds: Math.floor(
          (Date.now() - s.startedAt.getTime()) / 1000
        ),
      });
    }

    // Rally scoring: point winner serves next
    set({
      team1Score: t1,
      team2Score: t2,
      servingTeam: team,
      isGameOver: !!winner,
      winner,
    });
  },

  decrementScore: (team) => {
    const s = get();
    if (s.isGameOver) return;
    set({
      team1Score: team === 1 ? Math.max(0, s.team1Score - 1) : s.team1Score,
      team2Score: team === 2 ? Math.max(0, s.team2Score - 1) : s.team2Score,
    });
  },

  setServingTeam: (team) => set({ servingTeam: team }),

  setWinScore: (score) => set({ winScore: score }),

  newGame: () =>
    set({
      team1Score: 0,
      team2Score: 0,
      servingTeam: 1,
      isGameOver: false,
      winner: null,
      startedAt: new Date(),
    }),

  loadHistory: async () => {
    const games = await db.games
      .orderBy("playedAt")
      .reverse()
      .limit(50)
      .toArray();
    set({ history: games });
  },
}));
