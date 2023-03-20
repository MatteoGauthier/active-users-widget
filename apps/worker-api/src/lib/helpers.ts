import countriesDatabase from "./country-list"

export const averageLocationFromKeys = (
  locations?: {
    metadata?: {
      latitude: string
      longitude: string
    }
  }[]
) => {
  if (!locations || locations.length === 0 || !locations[0]?.metadata) {
    return null
  }
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
  const latitudes = locations.map((e) => Number(e?.metadata?.latitude) || 0)
  const longitudes = locations.map((e) => Number(e?.metadata?.longitude) || 0)
  return {
    latitude: avg(latitudes),
    longitude: avg(longitudes),
  }
}

export const findTopCountryFromKeys = (
  locations: {
    metadata?: {
      country?: string | null
    }
  }[]
) => {
  if (locations.length === 0) return
  const countries = locations
    .filter((e) => e.metadata?.country)
    .map((e) => e?.metadata?.country)
    .filter((item): item is string => !!item)

  if (countries.length === 0) return

  const countryCount = countries.reduce((acc, cur) => {
    if (cur) {
      acc[cur] = (acc[cur] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
  const countriesKeys = Object.keys(countryCount)
  const topCountry = countriesKeys.reduce((a, b) => (countryCount[a] > countryCount[b] ? a : b))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [countryName, countryCode, countryEmoji] = countriesDatabase.find((e) => e[1] === topCountry)!

  return {
    code: topCountry,
    formattedText: `${countryEmoji} ${countryName}`,
  }
}
