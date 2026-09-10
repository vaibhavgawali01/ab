import React from 'react';
import { 
  LayoutDashboard, 
  Navigation, 
  Train, 
  Hourglass, 
  AlertOctagon, 
  BarChart3, 
  History, 
  HelpCircle,
  X,
  Radio,
  Signal
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  activeConflictsCount = 0, 
  delayedTrainsCount = 0,
  isMobileOpen,
  closeMobileMenu 
}) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'manmad-focus', label: t('nav.manmadFocus'), icon: Signal, badge: 'MAIN', badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30 font-semibold' },
    { id: 'mmr-kpg', label: t('nav.mmrKpgControlRoom'), icon: Radio, badge: 'FOCUS', badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 font-semibold' },
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, badge: null },
    { id: 'live-tracking', label: t('nav.trainReplay'), icon: Navigation, badge: 'Replay' },
    { id: 'train-details', label: t('nav.trainDetails'), icon: Train, badge: null },
    { id: 'eta-prediction', label: t('nav.etaPrediction'), icon: Hourglass, badge: 'ML' },
    { 
      id: 'conflict-mgmt', 
      label: t('nav.conflictMgmt'), 
      icon: AlertOctagon, 
      badge: activeConflictsCount > 0 ? `${activeConflictsCount}` : null,
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
    },
    { 
      id: 'delay-analysis', 
      label: t('nav.delayAnalysis'), 
      icon: BarChart3, 
      badge: delayedTrainsCount > 0 ? `${delayedTrainsCount}` : null,
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
    { id: 'historical-data', label: t('nav.historicalData'), icon: History, badge: null },
    { id: 'about', label: t('nav.about'), icon: HelpCircle, badge: 'Info' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={closeMobileMenu} 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Navigation Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#0a0e17]/95 border-r border-slate-800/90 flex flex-col justify-between backdrop-blur-xl shadow-lg
        transform transition-transform duration-200 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Navigation Header for Mobile */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400" />
            <span className="font-bold text-slate-100 font-mono">{t('nav.navTitle')}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button 
              onClick={closeMobileMenu}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Links List */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
            {t('nav.controlRoomViews')}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (closeMobileMenu) closeMobileMenu();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer group ${
                  isActive
                    ? 'bg-slate-900/90 text-sky-300 border border-sky-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium border ${
                    item.badgeColor || (isActive ? 'bg-sky-500/15 text-sky-200 border-sky-400/30' : 'bg-slate-900 text-slate-400 border-slate-800')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Telemetry & Signal Indicator */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 font-mono text-[11px]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] tracking-wide font-medium">BLOCK SIGNALING</span>
            </span>
            <span className="text-[9.5px] text-emerald-400 font-semibold uppercase tracking-wider">AUTOMATIC</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 py-1">
            <div className="flex flex-col items-center bg-slate-900/80 p-1 rounded border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] mb-0.5"></div>
              <span className="text-[9px] text-slate-400">CLEAR</span>
            </div>
            <div className="flex flex-col items-center bg-slate-900/80 p-1 rounded border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)] mb-0.5"></div>
              <span className="text-[9px] text-slate-400">ATTN</span>
            </div>
            <div className="flex flex-col items-center bg-slate-900/80 p-1 rounded border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.6)] mb-0.5"></div>
              <span className="text-[9px] text-slate-400">CAUT</span>
            </div>
            <div className="flex flex-col items-center bg-slate-900/80 p-1 rounded border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.6)] mb-0.5"></div>
              <span className="text-[9px] text-slate-400">STOP</span>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-400 text-center font-mono">
            v1.0.0-enterprise · Indian Railways
          </div>
        </div>
      </aside>
    </>
  );
}
