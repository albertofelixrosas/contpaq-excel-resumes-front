import { useQuery } from '@tanstack/react-query';
import { fetchConcept } from '../../services/concept.service';

export function useConcept(id: number) {
  return useQuery({
    queryKey: ['concepts', id],
    queryFn: () => fetchConcept(id),
    enabled: !!id,
  });
}