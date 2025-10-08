import { useQuery } from '@tanstack/react-query';
import { fetchMovementsConcepts } from '../../services/movement.service';

export function useMovementsConcepts(filters: { company_id: number }) {
  return useQuery({
    queryKey: ['movements', 'concepts', filters],
    queryFn: () => fetchMovementsConcepts(filters),
    enabled: !!filters.company_id,
  });
}