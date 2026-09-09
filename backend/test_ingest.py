import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.timetable_pipeline import timetable_pipeline

def test_pipeline():
    print("=== TIMETABLE INGESTION TEST ===")
    trains = timetable_pipeline.get_all_trains()
    print(f"Total trains ingested: {len(trains)}")
    assert len(trains) > 0, "No trains ingested"

    t = timetable_pipeline.get_train("12301")
    assert t is not None, "Train 12301 not found"
    print(f"Train 12301: {t['train_name']} ({t['origin_station_code']} -> {t['destination_station_code']}), {t['total_distance_km']} km, {t['total_halts']} halts")

    route = timetable_pipeline.get_train_route("12301")
    assert route is not None, "Route for 12301 not found"
    print(f"Train 12301 Route segments: {len(route['segments'])}")
    for seg in route["segments"]:
        print(f"  Segment: {seg['from_station_code']} ({seg['from_station_name']}) -> {seg['to_station_code']} ({seg['to_station_name']}): {seg['segment_distance_km']} km, {seg['scheduled_travel_time_mins']} mins, {seg['scheduled_speed_kmh']} km/h")

    stations = timetable_pipeline.get_all_stations()
    print(f"Total unique stations ingested: {len(stations)}")
    assert len(stations) > 0, "No stations ingested"

    stn = timetable_pipeline.get_station("NDLS")
    assert stn is not None, "Station NDLS not found"
    print(f"Station NDLS: {stn['station_name']}, Zone: {stn['zone']}, Serving trains: {stn['serving_trains']}")

    print("\n[OK] TIMETABLE INGESTION PIPELINE VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    test_pipeline()
