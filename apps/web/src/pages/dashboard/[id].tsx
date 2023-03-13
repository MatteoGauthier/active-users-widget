import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { prisma } from "../../server/db";

import { Project } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { serialize } from "superjson";
import GlobeViz from "../../components/dashboard/GlobeViz";
import { getStatistics } from "../../utils/queries";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsBanner from "../../components/dashboard/detail/StatsBanner";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const { id } = context.params!;

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
  });

  return {
    props: {
      project: serialize(project).json as unknown as Project,
      id,
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
  const { project } = props;

  // @todo maybe add a rate limiter to prevent over usage of the /stats endpoint
  const { data } = useQuery({
    queryKey: ["project", project.key],
    queryFn: getStatistics,
    enabled: !!project.key,
  });

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
              Created {new Date(project.createdAt).toLocaleDateString()}
            </em>
          </div>
        </div>
        <StatsBanner projectKey={project.key} />
        {data && <GlobeViz visitors={data.keys} />}
      </div>
    </DashboardLayout>
  );
}
