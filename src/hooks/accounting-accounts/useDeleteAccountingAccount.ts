import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAccounts } from '../../services/accounting-accounts.service';

export function useDeleteAccountingAccount() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteAccountingAccountMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, number>({
    mutationFn: deleteAccounts,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['accounting-accounts'] });
      queryClient.removeQueries({ queryKey: ['accounting-accounts', id] });
    },
  });

  return { deleteAccountingAccount: deleteAccountingAccountMutation, isPending, isError, error, isSuccess };
}