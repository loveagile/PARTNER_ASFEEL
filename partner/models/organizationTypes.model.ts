import { Timestamp } from "firebase/firestore";

export class OrganizationType {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  name: string;
  grade: string;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, name: string, grade: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.name = name;
    this.grade = grade;
  }
}
