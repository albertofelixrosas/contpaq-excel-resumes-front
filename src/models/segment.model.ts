export interface CreateSegmentDto {
  code: string;
  accounting_account_id: number;
  name?: string;
  date?: string;
  farm_name?: string;
}

export interface GetSegmentsQueryDto {
  company_id?: number;
}

export interface UpdateSegmentDto {
  code?: string;
  accounting_account_id?: number;
  name?: string;
  date?: string;
  farm_name?: string;
}

export interface Segment {
  segment_id: number;
  accounting_account_id: number;
  code: string;
  name: string;
  date: string;
  farm_name: string;
}
