import { api } from './api';
import type {
  AccountingAccount,
  CreateAccountingAccountDto,
  UpdateAccountingAccountDto,
  GetAccountingAccountsQueryDto,
} from '../models/accounting-account.model';

export async function fetchAccounts(
  filters: GetAccountingAccountsQueryDto,
): Promise<AccountingAccount[]> {
  const { data } = await api.get<AccountingAccount[]>('/accounting-accounts', { params: filters });
  return data;
}

export async function createAccounts(payload: CreateAccountingAccountDto): Promise<void> {
  await api.post('/accounting-accounts', payload);
}

export async function deleteAccounts(id: number): Promise<void> {
  await api.delete(`/accounting-accounts/${id}`);
}

export async function updateAccounts(
  id: number,
  payload: Partial<UpdateAccountingAccountDto>,
): Promise<void> {
  await api.patch(`/accounting-accounts/${id}`, payload);
}
