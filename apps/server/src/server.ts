import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import * as trpcExpress from "@trpc/server/adapters/express";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";

import { serverRouter, createBaseContext } from "@repo/trpc/server";
import { handleClerkWebhook } from "./webhooks/clerk.js";
import { env } from "./env.js";

export const app = express();

// ─── OpenAPI document (generated once at startup) ────────────────────────────
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Form Builder",
  description: "Form Builder API",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.NODE_ENV === "development" ? "*" : env.BASE_URL,
    credentials: true,
  }),
);

// ─── Clerk webhook ────────────────────────────────────────────────────────────
// MUST be before express.json() — svix needs raw Buffer body
app.post(
  "/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook,
);

// ─── Clerk auth middleware ─────────────────────────────────────────────────────
app.use(clerkMiddleware());

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Context factory ──────────────────────────────────────────────────────────
const createContext = ({ req }: CreateExpressContextOptions) =>
  createBaseContext({ userId: getAuth(req).userId ?? null });

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ message: "Form builder is up and running" });
});

app.get("/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});

// Scalar docs — dynamic import because @scalar/express-api-reference is ESM-only.
// Cast req to any to bridge the Express v4 types expected by @scalar and Express v5 we use.
app.use("/docs", async (req, res, next) => {
  const { apiReference } = await import("@scalar/express-api-reference");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return apiReference({ url: "/openapi.json" })(req as any, res, next);
});

// ─── API adapters ─────────────────────────────────────────────────────────────
// REST (OpenAPI) adapter — for external/REST clients
app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

// tRPC adapter — for the Next.js frontend (full type-safety)
app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
