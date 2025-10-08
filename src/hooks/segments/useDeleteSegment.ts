import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSegment } from '../../services/segments.service';

export function useDeleteSegment() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteSegmentMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, number>({
    mutationFn: deleteSegment,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      queryClient.removeQueries({ queryKey: ['segments', id] });
    },
  });

  return { deleteSegment: deleteSegmentMutation, isPending, isError, error, isSuccess };
}