import express from "express";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import {
  generateOpenApiDocument,
  createOpenApiExpressMiddleware,
} from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";
import { env } from "./env";

export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Form Builder",
  description: "Form Builder API",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api")
});

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "*",
    }),
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Form builder is up and running" });
});

// Docs
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

app.use("/docs", apiReference({ url: "/openapi.json" }));

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

export default app;
