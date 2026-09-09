import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Train, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Gauge, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Sliders, 
  Activity,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function LiveTracking({ 
  trains = [], 
  stations = [], 
  routes = [], 
  selectedTrain, 
  onSelectTrain,
  onViewTrainDetails 
}) {
  // Station lookup dictionary for full names
  const stationLookup = useRef({});
  useEffect(() => {
    const dict = {};
    stations.forEach(s => {
      dict[s.code] = s.name;
    });
    stationLookup.current = dict;
  }, [stations]);

  const getStationName = (code) => {
    return stationLookup.current[code] || code;
  };

  // Currently selected train for replay
  const [activeTrainNumber, setActiveTrainNumber] = useState(
    selectedTrain?.train_number || trains[0]?.train_number || "12301"
  );

  // Replay playback controls state
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(2); // 1x, 2x, 5x, 10x
  const [progressPercent, setProgressPercent] = useState(38); // 0 to 100% of route

  // Sync if selectedTrain prop changes
  useEffect(() => {
    if (selectedTrain?.train_number) {
      setActiveTrainNumber(selectedTrain.train_number);
    }
  }, [selectedTrain]);

  // Retrieve current active train object
  const currentTrain = useMemoTrain(trains, activeTrainNumber);

  function useMemoTrain(allTrains, num) {
    return allTrains.find(t => t.train_number === num) || allTrains[0] || {
      train_number: "12301",
      name: "Howrah Rajdhani Express",
      type: "Rajdhani Express",
      origin: "HWH",
      destination: "NDLS",
      schedule: [],
      status: {
        current_status: "Running",
        current_speed_kmh: 118,
        simulated_delay_mins: 14
      }
    };
  }

  // Calculate schedule and stops
  const stops = currentTrain?.schedule || [
    { station_code: "HWH", day: 1, scheduled_arr: "16:50", scheduled_dep: "16:55", distance_km: 0, platform: "9" },
    { station_code: "ASN", day: 1, scheduled_arr: "18:55", scheduled_dep: "18:57", distance_km: 200, platform: "4" },
    { station_code: "DDU", day: 2, scheduled_arr: "00:45", scheduled_dep: "00:55", distance_km: 659, platform: "2" },
    { station_code: "PRYJ", day: 2, scheduled_arr: "02:43", scheduled_dep: "02:45", distance_km: 812, platform: "1" },
    { station_code: "CNB", day: 2, scheduled_arr: "04:50", scheduled_dep: "04:55", distance_km: 1007, platform: "1" },
    { station_code: "NDLS", day: 2, scheduled_arr: "10:05", scheduled_dep: "10:05", distance_km: 1447, platform: "1" }
  ];

  const totalRouteDistance = stops[stops.length - 1]?.distance_km || 1447;

  // Replay Animation Loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressPercent((prev) => {
          const next = prev + (0.15 * speedMultiplier);
          if (next >= 100) return 0; // Loop back to origin
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Current distance travelled & remaining
  const currentDistanceKm = Math.round((progressPercent / 100) * totalRouteDistance);
  const remainingDistanceKm = Math.max(0, totalRouteDistance - currentDistanceKm);

  // Compute Current Station & Next Station based on progress along stops
  let currentStationIndex = 0;
  for (let i = 0; i < stops.length; i++) {
    if (currentDistanceKm >= stops[i].distance_km) {
      currentStationIndex = i;
    } else {
      break;
    }
  }
  const nextStationIndex = Math.min(stops.length - 1, currentStationIndex + 1);

  const currentStop = stops[currentStationIndex] || stops[0];
  const nextStop = stops[nextStationIndex] || stops[stops.length - 1];

  const currentStationCode = currentStop.station_code;
  const nextStationCode = nextStop.station_code;

  // Current simulated delay
  const simulatedDelayMins = currentTrain.status?.simulated_delay_mins || 14;

  // Status computation
  let computedStatus = "Running";
  if (currentTrain.status?.current_status === "Held at Loop") {
    computedStatus = "Held at Siding";
  } else if (currentDistanceKm >= totalRouteDistance - 2) {
    computedStatus = "Arrived at Destination";
  } else if (Math.abs(currentDistanceKm - nextStop.distance_km) < 15) {
    computedStatus = `Approaching ${nextStationCode}`;
  } else if (simulatedDelayMins > 15) {
    computedStatus = `Delayed (+${simulatedDelayMins}m)`;
  } else {
    computedStatus = `In-Transit (${currentTrain.status?.current_speed_kmh || 110} km/h)`;
  }

  // Replay control handlers
  const handleStartResume = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setProgressPercent(0);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. MANDATORY PROMINENT DISCLAIMER HEADER */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border-2 border-amber-500/50 p-4 rounded-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-amber-300 font-mono tracking-wider uppercase">
                  Historical Replay / Simulation
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-200 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  PROTOTYPE
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-mono mt-0.5">
                Simulating historical train movement using timetable data. <strong>Do NOT treat as live Indian Railways GPS tracking.</strong>
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
            Timetable Baseline: Official Broad Gauge Schedule
          </div>
        </div>
      </div>

      {/* 2. TRAIN SELECTOR & REPLAY CONTROLS BAR */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 font-mono shadow-xl space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          
          {/* 1. Train Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Train className="w-4 h-4 text-cyan-400" />
              SELECT TRAIN TO REPLAY:
            </label>
            <select
              value={activeTrainNumber}
              onChange={(e) => {
                setActiveTrainNumber(e.target.value);
                setProgressPercent(15);
                const found = trains.find(t => t.train_number === e.target.value);
                if (found && onSelectTrain) onSelectTrain(found);
              }}
              className="bg-slate-950 border border-slate-700 text-cyan-300 font-bold px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-cyan-500 cursor-pointer min-w-[280px]"
            >
              {trains.map(t => (
                <option key={t.train_number} value={t.train_number}>
                  {t.train_number} — {t.name} ({t.type})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Replay Action Controls (Start, Pause, Resume, Reset) */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Start / Resume */}
            {!isPlaying ? (
              <button
                onClick={handleStartResume}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{progressPercent > 0 ? "Resume Replay" : "Start Replay"}</span>
              </button>
            ) : (
              /* Pause */
              <button
                onClick={handlePause}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-950/40 transition-all"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Replay</span>
              </button>
            )}

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
              title="Reset train to origin"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="h-6 w-px bg-slate-800 mx-1"></div>

            {/* Speed Multipliers (1x, 2x, 5x, 10x) */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 px-1.5">SPEED:</span>
              {[1, 2, 5, 10].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeedMultiplier(spd)}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    speedMultiplier === spd
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Interactive Scrub Timeline Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>REPLAY PROGRESSION SCRUBBER:</span>
              <strong className="text-white ml-1">{Math.round(progressPercent)}% completed</strong>
            </span>
            <span className="text-cyan-300 font-bold">{currentDistanceKm} km / {totalRouteDistance} km</span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="0.2"
              value={progressPercent}
              onChange={(e) => {
                setProgressPercent(parseFloat(e.target.value));
              }}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
          </div>
        </div>

      </div>

      {/* 3. CURRENT TRAIN INFORMATION CARDS */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 font-mono shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-cyan-400">{currentTrain.train_number}</span>
                <span className="text-white font-bold text-base">— {currentTrain.name}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {currentTrain.type}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Corridor: {currentTrain.corridor_code || "NDLS-HWH"} | Locomotive: {currentTrain.locomotive || "WAP-7 Electric"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
              computedStatus.includes('Delayed') || computedStatus.includes('Held')
                ? 'bg-rose-950/60 text-rose-300 border-rose-500/50 animate-pulse'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
            }`}>
              {computedStatus}
            </span>
          </div>
        </div>

        {/* 7 Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">CURRENT STATION</span>
            <span className="text-sm font-bold text-white mt-1 block truncate">
              {currentStationCode}
            </span>
            <span className="text-[10px] text-slate-400 truncate block">
              {getStationName(currentStationCode)}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">NEXT STATION</span>
            <span className="text-sm font-bold text-cyan-300 mt-1 block truncate">
              {nextStationCode}
            </span>
            <span className="text-[10px] text-slate-400 truncate block">
              {getStationName(nextStationCode)}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">DISTANCE TRAVELLED</span>
            <span className="text-sm font-bold text-emerald-400 mt-1 block">
              {currentDistanceKm} km
            </span>
            <span className="text-[10px] text-slate-400 block">From {currentTrain.origin}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">REMAINING DISTANCE</span>
            <span className="text-sm font-bold text-amber-300 mt-1 block">
              {remainingDistanceKm} km
            </span>
            <span className="text-[10px] text-slate-400 block">To {currentTrain.destination}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">ESTIMATED DELAY</span>
            <span className={`text-sm font-bold mt-1 block ${
              simulatedDelayMins > 15 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {simulatedDelayMins > 0 ? `+${simulatedDelayMins} mins` : 'On Time'}
            </span>
            <span className="text-[10px] text-slate-400 block">Punctuality tolerance</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">SIMULATED SPEED</span>
            <span className="text-sm font-bold text-cyan-400 mt-1 block">
              {isPlaying ? `${currentTrain.status?.current_speed_kmh || 110} km/h` : '0 km/h (Paused)'}
            </span>
            <span className="text-[10px] text-slate-400 block">MPS: {currentTrain.max_speed_kmh || 130} km/h</span>
          </div>

        </div>
      </div>

      {/* 4. ROUTE VISUALIZATION (Station A -> Station B -> Station C -> Station D) */}
      <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 font-mono shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              ROUTE HALT VISUALIZATION & TRAIN POSITION TRACKER
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sequential station progression: Station A &rarr; Station B &rarr; Station C &rarr; Station D
            </p>
          </div>
          <span className="text-xs text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
            {stops.length} Sequential Stations
          </span>
        </div>

        {/* Sequential Stations Graphical Track Line */}
        <div className="relative py-10 px-4 overflow-x-auto min-w-[700px]">
          
          {/* Background Rail Track Line */}
          <div className="relative w-full h-3 flex items-center">
            
            {/* Dark Rail Bed */}
            <div className="w-full h-2 bg-slate-950 rounded border border-slate-800"></div>

            {/* Covered Progress Rail (Cyan Glow) */}
            <div 
              className="absolute left-0 top-0.5 h-2 bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-500 rounded shadow-[0_0_10px_rgba(6,182,212,0.6)] transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            ></div>

            {/* Station Nodes along the path */}
            {stops.map((stn, index) => {
              const nodePercent = (stn.distance_km / totalRouteDistance) * 100;
              const isPassed = progressPercent >= nodePercent;
              const isCurrent = currentStationCode === stn.station_code;
              const isNext = nextStationCode === stn.station_code;

              return (
                <div 
                  key={stn.station_code}
                  style={{ left: `${nodePercent}%` }}
                  className="absolute transform -translate-x-1/2 flex flex-col items-center z-10"
                >
                  {/* Station Marker Dot */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                    isCurrent 
                      ? 'bg-cyan-500 border-white ring-4 ring-cyan-500/40 scale-125' 
                      : isPassed
                      ? 'bg-slate-950 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-700 text-slate-500'
                  }`}>
                    <span className="text-[8px] font-bold">
                      {index + 1}
                    </span>
                  </div>

                  {/* Station Labels */}
                  <div className="mt-3 text-center pointer-events-none whitespace-nowrap">
                    <span className={`text-xs font-bold block ${
                      isCurrent ? 'text-cyan-300' : isPassed ? 'text-slate-200' : 'text-slate-400'
                    }`}>
                      {stn.station_code}
                    </span>
                    <span className="text-[10px] text-slate-400 block max-w-[90px] truncate">
                      {getStationName(stn.station_code)}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {stn.distance_km} km
                    </span>
                  </div>

                  {/* Scheduled Departure Tag */}
                  <div className="mt-1">
                    <span className="text-[8px] text-slate-400 bg-slate-950/80 px-1 py-0.5 rounded border border-slate-800">
                      Dep: {stn.scheduled_dep}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Moving Train Token Icon on the Track */}
            <div 
              style={{ left: `${progressPercent}%` }}
              className="absolute -top-12 transform -translate-x-1/2 flex flex-col items-center z-30 transition-all duration-150 pointer-events-none"
            >
              {/* Train Head Badge */}
              <div className="bg-cyan-500 text-slate-950 px-2 py-1 rounded-md text-[10px] font-extrabold flex items-center gap-1 shadow-[0_0_15px_rgba(6,182,212,0.8)] border border-cyan-300">
                <Train className="w-3.5 h-3.5" />
                <span>{currentTrain.train_number}</span>
                <span className="text-[8px] bg-slate-950 text-cyan-300 px-1 rounded ml-0.5">
                  {isPlaying ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>

              {/* Pointing Needle */}
              <div className="w-2.5 h-2.5 bg-cyan-400 transform rotate-45 -mt-1 shadow-md"></div>
              
              {/* Pulse circle on the track */}
              <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-white mt-1 shadow-lg animate-ping" style={{ animationDuration: '2s' }}></div>
            </div>

          </div>

        </div>

        {/* Station Passage Summary Breadcrumbs */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">HALT SEQUENCE:</span>
            {stops.map((s, idx) => (
              <React.Fragment key={s.station_code}>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  currentStationCode === s.station_code 
                    ? 'bg-cyan-500 text-slate-950' 
                    : idx <= currentStationIndex 
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60' 
                    : 'bg-slate-950 text-slate-400'
                }`}>
                  {s.station_code}
                </span>
                {idx < stops.length - 1 && <span className="text-slate-600">&rarr;</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="text-[11px] text-cyan-400">
            Currently between: <strong>{currentStationCode}</strong> &rarr; <strong>{nextStationCode}</strong>
          </div>
        </div>

      </div>

      {/* 5. TIMELINE: SCHEDULED VS SIMULATED ARRIVAL & DELAY TABLE */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 font-mono shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              TIMELINE & ARRIVAL COMPARISON
            </h3>
            <p className="text-xs text-slate-400">
              Scheduled timetable arrival vs. simulated actual arrival factoring in historical delay accumulation
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            Punctuality Benchmark: Broad Gauge &le; 15 mins
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Sequence</th>
                <th className="p-3">Station Code & Name</th>
                <th className="p-3">Distance</th>
                <th className="p-3">Scheduled Arrival</th>
                <th className="p-3">Scheduled Departure</th>
                <th className="p-3">Simulated Arrival</th>
                <th className="p-3">Delay</th>
                <th className="p-3 text-right">Checkpoint Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {stops.map((stop, idx) => {
                const isPassed = progressPercent >= (stop.distance_km / totalRouteDistance) * 100;
                const isCurrent = currentStationCode === stop.station_code;
                
                // Simulated arrival delay progression
                const stopDelay = Math.max(0, simulatedDelayMins + (idx * 2) - (idx > 2 ? 4 : 0));
                
                // Format simulated arrival display
                const simulatedArrival = stop.scheduled_arr === "--" 
                  ? "Origin" 
                  : `${stop.scheduled_arr} (+${stopDelay}m)`;

                return (
                  <tr 
                    key={stop.station_code}
                    className={`transition-colors ${
                      isCurrent 
                        ? 'bg-cyan-950/70 text-white' 
                        : isPassed
                        ? 'bg-slate-950/30 text-slate-300'
                        : 'hover:bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="text-cyan-400">{stop.station_code}</span>
                        <span className="font-normal text-slate-300 truncate max-w-[160px]">
                          {getStationName(stop.station_code)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{stop.distance_km} km</td>
                    <td className="p-3 text-slate-300">{stop.scheduled_arr}</td>
                    <td className="p-3 text-slate-300">{stop.scheduled_dep}</td>
                    <td className="p-3 font-bold text-cyan-300">
                      {simulatedArrival}
                    </td>
                    <td className="p-3">
                      <span className={`font-bold ${
                        stopDelay > 15 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {stopDelay === 0 ? 'On Time' : `+${stopDelay} mins`}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse'
                          : isPassed
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isCurrent ? 'TRAIN AT STATION' : isPassed ? 'PASSED / DEPARTED' : 'SCHEDULED AHEAD'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
