import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMovement } from '../../services/movement.service';
import type { CreateMovementDto } from '../../models/movement.model';

interface UpdateMovementRequest {
  id: number;
  data: Partial<CreateMovementDto>;
}

export function useUpdateMovement() {
  const queryClient = useQueryClient();

  const {
    mutate: updateMovementMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, UpdateMovementRequest>({
    mutationFn: ({ id, data }) => updateMovement(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['movements', id] });
    },
  });

  return { updateMovement: updateMovementMutation, isPending, isError, error, isSuccess };
}