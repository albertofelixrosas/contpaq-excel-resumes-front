import { useCallback, useState } from 'react';
import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../services/company.service';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../models/company.model';

export function useCompanies() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCompanies();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (payload: CreateCompanyDto) => {
      setLoading(true);
      try {
        await createCompany(payload);
        await fetch();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [fetch],
  );

  const update = useCallback(async (id: number, payload: UpdateCompanyDto) => {
    setLoading(true);
    try {
      await updateCompany(id, payload);
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
        await deleteCompany(id);
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
