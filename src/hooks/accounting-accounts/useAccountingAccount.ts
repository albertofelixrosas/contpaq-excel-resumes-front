import { useQuery } from '@tanstack/react-query';
import { fetchAccount } from '../../services/accounting-accounts.service';

export function useAccountingAccount(id: number) {
  return useQuery({
    queryKey: ['accounting-accounts', id],
    queryFn: () => fetchAccount(id),
    enabled: !!id,
  });
}