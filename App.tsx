
import React, { useState, useRef, useEffect } from 'react';
import { Photo } from './types';
import PhotoGrid from './components/PhotoGrid';
import Modal from './components/Modal';
import UploadButton from './components/UploadButton';
import ExportButton from './components/ExportButton';
import { getHighResUrl } from './utils';
import PasscodeModal from './components/PasscodeModal';
import { initialPhotos, DEFAULT_HERO_PHOTO_ID } from './data/photos';
import ChevronDownIcon from './components/icons/ChevronDownIcon';

const PASSCODE = '1356';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const findInitialHero = () => {
    const hero = initialPhotos.find(p => p.id === DEFAULT_HERO_PHOTO_ID);
    return hero || initialPhotos[0];
  };
  const [heroImageUrl, setHeroImageUrl] = useState(getHighResUrl(findInitialHero()));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // 進行度を計算（最初の半画面分でタイトル移動を完結）
      const progress = Math.min(container.scrollLeft / (window.innerWidth * 0.4), 1);
      setScrollProgress(progress);
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        container.scrollLeft += e.deltaY * 1.5;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'E') {
        if (isOwnerMode) setIsOwnerMode(false);
        else {
          setPasscodeError('');
          setShowPasscodeModal(true);
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOwnerMode]);

  const handlePasscodeSubmit = (passcode: string) => {
    if (passcode === PASSCODE) {
      setIsOwnerMode(true);
      setShowPasscodeModal(false);
    } else {
      setPasscodeError('Incorrect passcode');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => [{
          id: Date.now().toString() + Math.random(),
          src: e.target?.result as string,
          alt: file.name.replace(/\.[^/.]+$/, ""),
          date: new Date().toLocaleDateString('ja-JP'),
        }, ...prev]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleExport = async () => {
    const currentHeroPhoto = photos.find(p => getHighResUrl(p) === heroImageUrl);
    const heroId = currentHeroPhoto ? currentHeroPhoto.id : (photos.length > 0 ? photos[0].id : '');

    const photosJson = JSON.stringify(photos, (key, value) => {
      if (key === 'src' && typeof value === 'string' && value.startsWith('data:image')) {
        return '/images/REPLACE_WITH_SAVED_IMAGE_FILENAME.jpg';
      }
      return value;
    }, 2);

    const exportContent = `import { Photo } from '../types';

// Attention Developer:
// For any newly uploaded images, you must save them to your project's
// '/images' directory and replace the 'src' placeholder below
// with the correct file path (e.g., '/images/your-new-image.jpg').

export const DEFAULT_HERO_PHOTO_ID = '${heroId}';

export const initialPhotos: Photo[] = ${photosJson};
`;
    await navigator.clipboard.writeText(exportContent);
    return true;
  };


  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050608] text-gray-100 font-lato select-none">
      
      <div 
        className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center"
        style={{
          transform: `translate3d(0, ${-scrollProgress * 38}vh, 0)`,
        }}
      >
        <h1 
          className="text-6xl sm:text-7xl md:text-8xl font-bold font-playfair tracking-[0.15em] text-white"
          style={{
            transform: `scale(${1 - (scrollProgress * 0.7)})`,
          }}
        >
          Gallery
        </h1>
        <p 
          className="text-xs tracking-[0.4em] uppercase text-orange-500 font-bold mt-4"
          style={{ 
            transform: `translateY(${scrollProgress * 76}vh) scale(${1 - (scrollProgress * 0.3)})`
          }}
        >
          by Nao
        </p>
      </div>

      <div 
        ref={containerRef}
        className="h-full w-full overflow-x-auto overflow-y-hidden flex flex-nowrap scroll-smooth no-scrollbar"
      >
        {/* Cover */}
        <section className="h-screen min-w-[100vw] relative flex-shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImageUrl}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-[#050608]"></div>
          <button 
            onClick={() => containerRef.current?.scrollTo({ left: window.innerWidth, behavior: 'smooth' })}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/30 hover:text-orange-500 transition-colors"
          >
            <div className="rotate-[-90deg]"><ChevronDownIcon /></div>
          </button>
        </section>

        {/* Gallery Items */}
        <section className="h-screen flex items-center flex-shrink-0 bg-[#050608]">
          <PhotoGrid 
            photos={photos} 
            onPhotoClick={setSelectedPhoto}
            isOwnerMode={isOwnerMode}
            onSetHero={(p) => setHeroImageUrl(getHighResUrl(p))}
            currentHeroUrl={heroImageUrl}
          />
        </section>
      </div>

      {isOwnerMode && (
        <div className="fixed bottom-8 right-8 z-[60] flex flex-col gap-4">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
          <ExportButton onCopy={handleExport} />
          <UploadButton onClick={() => fileInputRef.current?.click()} />
        </div>
      )}

      {selectedPhoto && (
        <Modal 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)}
          onSetHero={(p) => { setHeroImageUrl(getHighResUrl(p)); setSelectedPhoto(null); }}
          currentHeroUrl={heroImageUrl}
          onDelete={(id) => { setPhotos(prev => prev.filter(p => p.id !== id)); setSelectedPhoto(null); }}
          onUpdatePhoto={(updated) => { setPhotos(prev => prev.map(p => p.id === updated.id ? updated : p)); setSelectedPhoto(updated); }}
          isOwnerMode={isOwnerMode}
        />
      )}

      {showPasscodeModal && (
        <PasscodeModal onClose={() => setShowPasscodeModal(false)} onSubmit={handlePasscodeSubmit} error={passcodeError} />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
