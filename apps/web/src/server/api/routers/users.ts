import { Plan } from "@prisma/client";
import { z } from "zod";
import { maxProjectByPlan, planSchema } from "../../../utils/common";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.count({
      where: {
        ownerId: ctx.session.user.id,
      },
    });

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    return {
      projectCount: projects,
      maxProjects: maxProjectByPlan[user?.plan ?? Plan.FREE],
      user,
    };
  }),
  subscriptionStatus: protectedProcedure
    .output(
      z.object({
        status: planSchema,
      })
    )
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          stripeCustomerId: true,
          plan: true,
        },
      });

      return {
        status: user?.plan ?? Plan.FREE,
      };
    }),
});
