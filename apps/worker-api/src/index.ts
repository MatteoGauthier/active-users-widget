import { cors } from "hono/cors"
import { nanoid } from "nanoid"

import { Hono } from "hono"
import { saveView } from "./lib/methods"
export interface Env {
  VIEWS: KVNamespace
}

const app = new Hono<{ Bindings: Env }>()
app.use(
  "/*",
  cors({
    origin: "*",
  })
)

app.get("/:projectId/capture", async (c) => {
  const id = nanoid()
  const viewKey = `${c.req.param().projectId}:${id}`
  const totalKey = `${c.req.param().projectId}:total`

  const geo = c.req.cf as any

  saveView({ context: c, viewKey, totalKey, geo })

  return c.json({
    message: "Captured",
  })
})

app.get("/:projectId/stats", async (c) => {
  let lastViews = await c.env.VIEWS.list({
    prefix: `${c.req.param().projectId}:`,
  })
  let totalViewsResult = await c.env.VIEWS.get(`${c.req.param().projectId}:total`, "text")
  let totalViews = totalViewsResult ? parseInt(totalViewsResult) : null

  const result = {
    last30days: lastViews.keys.length,
    totalViews,
  }
  return c.json(result)
})

app.get("/global", async (c) => {
  let views = await c.env.VIEWS.list()
  return c.json(views)
})

export default app
