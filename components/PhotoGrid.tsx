
import React from 'react';
import { Photo } from '../types';
import PhotoItem from './PhotoItem';
import { getHighResUrl } from '../utils';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  isOwnerMode: boolean;
  onSetHero: (photo: Photo) => void;
  currentHeroUrl: string;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick, isOwnerMode, onSetHero, currentHeroUrl, scrollContainerRef }) => {
  return (
    <div className="flex flex-nowrap h-[55vh] sm:h-[65vh] gap-16 sm:gap-32 items-center px-8 sm:px-[20vw]">
      {photos.map((photo) => {
        const isCurrentHero = getHighResUrl(photo) === currentHeroUrl;
        return (
          <PhotoItem 
            key={photo.id} 
            photo={photo} 
            onClick={() => onPhotoClick(photo)}
            isOwnerMode={isOwnerMode}
            onSetHero={() => onSetHero(photo)}
            isCurrentHero={isCurrentHero}
            scrollContainerRef={scrollContainerRef}
          />
        );
      })}
    </div>
  );
};

export default PhotoGrid;
