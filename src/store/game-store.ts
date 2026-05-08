"use client";

import { create } from "zustand";
import { db, type Game } from "@/lib/db";

type Mode = "singles" | "doubles";
type ScoringMode = "rally" | "service";

interface GameState {
  mode: Mode;
  scoringMode: ScoringMode;
  team1Name: string;
  team2Name: string;
  playerNames: [string, string, string, string];
  team1Score: number;
  team2Score: number;
  servingPlayer: 1 | 2 | 3 | 4;
  isFirstServe: boolean;
  isSecondServer: boolean;
  winScore: 11 | 15 | 21;
  startedAt: Date;
  isGameOver: boolean;
  winner: 1 | 2 | null;
  history: Game[];
  flashMessage: string | null;
}

interface GameActions {
  setMode: (mode: Mode) => void;
  setScoringMode: (mode: ScoringMode) => void;
  setTeamName: (team: 1 | 2, name: string) => void;
  setPlayerName: (player: 1 | 2 | 3 | 4, name: string) => void;
  incrementScore: (player: 1 | 2 | 3 | 4) => void;
  decrementScore: (team: 1 | 2) => void;
  setWinScore: (score: 11 | 15 | 21) => void;
  newGame: () => void;
  clearFlashMessage: () => void;
  loadHistory: () => Promise<void>;
  swapTeams: () => void;
  swapPlayers: (team: 1 | 2) => void;
}

function checkWinner(t1: number, t2: number, winScore: number): 1 | 2 | null {
  const wins = (s: number, o: number) => s >= winScore && s - o >= 2;
  if (wins(t1, t2)) return 1;
  if (wins(t2, t1)) return 2;
  return null;
}

const FRESH_GAME = {
  team1Score: 0,
  team2Score: 0,
  servingPlayer: 2 as const,
  isFirstServe: true,
  isSecondServer: false,
  isGameOver: false,
  winner: null,
  startedAt: new Date(),
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  mode: "doubles",
  scoringMode: "service",
  team1Name: "Team 1",
  team2Name: "Team 2",
  playerNames: ["Player 1", "Player 2", "Player 3", "Player 4"],
  ...FRESH_GAME,
  winScore: 11,
  history: [],
  flashMessage: null,

  setMode: (mode) => set({ mode, ...FRESH_GAME, startedAt: new Date() }),

  setScoringMode: (scoringMode) => set({ scoringMode }),

  setTeamName: (team, name) =>
    set(team === 1 ? { team1Name: name } : { team2Name: name }),

  setPlayerName: (player, name) => {
    const next = [...get().playerNames] as [string, string, string, string];
    next[player - 1] = name;
    set({ playerNames: next });
  },

  incrementScore: (player) => {
    const s = get();
    if (s.isGameOver) return;

    const tappedTeam: 1 | 2 = player <= 2 ? 1 : 2;

    if (s.scoringMode === "service") {
      const servingTeam: 1 | 2 = s.servingPlayer <= 2 ? 1 : 2;

      if (tappedTeam !== servingTeam) {
        if (s.mode === "singles") {
          const next: 1 | 2 | 3 | 4 = servingTeam === 1 ? 3 : 1;
          set({ servingPlayer: next, flashMessage: "Side Out!", isFirstServe: false });
          return;
        }

        if (s.isFirstServe) {
          const next: 1 | 2 | 3 | 4 = servingTeam === 1 ? 3 : 2;
          set({ servingPlayer: next, flashMessage: "Side Out!", isFirstServe: false, isSecondServer: false });
          return;
        }

        if (s.isSecondServer) {
          const next: 1 | 2 | 3 | 4 = servingTeam === 1 ? 3 : 2;
          set({ servingPlayer: next, flashMessage: "Side Out!", isSecondServer: false });
          return;
        }

        const partner = (s.servingPlayer <= 2 ? 3 - s.servingPlayer : 7 - s.servingPlayer) as 1 | 2 | 3 | 4;
        set({ servingPlayer: partner, flashMessage: "Server 2", isSecondServer: true });
        return;
      }

      const t1 = servingTeam === 1 ? s.team1Score + 1 : s.team1Score;
      const t2 = servingTeam === 2 ? s.team2Score + 1 : s.team2Score;
      const winner = checkWinner(t1, t2, s.winScore);

      if (winner) {
        db.games.add({
          mode: s.mode,
          scoringMode: s.scoringMode,
          team1Name: s.team1Name,
          team2Name: s.team2Name,
          playerNames: s.playerNames,
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

      const nextServer = s.mode === "doubles"
        ? ((s.servingPlayer <= 2 ? 3 - s.servingPlayer : 7 - s.servingPlayer) as 1 | 2 | 3 | 4)
        : s.servingPlayer;

      set({ team1Score: t1, team2Score: t2, servingPlayer: nextServer, isGameOver: !!winner, winner });
      return;
    }

    const t1 = tappedTeam === 1 ? s.team1Score + 1 : s.team1Score;
    const t2 = tappedTeam === 2 ? s.team2Score + 1 : s.team2Score;
    const winner = checkWinner(t1, t2, s.winScore);

    if (winner) {
      db.games.add({
        mode: s.mode,
        scoringMode: s.scoringMode,
        team1Name: s.team1Name,
        team2Name: s.team2Name,
        playerNames: s.playerNames,
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

    set({ team1Score: t1, team2Score: t2, servingPlayer: player, isGameOver: !!winner, winner });
  },

  decrementScore: (team) => {
    const s = get();
    if (s.isGameOver) return;
    set({
      team1Score: team === 1 ? Math.max(0, s.team1Score - 1) : s.team1Score,
      team2Score: team === 2 ? Math.max(0, s.team2Score - 1) : s.team2Score,
    });
  },

  setWinScore: (score) => set({ winScore: score }),

  newGame: () => set({ ...FRESH_GAME, startedAt: new Date(), flashMessage: null }),

  clearFlashMessage: () => set({ flashMessage: null }),

  swapTeams: () => {
    const s = get();
    if (s.team1Score !== 0 || s.team2Score !== 0) return;
    set({
      team1Name: s.team2Name,
      team2Name: s.team1Name,
      playerNames: [s.playerNames[2], s.playerNames[3], s.playerNames[0], s.playerNames[1]],
    });
  },

  swapPlayers: (team) => {
    const s = get();
    if (s.team1Score !== 0 || s.team2Score !== 0) return;
    const next = [...s.playerNames] as [string, string, string, string];
    if (team === 1) {
      [next[0], next[1]] = [next[1], next[0]];
    } else {
      [next[2], next[3]] = [next[3], next[2]];
    }
    set({ playerNames: next });
  },

  loadHistory: async () => {
    const games = await db.games.orderBy("playedAt").reverse().limit(50).toArray();
    set({ history: games });
  },
}));
