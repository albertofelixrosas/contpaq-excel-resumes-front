import { useQuery } from '@tanstack/react-query';
import { fetchMovementsSuppliers } from '../../services/movement.service';

export function useMovementsSuppliers(filters: { company_id: number }) {
  return useQuery({
    queryKey: ['movements', 'suppliers', filters],
    queryFn: () => fetchMovementsSuppliers(filters),
    enabled: !!filters.company_id,
  });
}