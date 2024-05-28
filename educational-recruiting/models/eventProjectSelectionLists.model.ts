import { ApplyOrScout, ProjectSelectionType } from "@/enums";
import { Timestamp } from "firebase/firestore";

export class EventProjectSelectionList {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: ProjectSelectionType;
  userId: string;
  isUnread: boolean;
  applyOrScout: ApplyOrScout;
  deletedAt?: Timestamp;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, status: ProjectSelectionType, userId: string, isUnread: boolean, applyOrScout: ApplyOrScout, deletedAt: Timestamp
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.userId = userId;
    this.isUnread = isUnread;
    this.applyOrScout = applyOrScout;
    this.deletedAt = deletedAt;
  }
}
