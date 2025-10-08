import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCompany } from '../../services/company.service';
import type { UpdateCompanyDto } from '../../models/company.model';

interface UpdateCompanyRequest {
  id: number;
  data: Partial<UpdateCompanyDto>;
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  const {
    mutate: updateCompanyMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, UpdateCompanyRequest>({
    mutationFn: ({ id, data }) => updateCompany(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies', id] });
    },
  });

  return { updateCompany: updateCompanyMutation, isPending, isError, error, isSuccess };
}