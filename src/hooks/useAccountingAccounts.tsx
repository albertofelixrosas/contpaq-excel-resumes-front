import { useCallback, useState } from 'react';
import {
  fetchAccounts,
  createAccounts,
  deleteAccounts,
  updateAccounts,
} from '../services/accounting-accounts.service';
import type {
  AccountingAccount,
  CreateAccountingAccountDto,
  GetAccountingAccountsQueryDto,
  UpdateAccountingAccountDto,
} from '../models/accounting-account.model';

export function useAccountingAccounts() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AccountingAccount[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filters: GetAccountingAccountsQueryDto) => {
    try {
      if (!filters) {
        return;
      }
      setLoading(true);
      const res = await fetchAccounts(filters);
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (payload: CreateAccountingAccountDto) => {
      try {
        setLoading(true);
        await createAccounts(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(async (id: number, payload: UpdateAccountingAccountDto) => {
    try {
      setLoading(true);
      await updateAccounts(id, payload);
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
        await deleteAccounts(id);
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
