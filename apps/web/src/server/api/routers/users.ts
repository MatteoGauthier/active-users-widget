import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.count({
      where: {
        ownerId: ctx.session.user.id,
      },
    });

    const maxProjectByPlan = {
      free: 3,
      pro: 10,
      entreprise: 100,
      // @todo Add more plans
    };

    return {
      projectCount: projects,
      maxProjects: maxProjectByPlan.free
      // maxProjects: maxProjectByPlan[ctx.session.user.plan],
    };
  }),
});
