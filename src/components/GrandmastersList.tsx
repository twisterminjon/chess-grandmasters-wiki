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

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      updateUrl({ page: 1 });
    }
  }, [page, totalPages, updateUrl]);

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

  const handleMouseEnter = (username: string) => {
    prefetchPlayerProfile(username);
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
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">♔</div>
          <h1 className="hero-title">Chess Grandmasters Directory</h1>
          <p className="hero-subtitle">
            Explore the world's finest chess masters from Chess.com
          </p>
          <div className="hero-stats">
            <div className="stat-badge">
              <span className="stat-number">{grandmasters.length.toLocaleString()}</span>
              <span className="stat-label">Grandmasters</span>
            </div>
            {isFetching && <div className="updating-badge">Updating...</div>}
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-section">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by username..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input-modern"
            />
            {search && (
              <button 
                onClick={() => handleSearchChange('')}
                className="clear-search-modern"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          {search && (
            <div className="search-results-info">
              Found <strong>{filteredGrandmasters.length}</strong> grandmasters matching "<em>{search}</em>"
            </div>
          )}
        </div>

        <div className="view-controls">
          <div className="page-size-control">
            <label htmlFor="pageSize" className="control-label">Items per page:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="page-size-select-modern"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
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

      <div className="grandmasters-grid-modern">
        {currentData.map((username: string, index: number) => (
          <div
            key={username}
            className="grandmaster-card-modern"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Link 
              to={`/grandmaster/${username}?${new URLSearchParams({ from: page.toString(), search }).toString()}`}
              className="card-link"
              onMouseEnter={() => handleMouseEnter(username)}
            >
              <div className="card-header">
                <Avatar
                  username={username}
                  alt={`${username} avatar`}
                  size="medium"
                />
                <div className="gm-badge">GM</div>
              </div>
              <div className="card-content">
                <h3 className="username-title">{username}</h3>
                <p className="user-subtitle">Chess Grandmaster</p>
              </div>
              <div className="card-footer">
                <div className="view-profile-text">View Profile →</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {currentData.length === 0 && search && (
        <div className="no-results-modern">
          <div className="no-results-icon">🔍</div>
          <h3>No grandmasters found</h3>
          <p>No results for "<strong>{search}</strong>"</p>
          <button 
            onClick={() => handleSearchChange('')}
            className="clear-search-button-modern"
          >
            Clear search and view all
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