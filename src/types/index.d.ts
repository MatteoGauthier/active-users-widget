export interface StatisticsJson {
  list_complete: boolean
  keys: Key[]
}

export interface Key {
  name: string
  expiration: number
  metadata: Metadata
}

export interface Metadata {
  time: Date
  ip: string
  realIp: string
  ua: string
  country: string
  city: string
  region: string
  longitude: string
  latitude: string
}
