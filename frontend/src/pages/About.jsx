import React from 'react';
import { 
  HelpCircle, 
  ShieldAlert, 
  Cpu, 
  Database, 
  GitBranch, 
  CheckCircle2, 
  Info, 
  Layers, 
  FileCode,
  Train
} from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6 pb-12 font-sans max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Train className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">ABOUT TRACKPULSE</h1>
            <p className="text-xs text-slate-400">
              Prototype Operational Decision Support & Delay Prediction System for Indian Railways.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Mandatory Prototype Disclaimer */}
      <div className="bg-gradient-to-br from-amber-950/50 via-slate-900 to-amber-950/30 border-2 border-amber-500/50 p-6 rounded-xl shadow-2xl relative">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-bold text-amber-300 font-mono tracking-wide uppercase">
              Mandatory Operational Disclaimer: Prototype & Simulation Environment
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong>TrackPulse is a prototype system created exclusively for research, operational modeling, and demonstration purposes.</strong>
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside font-mono">
              <li>
                <strong>No Live GPS or Official Feed:</strong> TrackPulse does <em>not</em> connect to live Indian Railways GPS locators, CRIS (Centre for Railway Information Systems), FOIS (Freight Operations Information System), or COA (Control Office Application) feeds.
              </li>
              <li>
                <strong>Historical & Simulated Telemetry:</strong> All train positions, block occupancies, and signal aspects are simulated algorithmically from official public timetable structures and physical headway parameters.
              </li>
              <li>
                <strong>Decision Support Concept:</strong> Predictive algorithms and conflict alerts are computational prototypes designed to illustrate potential machine learning benefits for section controllers and dispatchers.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* System Objectives & Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3 font-mono">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            CORE PROTOTYPE CAPABILITIES
          </h3>
          <ul className="text-xs text-slate-300 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>ML Delay Prediction:</strong> Gradient Boosted Regression predicting terminal and sectional delay based on time of day, weather, visibility, and track utilization.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Explainable AI (XAI):</strong> Additive feature attribution detailing <em>why</em> a train is delayed (e.g., dense fog impact, yard congestion, speed restrictions).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Dynamic ETA Engine:</strong> Continuous arrival time recalculation factoring in sectional recovery slack and track speed caps.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Spatial Conflict Detector:</strong> Real-time detection of headway compression, platform overlaps, and precedence inversions.</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3 font-mono">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            TECHNICAL ARCHITECTURE
          </h3>
          <ul className="text-xs text-slate-300 space-y-2.5">
            <li className="flex items-start gap-2">
              <FileCode className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Frontend:</strong> React 18, Vite, Tailwind CSS with Railway Control Room Dark Slate theme, Lucide Icons, Recharts telemetry charts, and custom SVG Indian Railways spatial route visualizer.</span>
            </li>
            <li className="flex items-start gap-2">
              <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Backend API:</strong> Python FastAPI, Pydantic v2 schemas, REST endpoints (`/trains`, `/routes`, `/stations`, `/replay`, `/predict-delay`, `/calculate-eta`, `/conflicts`, `/analytics`).</span>
            </li>
            <li className="flex items-start gap-2">
              <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Data & Persistence:</strong> PostgreSQL with seamless embedded SQLite fallback and Indian Railways historical timetable registry.</span>
            </li>
            <li className="flex items-start gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Machine Learning:</strong> Pure-Python Gradient Boosted regression ensemble and SHAP-inspired explainability attribution engine.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Railway Domain Logic */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          INDIAN RAILWAYS OPERATIONAL LOGIC EMULATION
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-300 pt-2">
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <strong className="text-cyan-300 block mb-1">Precedence Priority</strong>
            Higher priority trains (Vande Bharat P1, Rajdhani P1, Shatabdi P2) are given through green signal clearance; freight and passenger trains are held at loop lines.
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <strong className="text-amber-300 block mb-1">Fog Safety Protocol</strong>
            Under visibility &lt; 200m, automatic block speed caps are enforced to preserve safe driver optical braking distance, generating realistic seasonal delays.
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <strong className="text-emerald-300 block mb-1">Schedule Recovery Slack</strong>
            Indian Railways timetables feature built-in engineering slack (10-15 mins) before major terminals, simulated in our ETA calculation algorithm.
          </div>
        </div>
      </div>

    </div>
  );
}
