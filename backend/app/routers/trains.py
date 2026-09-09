from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from app.services.timetable_pipeline import timetable_pipeline
import json
import os

router = APIRouter(prefix="/trains", tags=["Trains & Timetable"])

def load_simulated_statuses():
    """Load simulated operational telemetry status for trains."""
    try:
        data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "trains.json")
        with open(data_path, "r", encoding="utf-8") as f:
            trains_sim = json.load(f)
            return {t["train_number"]: t.get("status", {}) for t in trains_sim}
    except Exception:
        return {}

@router.get("", response_model=List[Dict[str, Any]])
def get_all_trains(
    search: Optional[str] = Query(None, description="Search by train number or name"),
    train_type: Optional[str] = Query(None, description="Filter by train type (e.g. Rajdhani, Vande Bharat, Shatabdi)")
):
    """
    Retrieve all trains from the ingested Indian Railways timetable dataset.
    Includes origin, destination, scheduled times, total distance, and operational status.
    """
    trains = timetable_pipeline.get_all_trains()
    sim_statuses = load_simulated_statuses()

    enriched_trains = []
    for t in trains:
        t_copy = dict(t)
        t_copy["status"] = sim_statuses.get(t["train_number"], {
            "current_status": "Running",
            "current_speed_kmh": 110.0,
            "current_km": round(t["total_distance_km"] * 0.45, 1),
            "last_reported_station": t["origin_station_code"],
            "next_station": t["halts"][1]["station_code"] if len(t["halts"]) > 1 else t["destination_station_code"],
            "simulated_delay_mins": 8,
            "signal_aspect": "Green",
            "block_section": f"{t['origin_station_code']}-{t['destination_station_code']} Section",
            "pnp_score": 95.0
        })
        # Backward compatibility fields for frontend UI
        t_copy["origin"] = t["origin_station_code"]
        t_copy["destination"] = t["destination_station_code"]
        t_copy["name"] = t["train_name"]
        t_copy["schedule"] = [
            {
                "station_code": h["station_code"],
                "station_name": h["station_name"],
                "scheduled_arr": h["arrival_time"],
                "scheduled_dep": h["departure_time"],
                "distance_km": h["distance_km"]
            }
            for h in t["halts"]
        ]

        if search:
            q = search.lower()
            if q not in t["train_number"].lower() and q not in t["train_name"].lower():
                continue
        if train_type:
            if train_type.lower() not in t["type"].lower():
                continue

        enriched_trains.append(t_copy)

    return enriched_trains

