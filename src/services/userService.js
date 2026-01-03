import { doc, getDoc, updateDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "donor" | "beneficiary";
  status: "active" | "inactive" | "suspended";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  totalDonated?: number;
  monthlyDonations?: number;
  phoneNumber?: string;
  address?: string;
  photoURL?: string;
}

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Create or update user profile
export const createOrUpdateUserProfile = async (
  uid: string,
  email: string,
  displayName: string
) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user profile
      await setDoc(userRef, {
        uid,
        email,
        displayName,
        role: email === "admin@humsj.edu.et" ? "admin" : "donor",
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        totalDonated: 0,
        monthlyDonations: 0,
      });
    } else {
      // Update existing profile
      await updateDoc(userRef, {
        displayName,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    throw error;
  }
};

// Update user donation stats
export const updateUserDonationStats = async (
  uid: string,
  amount: number,
  isMonthly: boolean
) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data();
      const newTotalDonated = (currentData.totalDonated || 0) + amount;
      const newMonthlyDonations = isMonthly
        ? (currentData.monthlyDonations || 0) + 1
        : currentData.monthlyDonations || 0;

      await updateDoc(userRef, {
        totalDonated: newTotalDonated,
        monthlyDonations: newMonthlyDonations,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error updating user donation stats:", error);
    throw error;
  }
};

// Delete user profile
export const deleteUser = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      status: "inactive",
      updatedAt: Timestamp.now(),
    });
    // Note: We're soft-deleting by setting status to inactive
    // To hard delete, you would use: await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
