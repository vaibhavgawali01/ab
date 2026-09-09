import React, { useState, useEffect } from 'react';
import PrototypeBanner from './components/PrototypeBanner';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import MMRKpgControlRoom from './pages/MMRKpgControlRoom';
import ManmadJunctionFocus from './pages/ManmadJunctionFocus';
import LiveTracking from './pages/LiveTracking';
import TrainDetails from './pages/TrainDetails';
import ETAPrediction from './pages/ETAPrediction';
import ConflictManagement from './pages/ConflictManagement';
import DelayAnalysis from './pages/DelayAnalysis';
import HistoricalData from './pages/HistoricalData';
import About from './pages/About';

import { 
  fetchHealth, 
  fetchTrains, 
  fetchRoutes, 
  fetchStations, 
  fetchReplayState, 
  stepReplaySimulation, 
  resetReplaySimulation,
  fetchConflicts, 
  fetchAnalytics 
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('manmad-focus');
  const [selectedCorridor, setSelectedCorridor] = useState('');
  const [selectedTrainNumber, setSelectedTrainNumber] = useState(null);
  const [selectedTrainObj, setSelectedTrainObj] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Backend state
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [trains, setTrains] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [replayState, setReplayState] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Simulation playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeMultiplier, setTimeMultiplier] = useState(5);
  const [simulationTime, setSimulationTime] = useState('2026-09-08 10:30:00');

  // Initial Data Load
  useEffect(() => {
    async function initData() {
      try {
        const health = await fetchHealth();
        setIsBackendConnected(health.status === 'healthy');

        const [tData, rData, sData, cData, aData, repData] = await Promise.allSettled([
          fetchTrains(),
          fetchRoutes(),
          fetchStations(),
          fetchConflicts(),
          fetchAnalytics(),
          fetchReplayState()
        ]);

        if (tData.status === 'fulfilled') {
          setTrains(tData.value);
          if (tData.value.length > 0) {
            setSelectedTrainNumber(tData.value[0].train_number);
            setSelectedTrainObj(tData.value[0]);
          }
        }
        if (rData.status === 'fulfilled') setRoutes(rData.value);
        if (sData.status === 'fulfilled') setStations(sData.value);
        if (cData.status === 'fulfilled') setConflicts(cData.value.conflicts || []);
        if (aData.status === 'fulfilled') setAnalytics(aData.value);
        if (repData.status === 'fulfilled') {
          setReplayState(repData.value);
          setSimulationTime(repData.value.simulation_time);
        }
      } catch (err) {
        console.warn("Using local prototype fallback data:", err);
      }
    }

    initData();
  }, []);

  // Simulation Timer Interval
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(async () => {
        try {
          // Advance simulation step in backend
          const updated = await stepReplaySimulation(timeMultiplier, 15);
          setReplayState(updated);
          setSimulationTime(updated.simulation_time);
        } catch (err) {
          // If backend offline, advance time locally
          setSimulationTime(prev => {
            const parts = prev.split(' ');
            const timeParts = parts[1].split(':');
            let s = parseInt(timeParts[2]) + 15 * timeMultiplier;
            let m = parseInt(timeParts[1]) + Math.floor(s / 60);
            let h = parseInt(timeParts[0]) + Math.floor(m / 60);
            s = s % 60;
            m = m % 60;
            h = h % 24;
            const pad = (n) => n.toString().padStart(2, '0');
            return `${parts[0]} ${pad(h)}:${pad(m)}:${pad(s)}`;
          });
        }
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeMultiplier]);

  const handleResetSimulation = async () => {
    try {
      const resetState = await resetReplaySimulation();
      setReplayState(resetState);
      setSimulationTime(resetState.simulation_time);
    } catch (err) {
      setSimulationTime('2026-09-08 10:30:00');
    }
  };

  const handleRefreshConflicts = async () => {
    try {
      const res = await fetchConflicts(selectedCorridor);
      setConflicts(res.conflicts || []);
    } catch (err) {
      console.warn("Could not refresh conflicts:", err);
    }
  };

  const navigateToTrain = (trainNumber) => {
    setSelectedTrainNumber(trainNumber);
    const found = trains.find(t => t.train_number === trainNumber);
    if (found) setSelectedTrainObj(found);
    setActiveTab('train-details');
  };

  const navigateToPrediction = (trainNumber) => {
    setSelectedTrainNumber(trainNumber);
    setActiveTab('eta-prediction');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {/* 1. Mandatory Prototype Disclaimer Banner */}
      <PrototypeBanner />

      {/* 2. Control Room Top Navigation Bar */}
      <Navbar 
        corridors={routes}
        selectedCorridor={selectedCorridor}
        onSelectCorridor={setSelectedCorridor}
        simulationTime={simulationTime}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        timeMultiplier={timeMultiplier}
        onChangeMultiplier={setTimeMultiplier}
        onResetSimulation={handleResetSimulation}
        isBackendConnected={isBackendConnected}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* 3. Main Workspace: Sidebar + Dynamic Page Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Responsive Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeConflictsCount={conflicts.filter(c => !c.resolved).length}
          delayedTrainsCount={trains.filter(t => (t.status?.simulated_delay_mins || 0) > 15).length}
          isMobileOpen={isMobileMenuOpen}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Page Router Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#090d16]">
          <div className="max-w-7xl mx-auto">
            
            {activeTab === 'manmad-focus' && (
              <ManmadJunctionFocus />
            )}

            {activeTab === 'mmr-kpg' && (
              <MMRKpgControlRoom 
                onViewTrainDetails={navigateToTrain}
              />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard 
                analytics={analytics}
                trains={trains}
                conflicts={conflicts}
                onSelectTab={setActiveTab}
                onSelectTrain={(train) => navigateToTrain(train.train_number)}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                simulationTime={simulationTime}
                timeMultiplier={timeMultiplier}
                routes={routes}
                stations={stations}
              />
            )}

            {activeTab === 'live-tracking' && (
              <LiveTracking 
                trains={trains}
                stations={stations}
                routes={routes}
                replayState={replayState}
                selectedTrain={selectedTrainObj}
                onSelectTrain={(t) => {
                  setSelectedTrainObj(t);
                  setSelectedTrainNumber(t.train_number);
                }}
                onViewTrainDetails={navigateToTrain}
              />
            )}

            {activeTab === 'train-details' && (
              <TrainDetails 
                trains={trains}
                selectedTrainNumber={selectedTrainNumber}
                onSelectTrainNumber={(num) => {
                  setSelectedTrainNumber(num);
                  const found = trains.find(t => t.train_number === num);
                  if (found) setSelectedTrainObj(found);
                }}
                onNavigateToPrediction={navigateToPrediction}
              />
            )}

            {activeTab === 'eta-prediction' && (
              <ETAPrediction 
                trains={trains}
                stations={stations}
                prefilledTrainNumber={selectedTrainNumber}
              />
            )}

            {activeTab === 'conflict-mgmt' && (
              <ConflictManagement 
                conflicts={conflicts}
                onRefreshConflicts={handleRefreshConflicts}
                onSelectTrain={navigateToTrain}
              />
            )}

            {activeTab === 'delay-analysis' && (
              <DelayAnalysis 
                analytics={analytics}
              />
            )}

            {activeTab === 'historical-data' && (
              <HistoricalData 
                trains={trains}
              />
            )}

            {activeTab === 'about' && (
              <About />
            )}

          </div>
        </main>

      </div>

      {/* 4. Control Room Footer Status */}
      <footer className="bg-[#0b1120] border-t border-slate-800/80 px-4 py-2 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>IR Broad Gauge 1676mm</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">Automatic Block Signaling (ABS)</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">25 kV AC 50 Hz Electric Traction</span>
        </div>

        <div className="text-amber-400/90 text-[10px]">
          Prototype Research Model · No Live GPS Feeds
        </div>
      </footer>

    </div>
  );
}
