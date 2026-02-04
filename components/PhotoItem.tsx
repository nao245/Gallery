
import React, { useEffect, useRef, useState } from 'react';
import { Photo } from '../types';
import LandscapeIcon from './icons/LandscapeIcon';

interface PhotoItemProps {
  photo: Photo;
  onClick: () => void;
  isOwnerMode: boolean;
  onSetHero: () => void;
  isCurrentHero: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onClick, isOwnerMode, onSetHero, isCurrentHero, scrollContainerRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    const container = scrollContainerRef.current;

    if (!element || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the element is intersecting (i.e., in the viewport), make it visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we don't need to observe it anymore
          observer.unobserve(element);
        }
      },
      {
        root: container,
        threshold: 0.1, // Trigger when 10% of the item is visible
        rootMargin: '0px 200px 0px 200px' // Widen the horizontal observation area
      }
    );

    observer.observe(element);

    return () => {
      // Disconnect the observer when the component is unmounted
      observer.disconnect();
    };
  }, [scrollContainerRef]);

  const handleSetHeroClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    onSetHero();
  };

  // Simple fade-in and slide-up animation
  const visibilityClass = isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95";

  return (
    <div 
      ref={elementRef}
      className={`h-[45vh] sm:h-[55vh] relative group cursor-pointer transition-all duration-700 ease-out flex-shrink-0 ${visibilityClass}`}
      onClick={onClick}
    >
      {isOwnerMode && !isCurrentHero && (
        <button
          onClick={handleSetHeroClick}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white/70 hover:text-white hover:bg-orange-600/80
                     opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
          title="背景画像に設定する"
        >
          <LandscapeIcon className="w-5 h-5" />
        </button>
      )}

      {/* Background glow on hover */}
      <div className="absolute inset-0 -z-10 bg-orange-500/20 blur-[40px] transition-opacity duration-300 rounded-full scale-125 opacity-0 group-hover:opacity-100"></div>

      {/* Frame */}
      <div className="h-full w-auto overflow-hidden border-[12px] border-[#0e1116] bg-[#0e1116] shadow-2xl transition-all duration-500 group-hover:-translate-y-6 group-hover:shadow-[0_0_60px_rgba(249,115,22,0.25)]">
        <img 
          src={photo.src} 
          alt={photo.alt}
          className="h-full w-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          loading="lazy"
        />
        {/* Inner glow */}
        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors duration-500 pointer-events-none"></div>
      </div>

      {/* Label */}
      <div className="absolute -bottom-14 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
        <p className="text-orange-500 text-[8px] font-bold uppercase tracking-[0.3em] mb-1">{photo.location || 'COLLECTION'}</p>
        <h3 className="text-white text-xl font-playfair font-bold whitespace-nowrap">{photo.alt}</h3>
      </div>
    </div>
  );
};

export default PhotoItem;
