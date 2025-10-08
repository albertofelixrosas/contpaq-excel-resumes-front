import { useQuery } from '@tanstack/react-query';
import { fetchMovement } from '../../services/movement.service';

export function useMovement(id: number) {
  return useQuery({
    queryKey: ['movements', id],
    queryFn: () => fetchMovement(id),
    enabled: !!id,
  });
}