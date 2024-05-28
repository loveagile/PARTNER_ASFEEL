import { PaginationInfo } from '@/constants/model'
import { Timestamp } from 'firebase/firestore'

export interface LargeCategory {
  id?: string
  name: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp
}

export interface MediumCategory {
  id?: string
  name: string
  largeCategory: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp
}

export interface Category {
  id?: string
  name: string
  largeCategory: string
  mediumCategory: string
  isPublish?: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp
}

export interface ListCategoriesResponse {
  data: Category[]
  pagination: PaginationInfo
}
