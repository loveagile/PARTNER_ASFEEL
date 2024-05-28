import { MessageType } from "@/enums";
import { FileUrlType } from "@/types";
import { Timestamp } from "firebase/firestore";

export class Message {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  type: string;
  text: string;
  senderId: string;
  projectId: string;
  deletedAt?: Timestamp;
  fileUrl?: FileUrlType[];

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, type: string, text: string, senderId: string, projectId: string, deletedAt: Timestamp, fileUrl: FileUrlType[]) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.type = type;
    this.text = text;
    this.senderId = senderId;
    this.projectId = projectId;
    this.deletedAt = deletedAt;
    this.fileUrl = fileUrl;
  }
}
