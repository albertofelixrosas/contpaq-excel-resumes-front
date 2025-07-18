import { useCallback, useState } from "react";
import { fetchMovementsSuppliers } from "../services/movement.service";

export function useMovementsSuppliers(initialFilters: { company_id: number }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filters = initialFilters) => {
    setLoading(true);
    try {
      const res = await fetchMovementsSuppliers(filters);
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch };
}
