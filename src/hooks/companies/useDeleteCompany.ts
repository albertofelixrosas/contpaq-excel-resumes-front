import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCompany } from '../../services/company.service';

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteCompanyMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, number>({
    mutationFn: deleteCompany,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.removeQueries({ queryKey: ['companies', id] });
    },
  });

  return { deleteCompany: deleteCompanyMutation, isPending, isError, error, isSuccess };
}