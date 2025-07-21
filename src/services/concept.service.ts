import { api } from './api';
import type {
  Concept,
  CreateConceptDto,
  UpdateConceptDto,
  GetConceptsQueryDto,
} from '../models/concept.model';

export async function fetchConcepts(payload: GetConceptsQueryDto): Promise<Concept[]> {
  const { data } = await api.get<Concept[]>('/concepts', { params: payload });
  return data;
}

export async function createConcept(payload: CreateConceptDto): Promise<void> {
  await api.post('/concepts', payload);
}

export async function deleteConcept(id: number): Promise<void> {
  await api.delete(`/concepts/${id}`);
}

export async function updateConcept(id: number, payload: Partial<UpdateConceptDto>): Promise<void> {
  await api.patch(`/concepts/${id}`, payload);
}
