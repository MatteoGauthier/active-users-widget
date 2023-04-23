import { createTRPCRouter } from "./trpc";
import { projectRouter } from "./routers/project";
import { userRouter } from "./routers/users";
import { stripeRouter } from "./routers/stripe";
import { bucketRouter } from "./routers/bucket";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  user: userRouter,
  stripe: stripeRouter,
  bucket: bucketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
