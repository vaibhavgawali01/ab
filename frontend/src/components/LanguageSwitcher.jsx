import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-0.5 rounded-lg font-mono text-xs shadow-sm ${className}`}>
      <Languages className="w-3.5 h-3.5 text-sky-400 ml-1.5" />
      <div className="flex items-center p-0.5 bg-slate-950/80 rounded border border-slate-800/80">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2 py-0.5 rounded text-[11px] transition font-medium cursor-pointer ${
            language === 'en'
              ? 'bg-sky-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Switch to English"
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage('mr')}
          className={`px-2 py-0.5 rounded text-[11px] transition font-medium cursor-pointer ${
            language === 'mr'
              ? 'bg-sky-600 text-white font-bold shadow-sm'
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
