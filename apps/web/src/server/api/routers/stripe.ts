import Stripe from "stripe";
import { z } from "zod";
import { getBaseUrl, planSchema } from "../../../utils/common";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        plan: planSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { stripe, session, req } = ctx;

      const customerId = z.string().parse(session.user.stripeCustomerId);

      const productQueryResult = await stripe.products.search({
        query: `active:'true' AND metadata['plan_id']:'${input.plan}'`,
      });

      const productPriceId = z
        .string()
        .parse(productQueryResult.data[0]?.default_price);

      const baseUrl = getBaseUrl(req);

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: session.user?.id,
        // payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: productPriceId,
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/dashboard?success=true`,
        cancel_url: `${baseUrl}/dashboard?cancel=true`,
        subscription_data: {
          metadata: {
            userId: session.user?.id,
            // plan_id: input.plan,
          },
        },
      });

      if (!checkoutSession) {
        throw new Error("Could not create checkout session");
      }

      return { checkoutUrl: checkoutSession.url };
    }),
  updateSubscription: protectedProcedure
    .input(
      z
        .object({
          plan: planSchema,
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      const { stripe, session, req } = ctx;

      const customerId = z.string().parse(session.user.stripeCustomerId);

      const customer = (await stripe.customers.retrieve(customerId, {
        expand: ["subscriptions"],
      })) as Stripe.Customer;

      const customerSubscriptionId = (
        customer?.subscriptions?.data as Stripe.Subscription[]
      )[0]?.id;

      const returnUrl = `${getBaseUrl(req)}${"/dashboard/my-account"}`;

      const stripeBillingPortalSession =
        await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: returnUrl,
        });

      return {
        // prettier-ignore
        billingPortalUrl: `${stripeBillingPortalSession.url}/subscriptions/${customerSubscriptionId}/${input?.plan == "FREE" ? "cancel" : "update"}`,
      };
    }),

  createBillingPortalSession: protectedProcedure
    .input(
      z
        .object({
          returnPathUrl: z.string().optional(),
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      const { stripe, session, req } = ctx;

      const customerId = z.string().parse(session.user.stripeCustomerId);

      const baseUrl = getBaseUrl(req);
      const returnUrl = `${baseUrl}${
        input?.returnPathUrl || "/dashboard/my-account"
      }`;

      const stripeBillingPortalSession =
        await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: returnUrl,
        });

      if (!stripeBillingPortalSession) {
        throw new Error("Could not create billing portal session");
      }

      return { billingPortalUrl: stripeBillingPortalSession.url };
    }),
});
