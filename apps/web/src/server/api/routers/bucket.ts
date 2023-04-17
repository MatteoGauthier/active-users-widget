import { getPresignedPostUrl } from "@/server/object-storage";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const bucketRouter = createTRPCRouter({
  getPresignedPostUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const url = await getPresignedPostUrl(input.fileName);
      return url;
    }),
});
