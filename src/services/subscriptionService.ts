import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Subscription {
  id?: string;
  userId: string;
  amount: number;
  startDate: Timestamp;
  active: boolean;
  billingCycle: "monthly";
  nextBillingDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const createSubscription = async (data: Omit<Subscription, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "subscriptions"), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

export const getAllSubscriptions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "subscriptions"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Subscription[];
  } catch (error) {
    console.error("Error getting subscriptions:", error);
    throw error;
  }
};

export const getUserSubscription = async (userId: string) => {
  try {
    const q = query(collection(db, "subscriptions"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Subscription;
  } catch (error) {
    console.error("Error getting user subscription:", error);
    throw error;
  }
};

export const updateSubscription = async (id: string, data: Partial<Subscription>) => {
  try {
    const subRef = doc(db, "subscriptions", id);
    await updateDoc(subRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
};

export const deleteSubscription = async (id: string) => {
  try {
    await deleteDoc(doc(db, "subscriptions", id));
  } catch (error) {
    console.error("Error deleting subscription:", error);
    throw error;
  }
};

export const pauseSubscription = async (id: string) => {
  return updateSubscription(id, { active: false });
};

export const activateSubscription = async (id: string) => {
  return updateSubscription(id, { active: true });
};
