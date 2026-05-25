import { router } from "./trpc";
import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
});

export type ServerRouter = typeof serverRouter;

// createBaseContext is used by apps/server to build the per-request context.
// The server wraps it with Clerk's getAuth() before passing to tRPC adapters.
export { createBaseContext } from "./context";
export type { Context, AuthContext } from "./context";
