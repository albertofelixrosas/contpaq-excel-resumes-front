import { useCallback, useState } from 'react';
import {
  createMovement,
  deleteMovement,
  fetchMovements,
  updateMovement,
} from '../services/movement.service';
import type {
  CreateMovementDto,
  UpdateMovementDto,
  MovementFilterDto,
  PaginatedMovementsDto,
} from '../models/movement.model';

export function useMovements(initialFilters: MovementFilterDto) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaginatedMovementsDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (filters = initialFilters) => {
      setLoading(true);
      try {
        const res = await fetchMovements(filters);
        setData(res);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [initialFilters],
  );

  const create = useCallback(
    async (payload: CreateMovementDto) => {
      setLoading(true);
      try {
        await createMovement(payload);
        await fetch();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [fetch],
  );

  const update = useCallback(async (id: number, payload: UpdateMovementDto) => {
    setLoading(true);
    try {
      await updateMovement(id, payload);
      await fetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        await deleteMovement(id);
        await fetch();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [fetch],
  );

  return { data, loading, error, fetch, create, update, remove };
}
