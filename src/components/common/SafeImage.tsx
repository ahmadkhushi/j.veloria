'use client';

import React, { useState, useEffect } from 'react';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  alt = '',
  fallbackSrc = '/placeholder.png',
  className = '',
  ...props
}: SafeImageProps) {
  const initialSrc = typeof src === 'string' && src ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);

  useEffect(() => {
    const validSrc = typeof src === 'string' && src ? src : fallbackSrc;
    setImgSrc(validSrc);
  }, [src, fallbackSrc]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
