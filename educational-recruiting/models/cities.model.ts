import { Timestamp } from "firebase/firestore";

export class City {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  zip: string;
  prefecture: string;
  area: string;
  city: string;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, zip: string, prefecture: string, area: string, city: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.zip = zip;
    this.prefecture = prefecture;
    this.area = area;
    this.city = city;
  }
}
