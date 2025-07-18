export interface CreateMovementDto {
  segment_id: number;
  date: string;
  number: number;
  supplier: string;
  concept: string;
  reference: string;
  charge: number | null;
}

export interface UpdateMovementDto {
  segment_id?: number;
  date?: string;
  number?: number;
  supplier?: string;
  concept?: string;
  reference?: string;
  charge?: number | null;
}

export interface PaginatedMovementsDto {
  data: MovementReportDto[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface MovementReportDto {
  movement_id: number;
  company_name: string;
  acount_code: string;
  account_name: string;
  segment_code: string;
  date: string; // si prefieres Date, cámbialo
  number: number;
  supplier: string;
  concept: string;
  reference: string;
  charge: number;
}

export interface MovementFilterDto {
  company_id: number;
  accounting_account_id?: number;
  segment_id?: number;
  start_date: string;
  end_date: string;
  concept?: string;
  supplier?: string;
  page: number;
  limit: number;
}

export interface MovementHeatmapFilters {
  company_id: number;
}

export interface MovementHeatmapDto {
  date: string;
  count: number;
}
