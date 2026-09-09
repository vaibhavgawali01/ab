import React, { useState } from 'react';
import { 
  Train, 
  MapPin, 
  Zap, 
  Layers, 
  Compass, 
  Info, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  Sliders
} from 'lucide-react';

export default function RouteMap({ 
  stations = [], 
  trains = [], 
  routes = [], 
  selectedTrain, 
  onSelectTrain 
}) {
  const [viewMode, setViewMode] = useState('geo'); // 'geo' or 'schematic'
  const [zoom, setZoom] = useState(1);
  const [hoveredEntity, setHoveredEntity] = useState(null);

  // Map geographic bounding box for India trunk corridors
  // Lat: 12° to 30° N, Lng: 72° to 89° E
  const minLng = 72.0;
  const maxLng = 89.0;
  const minLat = 12.0;
  const maxLat = 30.0;

  const width = 860;
  const height = 520;
  const padding = 45;

  const project = (lat, lng) => {
    const x = padding + ((lng - minLng) / (maxLng - minLng)) * (width - 2 * padding);
    // Invert Y because latitude goes South -> North
    const y = height - (padding + ((lat - minLat) / (maxLat - minLat)) * (height - 2 * padding));
    return { x, y };
  };

  const stationMap = {};
  stations.forEach(s => {
    stationMap[s.code] = {
      ...s,
      pos: project(s.lat, s.lng)
    };
  });

  const getSignalColor = (aspect) => {
    switch ((aspect || '').toLowerCase()) {
      case 'green': return '#10b981';
      case 'double yellow': return '#f59e0b';
      case 'yellow': return '#eab308';
      case 'red': return '#ef4444';
      default: return '#06b6d4';
    }
  };

  return (
    <div className="bg-[#0b1324] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative flex flex-col">
      {/* Top Map Toolbar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200 tracking-wide font-mono">CORRIDOR SPATIAL VISUALIZER</span>
          <span className="text-[11px] text-slate-400">| Trunk Lines & Automatic Block Telemetry</span>
        </div>

        {/* View mode toggle: Geographic Map vs Linear Schematic */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('geo')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                viewMode === 'geo'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Geographic Map
            </button>
            <button
              onClick={() => setViewMode('schematic')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                viewMode === 'schematic'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Linear CTC Schematic
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 1.8))} 
              className="p-1 text-slate-400 hover:text-cyan-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.8))} 
              className="p-1 text-slate-400 hover:text-cyan-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="relative overflow-auto p-2 flex items-center justify-center min-h-[460px] bg-[#070b14]">
        
        {viewMode === 'geo' ? (
          /* GEOGRAPHIC SVG ROUTE MAP */
          <div 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
            className="w-full flex justify-center"
          >
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[880px] h-auto drop-shadow-xl select-none">
              <defs>
                <linearGradient id="trunkLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background gridlines for control room radar look */}
              <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3">
                {[100, 200, 300, 400, 500].map(y => (
                  <line key={`h-${y}`} x1="0" y1={y} x2={width} y2={y} />
                ))}
                {[150, 300, 450, 600, 750].map(x => (
                  <line key={`v-${x}`} x1={x} y1="0" x2={x} y2={height} />
                ))}
              </g>

              {/* Corridor Tracks */}
              {routes.map(route => {
                const stopPoints = route.stops
                  .map(s => stationMap[s.station_code]?.pos)
                  .filter(Boolean);

                if (stopPoints.length < 2) return null;

                const pathD = stopPoints.reduce((acc, pt, idx) => {
                  return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                }, '');

                return (
                  <g key={route.id}>
                    {/* Track outer casing / glow */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="6"
                      strokeOpacity="0.15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Track main line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="url(#trunkLineGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Railroad sleeper dashes */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      strokeDasharray="2 6"
                      strokeOpacity="0.4"
                    />
                  </g>
                );
              })}

              {/* Station Nodes */}
              {Object.values(stationMap).map(stn => {
                const isSelected = selectedTrain && (selectedTrain.next_station === stn.code || selectedTrain.last_reported_station === stn.code);
                return (
                  <g 
                    key={stn.code} 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredEntity({ type: 'station', data: stn })}
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    <circle
                      cx={stn.pos.x}
                      cy={stn.pos.y}
                      r={stn.category === 'NSG-1' ? 6 : 4.5}
                      fill="#0b1324"
                      stroke={isSelected ? '#38bdf8' : '#64748b'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="transition-all group-hover:stroke-cyan-300"
                    />
                    <circle
                      cx={stn.pos.x}
                      cy={stn.pos.y}
                      r={stn.category === 'NSG-1' ? 3 : 2}
                      fill={isSelected ? '#38bdf8' : '#94a3b8'}
                    />
                    {/* Station Code Label */}
                    <text
                      x={stn.pos.x}
                      y={stn.pos.y - 9}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow"
                    >
                      {stn.code}
                    </text>
                  </g>
                );
              })}

              {/* Animated Simulated Train Tokens */}
              {trains.map(train => {
                const pos = project(train.lat, train.lng);
                const isSelected = selectedTrain?.train_number === train.train_number;
                const signalColor = getSignalColor(train.signal_aspect);

                return (
                  <g 
                    key={train.train_number}
                    className="cursor-pointer transition-transform duration-300"
                    onClick={() => onSelectTrain(train)}
                    onMouseEnter={() => setHoveredEntity({ type: 'train', data: train })}
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    {/* Pulse wave around active train */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 16 : 11}
                      fill={signalColor}
                      fillOpacity="0.15"
                      className="animate-ping"
                      style={{ animationDuration: '3s' }}
                    />

                    {/* Train outer ring */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 12 : 9}
                      fill="#0f172a"
                      stroke={signalColor}
                      strokeWidth={isSelected ? 3 : 2}
                      filter="url(#glow)"
                    />

                    {/* Directional heading tick */}
                    <line
                      x1={pos.x}
                      y1={pos.y}
                      x2={pos.x + 8 * Math.sin((train.heading_deg * Math.PI) / 180)}
                      y2={pos.y - 8 * Math.cos((train.heading_deg * Math.PI) / 180)}
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    {/* Train Number Label Badge */}
                    <g transform={`translate(${pos.x + 12}, ${pos.y - 12})`}>
                      <rect
                        x="0"
                        y="0"
                        width="54"
                        height="18"
                        rx="4"
                        fill="#0b1324"
                        stroke={signalColor}
                        strokeWidth="1"
                        fillOpacity="0.9"
                      />
                      <text
                        x="27"
                        y="12"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {train.train_number}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* LINEAR CTC SCHEMATIC VIEW */
          <div className="w-full max-w-4xl p-6 font-mono">
            <div className="text-xs text-cyan-300 mb-4 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold">NDLS - HWH CORRIDOR CTC SCHEMATIC (CONTINUOUS TRACK CIRCUITS)</span>
              <span className="text-slate-400">DOUBLE TRACK WITH INTERMEDIATE BLOCK SECTIONS (IBS)</span>
            </div>

            <div className="space-y-8">
              {/* UP MAIN LINE */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 relative">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="text-cyan-400 font-bold">UP LINE (TOWARDS HOWRAH / EAST)</span>
                  <span>SPEED LIMIT: 130 KM/H</span>
                </div>

                {/* Track Line */}
                <div className="h-1 bg-cyan-700/60 w-full relative my-8 flex items-center justify-between">
                  {/* Stations */}
                  {['NDLS', 'GZB', 'ALJN', 'TDL', 'CNB', 'PRYJ', 'DDU', 'HWH'].map((stn, idx) => (
                    <div key={stn} className="flex flex-col items-center relative z-10">
                      <div className="w-3.5 h-3.5 bg-slate-950 border-2 border-cyan-400 rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-200 mt-2">{stn}</span>
                      <span className="text-[8px] text-slate-500">Km {idx * 200}</span>
                    </div>
                  ))}

                  {/* Simulated Trains on Track */}
                  {trains.filter(t => t.speed_kmh > 0).slice(0, 4).map((t, idx) => {
                    const percent = 15 + idx * 24;
                    const signalColor = getSignalColor(t.signal_aspect);
                    return (
                      <div 
                        key={t.train_number}
                        onClick={() => onSelectTrain(t)}
                        style={{ left: `${percent}%` }}
                        className="absolute -top-7 transform -translate-x-1/2 cursor-pointer group flex flex-col items-center"
                      >
                        <div 
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-lg flex items-center gap-1 border"
                          style={{ backgroundColor: '#0f172a', borderColor: signalColor }}
                        >
                          <Train className="w-3 h-3" style={{ color: signalColor }} />
                          <span>{t.train_number}</span>
                          <span className="text-[9px] text-slate-400">{t.speed_kmh} km/h</span>
                        </div>
                        <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: signalColor }}></div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DOWN MAIN LINE */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 relative">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="text-emerald-400 font-bold">DOWN LINE (TOWARDS NEW DELHI / WEST)</span>
                  <span>SPEED LIMIT: 130 KM/H</span>
                </div>

                <div className="h-1 bg-emerald-700/60 w-full relative my-8 flex items-center justify-between">
                  {['HWH', 'DDU', 'PRYJ', 'CNB', 'TDL', 'ALJN', 'GZB', 'NDLS'].map((stn, idx) => (
                    <div key={stn} className="flex flex-col items-center relative z-10">
                      <div className="w-3.5 h-3.5 bg-slate-950 border-2 border-emerald-400 rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-200 mt-2">{stn}</span>
                      <span className="text-[8px] text-slate-500">Km {idx * 200}</span>
                    </div>
                  ))}

                  {trains.filter(t => t.speed_kmh > 0).slice(4, 7).map((t, idx) => {
                    const percent = 20 + idx * 28;
                    const signalColor = getSignalColor(t.signal_aspect);
                    return (
                      <div 
                        key={t.train_number}
                        onClick={() => onSelectTrain(t)}
                        style={{ left: `${percent}%` }}
                        className="absolute -top-7 transform -translate-x-1/2 cursor-pointer group flex flex-col items-center"
                      >
                        <div 
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-lg flex items-center gap-1 border"
                          style={{ backgroundColor: '#0f172a', borderColor: signalColor }}
                        >
                          <Train className="w-3 h-3" style={{ color: signalColor }} />
                          <span>{t.train_number}</span>
                          <span className="text-[9px] text-slate-400">{t.speed_kmh} km/h</span>
                        </div>
                        <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: signalColor }}></div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CENTRAL MAHARASHTRA LINE: MUMBAI - MANMAD - KOPARGAON */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 relative">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="text-amber-400 font-bold">CENTRAL MAHARASHTRA CORRIDOR (MUMBAI - MANMAD - KOPARGAON)</span>
                  <span>SPEED LIMIT: 110 KM/H | CR BHUSAWAL / SOLAPUR</span>
                </div>

                <div className="h-1 bg-amber-700/60 w-full relative my-8 flex items-center justify-between">
                  {[
                    { code: 'MMCT', name: 'Mumbai Central', km: 0 },
                    { code: 'MMR', name: 'Manmad Jn', km: 260 },
                    { code: 'KPG', name: 'Kopargaon', km: 302 }
                  ].map((stn, idx) => (
                    <div key={stn.code} className="flex flex-col items-center relative z-10">
                      <div className="w-4 h-4 bg-slate-950 border-2 border-amber-400 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-300 mt-2">{stn.code}</span>
                      <span className="text-[9px] text-slate-300 font-semibold">{stn.name}</span>
                      <span className="text-[8px] text-slate-500">Km {stn.km}</span>
                    </div>
                  ))}

                  {/* Shirdi Express 12131 on track */}
                  <div 
                    style={{ left: '72%' }}
                    className="absolute -top-7 transform -translate-x-1/2 cursor-pointer group flex flex-col items-center"
                    onClick={() => {
                      const t = trains.find(tr => tr.train_number === '12131');
                      if (t) onSelectTrain(t);
                    }}
                  >
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-lg flex items-center gap-1 border bg-slate-900 border-amber-400">
                      <Train className="w-3 h-3 text-amber-400" />
                      <span>12131</span>
                      <span className="text-[9px] text-amber-300">82 km/h</span>
                    </div>
                    <div className="w-2 h-2 rounded-full mt-1 bg-amber-400"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Floating Tooltip Card */}
        {hoveredEntity && (
          <div className="absolute top-4 right-4 bg-slate-950/95 border border-slate-700 p-3 rounded-xl shadow-2xl z-20 w-64 backdrop-blur-md text-xs font-mono">
            {hoveredEntity.type === 'train' ? (
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                  <span className="font-bold text-white">{hoveredEntity.data.train_number} - {hoveredEntity.data.name}</span>
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: getSignalColor(hoveredEntity.data.signal_aspect) }}
                  ></span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Speed:</span>
                    <span className="text-cyan-300 font-bold">{hoveredEntity.data.speed_kmh} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Signal Aspect:</span>
                    <span className="font-bold" style={{ color: getSignalColor(hoveredEntity.data.signal_aspect) }}>
                      {hoveredEntity.data.signal_aspect}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Simulated Delay:</span>
                    <span className={hoveredEntity.data.delay_mins > 15 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      +{hoveredEntity.data.delay_mins} mins
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Block Section:</span>
                    <span className="text-slate-300 truncate max-w-[120px]">{hoveredEntity.data.block_section}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-bold text-white border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
                  <span>{hoveredEntity.data.name} ({hoveredEntity.data.code})</span>
                  <span className="text-[10px] text-cyan-400">{hoveredEntity.data.zone} Zone</span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>Division: <span className="text-slate-200">{hoveredEntity.data.division}</span></div>
                  <div>Operating Platforms: <span className="text-cyan-300 font-bold">{hoveredEntity.data.platforms}</span></div>
                  <div>Category: <span className="text-slate-400">{hoveredEntity.data.category}</span></div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Map Legend Footer */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="text-slate-400">SIGNAL LEGEND:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Green (Clear)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Double Yellow (Attention)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Yellow (Caution)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Red (Stop / Hold)
          </span>
        </div>

        <div className="text-slate-400 text-[10px]">
          * Positions and speeds interpolated using historical timetable telemetry.
        </div>
      </div>
    </div>
  );
}
