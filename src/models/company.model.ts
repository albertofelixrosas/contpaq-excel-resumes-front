export interface CreateCompanyDto {
  company_name: string;
  rfc: string;
}

export interface UpdateCompanyDto {
  company_name?: string;
  rfc?: string;
}

export interface Company {
  company_id: number;
  company_name: string;
  rfc: string;
  created_at: string;
}
