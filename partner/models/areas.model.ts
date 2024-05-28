import { Timestamp } from "firebase/firestore";

export class Area {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  prefecture: string;
  area: string;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, prefecture: string, area: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.prefecture = prefecture;
    this.area = area;
  }
}
