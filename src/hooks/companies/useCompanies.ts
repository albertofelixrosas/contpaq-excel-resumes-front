import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from '../../services/company.service';

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });
}