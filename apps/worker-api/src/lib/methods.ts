import { Context } from "hono"
import { Env } from ".."

type Args = {
  context: Context<"projectId", { Bindings: Env }, unknown>
  viewKey: string
  totalKey: string
  geo: any
}

export async function saveView({ context: c, geo, viewKey, totalKey }: Args) {
  let savedView = await c.env.VIEWS.put(viewKey, `v_${viewKey}`, {
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

  let currentTotalResult = await c.env.VIEWS.get(totalKey, "text")
  let currentTotal = currentTotalResult ? parseInt(currentTotalResult) : 0
  const savedNewTotal = await c.env.VIEWS.put(totalKey, `${currentTotal + 1}`)

  return {
    savedView,
    savedNewTotal,
  }
}
