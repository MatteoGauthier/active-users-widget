import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import shiki from "shiki";
import NewProjectCard from "../../components/dashboard/NewProjectCard";
import ProjectCard from "../../components/dashboard/ProjectCard";
import { prisma } from "../../server/db";
import { api } from "../../utils/api";

export default function DashboardPage() {
  const dashboardProjects = api.project.getUserDashboardProjects.useQuery();

  const projects = dashboardProjects.data?.projects;
  const code = dashboardProjects.data?.code;

  return (
    <div className="mx-auto max-w-screen-lg">
      <h1>Dashboard</h1>

      <div className="grid grid-cols-1">
        <div>
          <h2>Projects</h2>
          <div className="flex flex-col space-y-3">
            {projects?.map((project) => (
              <ProjectCard project={project} key={"dashboard-" + project.id} codeSnippet={code}/>
            ))}
            <NewProjectCard />
          </div>
        </div>
      </div>
    </div>
  );
}
