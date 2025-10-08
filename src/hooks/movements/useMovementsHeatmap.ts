import { useQuery } from '@tanstack/react-query';
import { fetchMovementsHeatmap } from '../../services/movement.service';

export function useMovementsHeatmap(filters: { company_id: number }) {
  return useQuery({
    queryKey: ['movements', 'heatmap', filters],
    queryFn: () => fetchMovementsHeatmap(filters),
    enabled: !!filters.company_id,
  });
}