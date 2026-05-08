import Dexie, { type EntityTable } from "dexie";

interface Game {
  id: number;
  mode: "singles" | "doubles";
  scoringMode: "rally" | "service";
  team1Name: string;
  team2Name: string;
  playerNames: [string, string, string, string];
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

db.version(1).stores({ games: "++id, playedAt, winner" });

db.version(2)
  .stores({ games: "++id, playedAt, winner, mode" })
  .upgrade((tx) =>
    tx
      .table("games")
      .toCollection()
      .modify((g: Game) => {
        if (!g.mode) g.mode = "singles";
        if (!g.playerNames)
          g.playerNames = [g.team1Name, "", g.team2Name, ""];
      })
  );

db.version(3)
  .stores({ games: "++id, playedAt, winner, mode, scoringMode" })
  .upgrade((tx) =>
    tx
      .table("games")
      .toCollection()
      .modify((g: Game) => {
        if (!g.scoringMode) g.scoringMode = "rally";
      })
  );

export type { Game };
export { db };
