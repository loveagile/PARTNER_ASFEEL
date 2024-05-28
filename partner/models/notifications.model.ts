import { Timestamp } from "firebase/firestore";
import { Address } from "@/types";

export class Notification {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  address: Address;
  title: string;
  url: string;
  sentAt: Timestamp;
  status: string;
  deletedAt?: Timestamp;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, address: Address, title: string, url: string, sentAt: Timestamp, status: string, deletedAt: Timestamp) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.address = address;
    this.title = title;
    this.url = url;
    this.sentAt = sentAt;
    this.status = status;
    this.deletedAt = deletedAt;
  }
}
