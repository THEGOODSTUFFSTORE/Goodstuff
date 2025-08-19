'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ProductImage = React.memo(function ProductImage({
  src,
  alt,
  width = 150,
  height = 150,
  className = '',
  style = { objectFit: 'contain' }
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setImageSrc('/wine.webp');
      setHasError(true);
    }
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={handleError}
      priority={false}
    />
  );
});

export default ProductImage;