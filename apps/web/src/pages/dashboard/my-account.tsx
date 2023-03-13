import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import RingProgress from "../../components/dashboard/RingProgress";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { api } from "../../utils/api";

export default function MyAccountPage() {
  const { data: sessionData } = useSession();

  const { data: currentUser, isSuccess } = api.user.me.useQuery();

  const ringProgressValue =
    isSuccess &&
    Math.round((currentUser?.projectCount / currentUser?.maxProjects) * 100);
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
                    {"FREE"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
