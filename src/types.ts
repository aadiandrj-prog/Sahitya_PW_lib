import { Timestamp } from "firebase/firestore";

export interface Comment {
  text: string;
  time: Timestamp;
}

export interface Poem {
  id: string;
  title: string;
  author: string;
  body: string;
  font: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: Timestamp;
  reactions: Record<string, number>;
  comments: Comment[];
}