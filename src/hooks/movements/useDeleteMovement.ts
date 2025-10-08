import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMovement } from '../../services/movement.service';

export function useDeleteMovement() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteMovementMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, number>({
    mutationFn: deleteMovement,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.removeQueries({ queryKey: ['movements', id] });
    },
  });

  return { deleteMovement: deleteMovementMutation, isPending, isError, error, isSuccess };
}