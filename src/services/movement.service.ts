import { api } from './api';
import type {
  PaginatedMovementsDto,
  CreateMovementDto,
  MovementHeatmapDto,
  MovementFilterDto,
} from '../models/movement.model';

/**
 * Obtiene los movimientos paginados con filtros opcionales
 */
export async function fetchMovements(filters: MovementFilterDto): Promise<PaginatedMovementsDto> {
  const { data } = await api.get<PaginatedMovementsDto>('/movements', { params: filters });
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
export async function fetchMovementsSuppliers(filters: {
  company_id: number;
}): Promise<string[]> {
  const { data } = await api.get<string[]>('/movements/suppliers', { params: filters });
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
