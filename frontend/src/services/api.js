import {
  mockOverview,
  mockPlatforms,
  mockConflicts,
  mockTomorrowTimetable,
  mockAuditLogs,
  mockDynamicAssignments,
  mockTrains,
  mockStations,
  mockRoutes
} from './mockData';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://127.0.0.1:8000';

// In-memory state for offline/Vercel preview interactivity
let liveOverview = JSON.parse(JSON.stringify(mockOverview));
let livePlatforms = JSON.parse(JSON.stringify(mockPlatforms));
let liveConflicts = JSON.parse(JSON.stringify(mockConflicts));
let liveTomorrowTimetable = JSON.parse(JSON.stringify(mockTomorrowTimetable));
let liveAuditLogs = JSON.parse(JSON.stringify(mockAuditLogs));
let liveDynamicAssignments = JSON.parse(JSON.stringify(mockDynamicAssignments));

// Helper to fetch with timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = 2500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function fetchHealth() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/health`, {}, 1500);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'healthy', mode: 'PROTOTYPE (Vercel / Cloud Demo Mode)', service: 'TrackPulse IR Prototype' };
  }
}

export async function fetchTrains(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetchWithTimeout(`${API_BASE}/trains${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch trains');
    return await res.json();
  } catch (err) {
    return mockTrains;
  }
}

export async function fetchTrainByNumber(trainNumber) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/trains/${trainNumber}`);
    if (!res.ok) throw new Error(`Failed to fetch train ${trainNumber}`);
    return await res.json();
  } catch (err) {
    const found = mockTrains.find(t => t.train_no === trainNumber || t.id === trainNumber);
    return found || mockTrains[0];
  }
}

export async function fetchRoutes() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/routes`);
    if (!res.ok) throw new Error('Failed to fetch routes');
    return await res.json();
  } catch (err) {
    return mockRoutes;
  }
}

export async function fetchStations(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetchWithTimeout(`${API_BASE}/stations${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch stations');
    return await res.json();
  } catch (err) {
    return mockStations;
  }
}

export async function fetchReplayState(corridor = '') {
  try {
    const url = corridor ? `${API_BASE}/replay?corridor=${corridor}` : `${API_BASE}/replay`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error('Failed to fetch replay state');
    return await res.json();
  } catch (err) {
    return {
      current_time: new Date().toLocaleTimeString(),
      corridor: corridor || 'MMR-KPG',
      active_trains: mockTrains.slice(0, 4),
      time_multiplier: 1,
      total_trains: mockTrains.length
    };
  }
}

export async function stepReplaySimulation(multiplier = 1, stepSeconds = 30) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/replay/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time_multiplier: multiplier, step_seconds: stepSeconds })
    });
    if (!res.ok) throw new Error('Failed to step simulation');
    return await res.json();
  } catch (err) {
    return { status: 'stepped', current_time: new Date().toLocaleTimeString(), active_trains: mockTrains.slice(0, 4) };
  }
}

export async function resetReplaySimulation() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/replay/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset simulation');
    return await res.json();
  } catch (err) {
    return { status: 'reset', current_time: '10:00:00 AM' };
  }
}

export async function predictTrainDelay(payload) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/predict-delay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to predict delay');
    return await res.json();
  } catch (err) {
    return {
      predicted_delay_min: Math.floor(Math.random() * 15) + 4,
      confidence_score: 0.94,
      top_factors: [
        'High line utilization on Kalyan-Igatpuri ghat section (124%)',
        'Preceding freight rake occupying single-line block',
        'Speed restriction at Kasara neutral section'
      ],
      ai_explanation: 'Gradient curvature and sectional congestion increase probability of dwell elongation by 8-14 mins.'
    };
  }
}

export async function calculateUpdatedETA(payload) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/calculate-eta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to calculate ETA');
    return await res.json();
  } catch (err) {
    return {
      destination: payload.destination || 'Manmad Junction (MMR)',
      original_eta: '10:45 AM',
      updated_eta: '10:59 AM',
      delay_impact_min: 14,
      speed_recommendation_kmh: 95
    };
  }
}

export async function fetchConflicts(corridor = '') {
  try {
    const url = corridor ? `${API_BASE}/conflicts?corridor=${corridor}` : `${API_BASE}/conflicts`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error('Failed to fetch conflicts');
    return await res.json();
  } catch (err) {
    return liveConflicts;
  }
}

export async function resolveConflictAction(conflictId, action, notes = '') {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/conflicts/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conflict_id: conflictId, resolution_action: action, notes: notes })
    });
    if (!res.ok) throw new Error('Failed to resolve conflict');
    return await res.json();
  } catch (err) {
    return { success: true, message: `Conflict ${conflictId} resolved via ${action}` };
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  } catch (err) {
    return {
      average_punctuality_percent: 92.4,
      section_throughput_trains_per_day: 148,
      energy_saved_mwh: 18.2,
      active_conflicts_count: liveConflicts.length
    };
  }
}

export async function fetchMmrKpgTrains() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/trains/MMR-KPG`);
    if (!res.ok) throw new Error('Failed to fetch MMR-KPG trains');
    return await res.json();
  } catch (err) {
    return mockTrains.slice(0, 6);
  }
}

export async function fetchMmrKpgAnalytics() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/analytics/MMR-KPG`);
    if (!res.ok) throw new Error('Failed to fetch MMR-KPG analytics');
    return await res.json();
  } catch (err) {
    return {
      corridor: 'MMR-KPG',
      track_type: 'Single Line Electrified (Doubling ongoing)',
      average_delay_min: 14.2,
      punctuality_percent: 88.6
    };
  }
}

