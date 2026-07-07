import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, increment, arrayUnion, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./client";
import { Poem, Comment } from "@/types";

import { where } from "firebase/firestore";

export const getPoems = async (): Promise<Poem[]> => {
  const q = query(collection(db, "poems"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const poems: Poem[] = [];
  querySnapshot.forEach((doc) => {
    poems.push({ id: doc.id, ...doc.data() } as Poem);
  });
  return poems;
};

export const getUserPoems = async (authorName: string): Promise<Poem[]> => {
  const q = query(collection(db, "poems"), where("author", "==", authorName), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const poems: Poem[] = [];
  querySnapshot.forEach((doc) => {
    poems.push({ id: doc.id, ...doc.data() } as Poem);
  });
  return poems;
};

export const uploadFile = async (file: File, path: string): Promise<string | null> => {
  if (!file) return null;
  const storageRef = ref(storage, `${path}${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const submitPoem = async (poemData: Omit<Poem, "id">) => {
  return await addDoc(collection(db, "poems"), poemData);
};

export const toggleReaction = async (poemId: string, emoji: string, previousVote: string | null, userId: string) => {
  const poemRef = doc(db, "poems", poemId);

  if (previousVote === emoji) {
    // Remove vote
    await updateDoc(poemRef, {
        [`reactions.${emoji}`]: increment(-1),
        [`userReactions.${userId}`]: null
    });
    return null;
  } else if (previousVote) {
    // Change vote
    await updateDoc(poemRef, {
      [`reactions.${previousVote}`]: increment(-1),
      [`reactions.${emoji}`]: increment(1),
      [`userReactions.${userId}`]: emoji
    });
    return emoji;
  } else {
    // New vote
    await updateDoc(poemRef, {
        [`reactions.${emoji}`]: increment(1),
        [`userReactions.${userId}`]: emoji
    });
    return emoji;
  }
};

export const postComment = async (poemId: string, text: string, authorName: string, userId: string) => {
  const poemRef = doc(db, "poems", poemId);
  const newComment: Comment = { text, time: Timestamp.now(), authorName, userId };
  await updateDoc(poemRef, { comments: arrayUnion(newComment) });
};