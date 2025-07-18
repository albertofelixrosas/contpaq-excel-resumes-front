import React, { useMemo, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { format, parseISO } from 'date-fns';
import './CalendarHeatmap.css';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { subtractMonths } from '../../utils/dateUtils';

type Props = {
  values: { date: string; count: number }[];
  firstDatePreviusText: string;
  finalDatePreviusText: string;
};

export const MovementsHeatmap: React.FC<Props> = ({
  values,
  firstDatePreviusText,
  finalDatePreviusText,
}) => {
  const breakpoint = useBreakpoint();
  const stepMonths = 3;

  const maxMonths = useMemo(() => {
    switch (breakpoint) {
      case 'xs':
        return 4;
      case 'sm':
        return 6;
      case 'md':
        return 8;
      case 'lg':
      default:
        return 10;
    }
  }, [breakpoint]);

  const [offset, setOffset] = useState(0);

  const { startDate, endDate } = useMemo(() => {
    const end = subtractMonths(new Date(), offset);
    const start = subtractMonths(end, maxMonths);
    return { startDate: start, endDate: end };
  }, [offset, maxMonths]);

  const goPrevious = () => setOffset(prev => prev + stepMonths);
  const goNext = () => setOffset(prev => Math.max(prev - stepMonths, 0));

  const getDates = () => {
    const dates = values.map(v => v.date);
    const [first] = dates;
    const last = dates[dates.length - 1];
    return [first.slice(0, 10), last.slice(0, 10)];
  };

  const [firstDate, lastDate] = getDates();

  return (
    <>
      <div className="heatmap__important-dates">
        <p className="heatmap__important-date">
          {firstDatePreviusText}: <strong>{firstDate}</strong>
        </p>
        <p className="heatmap__important-date">
          {finalDatePreviusText}: <strong>{lastDate}</strong>
        </p>
      </div>
      <div className="heatmap">
        <div className="heatmap__header">
          <div className="heatmap__ranges">
            <div className="heatmap__range-item">
              <span>Rango inicial</span>
              <strong>{startDate.toJSON().slice(0, 10)}</strong>
            </div>
            <div className="heatmap__range-item">
              <span>Rango final</span>
              <strong>{endDate.toJSON().slice(0, 10)}</strong>
            </div>
          </div>
          <div className="heatmap__controls">
            <button className="heatmap__button" onClick={goPrevious}>
              Anterior
            </button>
            <button className="heatmap__button" onClick={goNext} disabled={offset === 0}>
              Siguiente
            </button>
          </div>
        </div>

        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          gutterSize={3}
          classForValue={value => {
            if (!value || value.count === 0) return 'color-empty';

            const month = format(parseISO(value.date), 'MMM').toLowerCase(); // ej: jan, feb…
            const level = Math.min(value.count, 4); // si quieres limitar a 4 niveles
            return `color-${month}-${level}`;
          }}
          showMonthLabels
          monthLabels={[
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
          ]}
          weekdayLabels={['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']}
        />
      </div>
    </>
  );
};
