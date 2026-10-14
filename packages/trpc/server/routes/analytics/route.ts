import { z } from "zod";
import { router, protectedProcedure } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { analyticsService, formService } from "../../services";

const getPath = generatePath("/analytics");

/* Analytics across all of the signed-in user's forms, or one of them */
export const analyticsRouter = router({
  overview: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/overview"),
        tags: ["Analytics"],
        summary: "Analytics across all your forms, or a single form",
        protect: true,
      },
    })
    .input(
      z.object({
        formId: z.string().uuid().optional(),
        days: z.number().int().min(1).max(365).default(30),
      }),
    )
    .output(z.any())
    .query(async ({ ctx, input }) => {
      const forms = await formService.getFormsByUser(ctx.auth.userId);

      // A single form must belong to the caller (throws otherwise)
      if (input.formId) await formService.getFormById(input.formId, ctx.auth.userId);
      const ids = input.formId ? [input.formId] : forms.map((f) => f.id);

      const from = new Date();
      from.setUTCHours(0, 0, 0, 0);
      from.setUTCDate(from.getUTCDate() - (input.days - 1));

      const [summary, perFormTotals] = await Promise.all([
        analyticsService.getAnalyticsForForms(ids, { from }),
        analyticsService.getPerFormTotals(ids, { from }),
      ]);

      const byId = new Map(forms.map((f) => [f.id, f]));
      const perForm = perFormTotals
        .map((t) => ({
          ...t,
          title: byId.get(t.formId)?.title ?? "Untitled form",
          status: byId.get(t.formId)?.status ?? "draft",
          completionRate: t.views > 0 ? Math.round((t.submissions / t.views) * 100) : 0,
        }))
        .sort((a, b) => b.submissions - a.submissions || b.views - a.views);

      return {
        days: input.days,
        formId: input.formId ?? null,
        forms: forms.map((f) => ({ id: f.id, title: f.title, status: f.status, responseCount: f.responseCount })),
        summary,
        perForm,
      };
    }),
});
