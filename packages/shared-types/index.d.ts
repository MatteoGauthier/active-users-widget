export interface StatisticsJson {
  last30days: number
  totalViews: number | null
  averageViewsLocation: {
    latitude: number
    longitude: number
  } | null
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
