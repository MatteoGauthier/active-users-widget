// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"; 
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: User;
  }
  interface User {
    role: Role;
    stripeCustomerId?: string;
  }
}
