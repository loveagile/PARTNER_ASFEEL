import { Name, PaginationInfo } from '@/constants/model'
import { Timestamp } from 'firebase/firestore'

export interface Coordinator {
  id?: string
  projectType: string
  organizationType: string
  prefectures: string
  cities?: string[]
  organizationName: string
  name: Name
  phoneNumber: string
  notificationEmails: string[]
  isFirstPasswordSet: boolean
  isSuspended: boolean
  parentId: string | null
  // authId: string
  isBoardOfEducation: boolean
  coordinatorIdOfPrefecture: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp | null
}

export interface ListCoordinatorsResponse {
  data: Coordinator[]
  pagination: PaginationInfo
}
