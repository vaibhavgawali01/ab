from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.services.manmad_engine import manmad_engine

router = APIRouter(prefix="/manmad", tags=["Manmad Junction Hub"])

class OverrideRequest(BaseModel):
    conflict_id: str = Field(..., example="MMR-CONF-01")
    favored_train: str = Field(..., example="11078")
    reason: str = Field(..., example="VIP Movement / Precedence Inversion")
    controller_id: Optional[str] = Field("SC-BHUSAWAL-04", example="SC-BHUSAWAL-04")
    notes: Optional[str] = Field("", example="Authorized by Senior Divisional Operations Manager (Sr. DOM)")

class EmergencyRequest(BaseModel):
    scenario_type: str = Field(..., example="medical_emergency", description="medical_emergency | track_obstruction | engineering_block | clear")

class WeatherUpdateRequest(BaseModel):
    visibility_meters: int = Field(..., example=180, description="Meters (<200 triggers fog_flag)")
    condition: Optional[str] = Field("Dense Winter Fog", example="Dense Winter Fog")
    rainfall_mm: Optional[float] = Field(0.0, example=0.0)

@router.get("/overview")
def get_station_overview():
    """
    Get comprehensive station overview for Manmad Junction (MMR):
    Platforms status, 4 converging lines, IMD weather, active conflicts, interlocking health.
    """
    return manmad_engine.get_station_overview()

@router.get("/platforms")
def get_platforms():
    """
    Get live platform status and assignments for Platforms 1 to 6.
    """
    return {
        "station": "MMR",
        "platforms": manmad_engine.get_platforms()
    }

@router.get("/conflicts")
def get_conflicts():
    """
    Centerpiece Two-Train Conflict Resolution Engine.
    Includes:
    - 6-Factor Side-by-Side Priority Comparison
    - Precedence Decision (Favored vs Held train)
    - Dual Distinct Explainability:
        1. 'Why did this conflict happen?'
        2. 'Why was this train given precedence?'
    """
    return {
        "station": "MMR",
        "conflicts": manmad_engine.get_conflicts(),
        "audit_logs": manmad_engine.get_audit_logs()
    }

@router.post("/conflicts/override")
def override_conflict_decision(payload: OverrideRequest):
    """
    Manual Section Controller Override.
    Allows manual reversal of precedence with mandatory audit logging and reason classification.
    """
    try:
        result = manmad_engine.apply_controller_override(
            conflict_id=payload.conflict_id,
            new_favored_train=payload.favored_train,
            override_reason=payload.reason,
            controller_id=payload.controller_id,
            notes=payload.notes
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/conflicts/trigger-emergency")
def trigger_emergency(payload: EmergencyRequest):
    """
    Trigger real-world emergency scenarios:
    - 'medical_emergency': Overrides priority above Rajdhani
    - 'track_obstruction': Boulder/rail fracture, halts all traffic at home signals
    - 'engineering_block': 4-hour OHE block, reroutes via loop
    - 'clear': Restores normal operations
    """
    try:
        result = manmad_engine.trigger_emergency_scenario(payload.scenario_type)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/weather")
def update_weather(payload: WeatherUpdateRequest):
    """
    Update simulated IMD Nashik weather conditions.
    Setting visibility < 200m triggers automatic fog_flag and yard speed restrictions.
    """
    updated_weather = manmad_engine.update_weather(
        visibility_m=payload.visibility_meters,
        condition=payload.condition,
        rainfall_mm=payload.rainfall_mm
    )
    return {"success": True, "weather": updated_weather}

@router.get("/timetable/tomorrow")
def get_tomorrow_timetable():
    """
    Tomorrow's Scheduled Timetable for Manmad Junction (24-hour forward look).
    Clearly labeled [Static Scheduled Timetable - Not ML].
    """
    return {
        "station": "MMR",
        "service_date": "Tomorrow (Scheduled 24-Hour Cycle)",
        "label": "[Static Scheduled Timetable - Not ML]",
        "total_trains": len(manmad_engine.get_tomorrow_timetable()),
        "timetable": manmad_engine.get_tomorrow_timetable()
    }

@router.get("/audit-logs")
def get_audit_logs():
    """
    Get audit history of Section Controller manual overrides.
    """
    return {
        "station": "MMR",
        "audit_logs": manmad_engine.get_audit_logs()
    }

# --- Dynamic Platform Assignment & Operational Reasoning ---

class ReassignPlatformRequest(BaseModel):
    train_no: str = Field(..., example="22222")
    new_platform: int = Field(..., example=3)
    reason: str = Field(..., example="Track circuit maintenance block on Platform 1 Down Main")
    controller_id: Optional[str] = Field("SC-BHUSAWAL-04", example="SC-BHUSAWAL-04")

class SimulatePlatformRequest(BaseModel):
    scenario_name: str = Field(..., example="pf1_blocked", description="pf1_blocked | reset")

@router.get("/platforms/dynamic")
def get_dynamic_platform_assignments():
    """
    Returns active dynamic platform assignments for incoming and berthed trains,
    including detailed operational reasons, CSL safety checks, track geometry, and alternatives.
    """
    return {
        "station": "MMR",
        "timestamp": "Live Interlocking RRI Status",
        "dynamic_assignments": manmad_engine.get_dynamic_platform_assignments()
    }

@router.post("/platforms/reassign")
def reassign_platform(payload: ReassignPlatformRequest):
    """
    Dynamically reassign a train to a different platform with CSL safety validation and reason logging.
    """
    try:
        result = manmad_engine.reassign_platform(
            train_no=payload.train_no,
            new_platform=payload.new_platform,
            reason=payload.reason,
            controller_id=payload.controller_id
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/platforms/simulate")
def simulate_platform_contingency(payload: SimulatePlatformRequest):
    """
    Simulate platform contingency (e.g. Platform 1 blocked due to track maintenance).
    """
    try:
        result = manmad_engine.simulate_platform_scenario(payload.scenario_name)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

