import { useCallback, useState } from 'react';
import type { MonthlyReportDto, MonthlyReportFiltersDto } from '../models/movement.model';
import { fetchMovementsYearConceptsResume } from '../services/movement.service';

export function useMovementYearResume() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MonthlyReportDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filters: MonthlyReportFiltersDto) => {
    try {
      if (!filters.company_id) {
        return;
      }
      setLoading(true);
      const res = await fetchMovementsYearConceptsResume({
        company_id: filters.company_id,
        year: filters.year,
      });
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
