import { Address, PaginationInfo } from '@/constants/model'
import { Timestamp } from 'firebase/firestore'

export interface OrganizationTypes {
  id?: string
  name: string
  grade: number
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp
}

export interface OrganizationType {
  id?: string
  name: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp
}

export interface Organization {
  organizationId: string
  // prefecture: string
  organizationType: string
  name: string
  nameKana?: string
  address: Address
  phoneNumber: string
  isSuspended: boolean
  organizationTypeText?: string
  deletedAt?: Timestamp | null
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface ListOrganizationsResponse {
  data: Organization[]
  pagination: PaginationInfo
}
