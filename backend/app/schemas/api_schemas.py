from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Prototype Notice schema
class PrototypeMeta(BaseModel):
    is_prototype: bool = True
    disclaimer: str = "Prototype data for demonstration and simulation purposes. Not connected to live Indian Railways/CRIS feeds."
    generated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

# Station Schemas
class StationBase(BaseModel):
    code: str
    name: str
    lat: float
    lng: float
    zone: str
    division: str
    platforms: int
    category: str

class StationResponse(StationBase):
    pass

# Route Schemas
class RouteStop(BaseModel):
    station_code: str
    km: float
    order: int

class CriticalBottleneck(BaseModel):
    location: str
    km: float
    reason: str

class RouteResponse(BaseModel):
    id: str
    code: str
    name: str
    total_distance_km: float
    electrified: bool
    tracks: int
    max_permissible_speed_kmh: int
    stops: List[RouteStop]
    critical_bottlenecks: List[CriticalBottleneck]

# Train Schemas
class ScheduleStop(BaseModel):
    station_code: str
    day: int
    scheduled_arr: str
    scheduled_dep: str
    distance_km: float
    platform: Optional[str] = None
    predicted_arr: Optional[str] = None
    predicted_delay_mins: Optional[int] = None

class TrainStatus(BaseModel):
    current_status: str
    current_km: float
    current_speed_kmh: float
    last_reported_station: str
    next_station: str
    simulated_delay_mins: int
    signal_aspect: str
    block_section: str
    pnp_score: float

class TrainResponse(BaseModel):
    train_number: str
    name: str
    type: str
    priority: int
    corridor_code: str
    origin: str
    destination: str
    locomotive: Optional[str] = None
    rake_type: Optional[str] = None
    max_speed_kmh: int
    avg_speed_kmh: float
    schedule: List[ScheduleStop]
    status: TrainStatus

# Replay Schemas
class ReplayTrainPosition(BaseModel):
    train_number: str
    name: str
    type: str
    lat: float
    lng: float
    current_km: float
    speed_kmh: float
    heading_deg: float
    signal_aspect: str
    block_section: str
    delay_mins: int
    status_label: str
    next_station: str

class ReplayStateResponse(BaseModel):
    meta: PrototypeMeta = Field(default_factory=PrototypeMeta)
    simulation_time: str
    time_multiplier: int
    corridor_code: str
    active_trains_count: int
    trains: List[ReplayTrainPosition]
    network_alerts_count: int

class ReplayStepRequest(BaseModel):
    corridor_code: Optional[str] = "NDLS-HWH"
    time_multiplier: Optional[int] = 1
    step_seconds: Optional[int] = 30

# Prediction Schemas
class PredictDelayRequest(BaseModel):
    train_number: str
    current_station: str
    destination_station: Optional[str] = None
    departure_hour: int = Field(ge=0, le=23, default=14)
    day_of_week: str = "Wednesday"
    weather: str = "Clear" # Clear, Fog, Rain, Severe Fog
    visibility_meters: int = 2500
    congestion_level: str = "Moderate" # Low, Moderate, High, Severe
    temporary_speed_restriction_kmh: Optional[int] = 110

class FeatureImportance(BaseModel):
    feature: str
    impact_mins: float
    description: str

class PredictDelayResponse(BaseModel):
    meta: PrototypeMeta = Field(default_factory=PrototypeMeta)
    train_number: str
    train_name: str
    predicted_delay_mins: int
    confidence_score: float
    delay_severity: str
    risk_level: str
    primary_driver: str
    top_factors: List[FeatureImportance]
    mitigation_suggestion: str

# ETA Calculation Schemas
class CalculateETARequest(BaseModel):
    train_number: str
    current_km: float
    destination_station: str
    current_speed_kmh: float
    baseline_scheduled_arrival: str # HH:MM or ISO
    weather_condition: Optional[str] = "Clear"
    simulated_delay_mins: Optional[int] = 0

class ETACalculationResponse(BaseModel):
    meta: PrototypeMeta = Field(default_factory=PrototypeMeta)
    train_number: str
    train_name: str
    destination_station: str
    remaining_distance_km: float
    estimated_travel_time_mins: int
    scheduled_arrival: str
    predicted_arrival: str
    total_expected_delay_mins: int
    confidence_interval: str
    speed_factor_adjustment: float
    recovery_buffer_mins: int

# Conflict Schemas
class ConflictItem(BaseModel):
    id: str
    corridor_code: str
    conflict_type: str
    severity: str
    location: str
    train_primary: str
    train_secondary: str
    description: str
    recommended_action: str
    resolved: bool = False
    resolution_applied: Optional[str] = None
    detected_at: str

class ConflictsResponse(BaseModel):
    meta: PrototypeMeta = Field(default_factory=PrototypeMeta)
    total_active_conflicts: int
    critical_count: int
    conflicts: List[ConflictItem]

class ResolveConflictRequest(BaseModel):
    conflict_id: str
    resolution_action: str # "LoopLineHold", "PrecedenceOverride", "SpeedAdvisory", "Reroute"
    notes: Optional[str] = None

class ResolveConflictResponse(BaseModel):
    meta: PrototypeMeta = Field(default_factory=PrototypeMeta)
    conflict_id: str
    success: bool
    status: str
    message: str

# Analytics Schemas
class CorridorPunctuality(BaseModel):
    corridor_name: str
    corridor_code: str
    punctuality_percentage: float
    trains_monitored: int
    avg_delay_mins: float

class DelayCauseBreakdown(BaseModel):
    cause: str
    percentage: float
    impact_hours: float
    color: str

class AnalyticsResponse(BaseModel):
    meta: PrototypeMeta = Field(default_factory=PrototypeMeta)
    system_punctuality_percentage: float
    total_trains_tracked_today: int
    average_network_delay_mins: float
    active_conflicts_count: int
    on_time_trains: int
    delayed_trains: int
    corridor_metrics: List[CorridorPunctuality]
    delay_causes: List[DelayCauseBreakdown]
    hourly_punctuality_trend: List[Dict[str, Any]]
    top_bottlenecks: List[Dict[str, Any]]
