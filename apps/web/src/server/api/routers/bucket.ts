import { getPresignedPostUrl } from "@/server/object-storage";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const bucketRouter = createTRPCRouter({
  getPresignedUpload: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await getPresignedPostUrl(input.fileName);
      return result;
    }),
});
