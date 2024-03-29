import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { env } from "../env.mjs";
import { prisma } from "./db";
import { createNewCustomer } from "./stripe/utils";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.stripeCustomerId = user.stripeCustomerId;

        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      // @todo move this logic in a service or a helper

      const customer = await createNewCustomer({
        email: user.email!,
        name: user.name!,
      });
      const userUpdated = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: customer.id,
        },
      });

      // @todo add logger
      console.log(
        `Added stripeCustomerId to user ${userUpdated.id}, the value of stripeCustomerId is ${userUpdated.stripeCustomerId}`
      );
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
