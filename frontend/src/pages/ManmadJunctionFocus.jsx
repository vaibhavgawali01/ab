import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Layers, 
  MapPin, 
  Clock, 
  AlertOctagon, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  CloudSun, 
  CloudFog, 
  CloudRain, 
  CheckCircle2, 
  ChevronRight, 
  Send, 
  History, 
  Calendar, 
  RefreshCw,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  Ambulance,
  Ban,
  Wrench
} from 'lucide-react';

import ManmadStationSchematic from '../components/ManmadStationSchematic';
import ManmadRegionalMap from '../components/ManmadRegionalMap';
import { 
  fetchManmadOverview, 
  fetchManmadPlatforms, 
  fetchManmadConflicts, 
  overrideManmadConflict, 
  triggerManmadEmergency, 
  updateManmadWeather, 
  fetchManmadTomorrowTimetable,
  fetchManmadAuditLogs,
  fetchDynamicPlatformAssignments,
  reassignPlatform,
  simulatePlatformScenario
} from '../services/api';

export default function ManmadJunctionFocus() {
  const [overview, setOverview] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [activeConflictId, setActiveConflictId] = useState('MMR-CONF-01');
  const [tomorrowTimetable, setTomorrowTimetable] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [timetableSearch, setTimetableSearch] = useState('');
  const [timetableFilter, setTimetableFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Manual Override Form State
  const [selectedFavoredTrain, setSelectedFavoredTrain] = useState('');
  const [overrideReason, setOverrideReason] = useState('VIP Movement');
  const [controllerNotes, setControllerNotes] = useState('');
  const [isSubmittingOverride, setIsSubmittingOverride] = useState(false);
  const [overrideSuccessMsg, setOverrideSuccessMsg] = useState(null);

  // Weather simulation state
  const [simulatingWeather, setSimulatingWeather] = useState(false);

  const [dynamicAssignments, setDynamicAssignments] = useState([]);
  const [expandedTrainNo, setExpandedTrainNo] = useState('22222');
  const [platformActionMsg, setPlatformActionMsg] = useState(null);
  const [isSimulatingPf, setIsSimulatingPf] = useState(false);

  // Manual Reassignment Form State
  const [reassignTrainNo, setReassignTrainNo] = useState('22222');
  const [reassignTargetPf, setReassignTargetPf] = useState(3);
  const [reassignCustomReason, setReassignCustomReason] = useState('');
  const [isReassigning, setIsReassigning] = useState(false);

  // Load all MMR data
  const loadData = async () => {
    try {
      setLoading(true);
      const [ovData, pfData, cfData, ttData, alData, dynData] = await Promise.all([
        fetchManmadOverview(),
        fetchManmadPlatforms(),
        fetchManmadConflicts(),
        fetchManmadTomorrowTimetable(),
        fetchManmadAuditLogs(),
        fetchDynamicPlatformAssignments().catch(err => {
          console.error("Dynamic PF error:", err);
          return { assignments: [] };
        })
      ]);

      setOverview(ovData);
      setPlatforms(pfData.platforms || []);
      setConflicts(cfData.conflicts || []);
      setTomorrowTimetable(ttData.timetable || []);
      setAuditLogs(alData.audit_logs || cfData.audit_logs || []);
      setDynamicAssignments(dynData?.assignments || []);
    } catch (err) {
      console.error("Failed loading MMR data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeConflict = conflicts.find(c => c.id === activeConflictId) || conflicts[0] || null;

  // Handle Manual Controller Override
  const handleApplyOverride = async (e) => {
    e.preventDefault();
    if (!activeConflict) return;

    try {
      setIsSubmittingOverride(true);
      setOverrideSuccessMsg(null);

      const chosenTrain = selectedFavoredTrain || activeConflict.train_secondary.train_no;

      const res = await overrideManmadConflict({
        conflict_id: activeConflict.id,
        favored_train: chosenTrain,
        reason: overrideReason,
        controller_id: "SC-BHUSAWAL-04",
        notes: controllerNotes || "Precedence inverted by Section Controller on duty"
      });

      setOverrideSuccessMsg(res.message);
      // Reload conflicts to reflect changes
      await loadData();
    } catch (err) {
      alert("Override failed: " + err.message);
    } finally {
      setIsSubmittingOverride(false);
    }
  };

  // Handle Emergency Trigger
  const handleTriggerEmergency = async (scenarioType) => {
    try {
      const res = await triggerManmadEmergency(scenarioType);
      await loadData();
    } catch (err) {
      alert("Emergency trigger failed: " + err.message);
    }
  };

  // Handle Weather Toggle (Fog / Clear)
  const handleToggleWeather = async (isFog) => {
    try {
      setSimulatingWeather(true);
      await updateManmadWeather({
        visibility_meters: isFog ? 140 : 3400,
        condition: isFog ? "Dense Advection Fog" : "Clear / Light Haze",
        rainfall_mm: 0.0
      });
      await loadData();
    } catch (err) {
      console.error("Failed to update weather:", err);
    } finally {
      setSimulatingWeather(false);
    }
  };

  // Handle Dynamic Platform Scenario Simulation
  const handleSimulatePfScenario = async (scenarioKey) => {
    try {
      setIsSimulatingPf(true);
      setPlatformActionMsg(null);
      const res = await simulatePlatformScenario(scenarioKey);
      setPlatformActionMsg(res.message);
      await loadData();
    } catch (err) {
      alert("Platform simulation failed: " + err.message);
    } finally {
      setIsSimulatingPf(false);
    }
  };

  // Handle Manual Platform Reassignment with CSL validation
  const handleReassignTrain = async (e) => {
    e.preventDefault();
    try {
      setIsReassigning(true);
      setPlatformActionMsg(null);
      const res = await reassignPlatform({
        train_no: reassignTrainNo,
        new_platform: parseInt(reassignTargetPf, 10),
        reason: reassignCustomReason || "Manual Controller Discretionary Platform Change"
      });
      setPlatformActionMsg(res.message);
      await loadData();
    } catch (err) {
      alert("Reassignment failed: " + err.message);
    } finally {
      setIsReassigning(false);
    }
  };

  // Filtered timetable
  const filteredTimetable = tomorrowTimetable.filter(item => {
    const matchesSearch = item.train_no.toLowerCase().includes(timetableSearch.toLowerCase()) ||
                          item.train_name.toLowerCase().includes(timetableSearch.toLowerCase()) ||
                          item.destination.toLowerCase().includes(timetableSearch.toLowerCase());
    if (timetableFilter === 'ALL') return matchesSearch;
    if (timetableFilter === 'P1') return matchesSearch && item.priority_class.includes('P1');
    if (timetableFilter === 'P2') return matchesSearch && item.priority_class.includes('P2');
    if (timetableFilter === 'P3') return matchesSearch && item.priority_class.includes('P3');
    if (timetableFilter === 'KPG') return matchesSearch && (item.direction.includes('Kopargaon') || item.direction.includes('Daund'));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner & Scope */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                CENTRAL RAILWAY • BHUSAWAL DIVISION
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                STATION CODE: MMR (20.2498° N, 74.4384° E)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                6 PLATFORMS • 4 CONVERGING LINES
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Manmad Junction Operations & Two-Train Conflict Engine
            </h1>
            <p className="text-sm text-slate-400 max-w-4xl">
              Specialized single-station control room for Manmad Junction (MMR). Highlighting throat diamond interlocking,
              side-by-side multi-factor priority evaluation, dual distinct explainability, and manual Section Controller override.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh State</span>
          </button>
        </div>

        {/* Prototype Scope Banner Note */}
        <div className="mt-4 p-3 bg-slate-950/70 border border-amber-500/30 rounded-lg flex items-start gap-2.5 text-xs text-amber-200/90 font-mono">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>STATION SCOPE & DATA SOURCE:</strong> Manmad Junction (MMR) demo calibrated with historical timetable structures
            and IMD Nashik seasonal baselines. Clearly labeled <span className="text-amber-400 font-bold">[Synthetic Scenario Data]</span>.
            No live Indian Railways GPS or CRIS feeds are connected.
          </div>
        </div>
      </div>

      {/* 2. Key Station Metrics & Live Weather */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Platforms Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Platform Allocation</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            6 Platforms
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-mono">
            <span className="text-amber-400 font-semibold">{overview?.platform_summary?.occupied || 2} Occupied</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">{overview?.platform_summary?.clear || 3} Clear</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-semibold">{overview?.platform_summary?.reserved || 1} Reserved</span>
          </div>
        </div>

        {/* Converging Main Lines */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Converging Corridors</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            4 Main Routes
          </div>
          <div className="mt-2 text-xs text-slate-400 truncate">
            Bhusawal, Mumbai, Daund/KPG, Nanded
          </div>
        </div>

        {/* Active Conflict Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Interlocking Contention</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 flex items-center gap-2">
            <span>{conflicts.length} Active Conflict</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Point 14B Diamond Crossover Contention
          </div>
        </div>

        {/* IMD Nashik Weather */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg relative">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">IMD Nashik Weather</span>
            {overview?.weather?.fog_flag ? (
              <CloudFog className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : (
              <CloudSun className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {overview?.weather?.temperature_c || 28.4}°C
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Vis: {overview?.weather?.visibility_meters || 3400}m
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
            <span className={overview?.weather?.fog_flag ? "text-amber-400 font-bold" : "text-emerald-400"}>
              {overview?.weather?.fog_flag ? "⚠️ FOG ACTIVE (PSR 30 km/h)" : "Normal Track Speed"}
            </span>
            <button
              onClick={() => handleToggleWeather(!overview?.weather?.fog_flag)}
              disabled={simulatingWeather}
              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700 transition"
            >
              {overview?.weather?.fog_flag ? "Clear Fog" : "Simulate Fog"}
            </button>
          </div>
        </div>
      </div>

      {/* 3. DUAL VISUALS: Interlocking Schematic + Regional GIS Map */}
      <div className="space-y-4">
        {/* Custom SVG Interlocking Mimic Panel */}
        <ManmadStationSchematic platforms={platforms} activeConflict={activeConflict} />

        {/* Leaflet OpenStreetMap Regional Convergence Map */}
        <ManmadRegionalMap />
      </div>

      {/* 4. PLATFORM ASSIGNMENTS & THROUGH-LINE CLEARANCE PANEL */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Platform Infrastructure & Active Berthing Allocation
            </h3>
            <p className="text-xs text-slate-400">
              Manmad Junction (MMR) Platform 1 to 6 clear standing length (CSL), through-line clearance & approach routing
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            CSL Standard: 720m (Full 24-Coach Rake Capacity)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {platforms.map((pf) => {
            const isOccupied = pf.status === 'Occupied';
            const isReserved = pf.status.includes('Reserved');
            return (
              <div
                key={pf.platform_number}
                className={`p-3.5 rounded-lg border transition ${
                  isOccupied
                    ? 'bg-slate-950/80 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.08)]'
                    : isReserved
                    ? 'bg-slate-950/80 border-amber-500/40'
                    : 'bg-slate-950/40 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-extrabold text-white flex items-center gap-1.5">
                    Platform {pf.platform_number}
                    <span className="text-[10px] text-slate-500 font-normal">({pf.length_meters}m)</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isOccupied
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : isReserved
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {pf.status}
                  </span>
                </div>

                <div className="text-xs font-medium text-slate-300 mb-2">
                  {pf.line_type}
                </div>

                <div className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                  <span className="text-slate-500 font-semibold">Approach:</span> {pf.approach_direction}
                </div>

                {/* Train Info or Clearance */}
                {pf.current_train ? (
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
                    <div className="font-bold text-cyan-300 truncate">
                      🚆 {pf.current_train.train_no} {pf.current_train.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex justify-between">
                      <span>{pf.current_train.priority}</span>
                      <span className="text-emerald-400">Exp: {pf.current_train.expected_departure || pf.current_train.expected_arrival}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded bg-slate-900/40 border border-dashed border-slate-800 text-[11px] text-slate-500 font-mono text-center">
                    Through-Line Unobstructed • Ready for Signal Clearance
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4.5 DYNAMIC PLATFORM ASSIGNMENT & OPERATIONAL REASONING ENGINE */}
      <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-5 shadow-2xl relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  Dynamic Platform Assignment & Operational Reasoning Engine
                </h2>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  LIVE MMR ALLOCATIONS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time berthing optimization answering: <span className="text-cyan-300 italic">"Which train is coming to which platform and with what technical reason?"</span>
              </p>
            </div>
          </div>

          {/* Quick Scenario Simulators */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSimulatePfScenario('pf1_blocked')}
              disabled={isSimulatingPf}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition"
              title="Simulate Track Circuit Failure on Down Main PF 1 and reroute Rajdhani 22222 to PF 3 Loop"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate PF 1 Track Circuit Fault</span>
            </button>
            <button
              onClick={() => handleSimulatePfScenario('reset')}
              disabled={isSimulatingPf}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingPf ? 'animate-spin' : ''}`} />
              <span>Reset Standard Platforms</span>
            </button>
          </div>
        </div>

        {platformActionMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{platformActionMsg}</span>
            </div>
            <button onClick={() => setPlatformActionMsg(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {/* Dynamic Assignment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {dynamicAssignments.map((item) => {
            const isExpanded = expandedTrainNo === item.train_no;
            const isSpecialRake = item.train_type === 'FREIGHT' || item.train_type === 'PREMIUM_EXP';

            return (
              <div
                key={item.train_no}
                className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                  isExpanded 
                    ? 'bg-slate-950 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50' 
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Header: Train Info & Target Platform Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          item.priority.includes('P1') 
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                            : item.priority.includes('P2')
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : item.priority.includes('P3')
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.length_coaches_or_wagons}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white font-mono flex items-center gap-1.5">
                        <span>{item.train_no}</span>
                        <span className="text-slate-200 text-xs font-sans font-semibold truncate max-w-[150px]">
                          {item.train_name}
                        </span>
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className="px-2.5 py-1 rounded-lg bg-cyan-600/30 border border-cyan-400 text-cyan-200 font-mono font-extrabold text-xs shadow-sm">
                        PF {item.assigned_platform}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        ETA: {item.eta_manmad}
                      </span>
                    </div>
                  </div>

                  {/* Approach & Physical CSL specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono my-2.5 p-2 rounded bg-slate-900/80 border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Corridor</span>
                      <span className="text-slate-300 font-semibold truncate block">{item.approach_corridor}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Rake / CSL</span>
                      <span className="text-emerald-400 font-semibold truncate block">{item.rake_length_meters}m / {item.platform_csl_meters}m</span>
                    </div>
                  </div>

                  {/* Primary Reason Callout */}
                  <div className="p-2 rounded bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200/90 leading-relaxed mb-3">
                    <strong className="text-cyan-300 block text-[10px] font-mono uppercase mb-0.5">
                      Operational Assignment Reason:
                    </strong>
                    {item.primary_reason}
                  </div>
                </div>

                {/* Expansion Toggle for Full Technical Rationale */}
                <div>
                  <button
                    onClick={() => setExpandedTrainNo(isExpanded ? null : item.train_no)}
                    className="w-full py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white flex items-center justify-between transition"
                  >
                    <span>{isExpanded ? 'Hide Technical Rationale' : 'View Full Operational Rationale'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90 text-cyan-400' : ''}`} />
                  </button>

                  {/* Expandable Technical Rationale Breakdown */}
                  {isExpanded && (
                    <div className="mt-2.5 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2.5 animate-fadeIn">
                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">1. Track Geometry & Speed</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">{item.operational_rationale.track_geometry}</div>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">2. Clear Standing Length (CSL)</div>
                        <div className="text-[11px] text-emerald-300 mt-0.5">{item.operational_rationale.csl_validation}</div>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">3. Turnout & Crossing Conflict Minimization</div>
                        <div className="text-[11px] text-amber-300 mt-0.5">{item.operational_rationale.throat_point_conflict}</div>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">4. Downstream Cascade Protection</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">{item.operational_rationale.downstream_cascade}</div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">
                          Interlocking: <span className="text-slate-200">{item.route_locking_code}</span>
                        </span>
                        <span className="text-amber-400">
                          Alt PF: <span className="font-bold">Platform {item.alternative_platform}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Manual Reassignment Console */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
              Dynamic Platform Reassignment Console (Section Controller)
            </h4>
          </div>
          <form onSubmit={handleReassignTrain} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">Select Incoming Train:</label>
              <select
                value={reassignTrainNo}
                onChange={(e) => setReassignTrainNo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              >
                {dynamicAssignments.map(t => (
                  <option key={t.train_no} value={t.train_no}>
                    {t.train_no} - {t.train_name} (Current: PF {t.assigned_platform})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">Target Platform (1-6):</label>
              <select
                value={reassignTargetPf}
                onChange={(e) => setReassignTargetPf(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              >
                <option value={1}>Platform 1 (650m - Down Main)</option>
                <option value={2}>Platform 2 (650m - Up Main)</option>
                <option value={3}>Platform 3 (620m - Common Loop)</option>
                <option value={4}>Platform 4 (600m - Daund Chord)</option>
                <option value={5}>Platform 5 (580m - Nanded Branch)</option>
                <option value={6}>Platform 6 (720m - Freight / Goods)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">Operational Justification:</label>
              <input
                type="text"
                placeholder="e.g., Track maintenance on PF 1..."
                value={reassignCustomReason}
                onChange={(e) => setReassignCustomReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isReassigning}
                className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Validate & Reassign</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 5. CENTERPIECE: TWO-TRAIN CONFLICT RESOLUTION ENGINE */}
      {activeConflict && (
        <div className="bg-slate-900/90 border-2 border-rose-500/40 rounded-xl p-5 shadow-2xl relative">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                    Centerpiece: Two-Train Interlocking Conflict Resolution Engine
                  </h2>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {activeConflict.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {activeConflict.title} | Location: <span className="text-slate-200 font-mono">{activeConflict.location}</span>
                </p>
              </div>
            </div>

            {/* Emergency Badges if Active */}
            {activeConflict.is_emergency && (
              <div className="px-3 py-1 rounded bg-rose-600/30 text-rose-200 border border-rose-500 text-xs font-mono font-bold flex items-center gap-1.5 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{activeConflict.emergency_type || 'ACTIVE EMERGENCY'}</span>
              </div>
            )}
          </div>

          {/* Both Contending Trains Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Train A (Primary) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  TRAIN A (PREMIUM FLAGSHIP)
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Speed: {activeConflict.train_primary.speed_kmh} km/h
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white font-mono">
                {activeConflict.train_primary.train_no} - {activeConflict.train_primary.name}
              </h3>
              <div className="text-xs text-slate-400 mt-1">
                {activeConflict.train_primary.origin} → {activeConflict.train_primary.destination}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Priority Class</span>
                  <span className="text-cyan-400 font-bold">{activeConflict.train_primary.priority_class}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Current Delay</span>
                  <span className="text-amber-400 font-bold">+{activeConflict.train_primary.current_delay_min} min</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Approach Route</span>
                  <span className="text-slate-300 truncate">{activeConflict.train_primary.approach}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Berth Target</span>
                  <span className="text-emerald-400 font-bold">Platform {activeConflict.train_primary.assigned_platform}</span>
                </div>
              </div>
            </div>

            {/* Train B (Secondary) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  TRAIN B (CONVERGING CORRIDOR)
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Speed: {activeConflict.train_secondary.speed_kmh} km/h
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white font-mono">
                {activeConflict.train_secondary.train_no} - {activeConflict.train_secondary.name}
              </h3>
              <div className="text-xs text-slate-400 mt-1">
                {activeConflict.train_secondary.origin} → {activeConflict.train_secondary.destination}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Priority Class</span>
                  <span className="text-amber-400 font-bold">{activeConflict.train_secondary.priority_class}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Current Delay</span>
                  <span className="text-rose-400 font-bold">+{activeConflict.train_secondary.current_delay_min} min</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Approach Route</span>
                  <span className="text-slate-300 truncate">{activeConflict.train_secondary.approach}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Berth Target</span>
                  <span className="text-slate-300">Platform {activeConflict.train_secondary.assigned_platform}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6 PRIORITY FACTORS SIDE-BY-SIDE COMPARISON TABLE */}
          <div className="mb-6 overflow-x-auto">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                6-Factor Side-by-Side Priority Matrix
              </h4>
              <span className="text-xs font-mono text-slate-500">
                Evaluation weights based on Indian Railways Operating Manual
              </span>
            </div>

            <table className="w-full text-xs text-left border-collapse border border-slate-800 bg-slate-950/70 font-mono">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-300">
                  <th className="p-3 w-1/4">Evaluation Factor & Weight</th>
                  <th className="p-3 w-1/4 text-cyan-400">Train A (22222 Rajdhani)</th>
                  <th className="p-3 w-1/4 text-amber-400">Train B (11078 Jhelum)</th>
                  <th className="p-3 w-1/4 text-emerald-400">Engine Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeConflict.six_factors_comparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-semibold text-slate-200">
                      <div>{row.factor}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Impact Weight: {row.weight}</div>
                    </td>
                    <td className="p-3 text-slate-300 bg-cyan-950/10">
                      {row.train_a_val}
                    </td>
                    <td className="p-3 text-slate-300 bg-amber-950/10">
                      {row.train_b_val}
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 mb-1">
                        Advantage: {row.advantage}
                      </span>
                      <p className="text-[10px] text-slate-400 leading-tight font-sans">
                        {row.rationale}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PRECEDENCE DECISION CALLOUT */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Precedence Awarded
                </span>
                <h4 className="text-xl font-extrabold text-white mt-1 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {activeConflict.precedence_decision.favored_train}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                  {activeConflict.precedence_decision.action_summary}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <div className="text-slate-500 text-[10px]">Held Train Regulated Delay</div>
                  <div className="text-amber-400 font-bold text-sm">+{activeConflict.precedence_decision.estimated_delay_addition_held_min} min</div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <div className="text-slate-500 text-[10px]">Mainline Delay Prevented</div>
                  <div className="text-emerald-400 font-bold text-sm">-{activeConflict.precedence_decision.estimated_delay_saved_favored_min} min</div>
                </div>
              </div>
            </div>
          </div>

          {/* DUAL DISTINCT EXPLAINABILITY (MANDATORY: DO NOT MERGE) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Explainability 1: Why did it happen? */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
              <div className="flex items-center gap-2 mb-2 text-cyan-400">
                <AlertCircleIcon className="w-4 h-4" />
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  1. Why Did This Conflict Happen?
                </h4>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                {activeConflict.explainability.why_did_it_happen}
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-mono">
                Root Cause: Inversion of scheduled slot arrival caused by upstream section delay and intersecting throat point machine.
              </div>
            </div>

            {/* Explainability 2: Why was this train given precedence? */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  2. Why Was This Train Given Precedence?
                </h4>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                {activeConflict.explainability.why_this_decision}
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-mono">
                Regulatory Basis: Central Railway Operating Rule 4.14 (Golden Quadrilateral feeder protection & loop standing length clearance).
              </div>
            </div>
          </div>

          {/* MANUAL SECTION CONTROLLER OVERRIDE PANEL */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Manual Section Controller Precedence Override
                </h4>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">
                Operator: SC-BHUSAWAL-04 (Authorized)
              </span>
            </div>

            <form onSubmit={handleApplyOverride} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Award Precedence To:
                </label>
                <select
                  value={selectedFavoredTrain}
                  onChange={(e) => setSelectedFavoredTrain(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Default Recommendation ({activeConflict.precedence_decision.favored_train})</option>
                  <option value={activeConflict.train_secondary.train_no}>
                    REVERSE: {activeConflict.train_secondary.train_no} {activeConflict.train_secondary.name} (P3)
                  </option>
                  <option value={activeConflict.train_primary.train_no}>
                    RETAIN: {activeConflict.train_primary.train_no} {activeConflict.train_primary.name} (P1)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Override Justification (Required for Audit):
                </label>
                <select
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="VIP Movement">VIP Movement</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Planned Engineering Block">Planned Engineering Block</option>
                  <option value="Local Station Master / Controller Instruction">Local Station Master / Controller Instruction</option>
                  <option value="Track Integrity / Caution Order">Track Integrity / Caution Order</option>
                  <option value="Other Operational Grounds">Other Operational Grounds</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Optional log note..."
                  value={controllerNotes}
                  onChange={(e) => setControllerNotes(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={isSubmittingOverride}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Override</span>
                </button>
              </div>
            </form>

            {overrideSuccessMsg && (
              <div className="mt-3 p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                ✓ {overrideSuccessMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. EMERGENCY SCENARIO SANDBOX */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Emergency & Contingency Scenario Sandbox
            </h3>
            <p className="text-xs text-slate-400">
              Test dynamic interlocking re-evaluation under critical railway operating contingencies
            </p>
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-500/30">
            DISASTER MANAGEMENT PROTOCOL 6.02
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleTriggerEmergency('medical_emergency')}
            className="p-3 rounded-lg bg-slate-950 border border-rose-500/40 hover:border-rose-400 text-left transition group"
          >
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono mb-1">
              <Ambulance className="w-4 h-4" />
              <span>1. Medical Emergency Aboard</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Overrides Rajdhani priority. Grants immediate route to Platform 2 for trackside ambulance.
            </p>
          </button>

          <button
            onClick={() => handleTriggerEmergency('track_obstruction')}
            className="p-3 rounded-lg bg-slate-950 border border-amber-500/40 hover:border-amber-400 text-left transition group"
          >
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono mb-1">
              <Ban className="w-4 h-4" />
              <span>2. Track Obstruction (Km 258)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Simulates boulder/rail fracture. Sets all signals to Danger and halts both trains.
            </p>
          </button>

          <button
            onClick={() => handleTriggerEmergency('engineering_block')}
            className="p-3 rounded-lg bg-slate-950 border border-blue-500/40 hover:border-blue-400 text-left transition group"
          >
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold font-mono mb-1">
              <Wrench className="w-4 h-4" />
              <span>3. Planned Engineering Block</span>
            </div>
            <p className="text-[11px] text-slate-400">
              OHE maintenance power block on Up Main. Re-routes traffic through loop lines.
            </p>
          </button>

          <button
            onClick={() => handleTriggerEmergency('clear')}
            className="p-3 rounded-lg bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 text-left transition group"
          >
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono mb-1">
              <RefreshCw className="w-4 h-4" />
              <span>4. Reset Baseline Normal</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Restores baseline ML two-train conflict resolution model with standard parameters.
            </p>
          </button>
        </div>
      </div>

      {/* 7. CONTROLLER AUDIT LOGS */}
      {auditLogs.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Section Controller Override Audit Trail (Historical Log)
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {auditLogs.length} Entries Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono bg-slate-950 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Log ID</th>
                  <th className="p-2.5">Timestamp (UTC)</th>
                  <th className="p-2.5">Controller</th>
                  <th className="p-2.5">Conflict ID</th>
                  <th className="p-2.5">Decision Change</th>
                  <th className="p-2.5">Audit Reason</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.log_id} className="hover:bg-slate-900/40">
                    <td className="p-2.5 text-cyan-400 font-bold">{log.log_id}</td>
                    <td className="p-2.5 text-slate-400">{log.timestamp}</td>
                    <td className="p-2.5 text-slate-300">{log.controller_id}</td>
                    <td className="p-2.5 text-slate-300">{log.conflict_id}</td>
                    <td className="p-2.5 text-white">
                      <span className="line-through text-slate-500 mr-1.5">{log.original_favored}</span>
                      <ArrowRight className="w-3 h-3 inline text-emerald-400 mr-1.5" />
                      <strong className="text-emerald-400">{log.new_favored}</strong>
                    </td>
                    <td className="p-2.5 text-amber-300">{log.override_reason}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. TOMORROW'S SCHEDULED TIMETABLE FOR MANMAD JUNCTION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Tomorrow's Scheduled Timetable - Manmad Junction (MMR)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                [Static Scheduled Timetable - Not ML]
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Forward-looking 24-hour cycle sorted chronologically with platform berthing and approach corridors
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search train no / name..."
              value={timetableSearch}
              onChange={(e) => setTimetableSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs font-mono">
              <button
                onClick={() => setTimetableFilter('ALL')}
                className={`px-2 py-0.5 rounded ${timetableFilter === 'ALL' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setTimetableFilter('P1')}
                className={`px-2 py-0.5 rounded ${timetableFilter === 'P1' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
              >
                P1 (Raj/VB)
              </button>
              <button
                onClick={() => setTimetableFilter('KPG')}
                className={`px-2 py-0.5 rounded ${timetableFilter === 'KPG' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
              >
                KPG / Daund
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono bg-slate-950 rounded-lg overflow-hidden">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Train No.</th>
                <th className="p-2.5">Train Name</th>
                <th className="p-2.5">Route</th>
                <th className="p-2.5">Priority</th>
                <th className="p-2.5">Arrival</th>
                <th className="p-2.5">Departure</th>
                <th className="p-2.5">Halt</th>
                <th className="p-2.5 text-center">Assigned PF</th>
                <th className="p-2.5">Track Section</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTimetable.map((t) => (
                <tr key={t.train_no} className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-cyan-400 font-bold">{t.train_no}</td>
                  <td className="p-2.5 text-white font-semibold">{t.train_name}</td>
                  <td className="p-2.5 text-slate-400 truncate max-w-xs">{t.origin} → {t.destination}</td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority_class.includes('P1')
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : t.priority_class.includes('P2')
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : t.priority_class.includes('P3')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {t.priority_class}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-300">{t.scheduled_arrival}</td>
                  <td className="p-2.5 text-slate-300">{t.scheduled_departure}</td>
                  <td className="p-2.5 text-slate-400">{t.halt_duration_min} min</td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 rounded font-extrabold text-white bg-slate-800 border border-slate-700">
                      PF {t.assigned_platform}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-400 truncate max-w-xs">{t.track_section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Fallback icon
function AlertCircleIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
