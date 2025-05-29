import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';

const ScrollCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slides = [
    { image: '/assets/images/maintenance/img-cunstruct-1-bg.png', title: 'Carbon Neutral' },
    { image: '/assets/images/maintenance/img-cunstruct-1-bg.png', title: 'Performance' },
    { image: '/assets/images/maintenance/img-cunstruct-1-bg.png', title: 'Design' },
    { image: '/assets/images/maintenance/img-cunstruct-1-bg.png', title: 'Connectivity' }
  ];

  useEffect(() => {
    const carouselElement = carouselRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    if (carouselElement) {
      observer.observe(carouselElement);
    }

    return () => {
      if (carouselElement) {
        observer.unobserve(carouselElement);
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isVisible && isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isVisible, isPlaying, slides.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      ref={carouselRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Fixed controls overlay */}
      <div className={`
        fixed left-0 right-0 z-10 bottom-16
        transition-opacity duration-700
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="flex flex-col items-center justify-center">
          {/* Glassmorphic control pill */}
          <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
            {/* Play/Pause button */}
            <button 
              onClick={togglePlayPause}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-gray-800" />
              ) : (
                <Play className="w-4 h-4 text-gray-800" />
              )}
            </button>
            
            {/* Progress indicators */}
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: i === currentSlide ? '32px' : '8px' }}
                >
                  <div className={`
                    absolute inset-0 bg-gray-800 transition-all duration-300
                    ${i === currentSlide && isPlaying ? 'animate-progress' : ''}
                  `} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slides container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 w-full h-full 
              transition-all duration-700 transform
              ${index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
              <h2 className="text-4xl font-bold">{slide.title}</h2>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 3s linear;
          transform-origin: left;
        }
      `}</style>
    </div>
  );
};

export default ScrollCarousel;
