import React, { useState, useEffect } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  username: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'medium', 
  username 
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    if (src) {
      setImageState('loading');
    } else {
      setImageState('error');
    }
  }, [src]);

  const handleImageLoad = () => {
    setImageState('loaded');
  };

  const handleImageError = () => {
    setImageState('error');
  };

  const getInitials = (name: string) => {
    return name
      .split(/[-_\s]/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  };

  const sizeClasses = {
    small: 'avatar-small',
    medium: 'avatar-medium',
    large: 'avatar-large'
  };

  return (
    <div className={`avatar ${sizeClasses[size]}`}>
      {imageState === 'loaded' && src ? (
        <img
          src={src}
          alt={alt}
          className="avatar-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : imageState === 'loading' && src ? (
        <>
          <div className="avatar-skeleton" />
          <img
            src={src}
            alt={alt}
            className="avatar-image-hidden"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </>
      ) : (
        <div className="avatar-fallback">
          <span className="avatar-initials">{getInitials(username)}</span>
        </div>
      )}
    </div>
  );
};