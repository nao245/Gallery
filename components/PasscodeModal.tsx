
import React, { useState, useEffect, useRef } from 'react';
import XIcon from './icons/XIcon';

interface PasscodeModalProps {
  onClose: () => void;
  onSubmit: (passcode: string) => void;
  error: string;
}

const PasscodeModal: React.FC<PasscodeModalProps> = ({ onClose, onSubmit, error }) => {
  const [passcode, setPasscode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(passcode);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-gray-950 border border-gray-800 rounded-lg shadow-2xl shadow-black/50 w-full max-w-sm p-8 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white text-center mb-4 uppercase tracking-[0.2em]">オーナーモード</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">続行するにはパスコードを入力してください。</p>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="****"
            maxLength={4}
          />
          {error && <p className="text-red-400 text-sm text-center mt-4 animate-shake">{error}</p>}
          <button
            type="submit"
            className="w-full mt-8 px-4 py-4 bg-orange-600 text-white font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-orange-500 active:bg-orange-700 shadow-lg shadow-orange-950/20 transition-all duration-200"
          >
            Enter
          </button>
        </form>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <XIcon />
        </button>
      </div>
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.2s ease-out forwards; }
        .animate-shake { animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default PasscodeModal;
