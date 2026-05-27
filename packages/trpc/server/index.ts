import { router } from "./trpc";
import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { formsRouter } from "./routes/forms/route";
import { publicRouter } from "./routes/public/route";
import { exploreRouter } from "./routes/explore/route";
import { themesRouter } from "./routes/themes/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  forms: formsRouter,
  public: publicRouter,
  explore: exploreRouter,
  themes: themesRouter,
});

export type ServerRouter = typeof serverRouter;

export { createBaseContext } from "./context";
export type { Context } from "./context";
