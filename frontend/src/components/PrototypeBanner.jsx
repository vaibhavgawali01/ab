import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PrototypeBanner() {
  const { t } = useLanguage();

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 shadow-inner backdrop-blur-sm">
      <div className="flex items-center gap-2 font-medium">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/40 tracking-wider text-[10px] uppercase">
          {t('banner.prototypeMode')}
        </span>
        <span className="hidden sm:inline text-amber-300/90 font-mono">
          {t('banner.engineTitle')}
        </span>
        <span className="text-amber-200/80">
          {t('banner.engineDesc')}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-amber-300/80 bg-amber-900/30 px-2.5 py-1 rounded border border-amber-700/40 font-mono">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        <span>{t('banner.disclaimer')}</span>
      </div>
    </div>
  );
}
