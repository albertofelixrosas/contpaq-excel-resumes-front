import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAccounts } from '../../services/accounting-accounts.service';
import type { UpdateAccountingAccountDto } from '../../models/accounting-account.model';

interface UpdateAccountingAccountRequest {
  id: number;
  data: Partial<UpdateAccountingAccountDto>;
}

export function useUpdateAccountingAccount() {
  const queryClient = useQueryClient();

  const {
    mutate: updateAccountingAccountMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, UpdateAccountingAccountRequest>({
    mutationFn: ({ id, data }) => updateAccounts(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['accounting-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-accounts', id] });
    },
  });

  return { updateAccountingAccount: updateAccountingAccountMutation, isPending, isError, error, isSuccess };
}