// --- Manmad Junction (MMR) Specialized Focus ---

export async function fetchManmadOverview() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/overview`);
    if (!res.ok) throw new Error('Failed to fetch Manmad overview');
    return await res.json();
  } catch (err) {
    return liveOverview;
  }
}

export async function fetchManmadPlatforms() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/platforms`);
    if (!res.ok) throw new Error('Failed to fetch Manmad platforms');
    return await res.json();
  } catch (err) {
    return { station: 'MMR', platforms: livePlatforms };
  }
}

export async function fetchManmadConflicts() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/conflicts`);
    if (!res.ok) throw new Error('Failed to fetch Manmad conflicts');
    return await res.json();
  } catch (err) {
    return { station: 'MMR', conflicts: liveConflicts, audit_logs: liveAuditLogs };
  }
}

export async function overrideManmadConflict(payload) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/conflicts/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to apply controller override');
    return await res.json();
  } catch (err) {
    if (liveConflicts.length > 0) {
      const conf = liveConflicts[0];
      conf.decision.favored_train = payload.favored_train;
      conf.decision.held_train = payload.favored_train === conf.train_primary.train_no ? conf.train_secondary.train_no : conf.train_primary.train_no;
      conf.decision.precedence_reason = `MANUAL OVERRIDE: ${payload.reason || 'Controller Discretion'}`;
      liveAuditLogs.unshift({
        id: `LOG-OVR-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        conflict_id: payload.conflict_id,
        action: `Precedence Inverted to Train ${payload.favored_train}`,
        controller: payload.controller_id || 'SC-BHUSAWAL-04',
        notes: payload.notes || 'Precedence inverted by Section Controller on duty'
      });
    }
    return { success: true, message: `Precedence inverted: Train ${payload.favored_train} granted green aspect.` };
  }
}

export async function triggerManmadEmergency(scenarioType) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/conflicts/trigger-emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario_type: scenarioType })
    });
    if (!res.ok) throw new Error('Failed to trigger emergency scenario');
    return await res.json();
  } catch (err) {
    if (liveConflicts.length > 0) {
      const conf = liveConflicts[0];
      if (scenarioType === 'medical_emergency') {
        conf.is_emergency = true;
        conf.emergency_type = 'Medical Emergency';
        conf.decision.favored_train = conf.train_secondary.train_no;
        conf.decision.held_train = conf.train_primary.train_no;
        conf.decision.precedence_reason = 'EMERGENCY OVERRIDE: Critical Patient Evacuation on Train 11078 requires immediate Platform 4 berthing and ambulance ramp access.';
      } else if (scenarioType === 'clear') {
        conf.is_emergency = false;
        conf.emergency_type = null;
        conf.decision.favored_train = conf.train_primary.train_no;
        conf.decision.held_train = conf.train_secondary.train_no;
        conf.decision.precedence_reason = 'Premium P1 Priority + High momentum (88 km/h). Halting 22222 causes cascade delay on Kalyan-Bhusawal quad trunk.';
      }
    }
    return { success: true, message: `Emergency scenario '${scenarioType}' applied.` };
  }
}

export async function updateManmadWeather(payload) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/weather`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update weather');
    return await res.json();
  } catch (err) {
    if (liveOverview && liveOverview.weather) {
      liveOverview.weather.visibility_meters = payload.visibility_meters;
      liveOverview.weather.fog_flag = payload.visibility_meters < 200;
      liveOverview.weather.condition = payload.condition || (payload.visibility_meters < 200 ? 'Dense Winter Fog' : 'Clear');
    }
    return liveOverview.weather;
  }
}

export async function fetchManmadTomorrowTimetable() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/timetable/tomorrow`);
    if (!res.ok) throw new Error('Failed to fetch tomorrow timetable');
    return await res.json();
  } catch (err) {
    return { station: 'MMR', timetable: liveTomorrowTimetable };
  }
}

export async function fetchManmadAuditLogs() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/audit-logs`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return await res.json();
  } catch (err) {
    return { station: 'MMR', audit_logs: liveAuditLogs };
  }
}

export async function fetchDynamicPlatformAssignments() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/platforms/dynamic`);
    if (!res.ok) throw new Error('Failed to fetch dynamic platform assignments');
    return await res.json();
  } catch (err) {
    return { station: 'MMR', assignments: liveDynamicAssignments };
  }
}

export async function reassignPlatform(payload) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/platforms/reassign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to reassign platform');
    }
    return await res.json();
  } catch (err) {
    return {
      success: true,
      message: `Platform successfully reassigned: Train ${payload.train_no} moved to Platform ${payload.new_platform} (${payload.reason})`
    };
  }
}

export async function simulatePlatformScenario(scenarioName) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manmad/platforms/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario_name: scenarioName })
    });
    if (!res.ok) throw new Error('Failed to simulate platform scenario');
    return await res.json();
  } catch (err) {
    return { success: true, message: `Platform scenario '${scenarioName}' simulated.` };
  }
}
