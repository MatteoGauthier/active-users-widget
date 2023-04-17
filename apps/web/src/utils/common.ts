import { Plan } from "@prisma/client";
import { NextApiRequest } from "next";
import { z } from "zod";
import { env } from "../env.mjs";
import { nanoid } from "nanoid";

export const statNumberFormatter = Intl.NumberFormat("en", {
  notation: "compact",
});

export const formatStatNumber = (n: number) => statNumberFormatter.format(n);

export const getUpperPlan = (plan: Plan) => {
  switch (plan) {
    case Plan.FREE:
      return Plan.PRO;
    case Plan.PRO:
      return Plan.BUSINESS;
    case Plan.BUSINESS:
  }
};

// Inverse of upper

export const getLowerPlan = (plan: Plan) => {
  switch (plan) {
    case Plan.FREE:
    case Plan.PRO:
      return Plan.FREE;
    case Plan.BUSINESS:
      return Plan.PRO;
  }
};

export const maxProjectByPlan: Record<Plan, number> = {
  FREE: 3,
  PRO: 10,
  BUSINESS: 100,
  ENTREPRISE: 500,
};

export const getBaseUrl = (req: NextApiRequest) => {
  return env.NODE_ENV === "development"
    ? `http://${req.headers.host ?? "localhost:3000"}`
    : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;
};

export const planSchema = z.nativeEnum(Plan);

export const generateProjectKey = () => nanoid(10);
