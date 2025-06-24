import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getPage = useCallback(() => {
    const page = searchParams.get('page');
    return page ? Math.max(1, parseInt(page, 10)) : 1;
  }, [searchParams]);

  const getSearch = useCallback(() => {
    return searchParams.get('search') || '';
  }, [searchParams]);

  const getPageSize = useCallback(() => {
    const size = searchParams.get('pageSize');
    return size ? Math.max(12, Math.min(100, parseInt(size, 10))) : 24;
  }, [searchParams]);

  const updateUrl = useCallback((updates: {
    page?: number;
    search?: string;
    pageSize?: number;
  }) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      
      if (updates.page !== undefined) {
        if (updates.page === 1) {
          newParams.delete('page');
        } else {
          newParams.set('page', updates.page.toString());
        }
      }
      
      if (updates.search !== undefined) {
        if (updates.search === '') {
          newParams.delete('search');
        } else {
          newParams.set('search', updates.search);
        }
      }
      
      if (updates.pageSize !== undefined) {
        if (updates.pageSize === 24) {
          newParams.delete('pageSize');
        } else {
          newParams.set('pageSize', updates.pageSize.toString());
        }
      }
      
      return newParams;
    });
  }, [setSearchParams]);

  return {
    page: getPage(),
    search: getSearch(),
    pageSize: getPageSize(),
    updateUrl,
  };
}