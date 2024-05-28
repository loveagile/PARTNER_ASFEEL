import { Timestamp } from "firebase/firestore";

export class QuestionsForPrefecture {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  prefecture: string;
  question: string;
  answer: string;
  deletedAt: Timestamp;

  constructor(id: string, createdAt: Timestamp, updatedAt: Timestamp, prefecture: string, question: string, answer: string, deletedAt: Timestamp) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.prefecture = prefecture;
    this.question = question;
    this.answer = answer;
    this.deletedAt = deletedAt;
  }
}
