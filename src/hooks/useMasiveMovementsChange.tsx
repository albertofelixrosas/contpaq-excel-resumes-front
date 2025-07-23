import { useCallback, useState } from 'react';
import { masiveUpdateMovements } from '../services/movement.service';
import type {
  MasiveChangeConceptDto,
  MasiveChangeConceptResponseDto,
} from '../models/movement.model';

export function useMasiveMovementsChange() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MasiveChangeConceptResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (payload: MasiveChangeConceptDto) => {
    try {
      setLoading(true);
      const data = await masiveUpdateMovements(payload);
      setData(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, update };
}
