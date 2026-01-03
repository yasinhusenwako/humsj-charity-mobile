import { collection, addDoc, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Cause {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  raised: number;
  goal: number;
  progress: number;
  category: string;
  isActive: boolean;
}

export const createCause = async (causeData: Omit<Cause, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "causes"), causeData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating cause:", error);
    throw error;
  }
};

export const getAllCauses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "causes"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Cause[];
  } catch (error) {
    console.error("Error getting causes:", error);
    throw error;
  }
};

export const updateCauseAmount = async (causeId: string, amount: number) => {
  try {
    const causeRef = doc(db, "causes", causeId);
    const causeDoc = await getDoc(causeRef);
    
    if (causeDoc.exists()) {
      const currentRaised = causeDoc.data().raised || 0;
      const goal = causeDoc.data().goal || 1;
      const newRaised = currentRaised + amount;
      const newProgress = Math.round((newRaised / goal) * 100);
      
      await updateDoc(causeRef, {
        raised: newRaised,
        progress: newProgress,
      });
    }
  } catch (error) {
    console.error("Error updating cause amount:", error);
    throw error;
  }
};
