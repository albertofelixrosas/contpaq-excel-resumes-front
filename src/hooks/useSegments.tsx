import { useCallback, useState } from 'react';
import {
  fetchSegments,
  createSegment,
  updateSegment,
  deleteSegment,
} from '../services/segments.service';
import type {
  Segment,
  GetSegmentsQueryDto,
  CreateSegmentDto,
  UpdateSegmentDto,
} from '../models/segment.model';

export function useSegments() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Segment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (payload: GetSegmentsQueryDto) => {
    try {
      setLoading(true);
      const res = await fetchSegments(payload);
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: CreateSegmentDto) => {
    try {
      setLoading(true);
      await createSegment(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: number, payload: UpdateSegmentDto) => {
    try {
      setLoading(true);
      await updateSegment(id, payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await deleteSegment(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch, create, update, remove };
}
