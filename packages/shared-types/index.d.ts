export interface StatisticsJson {
  last30Minutes: number
  totalViews: number | null
  averageViewsLocation: {
    latitude: number
    longitude: number
  } | null
  views: KVNamespaceListKey<Metadata, string>[]
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
