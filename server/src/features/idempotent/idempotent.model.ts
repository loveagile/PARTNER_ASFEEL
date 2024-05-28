import { FieldValue, Timestamp } from 'firebase-admin/firestore'

export interface IdempotentEvent {
  id: string
  createdAt: Timestamp | FieldValue
}
