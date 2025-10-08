import { useQuery } from '@tanstack/react-query';
import { fetchCompany } from '../../services/company.service';

export function useCompany(id: number) {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => fetchCompany(id),
    enabled: !!id,
  });
}