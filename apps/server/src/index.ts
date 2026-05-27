import { logger } from "@repo/logger";
import { app } from "./server.js";
import { env } from "./env.js";

// ─── Vercel Serverless ────────────────────────────────────────────────────────
// Vercel's @vercel/node runtime picks up the default export and uses it as
// the HTTP handler — it never calls listen(). The `export default` here is
// what makes the deployment work.
export default app;

// ─── Local / Traditional server ───────────────────────────────────────────────
// Only start the HTTP server when NOT running inside Vercel (or any other
// serverless environment that sets VERCEL=1).
if (!process.env["VERCEL"]) {
  import("node:http").then(({ default: http }) => {
    const server = http.createServer(app);
    const PORT = Number(env.PORT) || 8000;

    server.listen(PORT, () => {
      logger.info("Server running", { port: PORT, env: env.NODE_ENV });
    });

    server.on("error", (error) => {
      logger.error("Server error", { error });
      process.exit(1);
    });
  }).catch((error) => {
    logger.error("Failed to start server", { error });
    process.exit(1);
  });
}
