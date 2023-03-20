import { Plan } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import RingProgress from "../../components/dashboard/RingProgress";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { api } from "../../utils/api";
import { getLowerPlan, getUpperPlan } from "../../utils/common";

export default function MyAccountPage() {
  const { data: sessionData } = useSession();

  const { data: currentUser, isSuccess } = api.user.me.useQuery();

  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();

  const { mutateAsync: updateSubscriptionSession } =
    api.stripe.updateSubscription.useMutation();

  const { mutateAsync: createBillingPortalSession } =
    api.stripe.createBillingPortalSession.useMutation();

  const router = useRouter();

  const subscribe = useCallback(
    async (plan: Plan) => {
      const { checkoutUrl } = await createCheckoutSession({
        plan,
      });

      if (checkoutUrl) {
        router.push(checkoutUrl);
      }
    },
    [createCheckoutSession, router]
  );

  const updateSubscription = useCallback(
    async (plan: Plan) => {
      const { billingPortalUrl } = await updateSubscriptionSession({
        plan,
      });

      if (billingPortalUrl) {
        router.push(billingPortalUrl);
      }
    },
    [router, updateSubscriptionSession]
  );

  const manageBilling = useCallback(async () => {
    const { billingPortalUrl } = await createBillingPortalSession();

    if (billingPortalUrl) {
      router.push(billingPortalUrl);
    }
  }, [createBillingPortalSession, router]);

  const ringProgressValue =
    isSuccess &&
    Math.round((currentUser?.projectCount / currentUser?.maxProjects) * 100);

  const possiblePlan = currentUser?.user?.plan && {
    upper: getUpperPlan(currentUser?.user?.plan),
    lower: getLowerPlan(currentUser?.user?.plan),
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="mt-8 mb-4 font-display text-3xl font-semibold">
          My Account
        </h2>
        <div>
          {sessionData && sessionData.user.image && (
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center space-x-4 rounded-md border border-gray-200 p-4">
                <Image
                  src={sessionData.user.image || ""}
                  width="64"
                  height="64"
                  alt="user avatar"
                  className="rounded-full"
                />
                <div className="text-md flex flex-col text-slate-800">
                  <span>
                    <strong>Name :</strong> {sessionData.user.name}
                  </span>
                  <span>
                    <strong>Email :</strong> {sessionData.user.email}
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center space-x-4 rounded-md border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <RingProgress
                    value={ringProgressValue || 0}
                    size={64}
                    label={`${currentUser?.projectCount}/${currentUser?.maxProjects}`}
                  />
                  <span>
                    {`${currentUser?.projectCount}/${currentUser?.maxProjects} `}
                    projects created
                  </span>
                </div>
              </div>
              <div className="inline-flex  space-x-4 rounded-md border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <span>Current plan : </span>
                  <div className="rounded-full bg-teal-200 px-2 py-1 text-sm font-semibold">
                    {currentUser?.user?.plan}
                  </div>
                </div>
              </div>
              <div className="inline-flex  space-x-4 rounded-md border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <button
                    className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
                    onClick={() => subscribe("PRO")}
                  >
                    Subscribe to PRO Plan
                  </button>
                </div>
              </div>
              <div className="inline-flex  space-x-4 rounded-md border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <button
                    className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
                    onClick={() => subscribe("BUSINESS")}
                  >
                    Subscribe to BUSINESS Plan
                  </button>
                </div>
              </div>
              <div className="inline-flex  space-x-4 rounded-md border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <button
                    className="w-fit cursor-pointer rounded-md bg-sky-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-sky-600 disabled:opacity-50"
                    disabled={!possiblePlan?.upper}
                    onClick={() =>
                      possiblePlan?.upper &&
                      updateSubscription(possiblePlan?.upper)
                    }
                  >
                    Upgrade to {possiblePlan?.upper || currentUser?.user?.plan}{" "}
                    Plan
                  </button>
                </div>
              </div>
              <div className="inline-flex  space-x-4 rounded-md border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <button
                    className="w-fit cursor-pointer rounded-md bg-sky-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-sky-600 disabled:opacity-50"
                    disabled={!possiblePlan?.lower}
                    onClick={() =>
                      possiblePlan?.lower &&
                      updateSubscription(possiblePlan?.lower)
                    }
                  >
                    Downgrade to{" "}
                    {possiblePlan?.lower || currentUser?.user?.plan} Plan
                  </button>
                </div>
              </div>
              <div className="inline-flex  space-x-4 rounded-md border border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <button
                    className="w-fit cursor-pointer rounded-md bg-orange-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-orange-600"
                    onClick={manageBilling}
                  >
                    Manage subscription and billing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
