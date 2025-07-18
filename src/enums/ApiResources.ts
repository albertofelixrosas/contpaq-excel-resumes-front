export const ApiResource = {
  Companies: 'companies',
  AccountingAccounts: 'accounting-accounts',
  Segments: 'segments',
  Movements: 'movements',
  MovementsHeatmap: 'movements/heatmap',
} as const;

export type ApiResource = typeof ApiResource[keyof typeof ApiResource];