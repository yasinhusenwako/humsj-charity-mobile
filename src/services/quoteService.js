import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Quote {
  id?: string;
  text: string;
  source: string;
  type: "quran" | "hadith";
  timesUsed: number;
  lastUsed?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const createQuote = async (data: Omit<Quote, "id" | "timesUsed" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "quotes"), {
      ...data,
      timesUsed: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating quote:", error);
    throw error;
  }
};

export const getAllQuotes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "quotes"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Quote[];
  } catch (error) {
    console.error("Error getting quotes:", error);
    throw error;
  }
};

export const getRandomQuote = async () => {
  try {
    const quotes = await getAllQuotes();
    if (quotes.length === 0) return null;
    return quotes[Math.floor(Math.random() * quotes.length)];
  } catch (error) {
    console.error("Error getting random quote:", error);
    throw error;
  }
};

export const updateQuote = async (id: string, data: Partial<Quote>) => {
  try {
    const quoteRef = doc(db, "quotes", id);
    await updateDoc(quoteRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating quote:", error);
    throw error;
  }
};

export const deleteQuote = async (id: string) => {
  try {
    await deleteDoc(doc(db, "quotes", id));
  } catch (error) {
    console.error("Error deleting quote:", error);
    throw error;
  }
};

export const incrementQuoteUsage = async (id: string) => {
  try {
    const quoteRef = doc(db, "quotes", id);
    const quoteDoc = await getDocs(collection(db, "quotes"));
    const quote = quoteDoc.docs.find(d => d.id === id);
    if (quote) {
      const data = quote.data();
      await updateDoc(quoteRef, {
        timesUsed: (data.timesUsed || 0) + 1,
        lastUsed: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error incrementing quote usage:", error);
    throw error;
  }
};
