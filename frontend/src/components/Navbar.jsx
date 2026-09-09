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
  return (
    <header className="bg-[#0b1120] border-b border-slate-800 sticky top-0 z-30 px-4 py-2.5 shadow-md">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-900/30 border border-cyan-400/30">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white font-mono">TRACK<span className="text-cyan-400">PULSE</span></span>
                <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-700/50 rounded font-mono font-semibold">IR-PROTO</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                CENTRAL OPERATIONS & DELAY PREDICTION CONSOLE
              </p>
            </div>
          </div>
        </div>

        {/* Center: Corridor Selector */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs text-slate-400 font-mono">CORRIDOR:</span>
          <select 
            value={selectedCorridor} 
            onChange={(e) => onSelectCorridor(e.target.value)}
            className="bg-transparent text-xs font-semibold text-cyan-300 focus:outline-none cursor-pointer border-none"
          >
            <option value="" className="bg-slate-900 text-slate-200">ALL TRUNK CORRIDORS</option>
            {corridors.map(c => (
              <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Simulation Clock & Playback Telemetry */}
        <div className="flex items-center gap-3">
          
          {/* Clock Display */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 leading-none">SIMULATION CLOCK</span>
              <span className="text-xs font-bold text-emerald-300 tracking-wider">
                {simulationTime ? simulationTime.split(' ')[1] : '10:30:00'}
              </span>
            </div>
          </div>

          {/* Play/Pause & Speed Multipliers */}
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
            <button
              onClick={onTogglePlay}
              className={`p-1.5 rounded transition-all ${
                isPlaying 
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
              }`}
              title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Speed Multiplier */}
            <div className="flex items-center">
              {[1, 5, 15, 60].map(speed => (
                <button
                  key={speed}
                  onClick={() => onChangeMultiplier(speed)}
                  className={`px-1.5 py-0.5 text-[11px] font-mono rounded transition-colors ${
                    timeMultiplier === speed
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              onClick={onResetSimulation}
              className="p-1 text-slate-400 hover:text-rose-400 transition-colors ml-1"
              title="Reset Simulation Clock"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Backend Connection Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono">
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className={isBackendConnected ? 'text-emerald-400' : 'text-rose-400'}>
              {isBackendConnected ? 'FASTAPI LIVE' : 'LOCAL MOCK'}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
}
