import { MESSAGE_TYPE } from '@/constants/common'
import { Timestamp } from 'firebase/firestore'

export interface MessageRoom {
  id?: string
  lastMessage?: string
  createdAt?: Timestamp | null
  deletedAt?: Timestamp | null
  memberIds: string[]
  members: {
    lastAccessedAt: Timestamp | null
    unreadCount: number
    userId: string
  }[]
  projectId?: string | null
  projectType: string
  updatedAt?: Timestamp | null
  userId: string
}

export interface Message {
  id?: string
  type: MESSAGE_TYPE
  text?: string
  senderId: string
  projectId?: string | null
  fileUrl?: {
    fileName: string
    fileUrl: string
  }[]
  createdAt?: string | number | null
  updatedAt?: string | number | null
  deletedAt?: string | number | null
}
