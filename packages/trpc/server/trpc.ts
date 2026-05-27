import { initTRPC, TRPCError } from "@trpc/server";
import { createClerkClient } from "@clerk/backend";
import { OpenApiMeta } from "trpc-to-openapi";
import type { Context } from "./context";
import UserService from "@repo/services/user";

const userService = new UserService();

// Lazy-initialise the Clerk client so we don't crash if the env var is absent
// in environments that never call protectedProcedure (e.g. pure public routes).
let _clerk: ReturnType<typeof createClerkClient> | null = null;
function getClerkClient() {
  if (!_clerk) {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "CLERK_SECRET_KEY is not configured on the server.",
      });
    }
    _clerk = createClerkClient({ secretKey });
  }
  return _clerk;
}

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<Context>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const protectedProcedure = tRPCContext.procedure.use(async ({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in to access this resource",
    });
  }

  let user = await userService.getUserByClerkId(ctx.auth.userId);

  // Auto-provision: first authenticated request creates the DB row via Clerk API
  if (!user) {
    try {
      const clerk = getClerkClient();
      const clerkUser = await clerk.users.getUser(ctx.auth.userId);
      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      );

      user = await userService.upsertUser({
        clerkId: ctx.auth.userId,
        email: primaryEmail?.emailAddress ?? `${ctx.auth.userId}@clerk.local`,
        fullName:
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          null,
        profileImageUrl: clerkUser.imageUrl ?? null,
      });
    } catch (err) {
      console.error("[protectedProcedure] auto-provision failed:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not provision your account. Please try again.",
      });
    }
  }

  return next({
    ctx: {
      ...ctx,
      auth: {
        userId: user.id,
        clerkId: ctx.auth.userId,
      },
    },
  });
});
