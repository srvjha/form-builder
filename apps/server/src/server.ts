import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import * as trpcExpress from "@trpc/server/adapters/express";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";

import { serverRouter, createBaseContext } from "@repo/trpc/server";
import { handleClerkWebhook } from "./webhooks/clerk.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { ApiResponse } from "./lib/api-response.js";
import { env } from "./env.js";

export const app = express();

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

app.post(
  "/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook,
);

app.use(clerkMiddleware());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const createContext = ({ req }: CreateExpressContextOptions) =>
  createBaseContext({ userId: getAuth(req).userId ?? null });

app.get("/", (_req, res) => {
  ApiResponse.ok(res, { message: "Form builder is up and running" });
});

app.get("/openapi.json", (_req, res) => {
  ApiResponse.ok(res, openApiDocument);
});

app.use("/docs", async (req, res, next) => {
  const { apiReference } = await import("@scalar/express-api-reference");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return apiReference({ url: "/openapi.json" })(req as any, res, next);
});

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
