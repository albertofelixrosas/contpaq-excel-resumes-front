import { useQuery } from '@tanstack/react-query';
import { fetchMovements } from '../../services/movement.service';
import type { MovementFilterDto } from '../../models/movement.model';

export function useMovements(filters: MovementFilterDto) {
  return useQuery({
    queryKey: ['movements', filters],
    queryFn: () => fetchMovements(filters),
  });
}