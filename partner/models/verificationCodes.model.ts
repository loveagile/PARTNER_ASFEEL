import { Timestamp } from 'firebase/firestore'

export class VerificationCode {
  id: string
  email: string
  createdAt: Timestamp
  expiredAt: Timestamp
  code: string
  isUsed: boolean

  constructor(id: string, email: string, createdAt: Timestamp, expiredAt: Timestamp, code: string, isUsed: boolean) {
    this.id = id
    this.email = email
    this.createdAt = createdAt
    this.expiredAt = expiredAt
    this.code = code
    this.isUsed = isUsed
  }
}
