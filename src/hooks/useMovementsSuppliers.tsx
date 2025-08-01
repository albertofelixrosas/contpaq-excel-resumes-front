import { useCallback, useState } from 'react';
import { fetchMovementsSuppliers } from '../services/movement.service';

export function useMovementsSuppliers() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (company_id: number) => {
    try {
      setLoading(true);
      const res = await fetchMovementsSuppliers({ company_id });
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
