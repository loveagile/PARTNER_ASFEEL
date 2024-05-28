import { Timestamp } from 'firebase-admin/firestore'

export class Prefecture {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  prefecture: string
  index: string

  constructor(
    id: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    prefecture: string,
    index: string
  ) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.prefecture = prefecture
    this.index = index
  }
}
