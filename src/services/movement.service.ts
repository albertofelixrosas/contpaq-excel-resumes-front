import { api } from './api';
import type {
  PaginatedMovementsDto,
  CreateMovementDto,
  MovementHeatmapDto,
  MovementFilterDto,
  MovementReportDto,
  MasiveChangeConceptDto,
  MasiveChangeConceptResponseDto,
  MonthlyReportDto,
  MonthlyReportBySegmentsDto,
} from '../models/movement.model';

/**
 * Obtiene los movimientos paginados con filtros opcionales
 */
export async function fetchMovements(filters: MovementFilterDto): Promise<PaginatedMovementsDto> {
  const { data } = await api.get<PaginatedMovementsDto>('/movements', { params: filters });
  return data;
}

/**
 * Obtiene un movimiento por ID
 */
export async function fetchMovement(id: number): Promise<MovementReportDto> {
  const { data } = await api.get<MovementReportDto>(`/movements/${id}`);
  return data;
}

/**
 * Obtiene un listado de las fechas y cuantos movimientos por fechas tiene una empresa
 */
export async function fetchMovementsHeatmap(filters: {
  company_id: number;
}): Promise<MovementHeatmapDto[]> {
  const { data } = await api.get<MovementHeatmapDto[]>('/movements/heatmap', { params: filters });
  return data;
}

/**
 * Obtiene un listado de los proveedores que tiene una empresa
 */
export async function fetchMovementsSuppliers(filters: { company_id: number }): Promise<string[]> {
  const { data } = await api.get<string[]>('/movements/suppliers', { params: filters });
  return data;
}

/**
 * Obtiene un listado de los proveedores que tiene una empresa
 */
export async function fetchMovementsConcepts(filters: { company_id: number }): Promise<string[]> {
  const { data } = await api.get<string[]>('/movements/concepts', { params: filters });
  return data;
}

export async function fetchMovementsYearConceptsResume(filters: {
  company_id: number;
  year: number;
}): Promise<MonthlyReportDto> {
  const { data } = await api.get<MonthlyReportDto>('/movements/monthly-report', {
    params: filters,
  });
  return data;
}

export async function fetchMovementsYearConceptsResumeBySegments(filters: {
  company_id: number;
  year: number;
}): Promise<MonthlyReportBySegmentsDto[]> {
  const { data } = await api.get<MonthlyReportBySegmentsDto[]>(
    '/movements/segmented-monthly-report',
    {
      params: filters,
    },
  );
  return data;
}

/**
 * Crea un nuevo movimiento
 */
export async function createMovement(payload: CreateMovementDto): Promise<void> {
  await api.post('/movements', payload);
}

/**
 * Elimina un movimiento por id
 */
export async function deleteMovement(id: number): Promise<void> {
  await api.delete(`/movements/${id}`);
}

/**
 * Actualiza un movimiento (opcional, si quieres agregarlo después)
 */
export async function updateMovement(
  id: number,
  payload: Partial<CreateMovementDto>,
): Promise<void> {
  await api.patch(`/movements/${id}`, payload);
}

/**
 * Actualiza todos los movimientos que cumplan los filtros dados como parametro en esta función
 */
export async function masiveUpdateMovements(
  payload: MasiveChangeConceptDto,
): Promise<MasiveChangeConceptResponseDto> {
  const { data } = await api.patch<MasiveChangeConceptResponseDto>(
    `/movements/massive-change-concept/`,
    payload,
  );
  return data;
}
