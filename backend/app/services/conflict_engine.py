import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime

class ConflictEngine:
    def __init__(self):
        # In-memory storage for active simulated conflicts and resolution states
        self.conflicts: Dict[str, Dict[str, Any]] = {}
        self._seed_initial_conflicts()

    def _seed_initial_conflicts(self):
        self.conflicts = {
            "CONF-101": {
                "id": "CONF-101",
                "corridor_code": "NDLS-HWH",
                "conflict_type": "Overtake / Precedence Inversion",
                "severity": "Critical",
                "location": "Kanpur (CNB) - Rura Section (Km 472)",
                "train_primary": "22436", # Vande Bharat (Priority 1)
                "train_secondary": "BOXN-50102", # Freight (Priority 4)
                "description": "High-speed Vande Bharat (128 km/h) approaching within 18 km of heavy freight rake BOXN-50102 occupying Up Main line at 42 km/h.",
                "recommended_action": "Divert Freight BOXN-50102 to Rura Loop Line 3 immediately to give unobstructed through clearance for 22436.",
                "resolved": False,
                "resolution_applied": None,
                "detected_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            },
            "CONF-102": {
                "id": "CONF-102",
                "corridor_code": "NDLS-HWH",
                "conflict_type": "Platform Occupancy Contention",
                "severity": "Warning",
                "location": "Prayagraj Junction (PRYJ) Platform 1",
                "train_primary": "12301", # Howrah Rajdhani
                "train_secondary": "12802", # Purushottam Express
                "description": "Projected simultaneous arrival at PRYJ Platform 1 within a 4-minute window due to delay accumulation on 12802.",
                "recommended_action": "Reallocate 12802 to Platform 4; retain Platform 1 for 12301 Rajdhani express.",
                "resolved": False,
                "resolution_applied": None,
                "detected_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            },
            "CONF-103": {
                "id": "CONF-103",
                "corridor_code": "NDLS-MMCT",
                "conflict_type": "Headway Compression",
                "severity": "Warning",
                "location": "Mathura Jn (MTJ) Approach (Km 138)",
                "train_primary": "12951",
                "train_secondary": "Suburban MEMU 64958",
                "description": "Headway reduced to 2.8 minutes entering double yellow automatic block territory.",
                "recommended_action": "Regulate trailing train speed limit to 75 km/h to maintain safe 5-minute spatial separation.",
                "resolved": False,
                "resolution_applied": None,
                "detected_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            },
            "CONF-201": {
                "id": "CONF-201",
                "corridor_code": "MMR-KPG",
                "section": "MMR-KPG",
                "conflict_type": "Single-Track Occupancy Overlap",
                "severity": "Critical",
                "location": "MMR-KPG Single Track (Km 12 - 24)",
                "train_primary": "12432",
                "train_secondary": "51503",
                "preferred_train": "12432 (Rajdhani)",
                "held_train": "51503 (Passenger)",
                "hold_time_minutes": 8,
                "hold_reason": "Higher-priority Rajdhani requires single-track section clearance",
                "description": "Both trains require the single-track MMR-KPG section at overlapping times. Priority 1 Rajdhani is granted preference; Priority 4 Passenger is held at Manmad Loop Line.",
                "recommended_action": "Hold Passenger 51503 at MMR Loop Line for 8 minutes; dispatch Rajdhani 12432 with through green. Add +8 min to Passenger ETA.",
                "resolved": False,
                "resolution_applied": None,
                "detected_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            }
        }

    def get_active_conflicts(self, corridor_code: Optional[str] = None) -> List[Dict[str, Any]]:
        results = list(self.conflicts.values())
        if corridor_code:
            results = [c for c in results if c["corridor_code"] == corridor_code]
        return results

    def resolve_conflict(self, conflict_id: str, action: str, notes: Optional[str] = None) -> Dict[str, Any]:
        if conflict_id not in self.conflicts:
            return {"success": False, "message": f"Conflict {conflict_id} not found."}
        
        item = self.conflicts[conflict_id]
        item["resolved"] = True
        item["resolution_applied"] = action
        item["resolution_time"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        item["resolution_notes"] = notes or f"Dispatcher executed: {action}"
        
        return {
            "success": True,
            "status": "Resolved",
            "message": f"Conflict {conflict_id} successfully resolved with action: {action}."
        }

    def reset_conflicts(self):
        self._seed_initial_conflicts()

conflict_engine = ConflictEngine()
