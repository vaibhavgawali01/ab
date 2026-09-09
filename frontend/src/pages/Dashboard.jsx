import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Clock, 
  Play, 
  Pause, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Train, 
  CheckCircle2, 
  AlertOctagon, 
  BarChart2, 
  Hourglass, 
  Zap, 
  Radio, 
  ArrowRight, 
  ShieldAlert, 
  GitBranch, 
  Compass, 
  ChevronRight, 
  Layers, 
  Info,
  Sliders,
  ExternalLink
} from 'lucide-react';

export default function Dashboard({ 
  analytics, 
  trains = [], 
  conflicts = [], 
  onSelectTab, 
  onSelectTrain,
  isPlaying = true,
  onTogglePlay,
  simulationTime = "2026-09-08 10:30:00",
  timeMultiplier = 5,
  routes = [],
  stations = []
}) {
  // Selected train for delay reason panel & route highlighting
  const [highlightedTrainNo, setHighlightedTrainNo] = useState("12802");

  // Summary Metrics Calculation
  const activeTrainsCount = trains.length || 8;
  const onTimeTrainsCount = trains.filter(t => (t.status?.simulated_delay_mins || 0) <= 15).length;
  const delayedTrainsCount = trains.filter(t => (t.status?.simulated_delay_mins || 0) > 15).length;
  const activeConflictsCount = conflicts.filter(c => !c.resolved).length;
  const avgDelay = analytics?.average_network_delay_mins || 13.8;

  // Next Station ETA calculation (e.g. 12301 approaching CNB)
  const imminentTrain = trains.find(t => t.train_number === "12301") || trains[0];
  const nextStationCode = imminentTrain?.status?.next_station || "CNB";
  const imminentDelay = imminentTrain?.status?.simulated_delay_mins || 14;

  // Pre-calculated comprehensive delay reasons for interactive panel
  const delayExplanations = {
    "12802": {
      train_number: "12802",
      name: "Purushottam Express",
      type: "Superfast Express",
      delay_mins: 46,
      status: "Delayed",
      location: "Chata - Kosi Kalan Block 4",
      primary_reason: "Precedence conflict with higher-priority train (Vande Bharat 22436 held on main line)",
      secondary_reason: "Dense fog restrictions: Optical signal sighting reduced to 400m; driver operating under 60 km/h caution curve.",
      root_cause_type: "Precedence Inversion & Fog Weather",
      dispatcher_recommendation: "Hold 12802 at loop siding until 22436 clears block section; authorize through line green aspect at 10:42 AM.",
      severity: "High"
    },
    "BOXN-50102": {
      train_number: "BOXN-50102",
      name: "Thermal Coal Freight Rake",
      type: "Freight",
      delay_mins: 82,
      status: "Held at Loop",
      location: "Kanpur Central (CNB) West Yard Loop Line 3",
      primary_reason: "Precedence siding hold for Rajdhani and Shatabdi express crossing corridors",
      secondary_reason: "Heavy 5,200 MT load requires dedicated path clearance; yard diamond crossing currently saturated.",
      root_cause_type: "Freight Siding Regulation",
      dispatcher_recommendation: "Maintain loop signal RED; clear 12301 Howrah Rajdhani on Up Main before admitting freight to section.",
      severity: "High"
    },
    "12004": {
      train_number: "12004",
      name: "Lucknow Shatabdi Express",
      type: "Shatabdi Express",
      delay_mins: 18,
      status: "Delayed",
      location: "Aligarh (ALJN) - Tundla (TDL) IBS Section",
      primary_reason: "Temporary Speed Restriction (TSR 90 km/h) due to track tamping maintenance",
      secondary_reason: "Suburban commuter EMU precedence conflict entering Ghaziabad yard throat.",
      root_cause_type: "Track Maintenance & Commuter Density",
      dispatcher_recommendation: "Advise section controller to prioritize Shatabdi through line clearance at Tundla Junction.",
      severity: "Medium"
    },
    "12301": {
      train_number: "12301",
      name: "Howrah Rajdhani Express",
      type: "Rajdhani Express",
      delay_mins: 14,
      status: "Running",
      location: "Prayagraj (PRYJ) - Kanpur (CNB) Section",
      primary_reason: "Early morning fog caution & terminal platform 1 contention at PRYJ",
      secondary_reason: "Within Indian Railways 15-minute punctuality tolerance; schedule recovery buffer active.",
      root_cause_type: "Marginal Seasonal Dwell",
      dispatcher_recommendation: "Automatic green signal aspect enabled; estimated to recover 5 minutes before New Delhi terminal.",
      severity: "Low"
    },
    "22436": {
      train_number: "22436",
      name: "Vande Bharat Express",
      type: "Vande Bharat",
      delay_mins: 2,
      status: "Running",
      location: "Kanpur (CNB) - Prayagraj (PRYJ) Block 2",
      primary_reason: "Nominal punctual run with full automatic block line clearance",
      secondary_reason: "Operating at 128 km/h on main through track; zero precedence restrictions.",
      root_cause_type: "On Time / High Priority",
      dispatcher_recommendation: "Maintain continuous green corridor passage.",
      severity: "Low"
    }
  };

  const currentExplanation = delayExplanations[highlightedTrainNo] || delayExplanations["12802"];

  // Helper to get visual indicator class for a train on route
  const getTrainVisualCategory = (t) => {
    const isConflict = conflicts.some(c => !c.resolved && (c.train_primary === t.train_number || c.train_secondary === t.train_number));
    if (isConflict) return "conflict";
    if (t.status?.current_status === "Held at Loop" || t.status?.current_speed_kmh === 0) return "held";
    if ((t.status?.simulated_delay_mins || 0) > 15) return "delayed";
    return "running";
  };

  // Stations for the NDLS - HWH trunk line visualization
  const trunkStations = [
    { code: "NDLS", name: "New Delhi", km: 0, percent: 4 },
    { code: "GZB", name: "Ghaziabad", km: 25, percent: 18 },
    { code: "ALJN", name: "Aligarh", km: 131, percent: 32 },
    { code: "TDL", name: "Tundla", km: 209, percent: 46 },
    { code: "CNB", name: "Kanpur", km: 440, percent: 62 },
    { code: "PRYJ", name: "Prayagraj", km: 635, percent: 76 },
    { code: "DDU", name: "Pt. DDU", km: 788, percent: 88 },
    { code: "HWH", name: "Howrah", km: 1447, percent: 97 }
  ];

  // Train positions for Route Visualization
  const routeTrains = [
    { train_number: "22436", name: "Vande Bharat", type: "Vande Bharat", percent: 65, delay: 2, speed: 128, category: "running" },
    { train_number: "12301", name: "HWH Rajdhani", type: "Rajdhani", percent: 79, delay: 14, speed: 118, category: "running" },
    { train_number: "12004", name: "Shatabdi", type: "Shatabdi", percent: 38, delay: 18, speed: 105, category: "delayed" },
    { train_number: "12802", name: "Purushottam", type: "Superfast", percent: 52, delay: 46, speed: 82, category: "conflict" },
    { train_number: "BOXN-50102", name: "Freight Rake", type: "Freight", percent: 60, delay: 82, speed: 0, category: "held" }
  ];

  // Monitoring table rows formatted with required fields
  const monitoringData = trains.map(t => {
    const delay = t.status?.simulated_delay_mins || 0;
    const isConflict = conflicts.some(c => !c.resolved && (c.train_primary === t.train_number || c.train_secondary === t.train_number));
    
    // Conflict label
    let conflictStatus = "Clear (No Conflict)";
    let conflictColor = "text-emerald-400 bg-emerald-950/60 border-emerald-800/60";
    if (isConflict) {
      if (t.train_number === "22436" || t.train_number === "BOXN-50102") {
        conflictStatus = "Precedence Inversion";
        conflictColor = "text-rose-300 bg-rose-950/80 border-rose-700/80 animate-pulse";
      } else if (t.train_number === "12301" || t.train_number === "12802") {
        conflictStatus = "Platform Contention";
        conflictColor = "text-amber-300 bg-amber-950/80 border-amber-700/80";
      } else {
        conflictStatus = "Headway Compression";
        conflictColor = "text-yellow-300 bg-yellow-950/80 border-yellow-700/80";
      }
    } else if (t.status?.current_status === "Held at Loop") {
      conflictStatus = "Overtake Hold";
      conflictColor = "text-amber-300 bg-amber-950/60 border-amber-800/60";
    }

    // Status label
    let statusLabel = "Running";
    let statusColor = "text-cyan-300 bg-cyan-950/80 border-cyan-800/80";
    if (t.status?.current_status === "Held at Loop") {
      statusLabel = "Held";
      statusColor = "text-rose-300 bg-rose-950/80 border-rose-800/80";
    } else if (delay > 15) {
      statusLabel = "Delayed";
      statusColor = "text-amber-300 bg-amber-950/80 border-amber-800/80";
    }

    // Scheduled and predicted ETA calculation
    const scheduledETA = t.schedule?.[t.schedule.length - 1]?.scheduled_arr || "10:05";
    const predictedETA = t.schedule?.[t.schedule.length - 1]?.predicted_arr || (
      delay > 0 ? `${scheduledETA} (+${delay}m)` : scheduledETA
    );

    return {
      train_number: t.train_number,
      name: t.name,
      type: t.type,
      current_station: t.status?.last_reported_station || t.origin,
      next_station: t.status?.next_station || "CNB",
      scheduled_eta: scheduledETA,
      predicted_eta: predictedETA,
      delay: delay,
      status: statusLabel,
      statusColor: statusColor,
      conflict_status: conflictStatus,
      conflictColor: conflictColor,
      rawTrain: t
    };
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="bg-[#0b1326] border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/30 border border-cyan-400/30 text-white">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white font-mono tracking-wider">
                  TRACK<span className="text-cyan-400">PULSE</span>
                </h1>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono font-bold">
                  NOC DASHBOARD
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Indian Railways Operations & Delay Prediction Prototype Console
              </p>
            </div>
          </div>

          {/* Prototype Status Indicator Badge */}
          <div className="flex items-center gap-2 bg-amber-950/50 border border-amber-500/40 px-3 py-1.5 rounded-lg text-amber-300 text-xs font-mono shadow-inner">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold block">PROTOTYPE ENVIRONMENT</span>
              <span className="text-[10px] text-amber-200/80">Simulated / Historical Timetable Data Only</span>
            </div>
          </div>

          {/* Current Simulation Status & Clock */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">STATUS</span>
                <span className={`font-bold ${isPlaying ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isPlaying ? 'REPLAY RUNNING' : 'REPLAY PAUSED'}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800"></div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">SIM TIME</span>
                <span className="text-cyan-300 font-bold">{simulationTime.split(' ')[1] || '10:30:00'}</span>
              </div>
            </div>

            <button
              onClick={onTogglePlay}
              className={`p-1.5 rounded ml-1 transition-all ${
                isPlaying 
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
              }`}
              title={isPlaying ? "Pause Simulation" : "Start Simulation"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* In-Header Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/80 mt-3 pt-3 text-xs font-mono">
          <span className="text-slate-400 text-[11px] mr-1">QUICK NAV:</span>
          {[
            { id: 'dashboard', label: 'Dashboard', active: true },
            { id: 'live-tracking', label: 'Train Replay' },
            { id: 'train-details', label: 'Train Details' },
            { id: 'eta-prediction', label: 'ETA Prediction' },
            { id: 'conflict-mgmt', label: 'Conflict Management' },
            { id: 'delay-analysis', label: 'Delay Analysis' },
            { id: 'historical-data', label: 'Historical Data' },
            { id: 'about', label: 'About' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-2.5 py-1 rounded transition-all ${
                tab.active 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SUMMARY CARDS (6 REQUESTED CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Card 1: Active Trains */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>ACTIVE TRAINS</span>
            <Train className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-1.5">
            <span className="text-2xl font-black text-white">{activeTrainsCount}</span>
            <span className="text-[10px] text-cyan-400 ml-1.5">Trunk Fleet</span>
          </div>
          <span className="text-[10px] text-slate-400">Tracked in simulation</span>
        </div>

        {/* Card 2: On-Time Trains */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>ON-TIME TRAINS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-1.5">
            <span className="text-2xl font-black text-emerald-400">{onTimeTrainsCount}</span>
            <span className="text-[10px] text-emerald-300 ml-1.5">&le; 15 min</span>
          </div>
          <span className="text-[10px] text-slate-400">Punctuality tolerance</span>
        </div>

        {/* Card 3: Delayed Trains */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>DELAYED TRAINS</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-1.5">
            <span className="text-2xl font-black text-amber-400">{delayedTrainsCount}</span>
            <span className="text-[10px] text-amber-300 ml-1.5">&gt; 15 min</span>
          </div>
          <span className="text-[10px] text-slate-400">Subject to caution</span>
        </div>

        {/* Card 4: Active Conflicts */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>ACTIVE CONFLICTS</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="my-1.5">
            <span className="text-2xl font-black text-rose-400">{activeConflictsCount}</span>
            <span className="text-[10px] text-rose-300 ml-1.5">Critical</span>
          </div>
          <span className="text-[10px] text-slate-400">Headway & precedence</span>
        </div>

        {/* Card 5: Average Delay */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>AVERAGE DELAY</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-1.5">
            <span className="text-2xl font-black text-amber-300">+{avgDelay}</span>
            <span className="text-[10px] text-slate-400 ml-1">mins</span>
          </div>
          <span className="text-[10px] text-slate-400">Network mean</span>
        </div>

        {/* Card 6: Next Station ETA */}
        <div className="bg-cyan-950/40 p-3.5 rounded-xl border border-cyan-500/40 flex flex-col justify-between hover:border-cyan-400 transition-all font-mono">
          <div className="flex items-center justify-between text-cyan-300 text-[11px]">
            <span>NEXT STATION ETA</span>
            <Hourglass className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-1.5">
            <span className="text-sm font-black text-white block truncate">
              {imminentTrain?.train_number} @ {nextStationCode}
            </span>
            <span className="text-xs font-bold text-cyan-300 block">
              10:48 AM <span className="text-[10px] text-slate-400 font-normal">(+{imminentDelay}m)</span>
            </span>
          </div>
          <span className="text-[10px] text-cyan-200/80">Dynamic predicted</span>
        </div>

      </div>

      {/* 3. RAILWAY ROUTE VISUALIZATION */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 font-mono shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              NORTHERN-EASTERN TRUNK CORRIDOR TRACK SCHEMATIC
            </h2>
            <p className="text-xs text-slate-400">
              Interactive railway route showing stations, continuous track lines, and train movement indicators
            </p>
          </div>

          {/* Visual Indicators Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">INDICATORS:</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" style={{ animationDuration: '3s' }}></span>
              Running
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              Delayed
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
              Held
            </span>
            <span className="flex items-center gap-1 text-rose-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-400 animate-pulse"></span>
              Conflict
            </span>
          </div>
        </div>

        {/* Track Graphic Container */}
        <div className="relative py-12 px-4 overflow-x-auto min-w-[760px]">
          
          {/* Main Double Track Lines */}
          <div className="relative w-full h-10 flex items-center">
            {/* Railroad Sleepers pattern */}
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-30">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="w-1 h-8 bg-slate-600 rounded"></div>
              ))}
            </div>

            {/* Up Track (Cyan) */}
            <div className="absolute top-2 w-full h-1 bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
            
            {/* Down Track (Emerald) */}
            <div className="absolute bottom-2 w-full h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>

            {/* Station Nodes along the track */}
            {trunkStations.map((stn) => (
              <div 
                key={stn.code} 
                style={{ left: `${stn.percent}%` }}
                className="absolute transform -translate-x-1/2 flex flex-col items-center z-10"
              >
                {/* Signal Post / Station Node */}
                <div className="w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>

                {/* Station Code & Distance */}
                <div className="mt-3 text-center pointer-events-none">
                  <span className="text-[11px] font-bold text-slate-100 block">{stn.code}</span>
                  <span className="text-[9px] text-slate-400 block">{stn.name}</span>
                  <span className="text-[8px] text-slate-400 block">{stn.km} km</span>
                </div>
              </div>
            ))}

            {/* Train Tokens on the Route */}
            {routeTrains.map((tr) => {
              const isSelected = highlightedTrainNo === tr.train_number;
              
              // Style based on visual indicator category
              let badgeColor = "bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/50";
              let dotColor = "bg-emerald-400";
              let label = "RUNNING";

              if (tr.category === "conflict") {
                badgeColor = "bg-rose-600 text-white border-rose-400 shadow-rose-600/60 animate-pulse";
                dotColor = "bg-rose-500";
                label = "CONFLICT";
              } else if (tr.category === "held") {
                badgeColor = "bg-rose-800 text-rose-200 border-rose-600 shadow-rose-900/50";
                dotColor = "bg-rose-600";
                label = "HELD AT SIDING";
              } else if (tr.category === "delayed") {
                badgeColor = "bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/50";
                dotColor = "bg-amber-400";
                label = "DELAYED";
              }

              return (
                <div
                  key={tr.train_number}
                  onClick={() => {
                    setHighlightedTrainNo(tr.train_number);
                    onSelectTrain(tr);
                  }}
                  style={{ left: `${tr.percent}%` }}
                  className={`absolute -top-10 transform -translate-x-1/2 cursor-pointer transition-all z-20 group flex flex-col items-center ${
                    isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                  }`}
                >
                  {/* Train Token Box */}
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1.5 shadow-lg ${badgeColor} ${
                    isSelected ? 'ring-2 ring-cyan-300' : ''
                  }`}>
                    <Train className="w-3 h-3" />
                    <span>{tr.train_number}</span>
                    <span className="text-[9px] opacity-90">({tr.delay > 0 ? `+${tr.delay}m` : 'On-Time'})</span>
                  </div>

                  {/* Indicator Dot Dropping to Track */}
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 border border-slate-950 ${dotColor}`}></div>
                  
                  {/* Category Tag below */}
                  <span className="text-[8px] mt-0.5 px-1 rounded bg-slate-950/80 text-slate-300 border border-slate-800 whitespace-nowrap">
                    {label}
                  </span>
                </div>
              );
            })}

          </div>

        </div>

        {/* Track Footer Hint */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 mt-2">
          <span>Click on any train marker to update the Delay Reason Panel below.</span>
          <span className="text-cyan-400 font-bold">Currently Inspecting: Train {highlightedTrainNo}</span>
        </div>
      </div>

      {/* 4. DELAY REASON PANEL */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border-2 border-amber-500/40 rounded-xl p-5 shadow-2xl font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>DELAY REASON EXPLAINABILITY PANEL</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  {currentExplanation.root_cause_type}
                </span>
              </h3>
              <span className="text-xs text-slate-400">
                Machine Learning root cause breakdown for the selected train
              </span>
            </div>
          </div>

          {/* Selector to pick which train's delay reason to inspect */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">EXPLAIN TRAIN:</span>
            <select
              value={highlightedTrainNo}
              onChange={(e) => setHighlightedTrainNo(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-cyan-300 font-bold px-2.5 py-1 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="12802">12802 Purushottam (+46m)</option>
              <option value="BOXN-50102">BOXN-50102 Freight (+82m)</option>
              <option value="12004">12004 Shatabdi (+18m)</option>
              <option value="12301">12301 HWH Rajdhani (+14m)</option>
              <option value="22436">22436 Vande Bharat (+2m)</option>
            </select>
          </div>
        </div>

        {/* Big Delay & Reason Callout */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="text-sm font-bold text-white">
              Train <span className="text-cyan-300">{currentExplanation.train_number}</span> ({currentExplanation.name}) delayed by{' '}
              <span className="text-amber-400 text-base font-black">+{currentExplanation.delay_mins} minutes</span>
            </div>
            <span className="text-xs text-slate-400">Location: {currentExplanation.location}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div className="space-y-1">
              <span className="text-amber-400 font-bold block text-[11px] uppercase tracking-wider">
                &bull; Primary Delay Driver:
              </span>
              <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
                "{currentExplanation.primary_reason}"
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-cyan-400 font-bold block text-[11px] uppercase tracking-wider">
                &bull; Contributing Atmospheric & Line Factor:
              </span>
              <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
                "{currentExplanation.secondary_reason}"
              </p>
            </div>
          </div>

          {/* Dispatcher Recommendation */}
          <div className="bg-cyan-950/30 border border-cyan-800/50 p-3 rounded-lg text-xs flex items-start gap-2.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300">DISPATCHER RESOLUTION RECOMMENDATION: </span>
              <span className="text-slate-200">{currentExplanation.dispatcher_recommendation}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 5. TRAIN MONITORING SECTION (TABLE) */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 font-mono shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Train className="w-4 h-4 text-cyan-400" />
              TRAIN MONITORING TELEMETRY
            </h2>
            <p className="text-xs text-slate-400">
              Live status, scheduled vs predicted ETAs, delay accumulation, and active track conflicts
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            {monitoringData.length} Trains Monitored
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Train Number</th>
                <th className="p-3">Train Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Current Station</th>
                <th className="p-3">Next Station</th>
                <th className="p-3">Scheduled ETA</th>
                <th className="p-3">Predicted ETA</th>
                <th className="p-3">Delay</th>
                <th className="p-3">Status</th>
                <th className="p-3">Conflict Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {monitoringData.map((row) => {
                const isSelected = highlightedTrainNo === row.train_number;
                return (
                  <tr 
                    key={row.train_number}
                    onClick={() => {
                      setHighlightedTrainNo(row.train_number);
                      onSelectTrain(row.rawTrain);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-cyan-950/60 text-white' 
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="p-3 font-bold text-cyan-400">{row.train_number}</td>
                    <td className="p-3 font-bold text-white truncate max-w-[170px]">{row.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {row.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{row.current_station}</td>
                    <td className="p-3 text-cyan-300 font-semibold">{row.next_station}</td>
                    <td className="p-3 text-slate-400">{row.scheduled_eta}</td>
                    <td className="p-3 font-bold text-cyan-300">{row.predicted_eta}</td>
                    <td className="p-3">
                      <span className={`font-bold ${row.delay > 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {row.delay === 0 ? 'On Time' : `+${row.delay}m`}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.conflictColor}`}>
                        {row.conflict_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. QUICK ACTIONS PANEL */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 font-mono shadow-xl">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            CONTROL ROOM QUICK ACTIONS
          </h2>
          <span className="text-xs text-slate-400">Interactive Dispatch Shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          
          {/* Action 1: Start / Pause Replay */}
          <button
            onClick={onTogglePlay}
            className={`p-3 rounded-lg border font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-lg ${
              isPlaying 
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60' 
                : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isPlaying ? 'Pause Replay' : 'Start Replay'}</span>
          </button>

          {/* Action 2: View Conflicts */}
          <button
            onClick={() => onSelectTab('conflict-mgmt')}
            className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/50 hover:bg-rose-900/60 text-rose-300 font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-lg"
          >
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <span>View Conflicts ({activeConflictsCount})</span>
          </button>

          {/* Action 3: View Train Details */}
          <button
            onClick={() => onSelectTab('train-details')}
            className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500 text-slate-200 font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all"
          >
            <Train className="w-5 h-5 text-cyan-400" />
            <span>View Train Details</span>
          </button>

          {/* Action 4: View Analytics */}
          <button
            onClick={() => onSelectTab('delay-analysis')}
            className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500 text-slate-200 font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all"
          >
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <span>View Analytics</span>
          </button>

          {/* Action 5: Run ETA Prediction */}
          <button
            onClick={() => onSelectTab('eta-prediction')}
            className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-300 font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-lg col-span-2 sm:col-span-1"
          >
            <Hourglass className="w-5 h-5 text-cyan-400" />
            <span>Run ML ETA Simulator</span>
          </button>

        </div>
      </div>

    </div>
  );
}
