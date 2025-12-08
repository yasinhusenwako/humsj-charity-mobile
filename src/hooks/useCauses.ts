import { useState, useEffect } from "react";
import { getAllCauses, Cause } from "@/services/causeService";

export const useCauses = () => {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        setLoading(true);
        const data = await getAllCauses();
        setCauses(data);
        setError(null);
      } catch (err) {
        setError("Failed to load causes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCauses();
  }, []);

  return { causes, loading, error };
};
