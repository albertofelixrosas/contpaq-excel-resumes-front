import { useCallback, useState } from "react";
import type { MovementHeatmapDto, MovementHeatmapFilters } from "../models/movement.model";
import { fetchMovementsHeatmap } from "../services/movement.service";

export function useMovementsHeatmap() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MovementHeatmapDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filters: MovementHeatmapFilters) => {
    setLoading(true);
    try {
      const res = await fetchMovementsHeatmap(filters);
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
