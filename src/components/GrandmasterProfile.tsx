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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'premium': return '#f39c12';
      case 'staff': return '#e74c3c';
      case 'mod': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-navigation">
        <Link to={backLink()} className="back-button">
          <span className="back-icon">←</span>
          <span>Back to Directory</span>
          {fromSearch && <span className="nav-context">({fromSearch})</span>}
        </Link>
        <div className="nav-actions">
          {isFetching && <div className="updating-indicator">Syncing...</div>}
          <button 
            onClick={handleRefresh} 
            className="refresh-button-modern"
            disabled={isFetching}
          >
            <span className="refresh-icon">⟳</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="profile-header-modern">
        <div className="profile-banner">
          <div className="banner-pattern"></div>
        </div>
        <div className="profile-info">
          <div className="avatar-section">
            <Avatar
              src={profile.avatar}
              alt={`${profile.username} avatar`}
              size="large"
              username={profile.username}
            />
            <div className="title-badge-large">GM</div>
          </div>
          <div className="profile-details-header">
            <h1 className="profile-name">{profile.name || profile.username}</h1>
            <p className="profile-username">@{profile.username}</p>
            <div className="profile-badges">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(profile.status) }}
              >
                {profile.status}
              </span>
              {profile.is_streamer && (
                <span className="streamer-badge">
                  📺 Streamer
                </span>
              )}
              {profile.title && profile.title !== 'GM' && (
                <span className="additional-title-badge">{profile.title}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-main-content">
        <div className="profile-left-column">
          <div className="stats-grid-modern">
            <div className="stat-card-modern primary">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-number">{profile.followers.toLocaleString()}</div>
                <div className="stat-label">Followers</div>
              </div>
            </div>
            
            <div className="stat-card-modern">
              <div className="stat-icon">🆔</div>
              <div className="stat-content">
                <div className="stat-number">#{profile.player_id}</div>
                <div className="stat-label">Player ID</div>
              </div>
            </div>
            
            {profile.fide && (
              <div className="stat-card-modern highlight">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <div className="stat-number">{profile.fide}</div>
                  <div className="stat-label">FIDE Rating</div>
                </div>
              </div>
            )}
            
            <div className="stat-card-modern">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <div className="stat-number">{formatDate(profile.joined)}</div>
                <div className="stat-label">Joined</div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <h3><span className="info-icon">ℹ️</span> Profile Information</h3>
            </div>
            <div className="info-list">
              {profile.location && (
                <div className="info-item">
                  <span className="info-key">📍 Location</span>
                  <span className="info-value">{profile.location}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-key">🗓️ Member Since</span>
                <span className="info-value">{formatDate(profile.joined)}</span>
              </div>
              <div className="info-item">
                <span className="info-key">🕐 Last Online</span>
                <span className="info-value">{formatDate(profile.last_online)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-right-column">
          <div className="info-card live-status">
            <div className="info-card-header">
              <h3><span className="info-icon">⏰</span> Live Status</h3>
            </div>
            <div className="live-timer">
              <TimeSinceLastOnline lastOnlineTimestamp={profile.last_online} />
            </div>
          </div>

          {profile.is_streamer && (
            <div className="info-card streaming">
              <div className="info-card-header">
                <h3><span className="info-icon">📺</span> Streaming</h3>
              </div>
              <p className="streaming-text">This grandmaster streams chess content!</p>
              {profile.twitch_url && (
                <a 
                  href={profile.twitch_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="twitch-button"
                >
                  <span className="twitch-icon">📺</span>
                  Watch on Twitch
                </a>
              )}
            </div>
          )}
        </div>

        <div className="action-section">
          <a 
            href={profile.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="primary-action-button"
          >
            <span className="action-icon">🔗</span>
            View on Chess.com
          </a>
        </div>

        <div className="profile-footer">
          <div className="last-updated">
            <span className="update-icon">🔄</span>
            Last updated: {new Date(dataUpdatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};