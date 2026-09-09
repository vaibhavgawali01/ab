import React, { useState } from 'react';
import { 
  Hourglass, 
  Cpu, 
  CloudFog, 
  Sun, 
  CloudRain, 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  Layers, 
  Info,
  Clock,
  Gauge
} from 'lucide-react';
import { predictTrainDelay, calculateUpdatedETA } from '../services/api';

export default function ETAPrediction({ trains = [], stations = [], prefilledTrainNumber }) {
  const [trainNumber, setTrainNumber] = useState(prefilledTrainNumber || '12301');
  const [currentStation, setCurrentStation] = useState('PRYJ');
  const [destStation, setDestStation] = useState('NDLS');
  const [depHour, setDepHour] = useState(3);
  const [dayOfWeek, setDayOfWeek] = useState('Friday');
  const [weather, setWeather] = useState('Dense Fog');
  const [visibilityMeters, setVisibilityMeters] = useState(150);
  const [congestionLevel, setCongestionLevel] = useState('High');
  const [tsrSpeed, setTsrSpeed] = useState(90);

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [etaResult, setEtaResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Run ML Delay Prediction
      const predData = await predictTrainDelay({
        train_number: trainNumber,
        current_station: currentStation,
        destination_station: destStation,
        departure_hour: parseInt(depHour),
        day_of_week: dayOfWeek,
        weather: weather,
        visibility_meters: parseInt(visibilityMeters),
        congestion_level: congestionLevel,
        temporary_speed_restriction_kmh: parseInt(tsrSpeed)
      });
      setPredictionResult(predData);

      // 2. Run Dynamic Updated ETA Calculation
      const etaData = await calculateUpdatedETA({
        train_number: trainNumber,
        current_km: 812, // PRYJ distance
        destination_station: destStation,
        current_speed_kmh: tsrSpeed,
        baseline_scheduled_arrival: "10:05",
        weather_condition: weather,
        simulated_delay_mins: predData.predicted_delay_mins
      });
      setEtaResult(etaData);

    } catch (err) {
      console.error("Prediction error:", err);
      setError("Failed to generate delay prediction. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Page Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-cyan-400" />
            DYNAMIC ETA & ML DELAY PREDICTION ENGINE
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Machine Learning regression powered by historical operational patterns, sectional congestion, and visibility factors.
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1.5 rounded-lg border border-cyan-800 flex items-center gap-1.5 self-start md:self-auto">
          <Cpu className="w-3.5 h-3.5" />
          <span>Gradient Boosted Ensemble Regressor</span>
        </span>
      </div>

      {/* Main Grid: Form Controls vs. Results & Explainability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Parameters Form */}
        <div className="lg:col-span-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              OPERATIONAL SIMULATION PARAMETERS
            </h2>
            <p className="text-[11px] text-slate-400">Tweak environmental and corridor conditions</p>
          </div>

          <form onSubmit={handlePredict} className="space-y-3.5 text-xs font-mono">
            
            {/* Train Selection */}
            <div>
              <label className="text-slate-400 block mb-1">TRAIN SERVICE:</label>
              <select
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-cyan-500"
              >
                {trains.map(t => (
                  <option key={t.train_number} value={t.train_number}>
                    {t.train_number} — {t.name} ({t.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Current & Destination Station */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">CURRENT LOCATION:</label>
                <select
                  value={currentStation}
                  onChange={(e) => setCurrentStation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {stations.map(s => (
                    <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">DESTINATION:</label>
                <select
                  value={destStation}
                  onChange={(e) => setDestStation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {stations.map(s => (
                    <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Departure Hour & Day */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">DEPARTURE HOUR (0-23):</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={depHour}
                  onChange={(e) => setDepHour(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">DAY OF RUN:</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Weather & Optical Visibility */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">WEATHER CONDITION:</label>
                <select
                  value={weather}
                  onChange={(e) => {
                    setWeather(e.target.value);
                    if (e.target.value === 'Dense Fog') setVisibilityMeters(150);
                    else if (e.target.value === 'Moderate Fog') setVisibilityMeters(400);
                    else if (e.target.value === 'Rain') setVisibilityMeters(800);
                    else setVisibilityMeters(2500);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-amber-300 font-semibold focus:outline-none focus:border-cyan-500"
                >
                  <option value="Clear">Clear Sky</option>
                  <option value="Rain">Rain / Wet Track</option>
                  <option value="Moderate Fog">Moderate Fog</option>
                  <option value="Dense Fog">Dense Winter Fog</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">VISIBILITY (METERS):</label>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  step="50"
                  value={visibilityMeters}
                  onChange={(e) => setVisibilityMeters(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Section Congestion & Speed Restriction */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">LINE CONGESTION:</label>
                <select
                  value={congestionLevel}
                  onChange={(e) => setCongestionLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Low">Low (&lt; 60% Capacity)</option>
                  <option value="Moderate">Moderate (60-80%)</option>
                  <option value="High">High (80-110%)</option>
                  <option value="Severe">Severe / Saturated (&gt; 110%)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">TSR SPEED CAP (KM/H):</label>
                <input
                  type="number"
                  min="30"
                  max="130"
                  step="5"
                  value={tsrSpeed}
                  onChange={(e) => setTsrSpeed(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Computing Inference & Updated ETA...</span>
                  </span>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>CALCULATE DELAY & UPDATED ETA</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Prediction Outcome & Feature Explainability */}
        <div className="lg:col-span-7 space-y-6">
          
          {predictionResult ? (
            <div className="space-y-4">
              
              {/* ETA & Delay Result Header Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#071527] p-5 rounded-xl border border-cyan-500/40 shadow-2xl relative overflow-hidden font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                      PREDICTION RESULT · {predictionResult.train_number}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {predictionResult.train_name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                      predictionResult.delay_severity.includes('Substantial') 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : predictionResult.delay_severity.includes('Moderate')
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {predictionResult.delay_severity}
                    </span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                      Confidence: {Math.round(predictionResult.confidence_score * 100)}%
                    </span>
                  </div>
                </div>

                {/* Big Metric Display */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
                  
                  <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">ESTIMATED DELAY</span>
                    <div className="text-3xl font-extrabold text-amber-300 mt-1">
                      +{predictionResult.predicted_delay_mins} <span className="text-xs text-slate-400 font-normal">mins</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Primary: {predictionResult.primary_driver}</span>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">SCHEDULED ARRIVAL</span>
                    <div className="text-2xl font-bold text-slate-300 mt-1">
                      {etaResult?.scheduled_arrival || '10:05'}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">At {destStation}</span>
                  </div>

                  <div className="bg-cyan-950/40 p-3.5 rounded-lg border border-cyan-500/40">
                    <span className="text-[10px] text-cyan-400 block font-bold">UPDATED DYNAMIC ETA</span>
                    <div className="text-3xl font-black text-cyan-300 mt-1">
                      {etaResult?.predicted_arrival || '10:52'}
                    </div>
                    <span className="text-[10px] text-cyan-200 mt-1 block">{etaResult?.confidence_interval || '±5 mins'}</span>
                  </div>

                </div>

                {/* Dispatcher Mitigation Recommendation */}
                <div className="bg-cyan-900/20 border border-cyan-800/60 p-3 rounded-lg text-xs flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-300">DISPATCHER RECOMMENDATION: </span>
                    <span className="text-slate-200">{predictionResult.mitigation_suggestion}</span>
                  </div>
                </div>

              </div>

              {/* Explainability Feature Attribution (Why is it delayed?) */}
              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 font-mono">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    DELAY ROOT CAUSE EXPLAINABILITY (SHAP-STYLE FEATURE ATTRIBUTION)
                  </h4>
                  <span className="text-[10px] text-slate-400">Impact (Minutes)</span>
                </div>

                <div className="space-y-3">
                  {predictionResult.top_factors.map((factor, idx) => {
                    const isCredit = factor.impact_mins < 0;
                    return (
                      <div key={idx} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-200">{factor.feature}</span>
                          <span className={`font-bold ${isCredit ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {isCredit ? `${factor.impact_mins}m` : `+${factor.impact_mins}m`}
                          </span>
                        </div>

                        {/* Bar visualizer */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-1.5">
                          <div 
                            className={`h-full rounded-full ${isCredit ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, Math.abs(factor.impact_mins) * 4)}%` }}
                          ></div>
                        </div>

                        <p className="text-[11px] text-slate-400">{factor.description}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>* Additive decomposition of sectional delay factors.</span>
                  <span>Baseline slack buffer: 12 mins</span>
                </div>
              </div>

            </div>
          ) : (
            /* Blank state prompting calculation */
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center mb-4 text-cyan-400">
                <Hourglass className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">Ready to Predict Train Delay</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1 mb-5">
                Adjust the corridor parameters on the left (e.g. Fog weather, high congestion, or temporary speed restriction) and click "Calculate Delay & Updated ETA" to run the ML model.
              </p>
              <button
                onClick={handlePredict}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg font-mono flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all"
              >
                <span>Run Default Simulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
