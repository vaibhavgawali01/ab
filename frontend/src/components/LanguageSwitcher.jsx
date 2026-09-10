import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-1.5 bg-slate-950/90 border border-slate-800 p-1 rounded-lg font-mono text-xs shadow-inner ${className}`}>
      <Languages className="w-3.5 h-3.5 text-cyan-400 ml-1" />
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 rounded transition-all font-semibold cursor-pointer ${
            language === 'en'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Switch to English"
        >
          English
        </button>
        <span className="text-slate-600 px-0.5 select-none">|</span>
        <button
          type="button"
          onClick={() => setLanguage('mr')}
          className={`px-2 py-1 rounded transition-all font-semibold cursor-pointer ${
            language === 'mr'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="मराठी भाषेवर स्विच करा"
        >
          मराठी
        </button>
      </div>
    </div>
  );
}
