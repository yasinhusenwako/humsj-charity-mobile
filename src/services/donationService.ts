import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Donation {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  causeId?: string;
  causeName?: string;
  isMonthly: boolean;
  status: "pending" | "completed" | "failed";
  createdAt: Timestamp;
}

export const createDonation = async (donationData: Omit<Donation, "id" | "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, "donations"), {
      ...donationData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error;
  }
};

export const getUserDonations = async (userId: string) => {
  try {
    const q = query(
      collection(db, "donations"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Donation[];
  } catch (error) {
    console.error("Error getting user donations:", error);
    throw error;
  }
};

export const getAllDonations = async () => {
  try {
    const q = query(collection(db, "donations"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Donation[];
  } catch (error) {
    console.error("Error getting all donations:", error);
    throw error;
  }
};
