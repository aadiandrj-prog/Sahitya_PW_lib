import { Timestamp } from "firebase/firestore";

export interface Comment {
  text: string;
  time: Timestamp;
  authorName?: string;
  userId?: string;
}

export interface Poem {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  body: string;
  font: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: Timestamp;
  reactions: Record<string, number>;
  userReactions?: Record<string, string>; // Maps userId -> emoji
  comments: Comment[];
}