
import React from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface HeroProps {
  onScrollClick: () => void;
  backgroundImage: string;
}

const Hero: React.FC<HeroProps> = ({ onScrollClick, backgroundImage }) => {
  return (
    <section 
      className="h-screen w-full relative flex flex-col items-center justify-center"
    >
      {/* Background Layer */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
        style={{backgroundImage: `url('${backgroundImage}')`}}
      ></div>

      {/* Overlay Layer */}
      <div className="absolute inset-0 w-full h-full bg-black/60"></div>
      
      {/* Content Layer */}
      <div className="relative z-10 text-center text-white p-4">
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl font-bold font-playfair tracking-wider drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          Photo Gallery
        </h1>
        <p 
          className="text-lg text-amber-300/90 mt-2 animate-fade-in-up"
          style={{ animationDelay: '0.8s' }}
        >
          A Gallery by Nao
        </p>
        <p 
          className="text-md text-gray-300 mt-4 italic animate-fade-in-up"
          style={{ animationDelay: '1.2s' }}
        >
          「一瞬の物語を、」
        </p>
      </div>

      <button 
        onClick={onScrollClick} 
        className="absolute bottom-10 z-10 text-white animate-bounce"
        aria-label="Scroll to gallery"
      >
        <ChevronDownIcon />
      </button>
      <style>{`
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(25px);
            filter: blur(3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Hero;
