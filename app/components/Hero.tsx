'use client'
import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  heroImage?: string;
  heroVideo?: string;
  backgroundVideo?: string;
  backgroundGradient?: string;
  videoMuted?: boolean;
  videoLoop?: boolean;
  videoAutoplay?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  title = "GLENMORANGIE",
  subtitle = "SINGLE MALT SCOTCH WHISKY",
  buttonText = "GIFT HIM TODAY",
  onButtonClick = () => {},
  heroImage = "glen.png", // Replace with your actual image path
  heroVideo,
  backgroundVideo,
  backgroundGradient = "from-gray-900 via-black to-gray-800",
  videoMuted = true,
  videoLoop = true,
  videoAutoplay = true
}) => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Background Video or Gradient */}
      {backgroundVideo ? (
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay={videoAutoplay}
            loop={videoLoop}
            muted={videoMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.7) contrast(1.2)' }}
          >
            <source src={backgroundVideo} type="video/mp4" />
            <source src={backgroundVideo.replace('.mp4', '.webm')} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        /* Fallback to gradient background */
        <div className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient}`} 
             style={{
               background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 25%, #1a1a1a 50%, #2d2d2d 75%, #1a1a1a 100%)'
             }} />
      )}
      
      {/* Enhanced Decorative elements with animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-8 rounded-full blur-sm transform rotate-12 animate-pulse" 
             style={{ backgroundColor: '#EF4444' }} />
        <div className="absolute top-32 right-16 w-16 h-6 rounded-full blur-sm transform -rotate-12 animate-pulse delay-500" 
             style={{ backgroundColor: '#6B7280' }} />
        <div className="absolute bottom-24 left-20 w-24 h-10 rounded-full blur-sm transform rotate-6 animate-pulse delay-1000" 
             style={{ backgroundColor: '#10B981' }} />
        <div className="absolute bottom-40 right-10 w-12 h-5 rounded-full blur-sm transform -rotate-6 animate-pulse delay-1500" 
             style={{ backgroundColor: '#FFFFFF' }} />
      </div>

      <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] z-10">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full py-12 lg:py-20">
            
            {/* Content Section */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-10 rounded-full mb-4 animate-bounce"
                     style={{ backgroundColor: '#EF4444' }}>
                  <span className="text-white text-xs font-bold">10</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 tracking-wide animate-fade-in-up">
                {title}
              </h1>
              
              <p className="text-white/90 text-sm md:text-base lg:text-lg mb-8 tracking-widest animate-fade-in-up delay-300">
                {subtitle}
              </p>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 animate-fade-in-up delay-500">
                HAPPY FATHER'S DAY.
              </h2>
              
              <p className="text-white/90 text-base md:text-lg mb-8 tracking-wide animate-fade-in-up delay-700">
                FROM ONE ORIGINAL TO ANOTHER.
              </p>
              
              <button
                onClick={onButtonClick}
                className="inline-flex items-center px-8 py-3 font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-fade-in-up delay-1000"
                style={{ 
                  backgroundColor: '#10B981', 
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10B981';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                {buttonText}
              </button>
            </div>

            {/* Video/Image Section */}
            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
              {/* Video/Image container with responsive sizing */}
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[480px] animate-fade-in-right">
                {heroVideo ? (
                  /* Product Video */
                  <div className="relative">
                    <video
                      autoPlay={videoAutoplay}
                      loop={videoLoop}
                      muted={videoMuted}
                      playsInline
                      className="w-full h-auto object-contain filter drop-shadow-2xl rounded-lg"
                      style={{
                        aspectRatio: '2/3',
                        maxHeight: '70vh'
                      }}
                    >
                      <source src={heroVideo} type="video/mp4" />
                      <source src={heroVideo.replace('.mp4', '.webm')} type="video/webm" />
                      {/* Fallback to image if video fails */}
                      <img
                        src={heroImage}
                        alt="Glenmorangie Whisky Bottle"
                        className="w-full h-auto object-contain filter drop-shadow-2xl"
                        style={{
                          aspectRatio: '2/3',
                          maxHeight: '70vh'
                        }}
                      />
                    </video>
                  </div>
                ) : (
                  /* Fallback to Image */
                  <img
                    src={heroImage}
                    alt="Glenmorangie Whisky Bottle"
                    className="w-full h-auto object-contain filter drop-shadow-2xl"
                    style={{
                      aspectRatio: '2/3',
                      maxHeight: '70vh'
                    }}
                  />
                )}
                
                {/* Enhanced Floating elements around the bottle/video */}
                <div className="absolute -top-4 -right-4 w-12 h-8 rounded-full blur-sm animate-pulse" 
                     style={{ backgroundColor: 'rgba(239, 68, 68, 0.4)' }} />
                <div className="absolute top-1/3 -left-6 w-8 h-6 rounded-full blur-sm animate-pulse delay-1000" 
                     style={{ backgroundColor: 'rgba(107, 114, 128, 0.4)' }} />
                <div className="absolute bottom-1/4 -right-8 w-10 h-6 rounded-full blur-sm animate-pulse delay-500" 
                     style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }} />
                
                {/* Optional: Floating mini video elements */}
                <div className="absolute top-1/4 -right-12 w-16 h-16 rounded-full overflow-hidden opacity-30 animate-float">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 animate-spin-slow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent z-10" />
    </section>
  );
};

export default Hero;