import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { prisma } from "../../server/db";

import { serialize } from "superjson";
import { Project } from "@prisma/client";

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
  const { project, id } = props;

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <h1>{project.name}</h1>
      <em>Created {new Date(project.createdAt).toLocaleDateString()}</em>

      <pre>{JSON.stringify(project, null, 4)}</pre>
    </>
  );
}
