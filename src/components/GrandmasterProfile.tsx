import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlayerProfile } from '../hooks/useChessApi';
import { TimeSinceLastOnline } from './TimeSinceLastOnline';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { formatDate } from '../utils/timeUtils';

export const GrandmasterProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  
  const { 
    data: profile, 
    isLoading, 
    error, 
    refetch 
  } = usePlayerProfile(username);

  if (isLoading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <ErrorMessage 
        message={error instanceof Error ? error.message : 'Failed to load profile'} 
        onRetry={() => refetch()} 
      />
    );
  }
  
  if (!profile) {
    return <ErrorMessage message="Profile not found" />;
  }

  return (
    <div>
      <Link to="/">← Back to List</Link>
      
      <h1>{profile.name || profile.username}</h1>
      <p>@{profile.username}</p>
      
      <div>
        <p><strong>Followers:</strong> {profile.followers.toLocaleString()}</p>
        <p><strong>Status:</strong> {profile.status}</p>
        <p><strong>Joined:</strong> {formatDate(profile.joined)}</p>
        <p><strong>Last Online:</strong> {formatDate(profile.last_online)}</p>
        
        <TimeSinceLastOnline lastOnlineTimestamp={profile.last_online} />
        
        {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
        {profile.fide && <p><strong>FIDE Rating:</strong> {profile.fide}</p>}
      </div>

      <a href={profile.url} target="_blank" rel="noopener noreferrer">
        View on Chess.com
      </a>
    </div>
  );
};