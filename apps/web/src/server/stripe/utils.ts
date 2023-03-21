import { sift } from "radash";
import { stripe } from "./client";

export const createNewCustomer = async ({
  email,
  name,
}: {
  email: string;
  name?: string;
}) => {
  const customer = await stripe.customers.create({
    email,
    name,
  });

  return customer;
};

export const getAvailablePlans = async () => {
  // @todo validate metadata
  const productsResponse = (
    await stripe.products.list({
      active: true,
    })
  ).data;
  const products = sift(
    productsResponse.map((p) => ({
      plan: p.metadata.plan_id,
      productId: p.id,
    }))
  );
  return products;
};
