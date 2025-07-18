export interface MovementFilters {
  company_id?: number;
  accounting_account_id?: number;
  segment_id?: number;
  start_date: string;
  end_date: string;
  page: number = 1;
  limit: number = 20;
}

export type OptionRecord = {
  id: number;
  name: string;
};