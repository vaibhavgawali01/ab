from fastapi import APIRouter, HTTPException
from typing import List
import json
import os
from app.schemas.api_schemas import RouteResponse

router = APIRouter(prefix="/routes", tags=["Routes & Corridors"])

def load_routes():
    data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "routes.json")
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("", response_model=List[RouteResponse])
def get_all_routes():
    """Retrieve all simulated railway corridors, stops, track parameters, and critical bottleneck areas."""
    return load_routes()

@router.get("/{route_id}", response_model=RouteResponse)
def get_route_by_id(route_id: str):
    """Retrieve details and bottleneck topology for a specific corridor."""
    routes = load_routes()
    for r in routes:
        if r["id"].lower() == route_id.lower() or r["code"].lower() == route_id.lower():
            return r
    raise HTTPException(status_code=404, detail=f"Route/Corridor {route_id} not found.")
