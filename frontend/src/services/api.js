const API_BASE = "http://127.0.0.1:8000";

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    console.warn("Backend offline or starting up, using local prototype bridge:", err.message);
    return { status: "offline", mode: "LOCAL_PROTOTYPE_FALLBACK" };
  }
}

export async function fetchTrains(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/trains${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error("Failed to fetch trains");
  return await res.json();
}

export async function fetchTrainByNumber(trainNumber) {
  const res = await fetch(`${API_BASE}/trains/${trainNumber}`);
  if (!res.ok) throw new Error(`Failed to fetch train ${trainNumber}`);
  return await res.json();
}

export async function fetchRoutes() {
  const res = await fetch(`${API_BASE}/routes`);
  if (!res.ok) throw new Error("Failed to fetch routes");
  return await res.json();
}

export async function fetchStations(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/stations${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error("Failed to fetch stations");
  return await res.json();
}

export async function fetchReplayState(corridor = "") {
  const url = corridor ? `${API_BASE}/replay?corridor=${corridor}` : `${API_BASE}/replay`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch replay state");
  return await res.json();
}

export async function stepReplaySimulation(multiplier = 1, stepSeconds = 30) {
  const res = await fetch(`${API_BASE}/replay/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ time_multiplier: multiplier, step_seconds: stepSeconds })
  });
  if (!res.ok) throw new Error("Failed to step simulation");
  return await res.json();
}

export async function resetReplaySimulation() {
  const res = await fetch(`${API_BASE}/replay/reset`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to reset simulation");
  return await res.json();
}

export async function predictTrainDelay(payload) {
  const res = await fetch(`${API_BASE}/predict-delay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to predict delay");
  return await res.json();
}

export async function calculateUpdatedETA(payload) {
  const res = await fetch(`${API_BASE}/calculate-eta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to calculate ETA");
  return await res.json();
}

export async function fetchConflicts(corridor = "") {
  const url = corridor ? `${API_BASE}/conflicts?corridor=${corridor}` : `${API_BASE}/conflicts`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch conflicts");
  return await res.json();
}

export async function resolveConflictAction(conflictId, action, notes = "") {
  const res = await fetch(`${API_BASE}/conflicts/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conflict_id: conflictId,
      resolution_action: action,
      notes: notes
    })
  });
  if (!res.ok) throw new Error("Failed to resolve conflict");
  return await res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return await res.json();
}

export async function fetchMmrKpgTrains() {
  const res = await fetch(`${API_BASE}/trains/MMR-KPG`);
  if (!res.ok) throw new Error("Failed to fetch MMR-KPG trains");
  return await res.json();
}

export async function fetchMmrKpgAnalytics() {
  const res = await fetch(`${API_BASE}/analytics/MMR-KPG`);
  if (!res.ok) throw new Error("Failed to fetch MMR-KPG analytics");
  return await res.json();
}

// --- Manmad Junction (MMR) Specialized Focus ---

export async function fetchManmadOverview() {
  const res = await fetch(`${API_BASE}/manmad/overview`);
  if (!res.ok) throw new Error("Failed to fetch Manmad overview");
  return await res.json();
}

export async function fetchManmadPlatforms() {
  const res = await fetch(`${API_BASE}/manmad/platforms`);
  if (!res.ok) throw new Error("Failed to fetch Manmad platforms");
  return await res.json();
}

export async function fetchManmadConflicts() {
  const res = await fetch(`${API_BASE}/manmad/conflicts`);
  if (!res.ok) throw new Error("Failed to fetch Manmad conflicts");
  return await res.json();
}

export async function overrideManmadConflict(payload) {
  const res = await fetch(`${API_BASE}/manmad/conflicts/override`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to apply controller override");
  return await res.json();
}

export async function triggerManmadEmergency(scenarioType) {
  const res = await fetch(`${API_BASE}/manmad/conflicts/trigger-emergency`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario_type: scenarioType })
  });
  if (!res.ok) throw new Error("Failed to trigger emergency scenario");
  return await res.json();
}

export async function updateManmadWeather(payload) {
  const res = await fetch(`${API_BASE}/manmad/weather`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to update weather");
  return await res.json();
}

export async function fetchManmadTomorrowTimetable() {
  const res = await fetch(`${API_BASE}/manmad/timetable/tomorrow`);
  if (!res.ok) throw new Error("Failed to fetch tomorrow's timetable");
  return await res.json();
}

export async function fetchManmadAuditLogs() {
  const res = await fetch(`${API_BASE}/manmad/audit-logs`);
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return await res.json();
}

export async function fetchDynamicPlatformAssignments() {
  const res = await fetch(`${API_BASE}/manmad/platforms/dynamic`);
  if (!res.ok) throw new Error("Failed to fetch dynamic platform assignments");
  return await res.json();
}

export async function reassignPlatform(payload) {
  const res = await fetch(`${API_BASE}/manmad/platforms/reassign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to reassign platform");
  }
  return await res.json();
}

export async function simulatePlatformScenario(scenarioName) {
  const res = await fetch(`${API_BASE}/manmad/platforms/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario_name: scenarioName })
  });
  if (!res.ok) throw new Error("Failed to simulate platform scenario");
  return await res.json();
}
