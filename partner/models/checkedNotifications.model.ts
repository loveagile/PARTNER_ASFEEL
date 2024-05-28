import { Timestamp } from "firebase/firestore";

export class CheckedNotification {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  noticeId: string;
  deletedAt?: Timestamp;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, noticeId: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.noticeId = noticeId;
  }
}
