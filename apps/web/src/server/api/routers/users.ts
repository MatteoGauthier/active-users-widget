import { Plan } from "@prisma/client";
import { z } from "zod";
import { generateProjectKey, maxProjectByPlan, planSchema } from "../../../utils/common";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { isEmpty } from "radash";

export const userRouter = createTRPCRouter({
  knownUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        projects: true,
      },
    });

    if (isEmpty(user?.projects)) {
      return false;
    }
    return true;
  }),

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
  setup: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        avatar: z.string().optional(),
        followProductUpdates: z.boolean().optional(),
        project: z.object({
          name: z.string(),
          // allowedOrigin: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // @todo add followProductUpdates
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          email: input.email,
          image: input.avatar,
        },
      });
      await ctx.prisma.project.create({
        data: {
          name: input.project.name,
          // allowedOrigins: [input.project.allowedOrigin],
          key: generateProjectKey(),
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
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