@router.get("/MMR-KPG", response_model=List[Dict[str, Any]])
def get_mmr_kpg_trains():
    """
    Retrieve all trains operating on the Manmad (MMR) <-> Kopargaon (KPG) single-track corridor.
    Includes full priority ratings, current delays, ML predicted delays, conflict hold records,
    and dynamically recalculated ETAs.
    """
    data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "trains.json")
    try:
        with open(data_path, "r", encoding="utf-8") as f:
            all_trains = json.load(f)
    except Exception:
        all_trains = []

    mmr_kpg_list = []
    for t in all_trains:
        # Check if train belongs to MMR-KPG corridor or has MMR and KPG halts
        halts = [h.get("station_code") for h in t.get("schedule", [])]
        is_mmr_kpg = (
            t.get("corridor_code") in ["MMR-KPG", "MMCT-MMR-KPG"]
            or ("MMR" in halts and "KPG" in halts)
            or t.get("train_number") in ["12432", "12131", "11077", "12780", "51503", "51504"]
        )

        if not is_mmr_kpg:
            continue

        status = t.get("status", {})
        schedule = t.get("schedule", [])
        
        dep_time = schedule[0]["scheduled_dep"] if schedule else "10:00"
        arr_time = schedule[-1]["scheduled_arr"] if schedule else "10:50"

        # Calculate breakdown delays
        curr_delay = status.get("current_delay_mins", status.get("simulated_delay_mins", 0))
        pred_delay = status.get("predicted_delay_mins", 3)
        hold_time = status.get("hold_time_mins", 0)
        total_delay = curr_delay + pred_delay + hold_time

        # Calculate updated ETA
        try:
            arr_parts = arr_time.split(":")
            base_min = int(arr_parts[0]) * 60 + int(arr_parts[1])
            updated_min = (base_min + total_delay) % 1440
            updated_eta = f"{updated_min // 60:02d}:{updated_min % 60:02d}"
        except Exception:
            updated_eta = arr_time

        # Determine normalized status
        if hold_time > 0 or "HELD" in status.get("hold_status", "").upper():
            norm_status = "HELD"
        elif status.get("conflict_status", "") == "CONFLICT DETECTED":
            norm_status = "CONFLICT"
        elif curr_delay > 5:
            norm_status = "DELAYED"
        elif pred_delay > 4:
            norm_status = "PREDICTED DELAY"
        else:
            norm_status = "ON TIME"

        prio_map = {1: "Rajdhani (P1)", 2: "Superfast (P2)", 3: "Express (P3)", 4: "Passenger (P4)"}

        train_item = {
            "train_number": t["train_number"],
            "train_name": t["name"],
            "train_type": t.get("type", "Express"),
            "priority": t.get("priority", 3),
            "priority_label": prio_map.get(t.get("priority", 3), "Express (P3)"),
            "corridor": "MMR-KPG (Single Track, 42 km)",
            "origin": t.get("origin", "MMR"),
            "destination": t.get("destination", "KPG"),
            "current_station": status.get("last_reported_station", "MMR"),
            "next_station": status.get("next_station", "KPG"),
            "current_km": status.get("current_km", 0),
            "total_km": 42,
            "scheduled_departure": dep_time,
            "scheduled_arrival": arr_time,
            "current_delay_mins": curr_delay,
            "predicted_delay_mins": pred_delay,
            "hold_time_mins": hold_time,
            "total_expected_delay_mins": total_delay,
            "delay_probability": status.get("delay_probability", 65),
            "scheduled_eta": arr_time,
            "updated_eta": updated_eta,
            "status": norm_status,
            "conflict": status.get("conflict_status", "NONE"),
            "conflict_with": status.get("conflict_with"),
            "hold_reason": status.get("hold_reason"),
            "signal_aspect": status.get("signal_aspect", "Green"),
            "block_section": status.get("block_section", "MMR-KPG Section"),
            "pnp_score": status.get("pnp_score", 85.0),
            "schedule": schedule
        }
        mmr_kpg_list.append(train_item)

    # Sort primarily by priority then scheduled departure
    mmr_kpg_list.sort(key=lambda x: (x["priority"], x["scheduled_departure"]))
    return mmr_kpg_list

@router.get("/{train_number}", response_model=Dict[str, Any])
def get_train_by_number(train_number: str):
    """
    Retrieve detailed timetable, ordered station sequences, scheduled times,
    and distance for a specific train number from the ingested timetable.
    """
    train = timetable_pipeline.get_train(train_number)
    if not train:
        raise HTTPException(status_code=404, detail=f"Train {train_number} not found in timetable dataset.")

    sim_statuses = load_simulated_statuses()
    train_copy = dict(train)
    train_copy["status"] = sim_statuses.get(str(train_number), {
        "current_status": "Running",
        "current_speed_kmh": 110.0,
        "current_km": round(train["total_distance_km"] * 0.45, 1),
        "last_reported_station": train["origin_station_code"],
        "next_station": train["halts"][1]["station_code"] if len(train["halts"]) > 1 else train["destination_station_code"],
        "simulated_delay_mins": 8,
        "signal_aspect": "Green",
        "block_section": f"{train['origin_station_code']} Block Section",
        "pnp_score": 95.0
    })
    train_copy["origin"] = train["origin_station_code"]
    train_copy["destination"] = train["destination_station_code"]
    train_copy["name"] = train["train_name"]
    train_copy["schedule"] = [
        {
            "station_code": h["station_code"],
            "station_name": h["station_name"],
            "scheduled_arr": h["arrival_time"],
            "scheduled_dep": h["departure_time"],
            "distance_km": h["distance_km"]
        }
        for h in train["halts"]
    ]

    return train_copy

@router.get("/{train_number}/route", response_model=Dict[str, Any])
def get_train_route(train_number: str):
    """
    Retrieve the train route object containing sequential stations and calculated
    segment information between consecutive stations (distance, travel time, scheduled speed).
    """
    route = timetable_pipeline.get_train_route(train_number)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route for train {train_number} not found.")

    return {
        "train_number": route["train_number"],
        "train_name": route["train_name"],
        "origin": route["origin"],
        "destination": route["destination"],
        "total_distance_km": route["total_distance_km"],
        "total_segments": route["total_segments"],
        "stations_sequence": route["stations_sequence"],
        "segments": route["segments"]
    }
