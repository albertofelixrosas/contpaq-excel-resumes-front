import { useState } from 'react';
import { subtractMonths } from '../utils/dateUtils';

/**
 * Hook para manejar la navegación de rangos de fechas en bloques de meses
 */
export function useDateRange(stepMonths = 3, initialOffset = 0) {
  const [offset, setOffset] = useState(initialOffset);

  const today = new Date();
  const endDate = subtractMonths(today, offset);
  const startDate = subtractMonths(endDate, stepMonths);

  const goPrevious = () => setOffset(prev => prev + stepMonths);
  const goNext = () => setOffset(prev => Math.max(prev - stepMonths, 0));

  return {
    startDate,
    endDate,
    goPrevious,
    goNext,
    canGoNext: offset > 0,
  };
}
