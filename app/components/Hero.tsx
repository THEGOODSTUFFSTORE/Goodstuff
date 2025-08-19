'use client'
import React from 'react';
import Image from 'next/image';

interface HeroProps {
  alt?: string;
}

const Hero: React.FC<HeroProps> = ({
  alt = "Hero Image"
}) => {
  return (
    <section className="relative w-full">
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]">
        <Image
          src="/Goodstuff store.png"
          alt={alt}
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
      </div>
    </section>
  );
};

export default Hero;