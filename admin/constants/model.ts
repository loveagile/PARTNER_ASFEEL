import { Timestamp } from 'firebase/firestore'

export interface UserCustomClaims {
  nameSei: string
  nameMei: string
  nameSeiKana: string
  nameMeiKana: string
  role: string
  isPublish: boolean
  createdAt: number
  updatedAt: number
}

export interface PaginationInfo {
  page?: number
  perPage?: number
  total?: number
  allTotal?: number
}

export interface Exception {
  error: string
}

export interface Prefecture {
  id?: string
  prefecture: string
  index: number
  order?: string
  prefectureCode?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp | null
}

export interface Address {
  id?: string
  zip: string
  prefecture?: string
  city: string
  address1: string
  address2?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp | null
}

export interface City {
  id?: string
  zip: string
  prefecture: string
  area: string
  city: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp | null
}

export interface Area {
  id?: string
  area: string
  prefecture: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp | null
}

export interface Name {
  sei: string
  mei: string
  seiKana: string
  meiKana: string
}

export interface PaginationInfo {
  page?: number
  perPage?: number
  total?: number
  allTotal?: number
}

export interface ClubType {
  id: string
  name: string
  mediumCategory: string
  largeCategory: string
  isPublish?: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Organization {
  organizationId: string
  organizationType: string
  phoneNumber: string
  prefecture: string
  name: string
  nameKana: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp | null
}
