'use client'
import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  heroImage?: string;
  backgroundGradient?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "GLENMORANGIE",
  subtitle = "SINGLE MALT SCOTCH WHISKY",
  buttonText = "GIFT HIM TODAY",
  onButtonClick = () => {},
  heroImage = "/glen.png", // Replace with your actual image path
  backgroundGradient = "from-orange-400 via-orange-500 to-red-500"
}) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient}`} />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-8 bg-orange-300 rounded-full blur-sm transform rotate-12" />
        <div className="absolute top-32 right-16 w-16 h-6 bg-yellow-300 rounded-full blur-sm transform -rotate-12" />
        <div className="absolute bottom-24 left-20 w-24 h-10 bg-orange-200 rounded-full blur-sm transform rotate-6" />
        <div className="absolute bottom-40 right-10 w-12 h-5 bg-yellow-200 rounded-full blur-sm transform -rotate-6" />
      </div>

      <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full py-12 lg:py-20">
            
            {/* Content Section */}
            <div className="text-center lg:text-left order-2 lg:order-1 z-10">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-10 bg-orange-600 rounded-full mb-4">
                  <span className="text-white text-xs font-bold">10</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 tracking-wide">
                {title}
              </h1>
              
              <p className="text-white/90 text-sm md:text-base lg:text-lg mb-8 tracking-widest">
                {subtitle}
              </p>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                HAPPY FATHER'S DAY.
              </h2>
              
              <p className="text-white/90 text-base md:text-lg mb-8 tracking-wide">
                FROM ONE ORIGINAL TO ANOTHER.
              </p>
              
              <button
                onClick={onButtonClick}
                className="inline-flex items-center px-8 py-3 bg-white text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {buttonText}
              </button>
            </div>

            {/* Image Section */}
            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
              {/* Image container with responsive sizing */}
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[480px]">
                {/* Main product image */}
                <img
                  src={heroImage}
                  alt="Glenmorangie Whisky Bottle"
                  className="w-full h-auto object-contain filter drop-shadow-2xl"
                  style={{
                    aspectRatio: '2/3',
                    maxHeight: '70vh'
                  }}
                />
                
                {/* Floating elements around the bottle */}
                <div className="absolute -top-4 -right-4 w-12 h-8 bg-orange-300/30 rounded-full blur-sm animate-pulse" />
                <div className="absolute top-1/3 -left-6 w-8 h-6 bg-yellow-300/30 rounded-full blur-sm animate-pulse delay-1000" />
                <div className="absolute bottom-1/4 -right-8 w-10 h-6 bg-orange-200/30 rounded-full blur-sm animate-pulse delay-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/10 to-transparent" />
    </section>
  );
};

export default Hero;