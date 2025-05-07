import { hc } from "hono/client"
import { App } from "opencontrol"

export const client = hc<App>("", {
  async fetch(...args: Parameters<typeof fetch>): Promise<Response> {
    const [input, init] = args
    return fetch(input, {
      ...init,
      credentials: "same-origin" as RequestCredentials,
    })
  },
})

