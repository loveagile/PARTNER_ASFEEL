import { Timestamp } from "firebase/firestore";

export class Address {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  zip: string;
  prefecture: string;
  area: string;
  city: string;
  address1: string;
  address2: string;
  note?: string;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, zip: string, prefecture: string, area: string, city: string, address1: string, address2: string, note: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.zip = zip;
    this.prefecture = prefecture;
    this.area = area;
    this.city = city;
    this.address1 = address1;
    this.address2 = address2;
    this.note = note;
  }
}
