import { cors } from "hono/cors"
import { nanoid } from "nanoid"

import { Hono } from "hono"
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
  const key = `${c.req.param().projectId}:${id}`

  const geo = c.req.cf as any

  let value = await c.env.VIEWS.put(key, `v_${key}`, {
    metadata: {
      time: new Date().toISOString(),
      ip: c.req.headers.get("CF-Connecting-IP") || "unknown",
      realIp: c.req.headers.get("X-Real-IP") || "unknown",
      ua: c.req.headers.get("User-Agent") || "unknown",
      country: geo?.country || "unknown",
      city: geo?.city || "unknown",
      region: geo?.region || "unknown",
      longitude: geo?.longitude || "unknown",
      latitude: geo?.latitude || "unknown",
    },
    expirationTtl: 60 * 30,
  })

  return c.json({
    message: "Captured",
  })
})

app.get("/:projectId/stats", async (c) => {
  let views = await c.env.VIEWS.list({
    prefix: `${c.req.param().projectId}:`,
  })
  return c.json(views)
})

app.get("/global", async (c) => {
  let views = await c.env.VIEWS.list()
  return c.json(views)
})

export default app
