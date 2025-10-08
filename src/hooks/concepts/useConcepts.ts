import { useQuery } from '@tanstack/react-query';
import { fetchConcepts } from '../../services/concept.service';
import type { GetConceptsQueryDto } from '../../models/concept.model';

export function useConcepts(params: GetConceptsQueryDto) {
  return useQuery({
    queryKey: ['concepts', params],
    queryFn: () => fetchConcepts(params),
  });
}