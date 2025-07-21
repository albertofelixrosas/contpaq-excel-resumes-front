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

export function useConcepts(filters: GetConceptsQueryDto) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Concept[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filters: GetConceptsQueryDto) => {
    setLoading(true);
    try {
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
      setLoading(true);
      try {
        const response = await createConcept(payload);
        console.log({ response });
        await fetch(filters);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [fetch],
  );

  const update = useCallback(async (id: number, payload: UpdateConceptDto) => {
    setLoading(true);
    try {
      await updateConcept(id, payload);
      await fetch(filters);
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
        await deleteConcept(id);
        await fetch(filters);
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
