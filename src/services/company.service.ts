import { api } from './api';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../models/company.model';

export async function fetchCompanies(): Promise<Company[]> {
  const { data } = await api.get<Company[]>('/companies');
  return data;
}

export async function createCompany(payload: CreateCompanyDto): Promise<void> {
  await api.post('/companies', payload);
}

export async function deleteCompany(id: number): Promise<void> {
  await api.delete(`/companies/${id}`);
}

export async function updateCompany(
  id: number,
  payload: Partial<UpdateCompanyDto>,
): Promise<void> {
  await api.patch(`/companies/${id}`, payload);
}
