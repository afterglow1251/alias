import { readFileSync } from "fs"
import { join } from "path"

let wordsByCategory: Record<string, string[]> = {}

export function loadWords() {
  const filePath = join(import.meta.dir, "../../data/words-uk.json")
  const raw = readFileSync(filePath, "utf-8")
  wordsByCategory = JSON.parse(raw)
  const total = Object.values(wordsByCategory).reduce((sum, words) => sum + words.length, 0)
  console.log(`Loaded ${total} words in ${Object.keys(wordsByCategory).length} categories`)
}

export function getCategories(): string[] {
  return Object.keys(wordsByCategory)
}

export function getWordPool(categories: string[], count: number = 200): string[] {
  const allWords: string[] = []

  for (const cat of categories) {
    const words = wordsByCategory[cat]
    if (words) {
      allWords.push(...words)
    }
  }

  // Fisher-Yates shuffle
  for (let i = allWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allWords[i], allWords[j]] = [allWords[j], allWords[i]]
  }

  return allWords.slice(0, count)
}
