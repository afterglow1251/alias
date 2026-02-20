import { readFileSync } from "fs"
import { join } from "path"

let allWords: string[] = []

export function loadWords() {
  const filePath = join(import.meta.dir, "../../data/words-uk.json")
  const raw = readFileSync(filePath, "utf-8")
  allWords = JSON.parse(raw)
  console.log(`Loaded ${allWords.length} words`)
}

export function getWordPool(count: number = 200): string[] {
  const pool = [...allWords]

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, count)
}
