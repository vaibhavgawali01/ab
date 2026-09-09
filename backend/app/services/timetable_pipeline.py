"""
Indian Railways Timetable Data Ingestion Pipeline using Pandas.
Performs data cleaning, column standardization, sequence sorting, grouping,
route object generation, station registry extraction, and consecutive segment calculation.
"""

import pandas as pd
import numpy as np
import os
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

class TimetableIngestionPipeline:
    def __init__(self, csv_filepath: Optional[str] = None):
        if csv_filepath is None:
            self.csv_filepath = os.path.join(
                os.path.dirname(__file__), "..", "..", "data", "indian_railways_timetable.csv"
            )
        else:
            self.csv_filepath = csv_filepath

        self.df: Optional[pd.DataFrame] = None
        self.trains_cache: Dict[str, Dict[str, Any]] = {}
        self.routes_cache: Dict[str, Dict[str, Any]] = {}
        self.stations_cache: Dict[str, Dict[str, Any]] = {}
        self.ingest()

    def _clean_time_string(self, val: Any) -> str:
        """Standardize time strings into clean HH:MM format."""
        if pd.isna(val):
            return ""
        s = str(val).strip()
        if s.lower() in ["", "none", "nan", "null", "start", "end", "origin"]:
            return ""
        
        # Match HH:MM:SS or HH:MM
        match = re.match(r"^(\d{1,2}):(\d{2})(?::(\d{2}))?$", s)
        if match:
            h = int(match.group(1))
            m = int(match.group(2))
            return f"{h:02d}:{m:02d}"
        return s

    def _time_to_minutes(self, t_str: str) -> Optional[int]:
        """Convert HH:MM to total minutes from midnight."""
        if not t_str or ":" not in t_str:
            return None
        try:
            parts = t_str.split(":")
            return int(parts[0]) * 60 + int(parts[1])
        except Exception:
            return None

    def _calculate_travel_minutes(self, dep_str: str, arr_str: str) -> int:
        """Calculate scheduled transit minutes between departure and subsequent arrival (handles overnight)."""
        dep_m = self._time_to_minutes(dep_str)
        arr_m = self._time_to_minutes(arr_str)
        if dep_m is None or arr_m is None:
            return 30 # sensible default
        
        diff = arr_m - dep_m
        if diff <= 0:
            # Crossed midnight
            diff += 1440
        return max(5, diff)

    def ingest(self):
        """Execute the complete 9-step ingestion pipeline."""
        if not os.path.exists(self.csv_filepath):
            raise FileNotFoundError(f"Timetable dataset not found at {self.csv_filepath}")

        # Task 1: Load the CSV dataset
        raw_df = pd.read_csv(self.csv_filepath)

        # Task 2: Standardize column names (map from actual CSV headers to clean snake_case)
        column_mapping = {
            "Train No": "train_number",
            "Train Name": "train_name",
            "SEQ": "station_sequence",
            "Station Code": "station_code",
            "Station Name": "station_name",
            "Arrival time": "arrival_time",
            "Departure Time": "departure_time",
            "Distance": "distance_km",
            "Source Station": "source_station_code",
            "Source Station Name": "source_station_name",
            "Destination Station": "destination_station_code",
            "Destination Station Name": "destination_station_name"
        }
        df = raw_df.rename(columns=column_mapping)

        # Standardize strings (strip whitespace)
        for col in df.select_dtypes(include="object").columns:
            df[col] = df[col].astype(str).str.strip()

        # Task 3: Clean missing values and type cast
        df["train_number"] = df["train_number"].astype(str)
        df["station_sequence"] = pd.to_numeric(df["station_sequence"], errors="coerce").fillna(1).astype(int)
        df["distance_km"] = pd.to_numeric(df["distance_km"], errors="coerce").fillna(0.0).astype(float)

        # Task 4: Convert time columns into usable time formats
        df["arrival_time"] = df["arrival_time"].apply(self._clean_time_string)
        df["departure_time"] = df["departure_time"].apply(self._clean_time_string)

        # Fill origin arrival with departure, and terminal departure with arrival
        df.loc[(df["arrival_time"] == "") & (df["departure_time"] != ""), "arrival_time"] = df["departure_time"]
        df.loc[(df["departure_time"] == "") & (df["arrival_time"] != ""), "departure_time"] = df["arrival_time"]

        # If both are empty (fallback)
        df["arrival_time"] = df["arrival_time"].replace("", "00:00")
        df["departure_time"] = df["departure_time"].replace("", "00:00")

        # Task 5: Sort stations according to their station sequence
        df = df.sort_values(by=["train_number", "station_sequence"]).reset_index(drop=True)
        self.df = df

        # Task 6: Group records by train number
        grouped = df.groupby("train_number")

        trains_result = {}
        routes_result = {}
        stations_result = {}

        # Coordinate lookup for major Indian Railway stations
        coords = {
            "NDLS": {"lat": 28.6429, "lng": 77.2195, "zone": "NR", "platforms": 16},
            "GZB": {"lat": 28.6678, "lng": 77.4349, "zone": "NR", "platforms": 6},
            "ALJN": {"lat": 27.8974, "lng": 78.0880, "zone": "NCR", "platforms": 7},
            "TDL": {"lat": 27.2064, "lng": 78.2435, "zone": "NCR", "platforms": 5},
            "CNB": {"lat": 26.4547, "lng": 80.3507, "zone": "NCR", "platforms": 10},
            "PRYJ": {"lat": 25.4526, "lng": 81.8349, "zone": "NCR", "platforms": 10},
            "DDU": {"lat": 25.2818, "lng": 83.1182, "zone": "ECR", "platforms": 8},
            "BXR": {"lat": 25.5647, "lng": 83.9777, "zone": "ECR", "platforms": 3},
            "PNBE": {"lat": 25.6022, "lng": 85.1376, "zone": "ECR", "platforms": 10},
            "ASN": {"lat": 23.6871, "lng": 86.9746, "zone": "ER", "platforms": 7},
            "HWH": {"lat": 22.5839, "lng": 88.3426, "zone": "ER", "platforms": 23},
            "MTJ": {"lat": 27.4924, "lng": 77.6737, "zone": "NCR", "platforms": 10},
            "KOTA": {"lat": 25.2138, "lng": 75.8648, "zone": "WCR", "platforms": 6},
            "RTM": {"lat": 23.3441, "lng": 75.0352, "zone": "WR", "platforms": 7},
            "BRC": {"lat": 22.3107, "lng": 73.1812, "zone": "WR", "platforms": 7},
            "ST": {"lat": 21.2049, "lng": 72.8406, "zone": "WR", "platforms": 4},
            "BVI": {"lat": 19.2294, "lng": 72.8574, "zone": "WR", "platforms": 10},
            "MMCT": {"lat": 18.9696, "lng": 72.8193, "zone": "WR", "platforms": 5},
            "MAS": {"lat": 13.0827, "lng": 80.2757, "zone": "SR", "platforms": 17},
            "KPD": {"lat": 12.9692, "lng": 79.1378, "zone": "SR", "platforms": 5},
            "SBC": {"lat": 12.9781, "lng": 77.5694, "zone": "SWR", "platforms": 10},
            "MMR": {"lat": 20.2503, "lng": 74.4378, "zone": "CR", "platforms": 6},
            "KPG": {"lat": 19.8914, "lng": 74.4786, "zone": "CR", "platforms": 2}
        }

        # Task 7 & 9: Create train route objects and calculate segment information
        for train_no, train_group in grouped:
            first_row = train_group.iloc[0]
            last_row = train_group.iloc[-1]

            train_name = first_row["train_name"]
            source_code = first_row["source_station_code"] if "source_station_code" in first_row else first_row["station_code"]
            source_name = first_row["source_station_name"] if "source_station_name" in first_row else first_row["station_name"]
            dest_code = last_row["destination_station_code"] if "destination_station_code" in last_row else last_row["station_code"]
            dest_name = last_row["destination_station_name"] if "destination_station_name" in last_row else last_row["station_name"]
            total_distance = float(last_row["distance_km"])

            # Classify train type
            t_type = "Express"
            if "VANDE BHARAT" in train_name:
                t_type = "Vande Bharat"
            elif "RAJDHANI" in train_name:
                t_type = "Rajdhani Express"
            elif "SHATABDI" in train_name:
                t_type = "Shatabdi Express"
            elif "FREIGHT" in train_name or "BOXN" in train_no:
                t_type = "Freight"
            elif "SUPERFAST" in train_name or "PURUSHOTTAM" in train_name:
                t_type = "Superfast Express"

            stops_list = []
            segments_list = []

            rows = train_group.to_dict(orient="records")
            for i, r in enumerate(rows):
                stn_code = r["station_code"]
                stn_name = r["station_name"]
                
                # Register station object (Task 8)
                if stn_code not in stations_result:
                    coord_info = coords.get(stn_code, {"lat": 25.0, "lng": 80.0, "zone": "IR", "platforms": 4})
                    stations_result[stn_code] = {
                        "station_code": stn_code,
                        "station_name": stn_name,
                        "latitude": coord_info["lat"],
                        "longitude": coord_info["lng"],
                        "zone": coord_info["zone"],
                        "platforms": coord_info["platforms"],
                        "serving_trains": []
                    }
                
                if train_no not in stations_result[stn_code]["serving_trains"]:
                    stations_result[stn_code]["serving_trains"].append(train_no)

                stop_obj = {
                    "sequence": int(r["station_sequence"]),
                    "station_code": stn_code,
                    "station_name": stn_name,
                    "arrival_time": r["arrival_time"],
                    "departure_time": r["departure_time"],
                    "distance_km": float(r["distance_km"])
                }
                stops_list.append(stop_obj)

                # Task 9: Calculate segment information between consecutive stations
                if i > 0:
                    prev_r = rows[i - 1]
                    seg_dist = max(1.0, float(r["distance_km"]) - float(prev_r["distance_km"]))
                    travel_mins = self._calculate_travel_minutes(prev_r["departure_time"], r["arrival_time"])
                    speed_kmh = round(seg_dist / (travel_mins / 60.0), 1)

                    segment_obj = {
                        "segment_index": i,
                        "from_station_code": prev_r["station_code"],
                        "from_station_name": prev_r["station_name"],
                        "to_station_code": stn_code,
                        "to_station_name": stn_name,
                        "segment_distance_km": round(seg_dist, 1),
                        "scheduled_travel_time_mins": travel_mins,
                        "scheduled_speed_kmh": speed_kmh
                    }
                    segments_list.append(segment_obj)

            # Average speed over entire journey
            total_time_mins = sum(s["scheduled_travel_time_mins"] for s in segments_list) if segments_list else 120
            avg_journey_speed = round(total_distance / (total_time_mins / 60.0), 1) if total_time_mins > 0 else 75.0

            # Complete Train Object
            train_obj = {
                "train_number": str(train_no),
                "train_name": train_name,
                "type": t_type,
                "origin_station_code": source_code,
                "origin_station_name": source_name,
                "destination_station_code": dest_code,
                "destination_station_name": dest_name,
                "departure_time": first_row["departure_time"],
                "arrival_time": last_row["arrival_time"],
                "total_distance_km": total_distance,
                "total_halts": len(stops_list),
                "average_speed_kmh": avg_journey_speed,
                "halts": stops_list
            }
            trains_result[str(train_no)] = train_obj

            # Route Object with Segments
            route_obj = {
                "train_number": str(train_no),
                "train_name": train_name,
                "origin": source_code,
                "destination": dest_code,
                "total_distance_km": total_distance,
                "total_segments": len(segments_list),
                "stations_sequence": [s["station_code"] for s in stops_list],
                "segments": segments_list
            }
            routes_result[str(train_no)] = route_obj

        self.trains_cache = trains_result
        self.routes_cache = routes_result
        self.stations_cache = stations_result

    def get_all_trains(self) -> List[Dict[str, Any]]:
        return list(self.trains_cache.values())

    def get_train(self, train_number: str) -> Optional[Dict[str, Any]]:
        return self.trains_cache.get(str(train_number).strip())

    def get_train_route(self, train_number: str) -> Optional[Dict[str, Any]]:
        return self.routes_cache.get(str(train_number).strip())

    def get_all_stations(self) -> List[Dict[str, Any]]:
        return list(self.stations_cache.values())

    def get_station(self, station_code: str) -> Optional[Dict[str, Any]]:
        return self.stations_cache.get(str(station_code).strip().upper())

# Global singleton instance
timetable_pipeline = TimetableIngestionPipeline()
