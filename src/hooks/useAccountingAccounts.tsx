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

export function useAccountingAccounts(filters: GetAccountingAccountsQueryDto) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AccountingAccount[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filters: GetAccountingAccountsQueryDto) => {
    setLoading(true);
    try {
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
      setLoading(true);
      try {
        await createAccounts(payload);
        await fetch(filters);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [fetch],
  );

  const update = useCallback(async (id: number, payload: UpdateAccountingAccountDto) => {
    setLoading(true);
    try {
      await updateAccounts(id, payload);
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
        await deleteAccounts(id);
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
