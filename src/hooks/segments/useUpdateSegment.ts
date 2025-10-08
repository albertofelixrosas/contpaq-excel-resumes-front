import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSegment } from '../../services/segments.service';
import type { UpdateSegmentDto } from '../../models/segment.model';

interface UpdateSegmentRequest {
  id: number;
  data: Partial<UpdateSegmentDto>;
}

export function useUpdateSegment() {
  const queryClient = useQueryClient();

  const {
    mutate: updateSegmentMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, UpdateSegmentRequest>({
    mutationFn: ({ id, data }) => updateSegment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      queryClient.invalidateQueries({ queryKey: ['segments', id] });
    },
  });

  return { updateSegment: updateSegmentMutation, isPending, isError, error, isSuccess };
}