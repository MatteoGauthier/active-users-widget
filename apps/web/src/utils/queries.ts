import { env } from "../env.mjs";
import { StatisticsJson } from "shared-types";

import { QueryFunctionContext } from "@tanstack/react-query";

export async function getStatistics({
  queryKey,
}: QueryFunctionContext): Promise<StatisticsJson> {
  const projectId = queryKey[1];
  const result = await fetch(
    `${env.NEXT_PUBLIC_SERVICE_API_URL}/${projectId}/stats`
  );
  const parsedResult = await result.json();
  return parsedResult;
}
