import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Message {
  id?: string;
  name: string;
  email: string;
  message: string;
  handled: boolean;
  response?: string;
  createdAt: Timestamp;
  handledAt?: Timestamp;
}

export const createMessage = async (data: Omit<Message, "id" | "handled" | "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...data,
      handled: false,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

export const getAllMessages = async () => {
  try {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

export const markMessageAsHandled = async (id: string, response?: string) => {
  try {
    const messageRef = doc(db, "messages", id);
    await updateDoc(messageRef, {
      handled: true,
      handledAt: Timestamp.now(),
      ...(response && { response }),
    });
  } catch (error) {
    console.error("Error marking message as handled:", error);
    throw error;
  }
};

export const deleteMessage = async (id: string) => {
  try {
    await deleteDoc(doc(db, "messages", id));
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};
