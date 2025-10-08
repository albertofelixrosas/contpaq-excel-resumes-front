import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMovement } from '../../services/movement.service';
import type { CreateMovementDto } from '../../models/movement.model';

export function useCreateMovement() {
  const queryClient = useQueryClient();

  const {
    mutate: createMovementMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, CreateMovementDto>({
    mutationFn: createMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
    },
  });

  return { createMovement: createMovementMutation, isPending, isError, error, isSuccess };
}