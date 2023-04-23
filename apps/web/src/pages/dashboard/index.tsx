import NewProjectCard from "@/components/dashboard/NewProjectCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import SetupSuccessModal from "@/components/dashboard/SetupSuccessModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/utils/api";
import { showSuccessConfettis } from "@/utils/visuals";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const dashboardProjects = api.project.getUserDashboardProjects.useQuery();

  const projects = dashboardProjects.data?.projects;
  const code = dashboardProjects.data?.code;

  const router = useRouter();

  useEffect(() => {
    if (router.query?.setup === "true") {
      showSuccessConfettis();
      setShowSuccessModal(true);
      setTimeout(() => {
        router.replace({
          pathname: "/dashboard",
          query: {},
        });
      }, 100);
    }
  }, [router]);

  return (
    <DashboardLayout>
      {showSuccessModal && <SetupSuccessModal />}
      <div>
        <h2 className="mt-8 mb-4 font-display text-3xl font-semibold">
          Projects
        </h2>
        <div className="flex flex-col space-y-3">
          {projects?.map((project) => (
            <ProjectCard
              project={project}
              key={"dashboard-" + project.id}
              codeSnippet={code}
            />
          ))}
          <NewProjectCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
