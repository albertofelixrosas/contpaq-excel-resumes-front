import { useQuery } from '@tanstack/react-query';
import { fetchSegments } from '../../services/segments.service';
import type { GetSegmentsQueryDto } from '../../models/segment.model';

export function useSegments(params: GetSegmentsQueryDto) {
  return useQuery({
    queryKey: ['segments', params],
    queryFn: () => fetchSegments(params),
  });
}