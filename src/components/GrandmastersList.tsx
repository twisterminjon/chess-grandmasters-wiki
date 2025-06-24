import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGrandmasters, usePrefetchPlayerProfile } from '../hooks/useChessApi';
import { usePagination } from '../hooks/usePagination';
import { useUrlState } from '../hooks/useUrlState';
import { Pagination } from './Pagination';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { Avatar } from './Avatar';

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

export const GrandmastersList: React.FC = () => {
  const { page, search, pageSize, updateUrl } = useUrlState();
  const prefetchPlayerProfile = usePrefetchPlayerProfile();
  
  const { 
    data: grandmasters = [], 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useGrandmasters();

  const filteredGrandmasters = useMemo((): string[] => {
    if (!search) return grandmasters;
    const searchLower = search.toLowerCase();
    return grandmasters.filter((username: string) =>
      username.toLowerCase().includes(searchLower)
    );
  }, [grandmasters, search]);

  const {
    currentData,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
  } = usePagination<string>({
    data: filteredGrandmasters,
    pageSize,
    currentPage: page,
  });

  useEffect(() => {
    if (search && page > 1) {
      updateUrl({ page: 1 });
    }
  }, [search, page, updateUrl]);

  const handleSearchChange = (newSearch: string) => {
    updateUrl({ search: newSearch, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    updateUrl({ pageSize: newPageSize, page: 1 });
  };

  if (isLoading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <ErrorMessage 
        message={error instanceof Error ? error.message : 'Failed to load grandmasters'} 
        onRetry={() => refetch()} 
      />
    );
  }

  return (
    <div className="page-container">
      <h1>Chess Grandmasters ({grandmasters.length.toLocaleString()})</h1>
      {isFetching && <div className="updating-indicator">Updating...</div>}
      
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search grandmasters..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          {search && (
            <button 
              onClick={() => handleSearchChange('')}
              className="clear-search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="page-size-selector">
          <label htmlFor="pageSize">Show: </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="page-size-select"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        showInfo={true}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
      />

      <div className="grandmasters-grid">
        {currentData.map((username: string) => (
          <Link 
            key={username} 
            to={`/grandmaster/${username}?${new URLSearchParams({ from: page.toString(), search }).toString()}`}
            className="grandmaster-card"
            onMouseEnter={() => prefetchPlayerProfile(username)}
          >
            <Avatar
              username={username}
              alt={`${username} avatar`}
              size="small"
            />
            <div className="grandmaster-username">{username}</div>
          </Link>
        ))}
      </div>

      {currentData.length === 0 && search && (
        <div className="no-results">
          <p>No grandmasters found matching "{search}"</p>
          <button 
            onClick={() => handleSearchChange('')}
            className="clear-search-button"
          >
            Clear search
          </button>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};