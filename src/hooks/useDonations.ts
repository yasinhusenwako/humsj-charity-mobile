import { useState, useEffect } from "react";
import { getUserDonations, Donation } from "@/services/donationService";

export const useDonations = (userId: string | null) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchDonations = async () => {
      try {
        setLoading(true);
        const data = await getUserDonations(userId);
        setDonations(data);
        setError(null);
      } catch (err) {
        setError("Failed to load donations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userId]);

  return { donations, loading, error };
};
