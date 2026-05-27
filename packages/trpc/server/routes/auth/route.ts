import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../trpc";
import { zodUndefinedModel } from "../../schema";
import { generatePath } from "../../utils/path-generator";
import { getMeOutputModel } from "./model";
import { userService } from "../../services";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  getMe: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/me"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(getMeOutputModel)
    .query(async ({ ctx }) => {
      // After protectedProcedure ctx.auth.userId is the DB UUID (not Clerk ID).
      // The middleware already auto-provisions the user, so this lookup should
      // always succeed — but we guard just in case.
      const user = await userService.getUserById(ctx.auth.userId);
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User record could not be created or retrieved",
        });
      }
      return user;
    }),
});
