import { Timestamp } from 'firebase/firestore'

export class City {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  zip: string
  prefecture: string
  prefectureText: string
  area: string
  areaText
  city: string
  cityCode: string
  order: string

  constructor(
    id: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    zip: string,
    prefecture: string,
    prefectureText: string,
    area: string,
    areaText: string,
    city: string,
    cityCode: string,
    order: string,
  ) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.zip = zip
    this.prefecture = prefecture
    this.prefectureText = prefectureText
    this.area = area
    this.areaText = areaText
    this.city = city
    this.cityCode = cityCode
    this.order = order
  }
}
