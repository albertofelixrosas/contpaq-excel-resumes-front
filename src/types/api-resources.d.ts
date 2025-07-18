import {
  Company,
  AccountingAccount,
  Segment,
  Movement,
  type PaginatedMovements,
  MovementsHeatmapEntry,
} from './api-responses';
import { ApiResource } from '../enums/ApiResources';

export interface ApiResourceMap {
  [ApiResource.Companies]: Company[];
  [ApiResource.AccountingAccounts]: AccountingAccount[];
  [ApiResource.Segments]: Segment[];
  [ApiResource.Movements]: PaginatedMovements;
  [ApiResource.MovementsHeatmap]: MovementsHeatmapEntry[];
}
