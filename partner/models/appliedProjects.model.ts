import { Timestamp } from "firebase/firestore";

export class AppliedProject {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  projectId: string;
  deletedAt?: Timestamp;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, projectId: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.projectId = projectId;
  }
}
