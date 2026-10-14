import { z } from "zod";
import { router, protectedProcedure, adminProcedure, isAdminEmail } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { userService } from "../../services";
import AdminService from "@repo/services/admin";

const adminService = new AdminService();
const getPath = generatePath("/admin");

export const adminRouter = router({
  /* Whether the signed-in user can open the admin panel (used to show the sidebar link) */
  me: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/me"), tags: ["Admin"], summary: "Is the caller an admin", protect: true } })
    .input(z.void())
    .output(z.object({ isAdmin: z.boolean() }))
    .query(async ({ ctx }) => {
      const user = await userService.getUserById(ctx.auth.userId);
      return { isAdmin: isAdminEmail(user?.email) };
    }),

  overview: adminProcedure
    .meta({ openapi: { method: "GET", path: getPath("/overview"), tags: ["Admin"], summary: "Platform-wide numbers", protect: true } })
    .input(z.object({ days: z.number().int().min(1).max(365).default(30) }))
    .output(z.any())
    .query(async ({ input }) => adminService.getPlatformOverview(input.days)),
});
