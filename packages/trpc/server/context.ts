export type BaseContextInput = {
  userId: string | null;
  requestId?: string;
  ipAddress?: string;
  country?: string;
};

export function createBaseContext(input: BaseContextInput) {
  return {
    auth: {

      userId: input.userId,
      clerkId: input.userId,
    },
    requestId: input.requestId ?? "unknown",
    ipAddress: input.ipAddress,
    country: input.country,
  };
}

export type Context = ReturnType<typeof createBaseContext>;
