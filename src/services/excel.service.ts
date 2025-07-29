import type { ExcelSingleFileDto, ExcelSingleSuccessResponse } from '../models/movement.model';
import { api } from './api';

export async function updateExcelFile(payload: ExcelSingleFileDto): Promise<ExcelSingleSuccessResponse> {
  const formData = new FormData();
  formData.append('file', payload.file);
  const { data } = await api.post<ExcelSingleSuccessResponse>('/excel/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}
