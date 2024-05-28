import { Address } from "@/types";
import { Timestamp } from "firebase/firestore";
export class Organization {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  organizationId: string;
  organizationType: string;
  name: string;
  address: Address;
  phoneNumber: number;
  isSuspended: boolean;
  
  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, organizationId: string, organizationType: string, name: string, address: Address, phoneNumber: number, isSuspended: boolean) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.organizationId = organizationId;
    this.organizationType = organizationType;
    this.name = name;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.isSuspended = isSuspended;
  }
}