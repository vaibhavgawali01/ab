from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from app.services.timetable_pipeline import timetable_pipeline

router = APIRouter(prefix="/stations", tags=["Stations & Timetable"])

@router.get("", response_model=List[Dict[str, Any]])
def get_all_stations(
    zone: Optional[str] = Query(None, description="Filter by Railway Zone (e.g. NR, NCR, ECR, ER, WR, SR, SWR)"),
    search: Optional[str] = Query(None, description="Search by station code or name")
):
    """
    Retrieve all station objects created from the Indian Railways timetable dataset,
    including station code, name, coordinates, platforms, and serving trains.
    """
    stations = timetable_pipeline.get_all_stations()

    result = []
    for s in stations:
        stn_data = {
            "station_code": s["station_code"],
            "station_name": s["station_name"],
            "code": s["station_code"], # compatibility key
            "name": s["station_name"], # compatibility key
            "latitude": s["latitude"],
            "longitude": s["longitude"],
            "lat": s["latitude"],      # compatibility key
            "lng": s["longitude"],     # compatibility key
            "zone": s["zone"],
            "division": s.get("zone", "NR") + " Division",
            "platforms": s["platforms"],
            "category": "NSG-1" if s["platforms"] >= 10 else "NSG-2",
            "serving_trains": s["serving_trains"]
        }

        if zone and zone.lower() != s["zone"].lower():
            continue
        if search:
            q = search.lower()
            if q not in s["station_code"].lower() and q not in s["station_name"].lower():
                continue

        result.append(stn_data)

    return result

@router.get("/{station_code}", response_model=Dict[str, Any])
def get_station_by_code(station_code: str):
    """
    Retrieve metadata, geographical coordinates, and all serving train numbers
    for a specific station code from the ingested timetable.
    """
    s = timetable_pipeline.get_station(station_code)
    if not s:
        raise HTTPException(status_code=404, detail=f"Station with code {station_code} not found in timetable dataset.")

    return {
        "station_code": s["station_code"],
        "station_name": s["station_name"],
        "code": s["station_code"],
        "name": s["station_name"],
        "latitude": s["latitude"],
        "longitude": s["longitude"],
        "lat": s["latitude"],
        "lng": s["longitude"],
        "zone": s["zone"],
        "division": s.get("zone", "NR") + " Division",
        "platforms": s["platforms"],
        "category": "NSG-1" if s["platforms"] >= 10 else "NSG-2",
        "serving_trains": s["serving_trains"]
    }
