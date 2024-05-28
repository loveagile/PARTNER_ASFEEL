import { Timestamp } from "firebase/firestore";

export class ScoutedProject {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  projectId: string;
  isChecked: boolean;
  coordinatorId: string;
  result: boolean;
  deletedAt?: Timestamp;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, projectId: string, isChecked: boolean, coordinatorId: string, result: boolean) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.projectId = projectId;
    this.isChecked = isChecked;
    this.coordinatorId = coordinatorId;
    this.result = result;
  }
}
