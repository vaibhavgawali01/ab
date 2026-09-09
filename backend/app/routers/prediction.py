from fastapi import APIRouter, HTTPException
import json
import os
from app.schemas.api_schemas import PredictDelayRequest, PredictDelayResponse
from app.ml.delay_model import delay_predictor

router = APIRouter(prefix="/predict-delay", tags=["Delay Prediction & ML"])

def get_train_info(train_number: str):
    data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "trains.json")
    with open(data_path, "r", encoding="utf-8") as f:
        trains = json.load(f)
    for t in trains:
        if t["train_number"].lower() == train_number.lower():
            return t
    return None

@router.post("", response_model=PredictDelayResponse)
def predict_train_delay(req: PredictDelayRequest):
    """
    Predict train arrival delay using historical training patterns, weather, congestion, and TSR data.
    Provides feature attribution explaining top contributing delay factors.
    """
    train_info = get_train_info(req.train_number)
    priority = train_info["priority"] if train_info else 3
    train_name = train_info["name"] if train_info else f"Special Express {req.train_number}"

    prediction = delay_predictor.predict(
        train_priority=priority,
        departure_hour=req.departure_hour,
        day_of_week=req.day_of_week,
        weather=req.weather,
        visibility_meters=req.visibility_meters,
        congestion_level=req.congestion_level,
        tsr_kmh=req.temporary_speed_restriction_kmh or 110
    )

    return PredictDelayResponse(
        train_number=req.train_number,
        train_name=train_name,
        predicted_delay_mins=prediction["predicted_delay_mins"],
        confidence_score=prediction["confidence_score"],
        delay_severity=prediction["delay_severity"],
        risk_level=prediction["risk_level"],
        primary_driver=prediction["primary_driver"],
        top_factors=prediction["top_factors"],
        mitigation_suggestion=prediction["mitigation_suggestion"]
    )
