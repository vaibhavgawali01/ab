import React from 'react';
import { 
  Activity, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Zap, 
  Radio, 
  Database,
  Menu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar({ 
  corridors, 
  selectedCorridor, 
  onSelectCorridor, 
  simulationTime, 
  isPlaying, 
  onTogglePlay, 
  timeMultiplier, 
  onChangeMultiplier, 
  onResetSimulation,
  isBackendConnected,
  toggleMobileMenu
}) {
  const { t } = useLanguage();

  return (
    <header className="bg-[#0a0e17]/95 border-b border-slate-800/90 sticky top-0 z-30 px-4 py-2.5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
        
        {/* Left: Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center shadow-md shadow-sky-950/50 border border-sky-400/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-slate-100 font-mono">TRACK<span className="text-sky-400">PULSE</span></span>
                <span className="text-[9.5px] px-1.5 py-0.2 bg-sky-500/10 text-sky-300 border border-sky-500/25 rounded font-mono font-medium tracking-tight">
                  {t('header.brandTag')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                {t('header.tagline')}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Corridor Selector */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800/90 shadow-inner">
          <Radio className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs text-slate-400 font-mono font-medium">{t('header.corridor')}:</span>
          <select 
            value={selectedCorridor} 
            onChange={(e) => onSelectCorridor(e.target.value)}
            className="bg-transparent text-xs font-semibold text-sky-300 focus:outline-none cursor-pointer border-none font-mono"
          >
            <option value="" className="bg-slate-900 text-slate-200">{t('header.allCorridors')}</option>
            {corridors.map(c => (
              <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Simulation Clock & Playback Telemetry */}
        <div className="flex items-center gap-2.5">
          
          {/* Clock Display */}
          <div className="flex items-center gap-2 bg-slate-950/90 px-3 py-1.5 rounded-lg border border-slate-800 font-mono shadow-inner">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider leading-none">{t('header.simulationClock')}</span>
              <span className="text-xs font-bold text-emerald-400 tracking-wider">
                {simulationTime ? simulationTime.split(' ')[1] : '10:30:00'}
              </span>
            </div>
          </div>

          {/* Play/Pause & Speed Multipliers */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button
              onClick={onTogglePlay}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30' 
                  : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
              }`}
              title={isPlaying ? t('header.pauseSim') : t('header.resumeSim')}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Speed Multiplier Segmented Control */}
            <div className="flex items-center bg-slate-950/80 rounded p-0.5 border border-slate-800/80">
              {[1, 5, 15, 60].map(speed => (
                <button
                  key={speed}
                  onClick={() => onChangeMultiplier(speed)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition cursor-pointer ${
                    timeMultiplier === speed
                      ? 'bg-sky-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              onClick={onResetSimulation}
              className="p-1 text-slate-400 hover:text-rose-400 transition ml-0.5 cursor-pointer"
              title={t('header.resetSim')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Backend Connection Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-rose-400'}`}></span>
            <span className={isBackendConnected ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
              {isBackendConnected ? t('header.fastApiLive') : t('header.localMock')}
            </span>
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />

        </div>

      </div>
    </header>
  );
}
