import { Plan, PrismaClient } from "@prisma/client";
import type Stripe from "stripe";
import { z } from "zod";
import { planSchema } from "../../utils/common";
import { stripe } from "./client";

const subscriptionMetadataSchema = z.object({
  userId: z.string(),
  plan_id: planSchema,
});

export const handleSubscriptionCreated = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const subscription = event.data.object as Stripe.Subscription;

  const { userId, plan_id: planId } = subscriptionMetadataSchema.parse(
    subscription.metadata
  );

  // update user with subscription data
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      plan: planId as Plan,
    },
  });
};
export const handleSubscriptionUpdated = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const subscriptionItem = subscription.items.data[0];

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const productId = subscriptionItem?.plan.product;

  const product = await stripe.products.retrieve(productId as string);

  const customerUserId = (
    await prisma.user.findUnique({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
      select: {
        id: true,
      },
    })
  )?.id;

  if (!customerUserId) {
    throw new Error("User not found");
  }

  const metadata = subscriptionMetadataSchema.parse({
    plan_id: product?.metadata?.plan_id,
    userId: customerUserId,
  });

  // update user with subscription data
  await prisma.user.update({
    where: {
      id: metadata.userId,
    },
    data: {
      plan: metadata.plan_id,
    },
  });
};

export const handleSubscriptionCanceled = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId, plan_id: planId } = subscriptionMetadataSchema.parse(
    subscription.metadata
  );

  // remove subscription data from user
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      plan: "FREE",
    },
  });
};

// retrieves a Stripe customer id for a given user if it exists or creates a new one
export const getOrCreateStripeCustomerIdForUser = async ({
  stripe,
  prisma,
  userId,
}: {
  stripe: Stripe;
  prisma: PrismaClient;
  userId: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("User not found");

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // create a new customer
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.name ?? undefined,
    // use metadata to link this Stripe customer to internal user id
    metadata: {
      userId,
    },
  });

  // update with new customer id
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  if (updatedUser.stripeCustomerId) {
    return updatedUser.stripeCustomerId;
  }
};

export const handleInvoicePaid = async ({
  event,
  stripe,
  prisma,
}: {
  event: Stripe.Event;
  stripe: Stripe;
  prisma: PrismaClient;
}) => {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription;
  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId as string
  );
  const userId = subscription.metadata.userId;

  // update user with subscription data
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      // stripeSubscriptionId: subscription.id,
      // stripeSubscriptionStatus: subscription.status,
    },
  });
};
