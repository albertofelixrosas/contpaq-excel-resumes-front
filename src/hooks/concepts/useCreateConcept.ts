import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConcept } from '../../services/concept.service';
import type { CreateConceptDto } from '../../models/concept.model';

export function useCreateConcept() {
  const queryClient = useQueryClient();

  const {
    mutate: createConceptMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, CreateConceptDto>({
    mutationFn: createConcept,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] });
    },
  });

  return { createConcept: createConceptMutation, isPending, isError, error, isSuccess };
}