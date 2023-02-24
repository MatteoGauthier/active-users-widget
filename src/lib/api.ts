import { StatisticsJson } from "../types"

const API_URL = import.meta.env.API_URL

async function getStatistics(projectId: string): Promise<StatisticsJson> {
  const result = await fetch(`${API_URL}/${projectId}/stats`)
  const parsedResult = await result.json()
  return parsedResult
}

async function captureActivity(projectId: string) {
  const result = await fetch(`${API_URL}/${projectId}/capture`)
  const parsedResult = await result.json()
  return parsedResult
}

export const api = {
  getStatistics,
  captureActivity,
}
