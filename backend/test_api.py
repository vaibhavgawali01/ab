import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing /health...")
    res = client.get("/health")
    assert res.status_code == 200, res.text
    print("[OK] /health:", res.json())

    print("Testing /trains...")
    res = client.get("/trains")
    assert res.status_code == 200, res.text
    trains = res.json()
    assert len(trains) > 0
    print(f"[OK] /trains: {len(trains)} trains found")

    print("Testing /trains/{train_number}...")
    res = client.get("/trains/12301")
    assert res.status_code == 200, res.text
    t12301 = res.json()
    assert t12301["train_number"] == "12301"
    print(f"[OK] /trains/12301: {t12301['train_name']}, {len(t12301['halts'])} halts")

    print("Testing /trains/{train_number}/route...")
    res = client.get("/trains/12301/route")
    assert res.status_code == 200, res.text
    r12301 = res.json()
    assert "segments" in r12301 and len(r12301["segments"]) > 0
    print(f"[OK] /trains/12301/route: {len(r12301['segments'])} segments calculated")

    print("Testing /routes...")
    res = client.get("/routes")
    assert res.status_code == 200, res.text
    routes = res.json()
    assert len(routes) > 0
    print(f"[OK] /routes: {len(routes)} routes found")

    print("Testing /stations...")
    res = client.get("/stations")
    assert res.status_code == 200, res.text
    stations = res.json()
    assert len(stations) > 0
    print(f"[OK] /stations: {len(stations)} stations found")

    print("Testing /stations/{station_code}...")
    res = client.get("/stations/NDLS")
    assert res.status_code == 200, res.text
    s_ndls = res.json()
    assert s_ndls["station_code"] == "NDLS"
    print(f"[OK] /stations/NDLS: {s_ndls['station_name']}, Serving: {s_ndls['serving_trains']}")

    print("Testing /replay...")
    res = client.get("/replay")
    assert res.status_code == 200, res.text
    replay = res.json()
    assert "trains" in replay
    print(f"[OK] /replay: {len(replay['trains'])} simulated trains active")

    print("Testing /predict-delay...")
    payload = {
        "train_number": "12301",
        "current_station": "PRYJ",
        "departure_hour": 3,
        "day_of_week": "Friday",
        "weather": "Dense Fog",
        "visibility_meters": 150,
        "congestion_level": "High"
    }
    res = client.post("/predict-delay", json=payload)
    assert res.status_code == 200, res.text
    pred = res.json()
    assert "predicted_delay_mins" in pred
    print(f"[OK] /predict-delay: Predicted Delay = {pred['predicted_delay_mins']} mins, Driver = {pred['primary_driver']}")

    print("Testing /calculate-eta...")
    eta_payload = {
        "train_number": "12301",
        "current_km": 890,
        "destination_station": "NDLS",
        "current_speed_kmh": 110,
        "baseline_scheduled_arrival": "10:05",
        "weather_condition": "Dense Fog",
        "simulated_delay_mins": 14
    }
    res = client.post("/calculate-eta", json=eta_payload)
    assert res.status_code == 200, res.text
    eta_data = res.json()
    assert "predicted_arrival" in eta_data
    print(f"[OK] /calculate-eta: Scheduled={eta_data['scheduled_arrival']}, Predicted={eta_data['predicted_arrival']}")

    print("Testing /conflicts...")
    res = client.get("/conflicts")
    assert res.status_code == 200, res.text
    conflicts = res.json()
    assert conflicts["total_active_conflicts"] > 0
    print(f"[OK] /conflicts: {conflicts['total_active_conflicts']} active conflicts found")

    print("Testing /analytics...")
    res = client.get("/analytics")
    assert res.status_code == 200, res.text
    analytics = res.json()
    assert "system_punctuality_percentage" in analytics
    print(f"[OK] /analytics: Punctuality = {analytics['system_punctuality_percentage']}%")

    print("\nALL 8 BACKEND CORE ENDPOINTS VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
