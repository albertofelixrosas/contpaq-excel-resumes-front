import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateConcept } from '../../services/concept.service';
import type { UpdateConceptDto } from '../../models/concept.model';

interface UpdateConceptRequest {
  id: number;
  data: Partial<UpdateConceptDto>;
}

export function useUpdateConcept() {
  const queryClient = useQueryClient();

  const {
    mutate: updateConceptMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, UpdateConceptRequest>({
    mutationFn: ({ id, data }) => updateConcept(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] });
    },
  });

  return { updateConcept: updateConceptMutation, isPending, isError, error, isSuccess };
}