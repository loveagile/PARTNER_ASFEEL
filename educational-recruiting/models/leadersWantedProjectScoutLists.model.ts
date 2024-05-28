import { ProjectScoutType } from "@/enums";
import { Timestamp } from "firebase/firestore";

export class LeadersWantedProjectScoutList
 {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: ProjectScoutType;
  userId: string;
  deletedAt?: Timestamp;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, status: ProjectScoutType, userId: string, deletedAt: Timestamp
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.userId = userId;
    this.deletedAt = deletedAt;
  }
}
