import { Timestamp } from 'firebase/firestore'

export interface Addresses {
  id?: string
  zip: string
  address1: string
  address1Full?: string
  address2?: string
  area: string
  areaText?: string
  areaTextFull?: string
  city: string
  cityCode?: string
  cityText?: string
  prefecture?: string
  prefectureCode?: string
  prefectureText?: string
  order?: number
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp | null
}
