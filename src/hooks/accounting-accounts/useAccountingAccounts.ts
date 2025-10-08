import { useQuery } from '@tanstack/react-query';
import { fetchAccounts } from '../../services/accounting-accounts.service';
import type { GetAccountingAccountsQueryDto } from '../../models/accounting-account.model';

export function useAccountingAccounts(params: GetAccountingAccountsQueryDto) {
  return useQuery({
    queryKey: ['accounting-accounts', params],
    queryFn: () => fetchAccounts(params),
  });
}