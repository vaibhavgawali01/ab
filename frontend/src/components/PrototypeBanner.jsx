import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PrototypeBanner() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0b0f19]/90 border-b border-slate-800 text-slate-300 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3 backdrop-blur-md z-30 shadow-sm">
      <div className="flex items-center gap-2 font-medium">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        <span className="bg-sky-500/10 text-sky-300 font-semibold px-2 py-0.5 rounded border border-sky-500/25 tracking-wider text-[10px] uppercase font-mono">
          {t('banner.prototypeMode')}
        </span>
        <span className="hidden sm:inline text-slate-200 font-mono text-[11px] font-semibold">
          {t('banner.engineTitle')}
        </span>
        <span className="text-slate-400 text-[11px] hidden md:inline">
          {t('banner.engineDesc')}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[10.5px] text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800 font-mono">
        <ShieldAlert className="w-3 h-3 text-amber-400/90" />
        <span>{t('banner.disclaimer')}</span>
      </div>
    </div>
  );
}
