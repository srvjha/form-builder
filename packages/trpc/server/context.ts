// Auth info is injected by the server (apps/server) via Clerk's getAuth().
// Keeping this framework-agnostic means @repo/trpc does NOT depend on @clerk/express.
export type AuthContext = {
  userId: string | null; // null = unauthenticated
};

export function createBaseContext(auth: AuthContext) {
  return { auth };
}

export type Context = ReturnType<typeof createBaseContext>;
