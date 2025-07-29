import { useCallback, useState } from 'react';
import { updateExcelFile } from '../services/excel.service';
import type { ExcelSingleFileDto, ExcelSingleSuccessResponse } from '../models/movement.model';

export function useExcelSingleFileUpload() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExcelSingleSuccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (payload: ExcelSingleFileDto) => {
      setLoading(true);
      try {
        const response = await updateExcelFile(payload);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { data, loading, error, create };
}
