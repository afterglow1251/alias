import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL

let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (!db) {
    if (!connectionString) {
      console.warn("DATABASE_URL not set — DB features disabled")
      return null
    }
    const client = postgres(connectionString, { prepare: false, ssl: "require" })
    db = drizzle(client, { schema })
  }
  return db
}
