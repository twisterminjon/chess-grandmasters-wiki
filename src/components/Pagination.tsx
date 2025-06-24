import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  startIndex?: number;
  endIndex?: number;
  totalItems?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = false,
  startIndex,
  endIndex,
  totalItems,
}) => {
  const getPageNumbers = (): (number | string)[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      {showInfo && startIndex && endIndex && totalItems && (
        <div className="pagination-info">
          Showing {startIndex}-{endIndex} of {totalItems.toLocaleString()} grandmasters
        </div>
      )}
      
      <nav className="pagination">
        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        <div className="pagination-numbers">
          {pageNumbers.map((pageNumber, index) => (
            <button
              key={`${pageNumber}-${index}`}
              className={`pagination-number ${
                pageNumber === currentPage ? 'active' : ''
              }`}
              onClick={() => typeof pageNumber === 'number' && onPageChange(pageNumber)}
              disabled={pageNumber === '...'}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </nav>
    </div>
  );
};