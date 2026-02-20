import { Elysia } from "elysia"
import { wsHandler } from "./ws/handler"
import { staticFiles } from "./static"
import { loadWords } from "./words"

const PORT = process.env.PORT || 3000

// Load words into memory
loadWords()

new Elysia()
  .use(wsHandler)
  .use(staticFiles) // Must be last — catch-all
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
