import { useCallback, useState } from 'react';
import {
  fetchConcepts,
  createConcept,
  updateConcept,
  deleteConcept,
} from '../services/concept.service';
import type {
  Concept,
  CreateConceptDto,
  GetConceptsQueryDto,
  UpdateConceptDto,
} from '../models/concept.model';

export function useConcepts() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Concept[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filters: GetConceptsQueryDto) => {
    setLoading(true);
    try {
      if (!filters.company_id) {
        return;
      }
      const res = await fetchConcepts(filters);
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (payload: CreateConceptDto) => {
      try {
        setLoading(true);
        await createConcept(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(async (id: number, payload: UpdateConceptDto) => {
    setLoading(true);
    try {
      await updateConcept(id, payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        await deleteConcept(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { data, loading, error, fetch, create, update, remove };
}
