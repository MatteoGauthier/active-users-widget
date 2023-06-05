import { prisma } from "@/server/db";
import type {
  GetStaticPaths,
  InferGetStaticPropsType
} from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      key: true,
    },
  });

  const allIds: {
    params: {
      id: string;
    };
  }[] = projects
    .map((obj) => [obj.id, obj.key])
    .flat()
    .filter((e): e is string => Boolean(e))
    .map((e) => ({
      params: {
        id: e,
      },
    }));

  return {
    paths: allIds,
    fallback: true, // false or "blocking"
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const project = await prisma.project.findFirst({
    where: {
      OR: [
        {
          id: params.id,
        },
        {
          key: params.id,
        },
      ],
    },
  });

  return { props: { projectKey: project?.key } };
};

export default function DemoPage({
  projectKey,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!projectKey) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <script
        data-project-id={projectKey}
        src="https://unpkg.com/active-users-widget"
        defer
        async
      ></script>
    </>
  );
}
