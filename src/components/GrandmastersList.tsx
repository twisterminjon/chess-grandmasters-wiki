import React from 'react';
import { Link } from 'react-router-dom';
import { useGrandmasters } from '../hooks/useChessApi';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const GrandmastersList: React.FC = () => {
  const { 
    data: grandmasters = [], 
    isLoading, 
    error, 
    refetch 
  } = useGrandmasters();

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
    <div>
      <h1>Chess Grandmasters ({grandmasters.length})</h1>
      <div className="grandmasters-list">
        {grandmasters.map((username: string) => (
          <Link 
            key={username} 
            to={`/grandmaster/${username}`} 
            className="grandmaster-item"
          >
            {username}
          </Link>
        ))}
      </div>
    </div>
  );
};