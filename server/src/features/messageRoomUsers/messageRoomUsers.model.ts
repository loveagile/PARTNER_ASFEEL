import { Timestamp } from 'firebase-admin/firestore'
import { PrivateUser } from '../privateUsers/privateUsers.model'

export interface MessageRoomUser extends PrivateUser {
  roomId: string
  userId: string
  projectId: string
  unreadCount: number
  userLastAccessAt: Timestamp
}
