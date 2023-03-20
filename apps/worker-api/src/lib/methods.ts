import { Context } from "hono"
import { Env } from ".."

type Args = {
  context: Context<"projectId", { Bindings: Env }, unknown>
  viewKey: string
  totalKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geo: any
}

export async function saveView({ context: c, geo, viewKey, totalKey }: Args) {
  await c.env.VIEWS.put(viewKey, `v_${viewKey}`, {
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
    /// 30 minutes
    expirationTtl: 60 * 30,
  })

  const currentTotalResult = await c.env.VIEWS.get(totalKey, "text")
  const currentTotal = currentTotalResult ? parseInt(currentTotalResult) : 0
  await c.env.VIEWS.put(totalKey, `${currentTotal + 1}`, {
    metadata: {
      isTotalKey: true,
    },
  })

  return
}
