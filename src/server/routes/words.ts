import { Elysia } from "elysia"
import { getDb } from "../db/index"
import { words } from "../db/schema"
import { readFileSync } from "fs"
import { join } from "path"

export const wordsRoutes = new Elysia().post("/api/seed-words", async () => {
  const db = getDb()
  if (!db) return { error: "Database not configured" }

  const filePath = join(import.meta.dir, "../../../data/words-uk.json")
  const raw = readFileSync(filePath, "utf-8")
  const wordsByCategory: Record<string, string[]> = JSON.parse(raw)

  let count = 0
  for (const [category, categoryWords] of Object.entries(wordsByCategory)) {
    for (const word of categoryWords) {
      try {
        await db.insert(words).values({ word, category, difficulty: 1 }).onConflictDoNothing()
        count++
      } catch {
        // Skip duplicates
      }
    }
  }

  return { seeded: count }
})
