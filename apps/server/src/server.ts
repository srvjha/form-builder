import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import * as trpcExpress from "@trpc/server/adapters/express";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createBaseContext } from "@repo/trpc/server";
import { handleClerkWebhook } from "./webhooks/clerk";
import { env } from "./env";

export const app = express();

// ─── OpenAPI document (generated once at startup) ────────────────────────────
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Form Builder",
  description: "Form Builder API",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

app.use(
  cors({
    origin: env.NODE_ENV === "development" ? "*" : env.BASE_URL,
    credentials: true,
  }),
);

//Clerk webhook
app.post(
  "/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook,
);

// Clerk auth middleware
// Attaches auth state to every request so getAuth(req) works inside createContext.
// Public routes are still accessible — Clerk attaches null userId for unauthenticated requests.
app.use(clerkMiddleware());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Context factory ──────────────────────────────────────────────────────────
// Reads Clerk's verified auth state from the request and passes it into tRPC.
// @clerk/express lives here (apps/server) — @repo/trpc stays framework-agnostic.
const createContext = ({ req }: CreateExpressContextOptions) =>
  createBaseContext({ userId: getAuth(req).userId ?? null });

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ message: "Form builder is up and running" });
});

app.get("/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});

app.use("/docs", apiReference({ url: "/openapi.json" }));

// REST (OpenAPI) adapter
app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

// tRPC adapter — for the Next.js frontend 
app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
