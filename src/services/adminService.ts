import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Get all users (donors and beneficiaries)
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    // Get total donors
    const donorsQuery = query(collection(db, "users"), where("role", "==", "donor"));
    const donorsSnapshot = await getDocs(donorsQuery);
    const totalDonors = donorsSnapshot.size;

    // Get total donations
    const donationsSnapshot = await getDocs(collection(db, "donations"));
    const donations = donationsSnapshot.docs.map((doc) => doc.data());
    const totalDonations = donations.reduce((sum, donation: any) => sum + (donation.amount || 0), 0);

    // Get active causes
    const causesQuery = query(collection(db, "causes"), where("isActive", "==", true));
    const causesSnapshot = await getDocs(causesQuery);
    const activeCauses = causesSnapshot.size;

    // Get monthly revenue (current month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyDonationsQuery = query(
      collection(db, "donations"),
      where("createdAt", ">=", Timestamp.fromDate(firstDayOfMonth))
    );
    const monthlySnapshot = await getDocs(monthlyDonationsQuery);
    const monthlyDonations = monthlySnapshot.docs.map((doc) => doc.data());
    const monthlyRevenue = monthlyDonations.reduce(
      (sum, donation: any) => sum + (donation.amount || 0),
      0
    );

    return {
      totalDonors,
      totalDonations,
      activeCauses,
      monthlyRevenue,
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { status });
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Get recent activity
export const getRecentActivity = async (limit: number = 10) => {
  try {
    const q = query(
      collection(db, "donations"),
      orderBy("createdAt", "desc"),
      // limit(limit) // Uncomment when you import limit from firestore
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting recent activity:", error);
    throw error;
  }
};

// Export data to CSV format
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || "")).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
