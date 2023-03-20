import { createTRPCRouter } from "./trpc";
import { projectRouter } from "./routers/project";
import { userRouter } from "./routers/users";
import { stripeRouter } from "./routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  user: userRouter,
  stripe: stripeRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;
