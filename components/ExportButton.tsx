
import React, { useState } from 'react';
import ClipboardCopyIcon from './icons/ClipboardCopyIcon';

interface ExportButtonProps {
  onCopy: () => Promise<boolean>;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = async () => {
    const success = await onCopy();
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500); // Reset after 2.5 seconds
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className="w-14 h-14 md:w-16 md:h-16 bg-gray-950 text-gray-300 rounded-full flex items-center justify-center 
                   shadow-[5px_5px_10px_#0c0e14,_-5px_-5px_10px_#1a1e28] 
                   hover:text-white
                   hover:shadow-[8px_8px_16px_#0c0e14,_-8px_-8px_16px_#1a1e28]
                   active:shadow-[inset_5px_5px_10px_#0c0e14,_inset_-5px_-5px_10px_#1a1e28]
                   transition-all duration-200 ease-in-out"
        aria-label="Copy photo data to clipboard"
      >
        <ClipboardCopyIcon className="h-6 w-6 md:h-7 md:h-7" />
      </button>
      <div 
        className={`absolute bottom-1/2 translate-y-1/2 right-full mr-4 px-3 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg whitespace-nowrap transition-all duration-200 ease-in-out pointer-events-none
          ${isCopied ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}
      >
        {isCopied ? 'コピーしました！' : 'コードをコピー'}
        <div className="absolute top-1/2 -translate-y-1/2 left-full w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
};

export default ExportButton;
