# TrackPulse — Indian Railways Operations Prototype

**TrackPulse** is a prototype decision support system for Indian Railways operations that predicts train delays, calculates dynamic updated ETAs, simulates train movement on historical timetable corridors, detects track conflicts, and explains root causes of delay using explainable ML.

> [!IMPORTANT]
> **Prototype & Simulation Disclaimer**:
> This system operates purely on historical timetable data and simulated operational models. It does **NOT** connect to or claim to have live Indian Railways GPS, CRIS (Centre for Railway Information Systems), FOIS (Freight Operations Information System), or official real-time feeds. All telemetry, speeds, and block signaling are algorithmically simulated for prototype evaluation.

---

## Key Capabilities

1. **Dashboard (Network Operations Center)**:
   * Real-time network punctuality gauge, active fleet count, average delay trends.
   * Visual delay cause breakdown (Weather/Fog, Section Congestion, Precedence Siding, Track Maintenance, Signaling).
   * Live simulated operational event ticker (TSRs, precedence diversions, signal clearances).

2. **Live / Replay Tracking**:
   * Dual-mode interactive visualization: **Geographic Route Map** (India trunk lines) and **Linear CTC Track Schematic** (Continuous Track Circuits).
   * Real-time train positions, directional heading, speed (km/h), delay badges, and automatic block signal aspects (Green, Double Yellow, Yellow, Red).
   * Interactive telemetry inspector for any selected train.

3. **Train Operational Profile & Timetable**:
   * In-depth profile inspector for Vande Bharat Express, Howrah Rajdhani, Mumbai Tejas Rajdhani, Lucknow Shatabdi, Purushottam Express, and Heavy Freight Rakes.
   * Halt-by-halt comparison: **Scheduled Timetable** vs. **Simulated Actual** vs. **ML-Predicted ETA**.
   * Speed-distance sectional profile curves.

4. **Dynamic ETA & ML Delay Prediction**:
   * Interactive what-if simulator: select train, current location, departure hour, day of week, weather condition (Fog, Rain, Clear), visibility (m), line congestion, and speed caps.
   * Instant inference returning predicted delay (minutes), confidence score, severity rating, and updated dynamic ETA.
   * **Explainable AI (XAI)**: SHAP-style additive feature attribution detailing exact factors causing the delay.

5. **Conflict Management & Dispatcher Advisory**:
   * Detection of **Headway Violations** (trains following too close in block territory), **Platform Contention** (simultaneous arrival overlaps), and **Precedence Inversions** (expresses stuck behind freight).
   * One-click simulated dispatcher actions: *Divert to Loop Line*, *Precedence Override*, *Issue Speed Advisory*.
   * Resolution audit log with real-time state synchronization.

6. **Delay Analysis**:
   * Systematic root-cause attribution and total lost hours.
   * Junction bottleneck rankings (Kanpur Central CNB, Pt. Deen Dayal Upadhyaya DDU, Ghaziabad GZB, Mathura MTJ).
   * Delay propagation cascade tree with schedule recovery slack analysis.

7. **Historical Data Archives**:
   * Searchable repository of train runs.
   * Filtering by corridor, train type, and punctuality status.
   * Export capability to **CSV** and **JSON**.

8. **About TrackPulse**:
   * Clear compliance disclosures, technical architecture diagrams, and railway domain logic descriptions.

---

## Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, SVG Spatial Route Visualizer.
* **Backend**: Python FastAPI, Pydantic v2, REST API, Uvicorn.
* **Machine Learning**: Pure-Python Gradient Boosted Regression Ensemble & SHAP-style Explainability (designed with zero native DLL dependencies for 100% cross-platform compatibility).
* **Database**: PostgreSQL support via SQLAlchemy with automatic fallback to embedded SQLite (`trackpulse.db`).

---

## Quick Start Guide

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm

### 1. Start the Backend API

```bash
cd backend
python -m pip install fastapi uvicorn pydantic sqlalchemy requests
python run.py
```

* API will run at: `http://127.0.0.1:8000`
* Interactive API Docs: `http://127.0.0.1:8000/docs`
* Run Automated Tests: `python test_api.py`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

* Web UI will run at: `http://localhost:5173`

---

## API Endpoints Reference

| Path | Method | Description |
| :--- | :--- | :--- |
| `/trains` | `GET` | All trains, schedules, and live telemetry |
| `/trains/{train_number}` | `GET` | Specific train profile and halt list |
| `/routes` | `GET` | Corridor definitions, distances, and bottlenecks |
| `/stations` | `GET` | Indian Railways stations registry with coordinates |
| `/replay` | `GET` | Current simulated train positions and signals |
| `/replay/step` | `POST` | Advance or scrub simulation clock |
| `/predict-delay` | `POST` | ML delay inference with explainability factors |
| `/calculate-eta` | `POST` | Dynamic updated arrival time with recovery buffer |
| `/conflicts` | `GET` | Active detected track conflicts |
| `/conflicts/resolve` | `POST` | Execute dispatcher resolution action |
| `/analytics` | `GET` | Network punctuality, delay causes, bottleneck rankings |
| `/health` | `GET` | Backend service health and prototype status |
