import { Timestamp } from "firebase/firestore";

export class ClubTypeMediumCategory {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  name: string;
  largeCategory: string;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, name: string, largeCategory: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.name = name;
    this.largeCategory = largeCategory;
  }
}
