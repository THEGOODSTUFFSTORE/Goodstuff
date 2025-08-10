'use client'
import React from 'react';

interface HeroProps {
  alt?: string;
}

const Hero: React.FC<HeroProps> = ({
  alt = "Hero Image"
}) => {
  return (
    <section className="relative w-full">
      <img
        src={"/Goodstuff store.png"}
        alt={alt}
        className="w-full h-auto object-cover"
        style={{ maxHeight: '600px' }}
      />
    </section>
  );
};

export default Hero;