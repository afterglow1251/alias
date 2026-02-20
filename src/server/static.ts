import { Elysia } from "elysia"
import { join } from "path"

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
}

const distDir = join(import.meta.dir, "../../dist/client")

export const staticFiles = new Elysia().get("/*", async ({ params }) => {
  const filePath = params["*"] || "index.html"
  const fullPath = join(distDir, filePath)
  const file = Bun.file(fullPath)

  if (await file.exists()) {
    const ext = "." + filePath.split(".").pop()
    const contentType = MIME_TYPES[ext] || "application/octet-stream"
    return new Response(file, {
      headers: { "Content-Type": contentType },
    })
  }

  // SPA fallback
  const indexFile = Bun.file(join(distDir, "index.html"))
  if (await indexFile.exists()) {
    return new Response(indexFile, {
      headers: { "Content-Type": "text/html" },
    })
  }

  return new Response("Not found", { status: 404 })
})
