import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";
import { paginationSchema } from "../../schemas/form.schemas";

const TAGS = ["Explore"];
const getPath = generatePath("/explore");

export const exploreRouter = router({

  listForms: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/forms"),
        tags: TAGS,
        summary: "Browse publicly visible forms (visibility=public, status=published)",
      },
    })
    .input(
      paginationSchema.merge(
        z.object({ search: z.string().optional() }),
      ),
    )
    .output(z.any())
    .query(async ({ input }) => {
      return formService.listPublicForms({
        limit: input.pageSize,
        offset: (input.page - 1) * input.pageSize,
        search: input.search,
      });
    }),

});
