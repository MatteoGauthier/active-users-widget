import { cors } from "hono/cors"
import { nanoid } from "nanoid"
import { Key, Metadata, StatisticsJson } from "shared-types"

import { Hono } from "hono"
import { saveView } from "./lib/methods"
import { averageLocationFromKeys, findTopCountryFromKeys } from "./lib/helpers"
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

  c.executionCtx.waitUntil(saveView({ context: c, viewKey, totalKey, geo }))

  return c.json({
    message: "Captured",
  })
})

app.get("/:projectId/stats", async (c) => {
  let lastViews = await c.env.VIEWS.list<Metadata>({
    prefix: `${c.req.param().projectId}:`,
  })
  let totalViewsResult = await c.env.VIEWS.get(`${c.req.param().projectId}:total`, "text")
  let totalViews = totalViewsResult ? parseInt(totalViewsResult) : null

  const result: StatisticsJson = {
    last30Minutes: lastViews.keys.filter((e) => e.metadata && !e.metadata.isTotalKey).length,
    totalViews,
    averageViewsLocation: averageLocationFromKeys(lastViews.keys),
    views: lastViews.keys as Key[],
    topCountry: findTopCountryFromKeys(lastViews.keys),
  }
  return c.json(result)
})

app.get("/global", async (c) => {
  let views = await c.env.VIEWS.list()
  return c.json(views)
})

export default app
