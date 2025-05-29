// components/ui/fallback-image.tsx
import Image from 'next/image';
import { useState } from 'react';

interface FallbackImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
}

export function FallbackImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = '/assets/images/logo_xi.png',
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isError ? 'opacity-100' : ''}`}
      onError={() => {
        if (!isError) {
          setImgSrc(fallbackSrc);
          setIsError(true);
        }
      }}
      priority={true}
    />
  );
}