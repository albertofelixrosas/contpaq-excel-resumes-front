import { useCallback, useState } from 'react';
import type { MovementConceptsFilters } from '../models/movement.model';
import { fetchMovementsConcepts } from '../services/movement.service';

export function useMovementsConcetps() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filters: MovementConceptsFilters) => {
    try {
      if (!filters.company_id) {
        return;
      }
      setLoading(true);
      const res = await fetchMovementsConcepts({ company_id: filters.company_id });
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
