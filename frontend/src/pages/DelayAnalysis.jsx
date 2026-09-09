import React from 'react';
import { 
  BarChart3, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  CloudFog, 
  Sliders, 
  Activity, 
  ShieldCheck, 
  TrendingUp,
  GitPullRequest
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export default function DelayAnalysis({ analytics }) {
  const delayCauses = analytics?.delay_causes || [
    { cause: "Weather & Fog", percentage: 34.0, impact_hours: 142.5, color: "#38bdf8" },
    { cause: "Section Congestion", percentage: 28.5, impact_hours: 119.4, color: "#f59e0b" },
    { cause: "Precedence Holds", percentage: 18.0, impact_hours: 75.4, color: "#ec4899" },
    { cause: "Track Maintenance", percentage: 12.5, impact_hours: 52.3, color: "#a855f7" },
    { cause: "Signaling Checks", percentage: 7.0, impact_hours: 29.3, color: "#10b981" }
  ];

  const bottlenecks = analytics?.top_bottlenecks || [
    { station: "Kanpur Central (CNB)", zone: "NCR", delay_index: 89, avg_dwell_excess_mins: 24, reason: "Diamond crossing conflicts & terminal platform constraints" },
    { station: "Pt. Deen Dayal Upadhyaya (DDU)", zone: "ECR", delay_index: 82, avg_dwell_excess_mins: 19, reason: "Freight yard convergence & crew change dwell" },
    { station: "Ghaziabad (GZB)", zone: "NR", delay_index: 76, avg_dwell_excess_mins: 16, reason: "Suburban peak traffic & quad-track merging" },
    { station: "Mathura Junction (MTJ)", zone: "NCR", delay_index: 68, avg_dwell_excess_mins: 12, reason: "Bifurcation between Mumbai and South-bound routes" }
  ];

  // Waterfall delay cascade propagation
  const cascadeStages = [
    { stage: "Initial Fog Slowdown", delay: 18, cumulative: 18, color: "#38bdf8" },
    { stage: "Section IBS Signal Check", delay: 8, cumulative: 26, color: "#f59e0b" },
    { stage: "Kanpur Yard Congestion Hold", delay: 16, cumulative: 42, color: "#ef4444" },
    { stage: "Downstream Platform Wait", delay: 10, cumulative: 52, color: "#ec4899" },
    { stage: "High-Speed Section Recovery", delay: -6, cumulative: 46, color: "#10b981" }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            NETWORK DELAY ATTRIBUTION & BOTTLENECK ANALYSIS
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Deconstructing operational delays into root causes, station choke points, and cascade delay trees.
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1.5 rounded-lg border border-cyan-800">
          DATASET: HISTORICAL TIMETABLE LOGS
        </span>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cause Attribution Bar Chart */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              ROOT CAUSE FACTOR IMPACT (HOURS LOST)
            </h2>
            <p className="text-xs text-slate-400">Total hours of train delay accumulated by category</p>
          </div>

          <div className="h-64 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayCauses} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis dataKey="cause" type="category" stroke="#94a3b8" fontSize={10} fontFamily="monospace" width={110} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(val) => [`${val} hours`, 'Impact']}
                />
                <Bar dataKey="impact_hours" radius={[0, 4, 4, 0]}>
                  {delayCauses.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Primary Cause: Weather/Dense Fog (34.0%)</span>
            <span>Secondary: Section Congestion (28.5%)</span>
          </div>
        </div>

        {/* Cascade Propagation Simulation */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-emerald-400" />
              DELAY PROPAGATION CASCADE (RECOVERY SLACK)
            </h2>
            <p className="text-xs text-slate-400">How an initial 18-minute fog event cascades along a 1400 km run</p>
          </div>

          <div className="space-y-2.5 my-4 font-mono text-xs">
            {cascadeStages.map((stage, idx) => (
              <div key={idx} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 font-semibold">{stage.stage}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`font-bold ${stage.delay < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {stage.delay < 0 ? `${stage.delay}m` : `+${stage.delay}m`}
                  </span>
                  <span className="text-slate-400 text-[11px] w-20 text-right">
                    Total: <strong className="text-white">+{stage.cumulative}m</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Net Terminal Delay: +46 mins</span>
            <span className="text-emerald-400 font-bold">Recovery Slack Active</span>
          </div>
        </div>

      </div>

      {/* Critical Station Bottleneck Rankings */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              HIGH-IMPACT JUNCTION BOTTLENECK RANKINGS
            </h2>
            <p className="text-xs text-slate-400">Junctions with highest dwell excess and diamond crossing contention</p>
          </div>
          <span className="text-xs font-mono text-slate-400">North Central & Eastern Railway</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {bottlenecks.map((b) => (
            <div key={b.station} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                  <span className="font-bold text-white text-xs">{b.station}</span>
                  <span className="text-[10px] bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded">{b.zone}</span>
                </div>

                <div className="space-y-1.5 text-slate-300 text-[11px] my-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Congestion Score:</span>
                    <span className="text-rose-400 font-bold">{b.delay_index}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Excess Dwell:</span>
                    <span className="text-amber-400 font-bold">+{b.avg_dwell_excess_mins} mins</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-800/60 pt-2">
                  {b.reason}
                </p>
              </div>

              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${b.delay_index}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
