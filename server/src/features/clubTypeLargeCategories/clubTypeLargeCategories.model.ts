import { Timestamp } from 'firebase-admin/firestore'

export class ClubTypeLargeCategory {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  name: string

  constructor(
    id: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    name: string
  ) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.name = name
  }
}
