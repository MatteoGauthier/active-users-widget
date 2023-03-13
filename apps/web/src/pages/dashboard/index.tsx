import NewProjectCard from "../../components/dashboard/NewProjectCard";
import ProjectCard from "../../components/dashboard/ProjectCard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { api } from "../../utils/api";

export default function DashboardPage() {
  const dashboardProjects = api.project.getUserDashboardProjects.useQuery();

  const projects = dashboardProjects.data?.projects;
  const code = dashboardProjects.data?.code;

  return (
    <DashboardLayout>
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
