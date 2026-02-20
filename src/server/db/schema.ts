import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull().unique(),
  category: text("category").notNull(),
  difficulty: integer("difficulty").notNull().default(1),
})

export const gameHistory = pgTable("game_history", {
  id: serial("id").primaryKey(),
  roomCode: text("room_code").notNull(),
  winnerTeam: text("winner_team").notNull(),
  teamAScore: integer("team_a_score").notNull(),
  teamBScore: integer("team_b_score").notNull(),
  totalRounds: integer("total_rounds").notNull(),
  playedAt: timestamp("played_at").notNull().defaultNow(),
})
