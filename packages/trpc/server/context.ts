export type AuthContext = {
  userId: string | null;
};

export function createBaseContext(auth: AuthContext) {
  return { auth };
}

export type Context = ReturnType<typeof createBaseContext>;
