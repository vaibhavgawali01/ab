from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import json
import os
from app.schemas.api_schemas import CalculateETARequest, ETACalculationResponse

router = APIRouter(prefix="/calculate-eta", tags=["ETA Calculation"])

def get_train_and_corridor(train_number: str):
    data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "trains.json")
    with open(data_path, "r", encoding="utf-8") as f:
        trains = json.load(f)
    train = next((t for t in trains if t["train_number"].lower() == train_number.lower()), None)
    
    routes_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "routes.json")
    with open(routes_path, "r", encoding="utf-8") as f:
        routes = json.load(f)
    
    corridor = None
    if train:
        corridor = next((r for r in routes if r["code"] == train["corridor_code"]), None)
    
    return train, corridor

@router.post("", response_model=ETACalculationResponse)
def calculate_eta(req: CalculateETARequest):
    """
    Calculate dynamic updated ETA taking into account remaining distance, current track speed,
    weather degradation, simulated operational delay, and section recovery buffers.
    """
    train, corridor = get_train_and_corridor(req.train_number)
    train_name = train["name"] if train else f"Train {req.train_number}"
    total_km = corridor["total_distance_km"] if corridor else 1447.0
    
    # Calculate destination distance
    remaining_km = max(10.0, total_km - req.current_km)
    
    # Speed adjustment based on weather
    speed_factor = 1.0
    w = (req.weather_condition or "").lower()
    if "fog" in w:
        speed_factor = 0.72
    elif "rain" in w:
        speed_factor = 0.88
    
    effective_speed = max(35.0, (req.current_speed_kmh or 90.0) * speed_factor)
    
    # Calculate travel time in hours & minutes
    travel_time_hours = remaining_km / effective_speed
    travel_time_mins = int(round(travel_time_hours * 60))
    
    # Dynamic recovery buffer (Indian Railways schedules include slack for high-priority trains)
    recovery_buffer = 12 if (train and train["priority"] <= 2) else 5
    
    # Scheduled baseline parse
    try:
        if ":" in req.baseline_scheduled_arrival:
            parts = req.baseline_scheduled_arrival.split(":")
            base_time = datetime.now().replace(hour=int(parts[0]), minute=int(parts[1]), second=0)
        else:
            base_time = datetime.fromisoformat(req.baseline_scheduled_arrival)
    except Exception:
        base_time = datetime.now() + timedelta(hours=3)
    
    # Total expected delay minutes
    additional_weather_delay = int(round((1.0 - speed_factor) * 45))
    total_delay = max(0, (req.simulated_delay_mins or 0) + additional_weather_delay - recovery_buffer)
    
    predicted_arrival_time = base_time + timedelta(minutes=total_delay)
    
    ci_margin = 8 if "fog" in w else 4
    ci_str = f"±{ci_margin} mins ({max(0, total_delay - ci_margin)}m - {total_delay + ci_margin}m)"

    return ETACalculationResponse(
        train_number=req.train_number,
        train_name=train_name,
        destination_station=req.destination_station,
        remaining_distance_km=round(remaining_km, 1),
        estimated_travel_time_mins=travel_time_mins,
        scheduled_arrival=base_time.strftime("%H:%M"),
        predicted_arrival=predicted_arrival_time.strftime("%H:%M"),
        total_expected_delay_mins=total_delay,
        confidence_interval=ci_str,
        speed_factor_adjustment=round(speed_factor, 2),
        recovery_buffer_mins=recovery_buffer
    )
