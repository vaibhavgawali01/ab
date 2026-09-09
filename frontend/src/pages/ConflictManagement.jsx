import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Train, 
  GitBranch, 
  Sliders, 
  Clock, 
  Radio, 
  RotateCcw,
  ArrowRight,
  Info
} from 'lucide-react';
import { resolveConflictAction } from '../services/api';

export default function ConflictManagement({ 
  conflicts = [], 
  onRefreshConflicts,
  onSelectTrain 
}) {
  const [resolvingId, setResolvingId] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  const handleResolve = async (conflictId, action) => {
    setResolvingId(conflictId);
    setActionSuccessMsg(null);
    try {
      const res = await resolveConflictAction(conflictId, action, `Dispatcher applied: ${action}`);
      if (res.success) {
        setActionSuccessMsg(`Resolution successfully executed: ${action}`);
        if (onRefreshConflicts) onRefreshConflicts();
      }
    } catch (err) {
      console.error("Failed to resolve conflict:", err);
    } finally {
      setResolvingId(null);
    }
  };

  const activeList = conflicts.filter(c => !c.resolved);
  const resolvedList = conflicts.filter(c => c.resolved);

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Page Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            TRACK CONFLICT DETECTION & RESOLUTION ADVISORY
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated spatial conflict identification: Headway violations, platform contention, and precedence management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800">
            {activeList.length} Active Conflicts
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            {resolvedList.length} Resolved
          </span>
        </div>
      </div>

      {/* Action Success Alert */}
      {actionSuccessMsg && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 p-3.5 rounded-xl text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setActionSuccessMsg(null)}
            className="text-slate-400 hover:text-white text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Conflicts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            PENDING OPERATIONAL CONFLICTS
          </h2>
          <span className="text-xs text-slate-400 font-mono">Requires Section Dispatcher Decision</span>
        </div>

        {activeList.length === 0 ? (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-white font-mono">All Track Conflicts Resolved</div>
            <p className="text-xs text-slate-400 mt-1">Section headways and platform schedules are within safe clearance limits.</p>
          </div>
        ) : (
          activeList.map((conflict) => {
            const isCritical = conflict.severity === 'Critical';
            const isResolving = resolvingId === conflict.id;

            return (
              <div 
                key={conflict.id}
                className={`p-5 rounded-xl border transition-all shadow-xl font-mono ${
                  isCritical 
                    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 border-rose-500/40 shadow-rose-950/20' 
                    : 'bg-slate-900/80 border-amber-500/40 shadow-amber-950/20'
                }`}
              >
                {/* Conflict Card Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{conflict.id}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-xs font-bold text-white tracking-wide">{conflict.conflict_type}</span>
                    <span className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded">
                      {conflict.corridor_code}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border self-start sm:self-auto ${
                    isCritical 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  }`}>
                    {conflict.severity.toUpperCase()}
                  </span>
                </div>

                {/* Location & Trains Involved */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">CONFLICT LOCATION</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{conflict.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">PRIMARY TRAIN (HIGHER PRIORITY)</span>
                    <span className="font-bold text-cyan-300 mt-0.5 block">{conflict.train_primary}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SECONDARY / TRAILING / CONFLICTING TRAIN</span>
                    <span className="font-bold text-amber-300 mt-0.5 block">{conflict.train_secondary}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 my-3 text-xs text-slate-300">
                  <span className="text-slate-400 font-bold">SITUATION: </span>
                  {conflict.description}
                </div>

                {/* Recommended Dispatcher Action & Quick Action Buttons */}
                <div className="bg-cyan-950/30 border border-cyan-800/50 p-3.5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3">
                  <div className="text-xs">
                    <span className="text-cyan-400 font-bold block mb-0.5">DISPATCHER RECOMMENDATION:</span>
                    <span className="text-slate-200">{conflict.recommended_action}</span>
                  </div>

                  {/* Resolution Buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResolve(conflict.id, "Execute Loop Line Diversion")}
                      disabled={isResolving}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold transition-all disabled:opacity-50"
                    >
                      Divert to Loop Line
                    </button>
                    <button
                      onClick={() => handleResolve(conflict.id, "Precedence Override (Hold Trailing)")}
                      disabled={isResolving}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold transition-all disabled:opacity-50"
                    >
                      Precedence Override
                    </button>
                    <button
                      onClick={() => handleResolve(conflict.id, "Issue Speed Advisory (75 km/h)")}
                      disabled={isResolving}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-bold transition-all border border-slate-700 disabled:opacity-50"
                    >
                      Speed Advisory
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolved Conflicts History */}
      {resolvedList.length > 0 && (
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 mt-6 font-mono">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            RESOLVED CONFLICT DISPATCH LOG
          </h3>
          <div className="space-y-2">
            {resolvedList.map(c => (
              <div key={c.id} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-white font-bold">{c.id} · {c.conflict_type}</span>
                    <span className="text-slate-400 ml-2">({c.location})</span>
                    <div className="text-[11px] text-emerald-300/90 mt-0.5">
                      Applied: {c.resolution_applied}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">{c.resolution_time || 'Just now'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
