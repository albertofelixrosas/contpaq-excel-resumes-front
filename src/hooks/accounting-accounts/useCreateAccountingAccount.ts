import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAccounts } from '../../services/accounting-accounts.service';
import type { CreateAccountingAccountDto } from '../../models/accounting-account.model';

export function useCreateAccountingAccount() {
  const queryClient = useQueryClient();

  const {
    mutate: createAccountingAccountMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation<void, Error, CreateAccountingAccountDto>({
    mutationFn: createAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-accounts'] });
    },
  });

  return { createAccountingAccount: createAccountingAccountMutation, isPending, isError, error, isSuccess };
}