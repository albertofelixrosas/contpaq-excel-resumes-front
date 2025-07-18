export interface CreateAccountingAccountDto {
  company_id: number;
  acount_code: string;
  name: string;
}

export interface GetAccountingAccountsQueryDto {
  company_id?: number;
}

export interface UpdateAccountingAccountDto {
  company_id: number;
  acount_code: string;
  name: string;
}

export interface AccountingAccount {
  accounting_account_id: number;
  company_id: number;
  acount_code: string;
  name: string;
}