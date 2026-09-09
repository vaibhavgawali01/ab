import json
import os
import math
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

class ReplayEngine:
    def __init__(self):
        self.simulation_base_time = datetime(2026, 9, 8, 10, 30, 0)
        self.simulated_elapsed_seconds = 0
        self.time_multiplier = 1
        self.stations: Dict[str, Dict[str, Any]] = {}
        self.routes: Dict[str, Dict[str, Any]] = {}
        self.trains: List[Dict[str, Any]] = []
        self._load_datasets()

    def _load_datasets(self):
        base_path = os.path.join(os.path.dirname(__file__), "..", "..", "data")
        
        # Load stations
        stn_file = os.path.join(base_path, "stations.json")
        if os.path.exists(stn_file):
            with open(stn_file, "r", encoding="utf-8") as f:
                stns = json.load(f)
                self.stations = {s["code"]: s for s in stns}
        
        # Load routes
        rt_file = os.path.join(base_path, "routes.json")
        if os.path.exists(rt_file):
            with open(rt_file, "r", encoding="utf-8") as f:
                rts = json.load(f)
                self.routes = {r["code"]: r for r in rts}

        # Load trains
        tr_file = os.path.join(base_path, "trains.json")
        if os.path.exists(tr_file):
            with open(tr_file, "r", encoding="utf-8") as f:
                self.trains = json.load(f)

    def advance_simulation(self, step_seconds: int = 30, multiplier: int = 1) -> Dict[str, Any]:
        self.time_multiplier = multiplier
        self.simulated_elapsed_seconds += step_seconds * multiplier
        return self.get_current_state()

    def reset_simulation(self):
        self.simulated_elapsed_seconds = 0
        self.time_multiplier = 1
        return self.get_current_state()

    def _interpolate_coordinates(self, stn1_code: str, stn2_code: str, fraction: float):
        s1 = self.stations.get(stn1_code, {"lat": 28.6429, "lng": 77.2195})
        s2 = self.stations.get(stn2_code, {"lat": 26.4547, "lng": 80.3507})
        
        lat = s1["lat"] + (s2["lat"] - s1["lat"]) * fraction
        lng = s1["lng"] + (s2["lng"] - s1["lng"]) * fraction
        
        # Calculate bearing / heading
        d_lng = s2["lng"] - s1["lng"]
        d_lat = s2["lat"] - s1["lat"]
        bearing = (math.degrees(math.atan2(d_lng, d_lat)) + 360) % 360
        
        return lat, lng, round(bearing, 1)

    def get_current_state(self, corridor_code: Optional[str] = None) -> Dict[str, Any]:
        curr_time = self.simulation_base_time + timedelta(seconds=self.simulated_elapsed_seconds)
        time_str = curr_time.strftime("%Y-%m-%d %H:%M:%S")

        active_positions = []
        filtered_trains = self.trains
        if corridor_code:
            filtered_trains = [t for t in self.trains if t.get("corridor_code") == corridor_code]

        for train in filtered_trains:
            t_num = train["train_number"]
            speed_kmh = train["status"]["current_speed_kmh"]
            base_km = train["status"]["current_km"]
            
            # Dynamic displacement based on simulation time and speed
            # Distance delta = speed_kmh * (elapsed_hours)
            elapsed_hours = (self.simulated_elapsed_seconds / 3600.0)
            
            # Simulated oscillation to show movement along track
            corridor = self.routes.get(train.get("corridor_code", "NDLS-HWH"))
            total_km = corridor["total_distance_km"] if corridor else 1400.0
            
            curr_km = (base_km + (speed_kmh * elapsed_hours)) % total_km
            
            # Identify current and next station along corridor
            last_stn = train["status"]["last_reported_station"]
            next_stn = train["status"]["next_station"]
            
            # Interpolation fraction between last and next
            fraction = min(1.0, max(0.0, (curr_km % 120.0) / 120.0))
            lat, lng, heading = self._interpolate_coordinates(last_stn, next_stn, fraction)
            
            # Dynamic signal aspect logic
            signal = train["status"]["signal_aspect"]
            if speed_kmh == 0:
                signal = "Red"
            elif speed_kmh < 60:
                signal = "Yellow"
            elif speed_kmh < 100:
                signal = "Double Yellow"
            else:
                signal = "Green"

            active_positions.append({
                "train_number": t_num,
                "name": train["name"],
                "type": train["type"],
                "lat": round(lat, 5),
                "lng": round(lng, 5),
                "current_km": round(curr_km, 1),
                "speed_kmh": round(speed_kmh, 1),
                "heading_deg": heading,
                "signal_aspect": signal,
                "block_section": train["status"]["block_section"],
                "delay_mins": train["status"]["simulated_delay_mins"],
                "status_label": train["status"]["current_status"],
                "next_station": next_stn
            })

        return {
            "simulation_time": time_str,
            "time_multiplier": self.time_multiplier,
            "corridor_code": corridor_code or "ALL",
            "active_trains_count": len(active_positions),
            "trains": active_positions,
            "network_alerts_count": 3
        }

replay_engine = ReplayEngine()
