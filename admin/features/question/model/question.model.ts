import { PaginationInfo } from '@/constants/model'
import { Timestamp } from 'firebase/firestore'

export interface Question {
  id?: string
  prefecture: string
  question: string
  isPublish?: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
  deletedAt?: Timestamp
}

export interface ListQuestionsResponse {
  data: Question[]
  pagination: PaginationInfo
}
