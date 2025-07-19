import { api } from './api';
import type {
  Segment,
  CreateSegmentDto,
  GetSegmentsQueryDto,
  UpdateSegmentDto,
} from '../models/segment.model';

export async function fetchSegments(payload: GetSegmentsQueryDto): Promise<Segment[]> {
  const { data } = await api.get<Segment[]>('/segments', { params: payload });
  return data;
}

export async function createSegment(payload: CreateSegmentDto): Promise<void> {
  await api.post('/segments', payload);
}

export async function deleteSegment(id: number): Promise<void> {
  await api.delete(`/segments/${id}`);
}

export async function updateSegment(id: number, payload: Partial<UpdateSegmentDto>): Promise<void> {
  await api.patch(`/segments/${id}`, payload);
}
