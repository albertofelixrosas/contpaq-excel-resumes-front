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

export function useSegments(filters: GetSegmentsQueryDto) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Segment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (payload: GetSegmentsQueryDto) => {
    setLoading(true);
    try {
      const res = await fetchSegments(payload);
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (payload: CreateSegmentDto) => {
      setLoading(true);
      try {
        await createSegment(payload);
        await fetch(filters);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [fetch],
  );

  const update = useCallback(async (id: number, payload: UpdateSegmentDto) => {
    setLoading(true);
    try {
      await updateSegment(id, payload);
      await fetch(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        await deleteSegment(id);
        await fetch(filters);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [fetch],
  );

  return { data, loading, error, fetch, create, update, remove };
}
