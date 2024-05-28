import { PaginationInfo } from '@/constants/model'
import { Timestamp } from 'firebase/firestore'

export interface Notification {
  id?: string
  prefecture: string
  cities?: string[]
  title: string
  url: string
  sentAt: Timestamp
  status: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp
}

export interface ListNotificationsResponse {
  data: Notification[]
  pagination: PaginationInfo
}
