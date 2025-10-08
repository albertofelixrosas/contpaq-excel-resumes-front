import { useQuery } from '@tanstack/react-query';
import { fetchSegment } from '../../services/segments.service';

export function useSegment(id: number) {
  return useQuery({
    queryKey: ['segments', id],
    queryFn: () => fetchSegment(id),
    enabled: !!id,
  });
}