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

  const { data } = useQuery({
    queryKey: ["project", project.key],
    queryFn: getStatistics,
    enabled: !!project.key,
  });

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <h1>{project.name}</h1>
      <em>Created {new Date(project.createdAt).toLocaleDateString()}</em>
      {data && <GlobeViz visitors={data.keys} />}

      <pre>{JSON.stringify(project, null, 4)}</pre>
    </>
  );
}
