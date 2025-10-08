import { useMutation, useQueryClient } from '@tanstack/react-query';
import { masiveUpdateMovements } from '../../services/movement.service';
import type { MasiveChangeConceptDto } from '../../models/movement.model';

export function useMasiveUpdateMovements() {
  const queryClient = useQueryClient();

  const {
    mutate: masiveUpdateMovementsMutation,
    isPending,
    isError,
    error,
    isSuccess,
    data,
  } = useMutation<any, Error, MasiveChangeConceptDto>({
    mutationFn: masiveUpdateMovements,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
    },
  });

  return { 
    masiveUpdateMovements: masiveUpdateMovementsMutation, 
    isPending, 
    isError, 
    error, 
    isSuccess,
    data 
  };
}