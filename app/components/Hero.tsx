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
    <section className="relative w-full pt-16">
      <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] xl:h-[350px]">
        <Image
          src="/hero1.png"
          alt={alt}
          fill
          className="object-cover object-left"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
      </div>
    </section>
  );
};

export default Hero;