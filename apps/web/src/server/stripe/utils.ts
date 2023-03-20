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
