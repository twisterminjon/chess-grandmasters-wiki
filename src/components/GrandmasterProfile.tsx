import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { usePlayerProfile, useInvalidatePlayerData } from '../hooks/useChessApi';
import { Avatar } from './Avatar';
import { TimeSinceLastOnline } from './TimeSinceLastOnline';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { formatDate } from '../utils/timeUtils';

export const GrandmasterProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const { invalidatePlayer } = useInvalidatePlayerData();
  
  const { 
    data: profile, 
    isLoading, 
    error, 
    refetch,
    isFetching,
    dataUpdatedAt 
  } = usePlayerProfile(username);

  const fromPage = searchParams.get('from');
  const fromSearch = searchParams.get('search');
  
  const backLink = () => {
    const params = new URLSearchParams();
    if (fromPage && fromPage !== '1') {
      params.set('page', fromPage);
    }
    if (fromSearch) {
      params.set('search', fromSearch);
    }
    const queryString = params.toString();
    return `/${queryString ? `?${queryString}` : ''}`;
  };

  const handleRefresh = () => {
    if (username) {
      invalidatePlayer(username);
    }
  };

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
    <div className="profile-page">
      <div className="profile-nav">
        <Link to={backLink()} className="back-link">
          ← Back to Grandmasters List
          {fromSearch && <span className="back-context"> (search: "{fromSearch}")</span>}
        </Link>
        <div className="profile-actions">
          {isFetching && <span className="fetching-indicator">Updating...</span>}
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={isFetching}
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="profile-header">
        <Avatar
          src={profile.avatar}
          alt={`${profile.username} avatar`}
          size="large"
          username={profile.username}
        />
        <div className="profile-info">
          <h1>{profile.name || profile.username}</h1>
          <p className="username">@{profile.username}</p>
          {profile.title && <span className="title-badge">{profile.title}</span>}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Followers</h3>
          <p>{profile.followers.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <h3>Status</h3>
          <p>{profile.status}</p>
        </div>
        
        {profile.fide && (
          <div className="stat-card">
            <h3>FIDE Rating</h3>
            <p>{profile.fide}</p>
          </div>
        )}
      </div>

      <div className="profile-details">
        {profile.location && (
          <div className="detail-item">
            <strong>Location:</strong> {profile.location}
          </div>
        )}
        
        <div className="detail-item">
          <strong>Joined Chess.com:</strong> {formatDate(profile.joined)}
        </div>
        
        <div className="detail-item">
          <strong>Last Online:</strong> {formatDate(profile.last_online)}
        </div>
        
        <div className="detail-item">
          <TimeSinceLastOnline lastOnlineTimestamp={profile.last_online} />
        </div>
        
        {profile.is_streamer && (
          <div className="detail-item">
            <strong>Streamer:</strong> Yes
            {profile.twitch_url && (
              <a href={profile.twitch_url} target="_blank" rel="noopener noreferrer">
                Watch on Twitch
              </a>
            )}
          </div>
        )}
      </div>

      <div className="external-links">
        <a href={profile.url} target="_blank" rel="noopener noreferrer" className="chess-com-link">
          View on Chess.com
        </a>
      </div>

      <div className="data-info">
        <small>Last updated: {new Date(dataUpdatedAt).toLocaleString()}</small>
      </div>
    </div>
  );
};