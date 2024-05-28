import { Timestamp } from "firebase/firestore";

export class ClubTypeCategory {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  largeCategory: string;
  mediumCategory: string;
  name: string;
  isPublish: boolean

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, largeCategory: string, mediumCategory: string, name: string, isPublish: boolean) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.largeCategory = largeCategory;
    this.mediumCategory = mediumCategory;
    this.name = name;
    this.isPublish = isPublish;
  }
}
