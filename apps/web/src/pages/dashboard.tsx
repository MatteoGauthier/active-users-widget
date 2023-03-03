import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import shiki from "shiki";
import NewProjectCard from "../components/dashboard/NewProjectCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import { api } from "../utils/api";

export default function DashboardPage({
  code,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const mutation = api.project.useMutation();

  return (
    <div className="mx-auto max-w-screen-lg">
      <h1>Dashboard</h1>

      <div className="grid grid-cols-1">
        <div>
          <h2>Projects</h2>
          <div className="flex flex-col space-y-3">
            <ProjectCard codeSnippet={code} />
            <NewProjectCard onClick={() => {
              //
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const highlighter = await shiki.getHighlighter({
    theme: "github-light",
    langs: ["html"],
  });
  return {
    props: {
      code: highlighter.codeToHtml(
        `<script src="https://cdn.jsdelivr.net/npm/active-users-widget" data-active-users-project-id="HEY" type="module" defer async></script>`,
        {
          lang: "html",
        }
      ),
    },
  };
};
