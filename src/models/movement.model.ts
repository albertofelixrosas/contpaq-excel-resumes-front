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
  company_id?: number;
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

export interface MovementConceptsFilters {
  company_id?: number;
}

export interface MovementHeatmapDto {
  date: string;
  count: number;
}

export interface MasiveChangeConceptDto {
  company_id: number;
  accounting_account_id?: number;
  segment_id?: number;
  concept?: string;
  supplier?: string;
  new_concept: string;
}

export interface MasiveChangeConceptResponseDto {
  affected: number;
  message: string;
}

/* REPORTS */
export interface MonthDto {
  key: string;
  label: string;
}

export interface MonthlyConceptRowDto {
  concept: string;
  total_general: number;
  ene: number;
  feb: number;
  mar: number;
  abr: number;
  may: number;
  jun: number;
  jul: number;
  ago: number;
  sep: number;
  oct: number;
  nov: number;
  dic: number;
}

export interface MonthlyReportDto {
  months: MonthDto[];
  data: MonthlyConceptRowDto[];
}

export interface MonthlyReportFiltersDto {
  company_id?: number,
  year: number
}

export interface MonthlyReportBySegmentsDto extends MonthlyReportDto {
  segment_id: number;
  segment_code: string;
}

export interface ExcelSingleFileDto {
  file: File;
}

export interface ExcelSingleSuccessResponse {
  message: string;
  filename: string;
}