
import React, { useEffect, useState } from 'react';
import { Photo } from '../types';
import XIcon from './icons/XIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import CalendarIcon from './icons/CalendarIcon';
import CameraIcon from './icons/CameraIcon';
import SettingsIcon from './icons/SettingsIcon';
import LandscapeIcon from './icons/LandscapeIcon';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import { getHighResUrl } from '../utils';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ModalProps {
  photo: Photo;
  onClose: () => void;
  onSetHero: (photo: Photo) => void;
  currentHeroUrl: string;
  onDelete: (id: string) => void;
  onUpdatePhoto: (photo: Photo) => void;
  isOwnerMode: boolean;
}

const Modal: React.FC<ModalProps> = ({ photo, onClose, onSetHero, currentHeroUrl, onDelete, onUpdatePhoto, isOwnerMode }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhoto, setEditedPhoto] = useState<Photo>(photo);

  useEffect(() => {
    setEditedPhoto(photo);
    setIsEditing(false);
  }, [photo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleConfirmDelete = () => {
    onDelete(photo.id);
  };

  const handleInputChange = (field: keyof Photo, value: string) => {
    setEditedPhoto(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdatePhoto(editedPhoto);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedPhoto(photo);
    setIsEditing(false);
  };
  
  const potentialHeroUrl = getHighResUrl(photo);
  const isCurrentHero = potentialHeroUrl === currentHeroUrl;

  const InfoRow: React.FC<{ icon: React.ReactNode; field: keyof Photo; label: string; isTextarea?: boolean; }> = ({ icon, field, label, isTextarea = false }) => (
    <div className={`flex ${isTextarea ? 'items-start' : 'items-center'} group/row`}>
      <div className="mr-4 text-gray-600 flex-shrink-0 group-hover/row:text-orange-400 transition-colors">{icon}</div>
      <div className="w-full">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
        {isEditing ? (
          isTextarea ? (
            <textarea
              value={editedPhoto[field] as string || ''}
              onChange={e => handleInputChange(field, e.target.value)}
              placeholder={`${label}を入力...`}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm min-h-[100px]"
            />
          ) : (
            <input
              type="text"
              value={editedPhoto[field] as string || ''}
              onChange={e => handleInputChange(field, e.target.value)}
              placeholder={`${label}を入力...`}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
            />
          )
        ) : (
          <span className="break-words w-full text-gray-300 text-sm">{photo[field] || (isTextarea ? '解説はありません' : '未設定')}</span>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in"
        onClick={onClose}
      >
        <div 
          className="relative bg-[#0a0c10] border border-white/5 rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-6xl w-full max-h-[90vh] animate-scale-up overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Side */}
          <div className="w-full md:w-2/3 h-[45vh] md:h-auto flex items-center justify-center bg-black/20 relative overflow-hidden group/img">
            <img 
              src={photo.src}
              alt={photo.alt}
              className="max-w-full max-h-full object-contain p-4 transition-transform duration-1000 group-hover/img:scale-105"
            />
          </div>

          {/* Details Side */}
          <div className="w-full md:w-1/3 p-8 md:p-10 flex flex-col text-gray-300 overflow-y-auto bg-[#0d1016]">
            <div className="flex justify-between items-start mb-8">
              {isEditing ? (
                 <input
                    type="text"
                    value={editedPhoto.alt || ''}
                    onChange={e => handleInputChange('alt', e.target.value)}
                    placeholder="タイトルを入力"
                    className="flex-1 text-2xl font-bold text-white font-playfair bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 mr-2"
                  />
              ) : (
                <h2 className="flex-1 text-3xl font-bold text-white font-playfair leading-tight pr-4 tracking-tight">{photo.alt}</h2>
              )}
              {isOwnerMode && !isEditing && (
                <div className="flex items-center gap-1">
                  <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-orange-400 hover:bg-orange-400/5 rounded-lg transition-all" title="編集">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowConfirmDelete(true)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all" title="削除">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            {isOwnerMode && (
              <button
                onClick={() => onSetHero(photo)}
                disabled={isCurrentHero}
                className="w-full mb-10 inline-flex items-center justify-center gap-3 px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-orange-500/50 hover:text-orange-400 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                <LandscapeIcon className="w-4 h-4" />
                <span>{isCurrentHero ? '背景画像として使用中' : '背景画像に設定する'}</span>
              </button>
            )}

            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <InfoRow icon={<LocationMarkerIcon className="w-5 h-5" />} field="location" label="撮影場所" />
                <InfoRow icon={<CalendarIcon className="w-5 h-5" />} field="date" label="撮影日" />
              </div>
              
              <div className="space-y-6 pt-8 border-t border-white/5">
                <InfoRow icon={<CameraIcon className="w-5 h-5" />} field="camera" label="使用カメラ" />
                <div className="pl-9 -mt-4">
                  <InfoRow icon={<></>} field="lens" label="使用レンズ" />
                </div>
                <InfoRow icon={<SettingsIcon className="w-5 h-5" />} field="settings" label="撮影設定 (EXIF)" />
              </div>

              <div className="pt-8 border-t border-white/5">
                <InfoRow icon={<></>} field="description" label="作品解説" isTextarea />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-12">
                <button onClick={handleCancel} className="flex-1 py-4 text-[10px] font-bold tracking-widest uppercase bg-white/5 hover:bg-white/10 text-gray-400 rounded-2xl transition-colors">キャンセル</button>
                <button onClick={handleSave} className="flex-1 py-4 text-[10px] font-bold tracking-widest uppercase bg-orange-600 hover:bg-orange-500 text-white rounded-2xl shadow-[0_10px_20px_rgba(249,115,22,0.3)] transition-all">変更を保存</button>
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/30 hover:text-white transition-all z-50 p-4 rounded-full hover:bg-white/5"
          aria-label="閉じる"
        >
          <XIcon />
        </button>
      </div>

      {showConfirmDelete && (
        <ConfirmDeleteModal 
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleConfirmDelete}
          title="作品の削除"
        >
            <p className="text-gray-400 text-sm leading-relaxed">
              作品 <span className="text-white font-bold">「{photo.alt}」</span> をギャラリーから削除しますか？<br/>この操作は取り消すことができません。
            </p>
        </ConfirmDeleteModal>
      )}
    </>
  );
};

export default Modal;
