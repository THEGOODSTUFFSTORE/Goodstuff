'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
}

export default function ProductImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  fallbackSrc = '/wine.webp'
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    setImageSrc(fallbackSrc);
  };

  return (
    <Image
      src={imageSrc || fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain' }}
      onError={handleError}
    />
  );
} 