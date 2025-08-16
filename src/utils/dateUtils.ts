export const formatDateToLongSpanish = (date: Date): string => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export function subtractMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

export function slashAndSpanishMonthDate(date: Date): string {
  let formattedMonth = new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(date);

  const finalMonth = `${formattedMonth[0].toUpperCase()}${formattedMonth.toLowerCase().slice(1)}`;

  return `${(date.getDate() + '').padStart(2, '0')}/${finalMonth}/${date.getFullYear()}`;
}