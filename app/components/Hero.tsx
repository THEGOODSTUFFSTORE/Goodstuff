'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface HeroProps {
  alt?: string;
  pageKey?: string; // which page's hero to load from CMS (default: home)
}

const Hero: React.FC<HeroProps> = ({
  alt = "Hero Image",
  pageKey = 'home'
}) => {
  const [heroUrl, setHeroUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/cms/hero?page=${encodeURIComponent(pageKey)}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.url) {
          setHeroUrl(data.url as string);
        } else if (isMounted) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[Hero] Using fallback image. No CMS URL returned for pageKey:', pageKey);
          }
          setHeroUrl(null);
        }
      } catch {}
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [pageKey]);

  return (
    <section className="relative w-full pt-16">
      <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] xl:h-[350px]">
        <Image
          src={heroUrl || '/hero1.png'}
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