import React, { useState } from 'react';
import { Layers, ShieldCheck, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ManmadStationSchematic({ platforms = [], activeConflict = null, isHighlighted = false }) {
  const { t } = useLanguage();
  const [selectedElement, setSelectedElement] = useState(null);

  // Helper to find train on platform
  const getPlatformTrain = (pfNum) => {
    const pf = platforms.find((p) => p.platform_number === pfNum);
    return pf ? pf.current_train : null;
  };

  const getPlatformStatus = (pfNum) => {
    const pf = platforms.find((p) => p.platform_number === pfNum);
    return pf ? pf.status : 'Clear';
  };

  return (
    <div 
      id="mmr-schematic-overview" 
      className={`bg-slate-900/90 border rounded-xl p-4 shadow-2xl relative overflow-hidden transition-all duration-500 ${
        isHighlighted 
          ? 'border-cyan-400 ring-4 ring-cyan-400/40 shadow-[0_0_35px_rgba(6,182,212,0.5)]' 
          : 'border-slate-800'
      }`}
    >
      {/* Header & Interlocking Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                {t('schematic.title')}
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {t('schematic.solidStateBadge')}
              </span>
              {isHighlighted && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400 animate-pulse flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  {t('schematic.openedBadge')}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {t('schematic.subtext')}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-slate-300">{t('schematic.signalClear')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <span className="text-slate-300">{t('schematic.signalDanger')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-pulse" />
            <span className="text-amber-300">{t('schematic.conflictPoint14B')}</span>
          </div>
        </div>
      </div>

      {/* SVG Interlocking Mimic Panel */}
      <div className="w-full overflow-x-auto bg-[#070b14] border border-slate-800/80 rounded-lg p-3">
        <svg
          viewBox="0 0 1100 480"
          className="w-full min-w-[900px] select-none font-mono"
        >
          <defs>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="occupiedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="conflictGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" />
            </filter>
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ef4444" />
            </filter>
            <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" />
            </filter>
          </defs>

          {/* Background Grid Pattern Lines (Subtle Railway Yard CTC Grid) */}
          <g opacity="0.1" stroke="#38bdf8" strokeWidth="0.5">
            {[...Array(24)].map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="480" />
            ))}
            {[...Array(10)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="1100" y2={i * 50} />
            ))}
          </g>

          {/* ================= APPROACH CORRIDORS (WEST & SOUTH) ================= */}
          {/* Approach 1: From Kalyan / Mumbai (West Double Line) */}
          <g>
            <text x="30" y="70" fill="#94a3b8" fontSize="11" fontWeight="bold">← TO KALYAN / MUMBAI (CSMT)</text>
            <text x="30" y="85" fill="#64748b" fontSize="9">Double Line Electrified (ABS)</text>
            <line x1="20" y1="95" x2="220" y2="95" stroke="#475569" strokeWidth="4" strokeDasharray="6 3" />
            <line x1="20" y1="120" x2="220" y2="120" stroke="#475569" strokeWidth="4" strokeDasharray="6 3" />
          </g>

          {/* Approach 4: From Daund / Pune / Kopargaon (South Approach) */}
          <g>
            <text x="30" y="415" fill="#38bdf8" fontSize="11" fontWeight="bold">↙ TO KOPARGAON / DAUND / PUNE</text>
            <text x="30" y="430" fill="#64748b" fontSize="9">Single Line Tokenless Chord (Km 258)</text>
            <line x1="20" y1="390" x2="210" y2="390" stroke="#0284c7" strokeWidth="4" />
            {/* Chord curve heading up toward throat */}
            <path d="M 210 390 C 270 390, 310 310, 370 270" fill="none" stroke="#0284c7" strokeWidth="3.5" />
          </g>

          {/* Approach 3: From Nanded / Secunderabad (Southeast Approach) */}
          <g>
            <text x="820" y="430" fill="#a855f7" fontSize="11" fontWeight="bold">TO AURANGABAD / NANDED ↘</text>
            <text x="820" y="445" fill="#64748b" fontSize="9">Marathwada Line (Single Track)</text>
            <line x1="840" y1="395" x2="1070" y2="395" stroke="#a855f7" strokeWidth="4" />
            <path d="M 740 330 C 780 330, 800 395, 840 395" fill="none" stroke="#a855f7" strokeWidth="3" />
          </g>

          {/* Approach 2: To Bhusawal / Nagpur / Howrah (East Double Line) */}
          <g>
            <text x="830" y="70" fill="#94a3b8" fontSize="11" fontWeight="bold">TO BHUSAWAL / HOWRAH →</text>
            <text x="830" y="85" fill="#64748b" fontSize="9">Trunk Route (130 km/h)</text>
            <line x1="860" y1="95" x2="1070" y2="95" stroke="#475569" strokeWidth="4" strokeDasharray="6 3" />
            <line x1="860" y1="120" x2="1070" y2="120" stroke="#475569" strokeWidth="4" strokeDasharray="6 3" />
          </g>

          {/* ================= PLATFORM TRACK LINES (PF 1 to 6) ================= */}
          {/* PF 1: Down Main (Mumbai Direct) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedElement(platforms[0] || { pf: 1, name: 'Platform 1' })}
          >
            <line x1="330" y1="95" x2="770" y2="95" stroke="#10b981" strokeWidth="6" filter="url(#glowGreen)" />
            {/* Platform Island Bar */}
            <rect x="370" y="72" width="360" height="15" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" rx="3" />
            <text x="510" y="84" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              PLATFORM 1 [650m / 24 Coaches] - DOWN MAIN
            </text>
            {/* Train Tag 22222 */}
            <rect x="420" y="99" width="260" height="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" rx="4" />
            <text x="550" y="113" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              🚆 22222 CSMT RAJDHANI (P1)
            </text>
          </g>

          {/* PF 2: Up Main (Bhusawal Direct) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedElement(platforms[1] || { pf: 2, name: 'Platform 2' })}
          >
            <line x1="330" y1="150" x2="770" y2="150" stroke="#64748b" strokeWidth="5" />
            <rect x="370" y="128" width="360" height="15" fill="#1e293b" stroke="#64748b" strokeWidth="1" rx="3" />
            <text x="510" y="140" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">
              PLATFORM 2 [650m / 24 Coaches] - UP MAIN (CLEAR)
            </text>
          </g>

          {/* PF 3: Bidirectional Loop */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedElement(platforms[2] || { pf: 3, name: 'Platform 3' })}
          >
            <line x1="330" y1="210" x2="770" y2="210" stroke="#0ea5e9" strokeWidth="5" />
            <rect x="370" y="188" width="360" height="15" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" rx="3" />
            <text x="510" y="200" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              PLATFORM 3 [620m] - LOOP LINE
            </text>
            {/* Train Tag 12138 */}
            <rect x="430" y="214" width="240" height="18" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" rx="4" />
            <text x="550" y="227" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              🚆 12138 PUNJAB MAIL (P2)
            </text>
          </g>

          {/* PF 4: South Line (Daund / Kopargaon) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedElement(platforms[3] || { pf: 4, name: 'Platform 4' })}
          >
            <line x1="330" y1="270" x2="770" y2="270" stroke="#f59e0b" strokeWidth="5" />
            <rect x="370" y="248" width="360" height="15" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" rx="3" />
            <text x="510" y="260" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">
              PLATFORM 4 [600m] - DAUND/PUNE/KOPARGAON
            </text>
            {/* Train Tag 11078 (Approaching / Held) */}
            <rect x="410" y="274" width="280" height="20" fill="#7f1d1d" stroke="#f87171" strokeWidth="1" rx="4" />
            <text x="550" y="288" fill="#fecaca" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              ⚠️ 11078 JHELUM EXP (P3) [HELD AT ANKAI OUTER]
            </text>
          </g>

          {/* PF 5: Nanded Branch */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedElement(platforms[4] || { pf: 5, name: 'Platform 5' })}
          >
            <line x1="330" y1="330" x2="770" y2="330" stroke="#a855f7" strokeWidth="4" />
            <rect x="370" y="308" width="360" height="15" fill="#1e293b" stroke="#a855f7" strokeWidth="1" rx="3" />
            <text x="510" y="320" fill="#d8b4fe" fontSize="11" fontWeight="bold" textAnchor="middle">
              PLATFORM 5 [580m] - NANDED / SECUNDERABAD
            </text>
          </g>

          {/* PF 6: Freight / Shunting Yard */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedElement(platforms[5] || { pf: 6, name: 'Platform 6' })}
          >
            <line x1="330" y1="385" x2="770" y2="385" stroke="#475569" strokeWidth="4" strokeDasharray="5 3" />
            <rect x="370" y="365" width="360" height="15" fill="#1e293b" stroke="#475569" strokeWidth="1" rx="3" />
            <text x="510" y="377" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
              PLATFORM 6 [720m] - SHUNTING & FREIGHT BYPASS
            </text>
          </g>

          {/* ================= INTERLOCKING CROSSOVERS & POINTS ================= */}
          {/* West Throat Crossover Ladder */}
          <path d="M 220 95 L 330 95" stroke="#475569" strokeWidth="4" />
          <path d="M 220 120 L 330 150" stroke="#475569" strokeWidth="4" />
          <path d="M 240 120 L 330 210" stroke="#38bdf8" strokeWidth="3" />
          <path d="M 250 95 L 330 150" stroke="#475569" strokeWidth="2.5" />

          {/* East Throat Crossover Ladder (Where the conflict occurs!) */}
          <path d="M 770 95 L 860 95" stroke="#10b981" strokeWidth="5" />
          <path d="M 770 150 L 860 120" stroke="#475569" strokeWidth="4" />
          <path d="M 770 210 L 840 150" stroke="#475569" strokeWidth="3" />

          {/* ================= CONFLICT POINT 14B HIGHLIGHT ================= */}
          {/* Diagonal cut connecting South Line (PF 4) to Bhusawal Main line */}
          <path
            d="M 370 270 L 770 95"
            stroke="#f43f5e"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            className="animate-pulse"
          />

          {/* Pulsing Interlocking Diamond Box on Point 14B */}
          <g filter="url(#glowAmber)">
            <rect
              x="570"
              y="160"
              width="50"
              height="30"
              fill="#78350f"
              stroke="#f59e0b"
              strokeWidth="2"
              rx="4"
            />
            <text x="595" y="179" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
              PT 14B
            </text>
          </g>

          {/* Diamond cross icon */}
          <circle cx="595" cy="175" r="28" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />

          {/* Conflict Alert Banner Callout */}
          <g>
            <rect x="635" y="150" width="220" height="52" fill="#18181b" stroke="#f43f5e" strokeWidth="1.5" rx="6" />
            <text x="645" y="168" fill="#f43f5e" fontSize="10.5" fontWeight="bold">
              ⚡ CONFLICT: INTERLOCKING CUT
            </text>
            <text x="645" y="183" fill="#cbd5e1" fontSize="9">
              22222 Down Main vs 11078 South Throat
            </text>
            <text x="645" y="195" fill="#10b981" fontSize="9" fontWeight="bold">
              Route Locked: 22222 Green / 11078 Red
            </text>
          </g>

          {/* ================= INTERLOCKING SIGNALS ================= */}
          {/* Signal S-14 (Green on PF 1 for Rajdhani) */}
          <g filter="url(#glowGreen)">
            <line x1="785" y1="95" x2="785" y2="65" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="785" cy="65" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            <text x="785" y="52" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
              S-14 (CLR)
            </text>
          </g>

          {/* Signal S-42 (Red on Ankai Outer for Jhelum) */}
          <g filter="url(#glowRed)">
            <line x1="360" y1="270" x2="360" y2="240" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="360" cy="240" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <text x="360" y="230" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">
              S-42 (DANGER)
            </text>
          </g>

          {/* Signal S-08 (PF 3 Starter for Punjab Mail) */}
          <g filter="url(#glowGreen)">
            <line x1="315" y1="210" x2="315" y2="180" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="315" cy="180" r="6" fill="#10b981" />
            <text x="315" y="172" fill="#10b981" fontSize="8.5" fontWeight="bold" textAnchor="middle">
              S-08
            </text>
          </g>
        </svg>
      </div>

      {/* Selected Platform Detail Bar */}
      <div className="mt-3 p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">Selected Track Element:</span>
          {selectedElement ? (
            <span className="text-cyan-400 font-mono font-semibold">
              Platform {selectedElement.platform_number || selectedElement.pf}: {selectedElement.line_type || 'Main Line'} ({selectedElement.length_meters || 650}m CSL)
            </span>
          ) : (
            <span className="text-slate-400 italic">Click any platform line above to inspect interlocking specifications</span>
          )}
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Axle Counter Blocks: <strong className="text-emerald-400">All Normal</strong></span>
          <span>Point Machine Health: <strong className="text-emerald-400">100% Locked</strong></span>
        </div>
      </div>
    </div>
  );
}
