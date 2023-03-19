export interface StatisticsJson {
  last30Minutes: number
  totalViews: number | null
  averageViewsLocation: {
    latitude: number
    longitude: number
  } | null
  views: Key[]
  topCountry?: {
    code: string
    formattedText: string
  }
}

export interface Key {
  name: string
  expiration?: number
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
  isTotalKey?: boolean
}
