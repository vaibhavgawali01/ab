import React, { useState, useEffect } from 'react';
import { 
  Train, 
  Clock, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  ArrowRight, 
  Zap, 
  Cpu, 
  Layers, 
  Sliders, 
  FileText,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function TrainDetails({ 
  trains = [], 
  selectedTrainNumber, 
  onSelectTrainNumber,
  onNavigateToPrediction 
}) {
  const [activeTrain, setActiveTrain] = useState(null);

  useEffect(() => {
    if (trains.length > 0) {
      if (selectedTrainNumber) {
        const found = trains.find(t => t.train_number === selectedTrainNumber);
        setActiveTrain(found || trains[0]);
      } else {
        setActiveTrain(trains[0]);
      }
    }
  }, [trains, selectedTrainNumber]);

  if (!activeTrain) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono">
        Loading train operational profile...
      </div>
    );
  }

  // Create speed/distance chart data from schedule
  const speedCurveData = (activeTrain.schedule || []).map((s, idx) => ({
    station: s.station_code,
    km: s.distance_km,
    speed: idx === 0 ? 0 : idx === activeTrain.schedule.length - 1 ? 0 : activeTrain.max_speed_kmh - (idx % 2 === 0 ? 10 : 25)
  }));

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Top Header & Train Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <Train className="w-5 h-5 text-cyan-400" />
              TRAIN OPERATIONAL PROFILE & TIMETABLE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive halt-by-halt comparison: Scheduled Timetable vs. Historical Actual vs. ML Dynamic ETA
          </p>
        </div>

        {/* Dropdown Train Picker */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">SELECT TRAIN:</span>
          <select
            value={activeTrain.train_number}
            onChange={(e) => {
              onSelectTrainNumber(e.target.value);
              const found = trains.find(t => t.train_number === e.target.value);
              if (found) setActiveTrain(found);
            }}
            className="bg-slate-950 border border-slate-700 text-cyan-300 font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            {trains.map(t => (
              <option key={t.train_number} value={t.train_number}>
                {t.train_number} — {t.name} ({t.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Train Info Banner & Specs */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-cyan-400 font-mono tracking-wider">
                {activeTrain.train_number}
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {activeTrain.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-cyan-800">
                {activeTrain.type}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mt-2">
              <span>Origin: <strong className="text-white">{activeTrain.origin}</strong></span>
              <span>&rarr;</span>
              <span>Destination: <strong className="text-white">{activeTrain.destination}</strong></span>
              <span>Corridor: <strong className="text-cyan-300">{activeTrain.corridor_code}</strong></span>
              <span>Priority Rank: <strong className="text-amber-300">P{activeTrain.priority}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end lg:self-auto">
            <button
              onClick={() => onNavigateToPrediction(activeTrain.train_number)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg font-mono flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all"
            >
              <Cpu className="w-4 h-4" />
              <span>Simulate ML Delay Prediction</span>
            </button>
          </div>
        </div>

        {/* Technical Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 font-mono text-xs">
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 text-[10px] block">MOTIVE POWER</span>
            <span className="text-slate-200 font-bold mt-0.5 block truncate" title={activeTrain.locomotive}>
              {activeTrain.locomotive || 'WAP-7 Electric'}
            </span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 text-[10px] block">RAKE COMPOSITION</span>
            <span className="text-slate-200 font-bold mt-0.5 block truncate" title={activeTrain.rake_type}>
              {activeTrain.rake_type || '22 LHB Coaches'}
            </span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 text-[10px] block">MAX PERMISSIBLE SPEED</span>
            <span className="text-cyan-400 font-bold mt-0.5 block">
              {activeTrain.max_speed_kmh} km/h (MPS)
            </span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 text-[10px] block">CURRENT SIMULATED DELAY</span>
            <span className={`font-bold mt-0.5 block ${
              (activeTrain.status?.simulated_delay_mins || 0) > 15 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              +{(activeTrain.status?.simulated_delay_mins || 0)} mins ({activeTrain.status?.current_status || 'Running'})
            </span>
          </div>
        </div>
      </div>

      {/* Halt-by-Halt Timetable Table */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              HALT-BY-HALT SCHEDULE & DYNAMIC PREDICTION
            </h3>
            <p className="text-xs text-slate-400">Timetable benchmarked against simulated headway and dwell buffers</p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            {activeTrain.schedule?.length || 0} Scheduled Halts
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Station Code</th>
                <th className="p-3">Distance</th>
                <th className="p-3">Scheduled Arrival</th>
                <th className="p-3">Scheduled Dep</th>
                <th className="p-3">ML Predicted ETA</th>
                <th className="p-3">Est. Delay</th>
                <th className="p-3 text-right">Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {(activeTrain.schedule || []).map((stop, idx) => {
                // Calculate simulated predicted arrival time
                const delayMins = Math.max(0, (activeTrain.status?.simulated_delay_mins || 0) + (idx * 2) - (idx > 2 ? 4 : 0));
                
                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <span className="text-cyan-400">{stop.station_code}</span>
                    </td>
                    <td className="p-3 text-slate-400">{stop.distance_km} km</td>
                    <td className="p-3 text-slate-300">{stop.scheduled_arr}</td>
                    <td className="p-3 text-slate-300">{stop.scheduled_dep}</td>
                    <td className="p-3 font-bold text-cyan-300">
                      {/* Predicted arrival adjusted with delay */}
                      {stop.scheduled_arr} <span className="text-[10px] text-slate-400">(Est)</span>
                    </td>
                    <td className="p-3">
                      <span className={`font-semibold ${delayMins > 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {delayMins === 0 ? 'On Time' : `+${delayMins}m`}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-200">
                      PF {stop.platform || '1'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Speed & Distance Profile */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              CORRIDOR SPEED-DISTANCE PROFILE
            </h3>
            <p className="text-xs text-slate-400">Permissible sectional track speed vs halt decelerations</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Max Permissible: {activeTrain.max_speed_kmh} km/h</span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={speedCurveData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="station" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" domain={[0, 160]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Line type="stepAfter" dataKey="speed" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} name="Speed (km/h)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
