import Dexie, { type EntityTable } from "dexie";

interface Game {
  id: number;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  winScore: number;
  winner: 1 | 2;
  playedAt: Date;
  durationSeconds: number;
}

const db = new Dexie("DinkUpDB") as Dexie & {
  games: EntityTable<Game, "id">;
};

db.version(1).stores({
  games: "++id, playedAt, winner",
});

export type { Game };
export { db };
