import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "../../server/auth";
import { prisma } from "../../server/db";
import { stripe } from "../../server/stripe/client";
import { getAvailablePlans } from "../../server/stripe/utils";
import { planSchema } from "../../utils/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return res.status(401).end();
  }

  const availablePlans = await getAvailablePlans();
  const users = await prisma.user.findMany();

  const result = [];

  for await (const customer of stripe.customers.list({
    limit: 100,
    expand: ["data.subscriptions.data.plan"],
  })) {
    const user = users.find((u) => u.stripeCustomerId === customer.id);
    const customerPlan = planSchema.parse(
      availablePlans.find(
        (p) =>
          (
            customer?.subscriptions?.data[0] as Stripe.Subscription & {
              plan: Stripe.Plan;
            }
          ).plan.product === p.productId
      )?.plan
    );

    if (user && user.plan !== customerPlan) {
      await prisma.user.update({
        where: { id: user.id },
        data: { plan: customerPlan },
      });
      result.push({
        userId: user.id,
        plan: customerPlan,
      });
    }
  }
  return res.status(200).json({
    message:
      result.length > 0
        ? "Successfully synced Stripe customers with User in DB"
        : "No changes",
    result: !result.length ? null : result,
  });
}
