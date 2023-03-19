import fs from "fs/promises"

const API_URL = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json"

interface Country {
  id: number
  name: string
  iso3: string
  iso2: string
  numeric_code: string
  phone_code: string
  capital: string
  currency: string
  currency_name: string
  currency_symbol: string
  tld: string
  native: string
  region: string
  subregion: string
  timezones: object[]
  translations: object
  latitude: string
  longitude: string
  emoji: string
  emojiU: string
}

async function main() {
  const response = await fetch(API_URL)
  const countries: Country[] = await response.json()
  const lightCountryList = countries.map((country) => [country.name, country.iso2, country.emoji])

  await fs.writeFile("./src/lib/country-list.ts", `export default ${JSON.stringify(lightCountryList)}`)
}

main()

export {}
