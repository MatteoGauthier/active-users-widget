import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { prisma } from "../../server/db";

import { Project } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { serialize } from "superjson";
import GlobeViz from "@/components/dashboard/GlobeViz";
import { getStatistics } from "../../utils/queries";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsBanner from "@/components/dashboard/detail/StatsBanner";
import { useCopyToClipboard } from "@/hooks/useClipboard";
import CopyIcon from "@/components/svgx/CopyIcon";
import { getHighlightedWidgetSnippet } from "@/utils/code-snippets";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const { id } = context.params!;

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
  });

  console.log(project?.key);

  const code = project?.key
    ? await getHighlightedWidgetSnippet(project.key)
    : null;

  return {
    props: {
      project: serialize(project).json as unknown as Project,
      id,
      code,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.project.findMany({
    select: {
      id: true,
    },
  });

  return {
    paths: posts.map((post) => ({
      params: {
        id: post.id,
      },
    })),
    fallback: "blocking",
  };
};

export default function PostViewPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { project, code } = props;

  // @todo maybe add a rate limiter to prevent over usage of the /stats endpoint
  const { data: statsData } = useQuery({
    queryKey: ["project", project.key],
    queryFn: getStatistics,
    enabled: !!project.key,
  });

  const copy = useCopyToClipboard();

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <DashboardLayout>
      <div
        className={
          "mt-10 mb-20 rounded-lg border border-gray-100 bg-white px-6 pt-8 pb-4 shadow"
        }
      >
        <div className="mb-4 flex justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-slate-900">
              {project.name}
            </h1>
            <em className="text-gray-500">
              Created {new Date(project.createdAt).toLocaleDateString("fr-FR")}
            </em>
          </div>
        </div>
        <StatsBanner projectKey={project.key} />
        {statsData && (
          <GlobeViz
            visitors={statsData.views}
            averageLocation={statsData.averageViewsLocation}
          />
        )}
        {code?.highlighted && (
          <div className=" rounded-md bg-gradient-to-br from-slate-50 to-slate-200 px-3 py-3">
            <h3 className="mb-2 text-lg font-medium leading-none text-slate-700">
              Integrate the widget
            </h3>
            <p>
              Add the following code to the <code>&lt;head&gt;</code> tag
            </p>
            <div className="mt-2 flex space-x-2">
              <div
                className="code-block"
                dangerouslySetInnerHTML={{ __html: code.highlighted }}
              ></div>
              <button
                onClick={() => copy(code.raw)}
                className="flex items-center space-x-1 rounded-lg bg-slate-800 px-2 py-1 text-white"
              >
                <span>Copy</span>
                <CopyIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
