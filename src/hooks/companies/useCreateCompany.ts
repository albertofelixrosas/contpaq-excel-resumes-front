import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCompany } from '../../services/company.service';
import type { CreateCompanyDto } from '../../models/company.model';

export function useCreateCompany() {
  const queryClient = useQueryClient();

  const {
    mutate: createCompanyMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, CreateCompanyDto>({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  return { createCompany: createCompanyMutation, isPending, isError, error, isSuccess };
}