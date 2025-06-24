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
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-16 h-16 text-sm',
    large: 'w-24 h-24 text-lg'
  };

  // Reset state when src changes
  useEffect(() => {
    if (src) {
      setImageState('loading');
      setImageSrc(src);
    } else {
      setImageState('error');
    }
  }, [src]);

  const handleImageLoad = () => {
    setImageState('loaded');
  };

  const handleImageError = () => {
    setImageState('error');
    // Try alternative image sources
    if (imageSrc === src) {
      // Try with different parameters or CDN
      const altSrc = src?.replace('200x200o', '160x160o');
      if (altSrc && altSrc !== src) {
        setImageSrc(altSrc);
        return;
      }
    }
  };

  // Generate initials from username
  const getInitials = (name: string) => {
    return name
      .split(/[-_\s]/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  };

  const initials = getInitials(username);

  return (
    <div className={`avatar ${sizeClasses[size]}`}>
      {imageState === 'loaded' && imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className="avatar-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : imageState === 'loading' && imageSrc ? (
        <>
          <div className="avatar-skeleton" />
          <img
            src={imageSrc}
            alt={alt}
            className="avatar-image-hidden"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </>
      ) : (
        <div className="avatar-fallback">
          <span className="avatar-initials">{initials}</span>
        </div>
      )}
    </div>
  );
};