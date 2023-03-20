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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geo = c.req.cf as any

  c.executionCtx.waitUntil(saveView({ context: c, viewKey, totalKey, geo }))

  return c.json({
    message: "Captured",
  })
})

app.get("/:projectId/stats", async (c) => {
  const lastViews = await c.env.VIEWS.list<Metadata>({
    prefix: `${c.req.param().projectId}:`,
  })
  const totalViewsResult = await c.env.VIEWS.get(`${c.req.param().projectId}:total`, "text")
  const totalViews = totalViewsResult ? parseInt(totalViewsResult) : null

  const result: StatisticsJson = {
    last30Minutes: lastViews.keys.filter((e) => e.metadata && !e.metadata.isTotalKey).length,
    totalViews: totalViews || 0,
    averageViewsLocation: averageLocationFromKeys(lastViews.keys),
    views: lastViews.keys as Key[],
    topCountry: findTopCountryFromKeys(lastViews.keys),
  }
  return c.json(result)
})

app.get("/global", async (c) => {
  const views = await c.env.VIEWS.list()
  return c.json(views)
})

export default app
