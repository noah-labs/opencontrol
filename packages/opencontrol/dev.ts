#!/usr/bin/env bun

import { create } from "./src/index.js"
import { tool } from "./src/tool.js"
import { z } from "zod"
import { anthropic } from "@ai-sdk/anthropic"
import { HTTPException } from "hono/http-exception"
import jwt from "jsonwebtoken"

// Create a sample tool
const echoTool = tool({
  name: "echo",
  description: "Echoes back the input",
  args: z.object({
    message: z.string(),
  }),
  async run(args) {
    return { message: args.message }
  },
})


const JWT_SECRET = "your-jwt-secret-key"

const jwtAuthMiddleware = async (c, next) => {
  console.log("JWT auth middleware")
  const authHeader = c.req.header("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("error")
    throw new HTTPException(401, { message: "Unauthorized: Missing or invalid token format" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    // Store the decoded user info in the request context for later use
    c.set("user", decoded)

    // You can add additional checks here, e.g.:
    // - Check if user has required permissions
    // - Validate token expiration
    // - Check if user exists in database

    // If everything is valid, proceed to the next middleware
    return next()
  } catch (error) {
    // Handle different JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      throw new HTTPException(401, { message: "Unauthorized: Token expired" })
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new HTTPException(401, { message: "Unauthorized: Invalid token" })
    } else {
      throw new HTTPException(500, { message: "Internal server error during authentication" })
    }
  }
}

// Create the OpenControl app with the sample tool
const app = create({
  tools: [echoTool],
  model: anthropic("claude-3-7-sonnet-20250219"),
  // disableAuth: true,
})

app.auth(jwtAuthMiddleware)

// Or use the default auth
// app.init()

// Start the server
console.log("Starting OpenControl dev server on http://localhost:3000")
export default {
  port: 3000,
  fetch: app.fetch,
}
