import React from 'react';
import './Pagination.css';

type PaginationProps = {
  page: number;
  lastPage: number;
  total?: number;
  onPageChange: (page: number) => void;
  pageRange?: number; // cuántos botones mostrar a cada lado
};

export const Pagination: React.FC<PaginationProps> = ({
  page,
  lastPage,
  total,
  onPageChange,
  pageRange = 2,
}) => {
  const pages: number[] = [];

  const startPage = Math.max(1, page - pageRange);
  const endPage = Math.min(lastPage, page + pageRange);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < lastPage) onPageChange(page + 1);
  };

  return (
    <div className="pagination">
      <button
        disabled={page === 1}
        onClick={handlePrev}
        className="pagination-btn"
      >
        Anterior
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {startPage > 2 && <span>…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={p === page ? 'active' : ''}
        >
          {p}
        </button>
      ))}

      {endPage < lastPage && (
        <>
          {endPage < lastPage - 1 && <span>…</span>}
          <button onClick={() => onPageChange(lastPage)}>{lastPage}</button>
        </>
      )}

      <button
        disabled={page === lastPage}
        onClick={handleNext}
        className="pagination-btn"
      >
        Siguiente
      </button>

      {total !== undefined && (
        <span className="pagination-total">Total: {total}</span>
      )}
    </div>
  );
};

export default Pagination;
