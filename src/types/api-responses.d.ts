export interface Company {
  company_id: number;
  company_name: string;
  rfc: string;
  created_at: string;
}

export interface AccountingAccount {
  accounting_account_id: number;
  company_id: number;
  acount_code: string;
  name: string;
}

export interface Segment {
  segment_id: number;
  accounting_account_id: number;
  code: string;
}

export interface PaginatedMovements {
  data: Movement[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Movement {
  movement_id: number;
  company_name: string;
  acount_code: string;
  account_name: string;
  segment_code: string;
  date: string;
  number: number;
  concept: string;
  reference: string;
  charge: number;
}

export interface MovementsHeatmapEntry {
  date: string;
  count: number;
}
