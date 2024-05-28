import { Timestamp } from 'firebase/firestore'

export interface CsvHistory {
  name: string // prefecture
  createdAt?: Timestamp
  updatedAt?: Timestamp
}
