import { Timestamp } from "firebase/firestore";

export class Prefecture {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  prefecture: string;

  constructor(id:string, createdAt: Timestamp, updatedAt: Timestamp, prefecture: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.prefecture = prefecture;
  }
}
