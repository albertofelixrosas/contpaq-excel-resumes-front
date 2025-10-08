import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteConcept } from '../../services/concept.service';

export function useDeleteConcept() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteConceptMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, number>({
    mutationFn: deleteConcept,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] });
    },
  });

  return { deleteConcept: deleteConceptMutation, isPending, isError, error, isSuccess };
}