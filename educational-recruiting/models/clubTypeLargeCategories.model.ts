import { Timestamp } from "firebase/firestore";

export class ClubTypeLargeCategory {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  name: string;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, name: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.name = name;
  }
}
