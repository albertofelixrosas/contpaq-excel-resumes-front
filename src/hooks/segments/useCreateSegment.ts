import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSegment } from '../../services/segments.service';
import type { CreateSegmentDto } from '../../models/segment.model';

export function useCreateSegment() {
  const queryClient = useQueryClient();

  const {
    mutate: createSegmentMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, CreateSegmentDto>({
    mutationFn: createSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
  });

  return { createSegment: createSegmentMutation, isPending, isError, error, isSuccess };
}