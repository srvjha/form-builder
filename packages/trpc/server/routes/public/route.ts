import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService, responseService, analyticsService, userService } from "../../services";
import { submitResponseSchema, trackEventSchema } from "../../schemas/form.schemas";
import { getEmailService } from "../../services/email";

const TAGS = ["Public"];
const getPath = generatePath("/public");

export const publicRouter = router({

  getForm: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/forms/{slug}"),
        tags: TAGS,
        summary: "Get a published form by its slug (no auth required)",
      },
    })
    .input(z.object({ slug: z.string().min(1) }))
    .output(z.any())
    .query(async ({ input, ctx }) => {
      try {
        return await formService.getPublicFormBySlug(input.slug);
      } catch (err: unknown) {

        if (err && typeof err === "object" && "code" in err) {
          const e = err as { code: string; message: string };
          if (e.code === "FORM_CLOSED" || e.code === "FORM_EXPIRED" || e.code === "FORM_FULL") {
            throw new TRPCError({ code: "FORBIDDEN", message: e.message });
          }
        }
        throw err;
      }
    }),

  submit: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/forms/{slug}/submit"),
        tags: TAGS,
        summary: "Submit a response to a published form (no auth required)",
      },
    })
    .input(submitResponseSchema)
    .output(z.object({ responseId: z.string().uuid(), message: z.string() }))
    .mutation(async ({ input, ctx }) => {

      let form: Awaited<ReturnType<typeof formService.getPublicFormBySlug>>;
      try {
        form = await formService.getPublicFormBySlug(input.slug);
      } catch (err: unknown) {
        if (err && typeof err === "object" && "code" in err) {
          const e = err as { code: string; message: string };
          throw new TRPCError({ code: "FORBIDDEN", message: e.message });
        }
        throw err;
      }

      const ip = ctx.ipAddress;
      if (form.settings?.oneResponsePerIp && ip) {
        const already = await responseService.hasIpAlreadySubmitted(form.id, ip);
        if (already) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You have already submitted a response to this form.",
          });
        }
      }

      const response = await responseService.submitResponse({
        formId: form.id,
        respondentEmail: input.respondentEmail,
        ipAddress: ip,
        completionTimeMs: input.completionTimeMs,
        metadata: input.metadata,
        // Zod v4 infers `value` as optional; normalise to the required AnswerValue type
        answers: input.answers.map((a) => ({
          fieldId: a.fieldId,
          value: (a.value ?? null) as string | number | boolean | string[] | null,
        })),
      });

      analyticsService
        .trackEvent({
          formId: form.id,
          event: "submit",
          ipAddress: ip,
          referrer: input.metadata?.referer,
        })
        .catch(() => void 0);

      const emailService = getEmailService();
      const webUrl = process.env["WEB_URL"] ?? "http://localhost:3000";

      userService
        .getUserById(form.userId)
        .then(async (creator) => {
          if (!creator) return;
          return emailService.sendNewResponseNotification({
            creatorEmail: creator.email,
            creatorName: creator.fullName,
            formTitle: form.title,
            formSlug: input.slug,
            responseId: response.id,
            respondentEmail: input.respondentEmail,
            submittedAt: response.submittedAt,
            dashboardUrl: webUrl,
          });
        })
        .catch(() => void 0);

      if (input.respondentEmail) {
        emailService
          .sendRespondentConfirmation({
            respondentEmail: input.respondentEmail,
            formTitle: form.title,
            successMessage: form.successMessage ?? "Thank you for your response!",
            appName: process.env["APP_NAME"] ?? "FormCraft",
          })
          .catch(() => void 0);
      }

      return {
        responseId: response.id,
        message: form.successMessage ?? "Thank you for your response!",
      };
    }),

  trackEvent: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/analytics/track"),
        tags: TAGS,
        summary: "Track a form interaction event (view, start, abandon)",
      },
    })
    .input(trackEventSchema)
    .output(z.object({ tracked: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      await analyticsService.trackEvent({
        formId: input.formId,
        event: input.event,
        ipAddress: ctx.ipAddress,
        durationMs: input.durationMs,
        referrer: input.referrer,
      });
      return { tracked: true };
    }),
});
