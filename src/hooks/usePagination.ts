import { useMemo } from 'react';

export interface PaginationConfig<T> {
  data: T[];
  pageSize: number;
  currentPage: number;
}

export interface PaginationResult<T> {
  currentData: T[];
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export function usePagination<T>({
  data,
  pageSize,
  currentPage,
}: PaginationConfig<T>): PaginationResult<T> {
  return useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const currentData = data.slice(startIndex, endIndex);

    return {
      currentData,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex,
    };
  }, [data, pageSize, currentPage]);
}