import { Hono } from "hono"
import { Tool } from "./tool.js"
import { createMcp } from "./mcp.js"
import { cors } from "hono/cors"
import HTML from "opencontrol-frontend/dist/index.html" with { type: "text" }
import { zValidator } from "@hono/zod-validator"
import {
  APICallError,
  LanguageModelV1,
  LanguageModelV1CallOptions,
} from "ai"
import { z } from "zod"
import { HTTPException } from "hono/http-exception"
import type { Context } from "hono"

export interface OpenControlOptions {
  tools: Tool[]
  model?: LanguageModelV1
  app?: Hono
}

export type App = ReturnType<typeof create>

export function create(input: OpenControlOptions) {
  const mcp = createMcp({ tools: input.tools })
  const app = input.app ?? new Hono()

  const generateHandler = async (c: Context) => {
    if (!input.model)
      throw new HTTPException(400, { message: "No model configured" })
    // @ts-ignore
    const body = c.req.valid("json") as LanguageModelV1CallOptions
    try {
      const result = await input.model.doGenerate(body)
      return c.json(result)
    } catch (error) {
      console.error(error)
      if (error instanceof APICallError) {
        throw new HTTPException(error.statusCode || (500 as any), {
          message: "error",
        })
      }
      throw new HTTPException(500, { message: "error" })
    }
  }

  const mcpHandler = async (c: Context) => {
    const body = await c.req.json()
    const result = await mcp.process(body)
    return c.json(result)
  }

  app.use(
    cors({
      origin: "*",
      allowHeaders: ["*"],
      allowMethods: ["GET", "POST"],
      credentials: true,
    })
  )

  app.get("/", async (c) => {
    return c.html(HTML)
  })

  app.post(
    "/generate",
    // @ts-ignore 
    zValidator("json", z.custom<LanguageModelV1CallOptions>()),
    generateHandler
  )

  app.post("/mcp", mcpHandler)

  return {
    fetch: app.fetch.bind(app),
  }
}
