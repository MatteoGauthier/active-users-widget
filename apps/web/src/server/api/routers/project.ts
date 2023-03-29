import { nanoid } from "nanoid";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { getHighlightedWidgetSnippet } from "@/utils/code-snippets";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany();
  }),

  getUserDashboardProjects: protectedProcedure.query(async ({ ctx }) => {
    const { highlighted, raw } = await getHighlightedWidgetSnippet();

    return {
      projects: await ctx.prisma.project.findMany({
        where: {
          owner: {
            id: ctx.session.user.id,
          },
          key: {
            not: null,
          },
        },
      }),
      code: {
        highlighted,
        raw,
      },
    };
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          key: nanoid(10),
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return project;
    }),
});
