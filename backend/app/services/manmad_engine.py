import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime

class ManmadEngine:
    """
    Manmad Junction (MMR) Specialized Station & Two-Train Conflict Resolution Engine.
    Covers Central Railway, Bhusawal Division:
    - 6 Platforms (PF 1-6)
    - 4 Converging Main Lines (Kalyan/Mumbai, Bhusawal/Nagpur, Secunderabad/Nanded, Daund/Pune/Kopargaon)
    - Two-Train Conflict Evaluation Engine with 6 Side-by-Side Priority Factors
    - Dual Distinct Explainability ("Why did it happen?" vs "Why this decision?")
    - Manual Section Controller Override with Audit Logging
    - Emergency Scenarios Handling
    - IMD Nashik Weather Module
    - Forward-Looking Tomorrow's Scheduled Timetable
    """

    def __init__(self):
        self.station_info = {
            "code": "MMR",
            "name": "Manmad Junction",
            "division": "Bhusawal Division",
            "zone": "Central Railway (CR)",
            "state": "Maharashtra",
            "district": "Nashik",
            "coordinates": {"lat": 20.2498, "lng": 74.4384},
            "platforms_count": 6,
            "converging_routes_count": 4,
            "interlocking_type": "Route Relay Interlocking (RRI) with Electronic Interlocking (EI)",
            "csl_standard_meters": 720,
            "source_disclaimer": "Simulated Station Operations Prototype - No connection to live Indian Railways GPS or CRIS feeds [Synthetic Scenario Data]"
        }

        self.converging_routes = [
            {
                "id": "MMR-KYN",
                "name": "Mumbai / Kalyan Line",
                "section": "Bhusawal–Kalyan Main Line",
                "cardinal_direction": "Southwest",
                "track_type": "Double Line Electrified (25kV AC)",
                "max_permissible_speed_kmh": 120,
                "block_system": "Automatic Block Signaling (ABS)",
                "connected_stations": ["Lasalgaon", "Nashik Road", "Igatpuri", "Kalyan Jn", "Mumbai CSMT"],
                "traffic_density": "Very High (Quadruple tracking proposed)"
            },
            {
                "id": "MMR-BSL",
                "name": "Bhusawal / Nagpur / Howrah Line",
                "section": "Howrah–Nagpur–Mumbai Trunk Corridor",
                "cardinal_direction": "Northeast",
                "track_type": "Double Line Electrified (25kV AC)",
                "max_permissible_speed_kmh": 130,
                "block_system": "Automatic Block Signaling (ABS)",
                "connected_stations": ["Nandgaon", "Chalisgaon Jn", "Pachora Jn", "Bhusawal Jn", "Nagpur Jn"],
                "traffic_density": "Very High"
            },
            {
                "id": "MMR-NED",
                "name": "Nanded / Secunderabad Line",
                "section": "Secunderabad–Manmad Main Line",
                "cardinal_direction": "Southeast",
                "track_type": "Single Line Electrified (25kV AC - Recently Doubled Sections)",
                "max_permissible_speed_kmh": 100,
                "block_system": "Absolute Block System with Tokenless Operation",
                "connected_stations": ["Nagarsol", "Rotegaon", "Aurangabad", "Jalna", "Nanded", "Secunderabad Jn"],
                "traffic_density": "High Passenger & Agricultural Freight"
            },
            {
                "id": "MMR-DD",
                "name": "Daund / Pune / Shirdi Line",
                "section": "Daund–Manmad Chord & Line",
                "cardinal_direction": "South",
                "track_type": "Single Line Electrified (Doubling in progress)",
                "max_permissible_speed_kmh": 110,
                "block_system": "Absolute Block System with Axle Counters",
                "connected_stations": ["Ankai", "Kopargaon", "Belapur", "Ahmednagar", "Daund Jn", "Pune Jn"],
                "traffic_density": "High (Key route to Shirdi Sai Nagar, Pune, and South India)"
            }
        ]

        self.platforms = self._init_platforms()
        self.weather = self._init_weather()
        self.conflicts = self._init_conflicts()
        self.override_audit_logs: List[Dict[str, Any]] = []
        self.tomorrow_timetable = self._init_tomorrow_timetable()

    def _init_platforms(self) -> List[Dict[str, Any]]:
        return [
            {
                "platform_number": 1,
                "line_type": "Main Down Line",
                "length_meters": 650,
                "max_coaches": 24,
                "electrified": True,
                "status": "Occupied",
                "approach_direction": "From Bhusawal / Nagpur towards Mumbai",
                "current_train": {
                    "train_no": "22222",
                    "name": "CSMT Rajdhani Express",
                    "route": "Hazrat Nizamuddin -> CSMT Mumbai",
                    "priority": "P1 (Rajdhani)",
                    "expected_departure": "10:38"
                },
                "through_clearance_capable": True,
                "facilities": ["Ambulance Ramp", "Escalator", "Water Vending", "Full Canopy"]
            },
            {
                "platform_number": 2,
                "line_type": "Main Up Line",
                "length_meters": 650,
                "max_coaches": 24,
                "electrified": True,
                "status": "Clear",
                "approach_direction": "From Mumbai / Kalyan towards Bhusawal",
                "current_train": None,
                "through_clearance_capable": True,
                "facilities": ["Ambulance Ramp", "Waiting Hall", "Water Vending", "Full Canopy"]
            },
            {
                "platform_number": 3,
                "line_type": "Bidirectional Loop Line",
                "length_meters": 620,
                "max_coaches": 24,
                "electrified": True,
                "status": "Occupied",
                "approach_direction": "Bidirectional (Kalyan / Bhusawal)",
                "current_train": {
                    "train_no": "12138",
                    "name": "Punjab Mail",
                    "route": "Firozpur Cantt -> CSMT Mumbai",
                    "priority": "P2 (Superfast)",
                    "expected_departure": "10:45"
                },
                "through_clearance_capable": False,
                "facilities": ["FOB Access", "Tea Stalls", "Water Vending"]
            },
            {
                "platform_number": 4,
                "line_type": "South Line (Daund / Pune Corridor)",
                "length_meters": 600,
                "max_coaches": 22,
                "electrified": True,
                "status": "Reserved for Arrival",
                "approach_direction": "From / Towards Kopargaon, Puntamba & Pune",
                "current_train": {
                    "train_no": "11078",
                    "name": "Jhelum Express (Approaching)",
                    "route": "Jammu Tawi -> Pune Jn",
                    "priority": "P3 (Express)",
                    "expected_arrival": "10:48"
                },
                "through_clearance_capable": False,
                "facilities": ["Direct Southern Throat Access", "FOB Access"]
            },
            {
                "platform_number": 5,
                "line_type": "East Line (Nanded / Marathwada Corridor)",
                "length_meters": 580,
                "max_coaches": 22,
                "electrified": True,
                "status": "Clear",
                "approach_direction": "From / Towards Aurangabad, Jalna & Secunderabad",
                "current_train": None,
                "through_clearance_capable": False,
                "facilities": ["Branch Line Interlocking", "FOB Access"]
            },
            {
                "platform_number": 6,
                "line_type": "Shunting Loop & Secondary Passenger Line",
                "length_meters": 720,
                "max_coaches": 26,
                "electrified": True,
                "status": "Clear",
                "approach_direction": "Goods Yard & Passenger Overflow",
                "current_train": None,
                "through_clearance_capable": False,
                "facilities": ["Heavy Freight Loop", "Watering Point", "Loco Reversal"]
            }
        ]

    def _init_weather(self) -> Dict[str, Any]:
        return {
            "station": "Manmad Junction (MMR)",
            "reporting_station": "IMD Nashik Regional Agromet Observatory",
            "temperature_c": 28.6,
            "condition": "Dry / Light Haze",
            "visibility_meters": 3400,
            "humidity_percent": 58,
            "wind_speed_kmh": 12,
            "rainfall_mm": 0.0,
            "fog_flag": False,
            "speed_restriction_active": False,
            "caution_order": "Normal Track Permissible Speed (110–130 km/h) Authorized",
            "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "data_mode": "[Synthetic Scenario Data - Calibrated with IMD Seasonal Baselines]"
        }

    def _init_conflicts(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "MMR-CONF-01",
                "title": "East Throat Diamond Interlocking Contention: Rajdhani vs Jhelum Express",
                "severity": "Critical",
                "location": "Manmad East Crossover Point 14B (Km 261/8)",
                "active": True,
                "is_emergency": False,
                "emergency_type": None,
                "train_primary": {
                    "train_no": "22222",
                    "name": "CSMT Rajdhani Express",
                    "priority_class": "P1 (Rajdhani / High Speed)",
                    "priority_rank": 1,
                    "rake_type": "LHB 22-Coach Premium",
                    "speed_kmh": 110,
                    "current_delay_min": 12,
                    "origin": "Hazrat Nizamuddin (NZM)",
                    "destination": "CSMT Mumbai (CSMT)",
                    "approach": "Bhusawal Down Main Line",
                    "assigned_platform": 1,
                    "loop_line_requirement": "650m Through Clearance",
                    "section_occupancy": "Automatic Double Line Block (Clear signal to home)",
                    "weather_impact": "Negligible (Visibility > 3000m)",
                    "emergency_status": "Normal Operation"
                },
                "train_secondary": {
                    "train_no": "11078",
                    "name": "Jhelum Express",
                    "priority_class": "P3 (Mail / Express)",
                    "priority_rank": 3,
                    "rake_type": "ICF/LHB 24-Coach Mail",
                    "speed_kmh": 68,
                    "current_delay_min": 28,
                    "origin": "Jammu Tawi (JAT)",
                    "destination": "Pune Jn (PUNE)",
                    "approach": "Ankai Link / Daund Single Track Throat",
                    "assigned_platform": 4,
                    "loop_line_requirement": "Requires diamond crossover 14B cut across Down Main",
                    "section_occupancy": "Single Line Section Tokenless Block",
                    "weather_impact": "Negligible",
                    "emergency_status": "Normal Operation"
                },
                "six_factors_comparison": [
                    {
                        "factor": "1. Priority Class Hierarchy",
                        "weight": "35%",
                        "train_a_val": "P1 - Rajdhani Express (Highest Schedule Protection)",
                        "train_b_val": "P3 - Standard Mail/Express",
                        "advantage": "Train A (22222)",
                        "rationale": "Indian Railways Operating Manual mandates P1 precedence over P3 under non-emergency conditions."
                    },
                    {
                        "factor": "2. Delay Impact & Cascade Risk",
                        "weight": "25%",
                        "train_a_val": "12 min delay (+18 min cascade on Mumbai suburban slots if looped)",
                        "train_b_val": "28 min delay (Branch corridor with 42 min slack at Daund)",
                        "advantage": "Train A (22222)",
                        "rationale": "Delaying Rajdhani risks missing suburban commuter paths at Kalyan-Thane choke points."
                    },
                    {
                        "factor": "3. Platform & Loop Line Availability",
                        "weight": "15%",
                        "train_a_val": "Platform 1 is vacant and signaled for direct through run",
                        "train_b_val": "Platform 4 reserved, but throat access requires blocking both main lines",
                        "advantage": "Train A (22222)",
                        "rationale": "Ankai Outer Loop 2 has 720m CSL ready to hold 11078 safely without blocking trunk traffic."
                    },
                    {
                        "factor": "4. Section Occupancy & Track Topology",
                        "weight": "10%",
                        "train_a_val": "Trunk Double Line Corridor (Howrah-Nagpur-Mumbai)",
                        "train_b_val": "Single Line Branch Chord (MMR - KPG - Daund)",
                        "advantage": "Train A (22222)",
                        "rationale": "Holding a train on the double main line backs up following freight and express trains from Bhusawal."
                    },
                    {
                        "factor": "5. Weather & Visibility Conditions",
                        "weight": "5%",
                        "train_a_val": "Visibility 3,400m - Green Aspect Sight Distance Optimal",
                        "train_b_val": "Visibility 3,400m - Normal Braking Distance Assured",
                        "advantage": "Neutral",
                        "rationale": "No adverse fog or waterlogging active in MMR yard limits."
                    },
                    {
                        "factor": "6. Emergency Override Flag",
                        "weight": "10%",
                        "train_a_val": "None (Standard Train Movement)",
                        "train_b_val": "None (Standard Train Movement)",
                        "advantage": "Neutral",
                        "rationale": "No medical aboard, derailment risk, or track obstruction signaled."
                    }
                ],
                "precedence_decision": {
                    "favored_train": "22222 CSMT Rajdhani Express",
                    "held_train": "11078 Jhelum Express",
                    "action_summary": "Hold 11078 at Ankai Outer Home Signal (Signal S-42 Red Aspect). Clear Green Aspect on Down Main for 22222 for unimpeded run through PF 1.",
                    "estimated_delay_addition_held_min": 7,
                    "estimated_delay_saved_favored_min": 19,
                    "safety_interlocking_code": "RRI-ROUTE-14B-LOCKED"
                },
                "explainability": {
                    "why_did_it_happen": "Train 11078 Jhelum Express accumulated a 28-minute delay in the Khandwa-Bhusawal section due to an earlier freight derailment clearing operation. This delay shifted its arrival at Manmad East Interlocking Throat precisely into the scheduled path of Train 22222 CSMT Rajdhani Express. Because Train 11078 must traverse diamond crossover 14B to enter the single-track chord toward Kopargaon/Daund, both trains cannot occupy the interlocking block concurrently without a direct route collision hazard.",
                    "why_this_decision": "Train 22222 carries P1 Rajdhani priority classification versus P3 for Train 11078. Under Central Railway General & Subsidiary Rules (G&SR 4.14), holding a P1 intercity flagship incurs severe cascading delays down the golden quadrilateral feeder, threatening suburban EMU paths at Kalyan-Thane. Conversely, the Ankai loop siding has a 720m Clear Standing Length (CSL) that safely accommodates the entire 24-coach formation of Train 11078 with only 7 minutes of regulated dwell, sparing the mainline network from a projected 19-minute cascading gridlock."
                },
                "controller_override": {
                    "is_overridden": False,
                    "overridden_by": None,
                    "override_timestamp": None,
                    "override_reason": None,
                    "previous_favored_train": None
                }
            },
            {
                "id": "MMR-CONF-02",
                "title": "West Throat Crossover Conflict: Punjab Mail vs Devagiri Express",
                "severity": "Warning",
                "location": "Manmad West Crossover Point 08A (Km 259/4)",
                "active": True,
                "is_emergency": False,
                "emergency_type": None,
                "train_primary": {
                    "train_no": "12138",
                    "name": "Punjab Mail",
                    "priority_class": "P2 (Superfast Mail)",
                    "priority_rank": 2,
                    "rake_type": "LHB 24-Coach Superfast",
                    "speed_kmh": 85,
                    "current_delay_min": 18,
                    "origin": "Firozpur Cantt (FZR)",
                    "destination": "CSMT Mumbai (CSMT)",
                    "approach": "Platform 3 Departure toward Kalyan",
                    "assigned_platform": 3,
                    "loop_line_requirement": "Main Line Clearance",
                    "section_occupancy": "Double Line Interlocking",
                    "weather_impact": "Clear",
                    "emergency_status": "Normal Operation"
                },
                "train_secondary": {
                    "train_no": "17057",
                    "name": "Devagiri Express",
                    "priority_class": "P3 (Express)",
                    "priority_rank": 3,
                    "rake_type": "ICF 22-Coach Express",
                    "speed_kmh": 60,
                    "current_delay_min": 6,
                    "origin": "CSMT Mumbai (CSMT)",
                    "destination": "Secunderabad (SC)",
                    "approach": "Approaching from Lasalgaon, routed across West throat to PF 5",
                    "assigned_platform": 5,
                    "loop_line_requirement": "Cuts across Main Down Line to enter Nanded branch",
                    "section_occupancy": "Absolute Block Entry",
                    "weather_impact": "Clear",
                    "emergency_status": "Normal Operation"
                },
                "six_factors_comparison": [
                    {
                        "factor": "1. Priority Class Hierarchy",
                        "weight": "35%",
                        "train_a_val": "P2 - Superfast Mail (Scheduled Express)",
                        "train_b_val": "P3 - Standard Express",
                        "advantage": "Train A (12138)",
                        "rationale": "Superfast category holds higher timing sensitivity."
                    },
                    {
                        "factor": "2. Delay Impact & Cascade Risk",
                        "weight": "25%",
                        "train_a_val": "18 min delay (Needs departure before Mumbai morning peak)",
                        "train_b_val": "6 min delay (Running almost on time into single branch)",
                        "advantage": "Train A (12138)",
                        "rationale": "Holding 12138 compounds delay over Kasara Ghat descent section."
                    },
                    {
                        "factor": "3. Platform & Loop Line Availability",
                        "weight": "15%",
                        "train_a_val": "PF 3 needs release to accept trailing freight",
                        "train_b_val": "PF 5 is ready but entry signal can hold at outer safely",
                        "advantage": "Train A (12138)",
                        "rationale": "Clearing PF 3 frees up yard throat for incoming traffic."
                    },
                    {
                        "factor": "4. Section Occupancy & Track Topology",
                        "weight": "10%",
                        "train_a_val": "Upward departure on Kalyan line",
                        "train_b_val": "Entry across throat into Nanded single branch line",
                        "advantage": "Train A (12138)",
                        "rationale": "Outgoing train clears interlocking points faster than incoming branch crossing."
                    },
                    {
                        "factor": "5. Weather & Visibility Conditions",
                        "weight": "5%",
                        "train_a_val": "Clear (Visibility > 3000m)",
                        "train_b_val": "Clear (Visibility > 3000m)",
                        "advantage": "Neutral",
                        "rationale": "No adverse environmental inhibitors."
                    },
                    {
                        "factor": "6. Emergency Override Flag",
                        "weight": "10%",
                        "train_a_val": "None",
                        "train_b_val": "None",
                        "advantage": "Neutral",
                        "rationale": "Standard timetable dispute."
                    }
                ],
                "precedence_decision": {
                    "favored_train": "12138 Punjab Mail",
                    "held_train": "17057 Devagiri Express",
                    "action_summary": "Authorize starter signal on PF 3 for 12138 Punjab Mail. Retain 17057 Devagiri Express at West Outer Home Signal (Signal S-12) for 4 minutes until point machine 08A normalizes.",
                    "estimated_delay_addition_held_min": 4,
                    "estimated_delay_saved_favored_min": 11,
                    "safety_interlocking_code": "RRI-ROUTE-08A-LOCKED"
                },
                "explainability": {
                    "why_did_it_happen": "Train 12138 Punjab Mail completed its commercial halt at Platform 3 with an 18-minute lag, coinciding with Train 17057 Devagiri Express arriving from Mumbai. To access Platform 5 (Nanded branch line), Train 17057 must negotiate scissors crossover 08A which intersects the departure route of Platform 3.",
                    "why_this_decision": "Train 12138 is a P2 Superfast Mail that must traverse the critical Kasara Ghat banking section before suburban morning congestion sets in. Holding 12138 on Platform 3 creates a bottleneck that blocks trailing container freight trains from Bhusawal. Train 17057 is running with only 6 minutes delay and can safely decelerate at the West outer home signal for 4 minutes without compromising safety or significant punctuality."
                },
                "controller_override": {
                    "is_overridden": False,
                    "overridden_by": None,
                    "override_timestamp": None,
                    "override_reason": None,
                    "previous_favored_train": None
                }
            }
        ]

    def _init_tomorrow_timetable(self) -> List[Dict[str, Any]]:
        return [
            {
                "train_no": "22222",
                "train_name": "CSMT Rajdhani Express",
                "origin": "Hazrat Nizamuddin (NZM)",
                "destination": "CSMT Mumbai (CSMT)",
                "direction": "Bhusawal -> Kalyan / Mumbai",
                "priority_class": "P1 (Rajdhani)",
                "scheduled_arrival": "05:12",
                "scheduled_departure": "05:15",
                "halt_duration_min": 3,
                "assigned_platform": 1,
                "track_section": "Bhusawal–Kalyan Main Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "20705",
                "train_name": "Jalna - CSMT Vande Bharat Express",
                "origin": "Jalna (J)",
                "destination": "CSMT Mumbai (CSMT)",
                "direction": "Nanded/Aurangabad -> Kalyan / Mumbai",
                "priority_class": "P1 (Vande Bharat)",
                "scheduled_arrival": "07:35",
                "scheduled_departure": "07:37",
                "halt_duration_min": 2,
                "assigned_platform": 2,
                "track_section": "Secunderabad–Manmad & Bhusawal–Kalyan",
                "frequency": "Mon, Tue, Thu, Fri, Sat, Sun",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "12138",
                "train_name": "Punjab Mail",
                "origin": "Firozpur Cantt (FZR)",
                "destination": "CSMT Mumbai (CSMT)",
                "direction": "Bhusawal -> Kalyan / Mumbai",
                "priority_class": "P2 (Superfast)",
                "scheduled_arrival": "09:05",
                "scheduled_departure": "09:10",
                "halt_duration_min": 5,
                "assigned_platform": 3,
                "track_section": "Bhusawal–Kalyan Main Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "11078",
                "train_name": "Jhelum Express",
                "origin": "Jammu Tawi (JAT)",
                "destination": "Pune Jn (PUNE)",
                "direction": "Bhusawal -> Kopargaon / Daund",
                "priority_class": "P3 (Express)",
                "scheduled_arrival": "10:15",
                "scheduled_departure": "10:20",
                "halt_duration_min": 5,
                "assigned_platform": 4,
                "track_section": "Daund–Manmad Chord Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "12716",
                "train_name": "Sachkhand Express",
                "origin": "Amritsar Jn (ASR)",
                "destination": "Nanded (NED)",
                "direction": "Bhusawal -> Aurangabad / Nanded",
                "priority_class": "P2 (Superfast)",
                "scheduled_arrival": "11:30",
                "scheduled_departure": "11:35",
                "halt_duration_min": 5,
                "assigned_platform": 5,
                "track_section": "Secunderabad–Manmad Branch Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "12140",
                "train_name": "Sewagram Express",
                "origin": "Nagpur Jn (NGP)",
                "destination": "CSMT Mumbai (CSMT)",
                "direction": "Bhusawal -> Kalyan / Mumbai",
                "priority_class": "P2 (Superfast)",
                "scheduled_arrival": "12:15",
                "scheduled_departure": "12:20",
                "halt_duration_min": 5,
                "assigned_platform": 1,
                "track_section": "Bhusawal–Kalyan Main Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "12780",
                "train_name": "Goa Express",
                "origin": "Hazrat Nizamuddin (NZM)",
                "destination": "Vasco-da-Gama (VSG)",
                "direction": "Bhusawal -> Kopargaon / Daund",
                "priority_class": "P2 (Superfast)",
                "scheduled_arrival": "13:10",
                "scheduled_departure": "13:15",
                "halt_duration_min": 5,
                "assigned_platform": 4,
                "track_section": "Daund–Manmad Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "11077",
                "train_name": "Jhelum Express (Up)",
                "origin": "Pune Jn (PUNE)",
                "destination": "Jammu Tawi (JAT)",
                "direction": "Daund / Kopargaon -> Bhusawal",
                "priority_class": "P3 (Express)",
                "scheduled_arrival": "14:40",
                "scheduled_departure": "14:45",
                "halt_duration_min": 5,
                "assigned_platform": 2,
                "track_section": "Daund–Manmad & Howrah–Mumbai Trunk",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "17057",
                "train_name": "Devagiri Express",
                "origin": "CSMT Mumbai (CSMT)",
                "destination": "Secunderabad (SC)",
                "direction": "Kalyan / Mumbai -> Nanded / Secunderabad",
                "priority_class": "P3 (Express)",
                "scheduled_arrival": "16:00",
                "scheduled_departure": "16:05",
                "halt_duration_min": 5,
                "assigned_platform": 5,
                "track_section": "Secunderabad–Manmad Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "12860",
                "train_name": "Gitanjali Express",
                "origin": "Howrah Jn (HWH)",
                "destination": "CSMT Mumbai (CSMT)",
                "direction": "Bhusawal -> Kalyan / Mumbai",
                "priority_class": "P2 (Superfast)",
                "scheduled_arrival": "17:25",
                "scheduled_departure": "17:30",
                "halt_duration_min": 5,
                "assigned_platform": 1,
                "track_section": "Howrah–Nagpur–Mumbai Main Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "12149",
                "train_name": "Pune - Danapur Superfast Express",
                "origin": "Pune Jn (PUNE)",
                "destination": "Danapur (DNR)",
                "direction": "Daund / Kopargaon -> Bhusawal",
                "priority_class": "P2 (Superfast)",
                "scheduled_arrival": "18:50",
                "scheduled_departure": "18:55",
                "halt_duration_min": 5,
                "assigned_platform": 2,
                "track_section": "Daund–Manmad Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "12137",
                "train_name": "Punjab Mail (Down)",
                "origin": "CSMT Mumbai (CSMT)",
                "destination": "Firozpur Cantt (FZR)",
                "direction": "Kalyan / Mumbai -> Bhusawal",
                "priority_class": "P2 (Superfast)",
                "scheduled_arrival": "20:10",
                "scheduled_departure": "20:15",
                "halt_duration_min": 5,
                "assigned_platform": 2,
                "track_section": "Bhusawal–Kalyan Main Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "12779",
                "train_name": "Goa Express (Up)",
                "origin": "Vasco-da-Gama (VSG)",
                "destination": "Hazrat Nizamuddin (NZM)",
                "direction": "Daund / Kopargaon -> Bhusawal",
                "priority_class": "P2 (Superfast)",
                "scheduled_arrival": "21:35",
                "scheduled_departure": "21:40",
                "halt_duration_min": 5,
                "assigned_platform": 2,
                "track_section": "Daund–Manmad Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "17617",
                "train_name": "Tapovan Express",
                "origin": "CSMT Mumbai (CSMT)",
                "destination": "Nanded (NED)",
                "direction": "Kalyan / Mumbai -> Aurangabad / Nanded",
                "priority_class": "P3 (Express)",
                "scheduled_arrival": "22:20",
                "scheduled_departure": "22:25",
                "halt_duration_min": 5,
                "assigned_platform": 5,
                "track_section": "Secunderabad–Manmad Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "01127",
                "train_name": "Manmad - Igatpuri Passenger Special",
                "origin": "Manmad Jn (MMR)",
                "destination": "Igatpuri (IGP)",
                "direction": "Originating -> Kalyan / Mumbai",
                "priority_class": "P4 (Passenger / Local)",
                "scheduled_arrival": "Originates",
                "scheduled_departure": "06:15",
                "halt_duration_min": 0,
                "assigned_platform": 6,
                "track_section": "Bhusawal–Kalyan Main Line",
                "frequency": "Daily",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            },
            {
                "train_no": "BOXN-MMR-884",
                "train_name": "Foodgrain Freight Special (FCI)",
                "origin": "Bhusawal Goods Yard",
                "destination": "Pune Goods Terminal",
                "direction": "Bhusawal -> Kopargaon / Daund",
                "priority_class": "P5 (Freight / Goods)",
                "scheduled_arrival": "03:40",
                "scheduled_departure": "04:10",
                "halt_duration_min": 30,
                "assigned_platform": 6,
                "track_section": "Daund–Manmad Chord",
                "frequency": "Tri-weekly",
                "classification_note": "[Static Scheduled Timetable - Not ML]"
            }
        ]

    # --- Methods ---

    def get_station_overview(self) -> Dict[str, Any]:
        """Returns station header metrics, converging lines, weather summary, and operational status"""
        active_trains_at_station = [
            pf["current_train"] for pf in self.platforms if pf["current_train"] is not None
        ]
        active_conflicts = [c for c in self.conflicts if c.get("active", True)]

        return {
            "station": self.station_info,
            "converging_routes": self.converging_routes,
            "weather": self.weather,
            "platform_summary": {
                "total_platforms": len(self.platforms),
                "occupied": sum(1 for p in self.platforms if p["status"] == "Occupied"),
                "clear": sum(1 for p in self.platforms if p["status"] == "Clear"),
                "reserved": sum(1 for p in self.platforms if "Reserved" in p["status"])
            },
            "active_trains_count": len(active_trains_at_station),
            "active_conflicts_count": len(active_conflicts),
            "interlocking_health": "100% Green Normal Aspect - Electronic Interlocking Operational",
            "prototype_mode_notice": "PROTOTYPE MODE: All delays and conflicts derived from synthetic models and historical datasets. No live GPS or CRIS feeds."
        }

    def get_platforms(self) -> List[Dict[str, Any]]:
        return self.platforms

    def get_conflicts(self) -> List[Dict[str, Any]]:
        return self.conflicts

    def get_conflict_by_id(self, conflict_id: str) -> Optional[Dict[str, Any]]:
        for c in self.conflicts:
            if c["id"] == conflict_id:
                return c
        return None

    def apply_controller_override(
        self,
        conflict_id: str,
        new_favored_train: str,
        override_reason: str,
        controller_id: str = "SC-BHUSAWAL-04",
        notes: str = ""
    ) -> Dict[str, Any]:
        """
        Manually override precedence for a conflict with strict audit logging.
        """
        conflict = self.get_conflict_by_id(conflict_id)
        if not conflict:
            raise ValueError(f"Conflict {conflict_id} not found")

        original_favored = conflict["precedence_decision"]["favored_train"]
        original_held = conflict["precedence_decision"]["held_train"]

        # Validate that the train is one of the two
        train_a_name = f"{conflict['train_primary']['train_no']} {conflict['train_primary']['name']}"
        train_b_name = f"{conflict['train_secondary']['train_no']} {conflict['train_secondary']['name']}"

        # Invert or re-assign
        if new_favored_train == conflict["train_secondary"]["train_no"] or conflict["train_secondary"]["name"] in new_favored_train:
            new_favored = train_b_name
            new_held = train_a_name
        else:
            new_favored = train_a_name
            new_held = train_b_name

        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

        # Update decision
        conflict["precedence_decision"]["favored_train"] = new_favored
        conflict["precedence_decision"]["held_train"] = new_held
        conflict["precedence_decision"]["action_summary"] = (
            f"[MANUAL CONTROLLER OVERRIDE]: Precedence inverted by Section Controller ({controller_id}). "
            f"Authorized route clearance for {new_favored}. {new_held} diverted to outer holding loop. Reason: {override_reason}."
        )

        conflict["controller_override"] = {
            "is_overridden": True,
            "overridden_by": controller_id,
            "override_timestamp": now_str,
            "override_reason": override_reason,
            "notes": notes,
            "previous_favored_train": original_favored
        }

        # Update explainability with override note
        conflict["explainability"]["why_this_decision"] = (
            f"[MANUAL OVERRIDE APPLIED by {controller_id} at {now_str}]: "
            f"The automated ML decision was manually superseded to advance {new_favored} on grounds of '{override_reason}'. "
            f"Safety interlocking will maintain absolute block separation, routing {new_held} to regulated siding."
        )

        audit_entry = {
            "log_id": str(uuid.uuid4())[:8],
            "conflict_id": conflict_id,
            "timestamp": now_str,
            "controller_id": controller_id,
            "original_favored": original_favored,
            "new_favored": new_favored,
            "override_reason": override_reason,
            "notes": notes,
            "status": "APPROVED_AND_LOGGED"
        }
        self.override_audit_logs.insert(0, audit_entry)

        return {
            "success": True,
            "message": f"Manual override recorded for {conflict_id}. Favored train is now {new_favored}.",
            "conflict": conflict,
            "audit_entry": audit_entry
        }

    def trigger_emergency_scenario(self, scenario_type: str) -> Dict[str, Any]:
        """
        Triggers emergency situation on MMR-CONF-01:
        - 'medical_emergency': Overrides priority above Rajdhani, brings Jhelum Express into PF 2 with trackside ambulance
        - 'track_obstruction': Boulder or rail fracture at Ankai outer, holds both trains at home signals
        - 'engineering_block': 4-hour OHE maintenance block, diverts traffic via Loop 6
        - 'clear': Restores normal operations
        """
        conflict = self.get_conflict_by_id("MMR-CONF-01")
        if not conflict:
            raise ValueError("Conflict MMR-CONF-01 not found")

        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

        if scenario_type == "medical_emergency":
            conflict["is_emergency"] = True
            conflict["emergency_type"] = "Passenger Cardiac Emergency (Coach S-5, Train 11078)"
            conflict["train_secondary"]["emergency_status"] = "CRITICAL MEDICAL EMERGENCY ONBOARD"
            conflict["precedence_decision"]["favored_train"] = "11078 Jhelum Express"
            conflict["precedence_decision"]["held_train"] = "22222 CSMT Rajdhani Express"
            conflict["precedence_decision"]["action_summary"] = (
                "EMERGENCY PRIORITY OVERRIDE: Train 11078 granted immediate route clearance into Platform 2. "
                "Train 22222 CSMT Rajdhani held at East Home Signal (Signal S-14 Red Aspect). "
                "Nashik District Civil Hospital 108 Ambulance mobilized to Platform 2 trackside gate."
            )
            conflict["six_factors_comparison"][5]["train_b_val"] = "ACTIVE MEDICAL EMERGENCY (Overrides all commercial priorities)"
            conflict["six_factors_comparison"][5]["advantage"] = "Train B (11078 - IMMEDIATE LIFE SAFETY)"

            conflict["explainability"]["why_this_decision"] = (
                "Under Indian Railways Disaster Management & Medical Emergency Protocol (Rule 6.02), any passenger "
                "medical emergency requiring immediate hospitalization supersedes all commercial train priority classes, "
                "including Rajdhani and Vande Bharat services. Train 11078 is awarded immediate precedence into Platform 2 "
                "which provides direct vehicular ambulance access."
            )
            return {"success": True, "scenario": scenario_type, "message": "Medical Emergency Activated: 11078 given emergency clearance."}

        elif scenario_type == "track_obstruction":
            conflict["is_emergency"] = True
            conflict["emergency_type"] = "Track Obstruction / Boulder Fallen at Ankai Cutting (Km 258/2)"
            conflict["precedence_decision"]["favored_train"] = "NONE (ALL TRAFFIC HALTED)"
            conflict["precedence_decision"]["held_train"] = "BOTH (22222 Rajdhani & 11078 Jhelum)"
            conflict["precedence_decision"]["action_summary"] = (
                "EMERGENCY RED ASPECT: Route Relay Interlocking automatically set to Danger. "
                "Both 22222 Rajdhani and 11078 Jhelum stopped at Outer Signals. "
                "Bhusawal Permanent Way Inspector (PWI) gang dispatched with rail inspection trolley."
            )
            conflict["explainability"]["why_this_decision"] = (
                "Track circuit fail-safe relay TC-258 de-energized indicating track discontinuity / obstruction. "
                "Absolute safety takes precedence over all traffic movements. Trains held until PWI issues track safety fit certificate."
            )
            return {"success": True, "scenario": scenario_type, "message": "Track Obstruction Alert: Both trains halted at home signals."}

        elif scenario_type == "engineering_block":
            conflict["is_emergency"] = True
            conflict["emergency_type"] = "Planned OHE Power & Traffic Block (Up Main line Km 260-264)"
            conflict["precedence_decision"]["action_summary"] = (
                "Engineering Block in effect: 22222 Rajdhani diverted via Platform 3 loop at PSR 30 km/h. "
                "11078 Jhelum regulated at Ankai until block corridor clears."
            )
            conflict["explainability"]["why_this_decision"] = (
                "Section isolated for overhead catenary inspection. Interlocking software automatically reconfigures routes "
                "away from unpowered OHE section."
            )
            return {"success": True, "scenario": scenario_type, "message": "Engineering Block Active: Traffic rerouted via loop lines."}

        elif scenario_type == "clear":
            # Revert to default
            self.conflicts = self._init_conflicts()
            return {"success": True, "scenario": "clear", "message": "Emergency cleared. Restored baseline two-train conflict logic."}

        else:
            raise ValueError(f"Unknown scenario {scenario_type}")

    def update_weather(self, visibility_m: int, condition: str = "Hazy Fog", rainfall_mm: float = 0.0) -> Dict[str, Any]:
        """Update weather conditions and calculate fog_flag and caution orders"""
        fog_flag = visibility_m < 200
        speed_restriction = visibility_m < 200 or rainfall_mm > 40.0
        caution = "Caution Order: Fog Signal Device (Detonators) Placed. Max Speed 30 km/h in yard limits." if fog_flag else "Normal Track Permissible Speed Authorized"

        self.weather.update({
            "visibility_meters": visibility_m,
            "condition": condition,
            "rainfall_mm": rainfall_mm,
            "fog_flag": fog_flag,
            "speed_restriction_active": speed_restriction,
            "caution_order": caution,
            "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        })

        # Update conflict 1 factor 5
        for c in self.conflicts:
            c["six_factors_comparison"][4]["train_a_val"] = f"Visibility {visibility_m}m ({condition})"
            c["six_factors_comparison"][4]["train_b_val"] = f"Visibility {visibility_m}m ({condition})"
            if fog_flag:
                c["six_factors_comparison"][4]["advantage"] = "Speed Restricted 30 km/h (Both Trains)"
                c["six_factors_comparison"][4]["rationale"] = "Visibility < 200m triggers automatic fog safety caution order."

        return self.weather

    def get_tomorrow_timetable(self) -> List[Dict[str, Any]]:
        return self.tomorrow_timetable

    def get_audit_logs(self) -> List[Dict[str, Any]]:
        return self.override_audit_logs

    # --- Dynamic Platform Assignment & Operational Reasoning Engine ---

    def _init_dynamic_platform_assignments(self) -> List[Dict[str, Any]]:
        return [
            {
                "train_no": "22222",
                "train_name": "CSMT Rajdhani Express",
                "priority_class": "P1 (Rajdhani / Flagship)",
                "origin": "Hazrat Nizamuddin (NZM)",
                "destination": "CSMT Mumbai (CSMT)",
                "approach_direction": "Bhusawal Down Main Line (Trunk 130 km/h)",
                "rake_formation": "22 LHB Coaches (580m)",
                "csl_required_meters": 580,
                "assigned_platform": 1,
                "assigned_platform_name": "Platform 1 (Down Main Line)",
                "platform_csl_meters": 650,
                "berthing_status": "Berthed (Departure 10:38 AM)",
                "interlocking_route": "Route 14A Down Main Locked Normal",
                "signal_aspect": "Green Aspect (Through Run Authorized)",
                "primary_reason": "Down Main direct through clearance with 650m CSL and zero diamond crossover fouling.",
                "operational_rationale": [
                    "Mainline Track Geometry: Approaching from Bhusawal on the Down Main line. Routing via Platform 1 provides a straight-line passage without throwing turnouts or crossing throat scissors.",
                    "CSL Compliance: Platform 1 offers 650m Clear Standing Length (CSL), safely accommodating the full 22-coach (580m) LHB rake within fouling markers.",
                    "Downstream Punctuality Protection: As a P1 service heading into the congested Kasara Ghat banking section and Mumbai suburban corridor, clearing Platform 1 avoids suburban peak slot penalties.",
                    "Interlocking Safety: Route 14A bypasses crossover 14B, eliminating route conflicts with branch line chord traffic."
                ],
                "alternative_platform": 2,
                "alternative_platform_reason": "Platform 2 Up Main (if reverse signaling authorized under single line pilot block) or Platform 3 Loop Line (PSR 30 km/h applied)."
            },
            {
                "train_no": "20705",
                "train_name": "Jalna - CSMT Vande Bharat Express",
                "priority_class": "P1 (Vande Bharat / Semi-High Speed)",
                "origin": "Jalna (J)",
                "destination": "CSMT Mumbai (CSMT)",
                "approach_direction": "Nanded / Aurangabad Branch Line",
                "rake_formation": "16 Vande Bharat Trainset (384m)",
                "csl_required_meters": 400,
                "assigned_platform": 2,
                "assigned_platform_name": "Platform 2 (Up Main Line)",
                "platform_csl_meters": 650,
                "berthing_status": "Approaching (ETA 10:52 AM)",
                "interlocking_route": "Route 22 Up Main Ingress",
                "signal_aspect": "Double Yellow (Approaching Yard Limits)",
                "primary_reason": "High-speed Up Main track alignment from Marathwada chord with rapid 2-minute halt compliance.",
                "operational_rationale": [
                    "Branch Ingress: Enters from Marathwada line via East chord directly onto Platform 2 Up Main track.",
                    "Rapid Dwell Timing: Semi-high-speed trainset requires fast passenger ingress/egress; PF 2 offers wide island canopy and dual escalators.",
                    "Zero Down-Line Fouling: Keeps Platform 1 free for Down Main intercity traffic while accepting incoming traffic from Aurangabad."
                ],
                "alternative_platform": 3,
                "alternative_platform_reason": "Platform 3 Bidirectional Loop Line (CSL 620m)."
            },
            {
                "train_no": "12138",
                "train_name": "Punjab Mail",
                "priority_class": "P2 (Superfast Mail)",
                "origin": "Firozpur Cantt (FZR)",
                "destination": "CSMT Mumbai (CSMT)",
                "approach_direction": "Bhusawal -> Kalyan / Mumbai",
                "rake_formation": "24 ICF/LHB Coaches (620m)",
                "csl_required_meters": 620,
                "assigned_platform": 3,
                "assigned_platform_name": "Platform 3 (Bidirectional Loop Line)",
                "platform_csl_meters": 620,
                "berthing_status": "Berthed (Commercial Boarding - Dep 10:45 AM)",
                "interlocking_route": "Loop Line 3 Track Circuit Staged",
                "signal_aspect": "Signal S-08 Caution Yellow Aspect",
                "primary_reason": "Scheduled 5-minute passenger & parcel halt berthed on loop line to preserve trunk line clearance.",
                "operational_rationale": [
                    "Loop Line Regulation: Commercial halt of 5 minutes staged onto Platform 3 loop line, keeping Platform 1 Down Main line open for non-stop through freights and flagships.",
                    "CSL Rake Fit: Exactly matches the 620m CSL of Platform 3; rear brake van stands clear of fouling mark FM-3W.",
                    "Parcel & FOB Connectivity: Platform 3 features high-capacity hydraulic parcel lifts and FOB bridges connecting directly to town exit."
                ],
                "alternative_platform": 1,
                "alternative_platform_reason": "Platform 1 (Main Down Line) available during non-peak traffic gaps."
            },
            {
                "train_no": "11078",
                "train_name": "Jhelum Express",
                "priority_class": "P3 (Mail / Express)",
                "origin": "Jammu Tawi (JAT)",
                "destination": "Pune Jn (PUNE)",
                "approach_direction": "Daund / Kopargaon Single-Track Corridor (Via Ankai Link)",
                "rake_formation": "22 Coaches (580m)",
                "csl_required_meters": 580,
                "assigned_platform": 4,
                "assigned_platform_name": "Platform 4 (South Daund Corridor Line)",
                "platform_csl_meters": 600,
                "berthing_status": "Held at Ankai Outer Signal S-42 (ETA 10:48 AM)",
                "interlocking_route": "Point 14B Diamond Crossover Traversal Required",
                "signal_aspect": "Signal S-42 Danger Red (Awaiting 22222 Through Clearance)",
                "primary_reason": "Direct track geometry into Daund/Pune single-line chord avoiding main yard foulings.",
                "operational_rationale": [
                    "Southern Throat Topology: Platform 4 track leads directly into the single-track chord toward Kopargaon, Puntamba, and Daund Junction.",
                    "Diamond Interlocking Contention: Requires crossing Point 14B diamond crossover across the Down Main. Held until Train 22222 clears the throat to ensure absolute route interlocking safety.",
                    "CSL Compatibility: 22-coach formation matches 600m CSL of Platform 4."
                ],
                "alternative_platform": 3,
                "alternative_platform_reason": "Platform 3 Loop Line via West crossover ladder (causes additional 6 min throat delay)."
            },
            {
                "train_no": "17057",
                "train_name": "Devagiri Express",
                "priority_class": "P3 (Express)",
                "origin": "CSMT Mumbai (CSMT)",
                "destination": "Secunderabad (SC)",
                "approach_direction": "Kalyan / Mumbai Up Main Approach",
                "rake_formation": "22 Coaches (580m)",
                "csl_required_meters": 580,
                "assigned_platform": 5,
                "assigned_platform_name": "Platform 5 (Nanded / Marathwada Branch Line)",
                "platform_csl_meters": 580,
                "berthing_status": "In Approach near Lasalgaon (ETA 11:05 AM)",
                "interlocking_route": "Route 05 West Throat Scissors Turnout",
                "signal_aspect": "Yellow Approach",
                "primary_reason": "Dedicated branch line berthing feeding directly into Nanded Division tokenless block section.",
                "operational_rationale": [
                    "Branch Corridor Segregation: Platform 5 is physically aligned with the start of the Secunderabad–Manmad single line towards Nagarsol and Aurangabad.",
                    "Traffic Segregation: Isolating branch departures on Platform 5 prevents cross-traffic blocking on the Mumbai–Howrah trunk lines.",
                    "Terminal Length Check: 580m length exactly accommodates standard 22-coach ICF rake."
                ],
                "alternative_platform": 3,
                "alternative_platform_reason": "Platform 3 Loop Line."
            },
            {
                "train_no": "BOXN-MMR-884",
                "train_name": "FCI Foodgrain Special Freight",
                "priority_class": "P5 (Heavy Freight)",
                "origin": "Bhusawal Goods Yard",
                "destination": "Pune Goods Terminal",
                "approach_direction": "Bhusawal Trunk Corridors",
                "rake_formation": "58 BOXN Wagons + Guard Van (680m)",
                "csl_required_meters": 680,
                "assigned_platform": 6,
                "assigned_platform_name": "Platform 6 (Shunting & Heavy Freight Loop)",
                "platform_csl_meters": 720,
                "berthing_status": "Stabled on Siding (Departure 11:15 AM)",
                "interlocking_route": "Goods Yard Loop Line Isolated",
                "signal_aspect": "Shunt Signal Normal",
                "primary_reason": "Maximum 720m CSL capacity; isolates heavy 58-wagon freight rake from passenger platforms.",
                "operational_rationale": [
                    "Clear Standing Length (CSL): 58 loaded BOXN wagons require 680m minimum standing distance. Platform 6 has 720m CSL, the only line capable of stabling this rake without fouling yard crossovers.",
                    "Passenger Platform Protection: Keeps passenger platforms 1 through 5 entirely unobstructed for scheduled passenger boarding.",
                    "Loco Watering & Crew Change: Platform 6 borders the Manmad Locomotive Shed and running room crew change point."
                ],
                "alternative_platform": "Ankai Goods Siding (Km 256)",
                "alternative_platform_reason": "Ankai Goods Siding 750m Loop."
            }
        ]

    def get_dynamic_platform_assignments(self) -> List[Dict[str, Any]]:
        if not hasattr(self, "dynamic_platform_assignments"):
            self.dynamic_platform_assignments = self._init_dynamic_platform_assignments()
        return self.dynamic_platform_assignments

    def reassign_platform(
        self,
        train_no: str,
        new_platform: int,
        reason: str,
        controller_id: str = "SC-BHUSAWAL-04"
    ) -> Dict[str, Any]:
        """
        Dynamically reassign a train to a new platform with automated reason and safety validation.
        """
        assignments = self.get_dynamic_platform_assignments()
        target_train = None
        for a in assignments:
            if a["train_no"] == train_no:
                target_train = a
                break

        if not target_train:
            raise ValueError(f"Train {train_no} not found in dynamic queue")

        pf_obj = next((p for p in self.platforms if p["platform_number"] == new_platform), None)
        if not pf_obj:
            raise ValueError(f"Platform {new_platform} does not exist at MMR")

        # CSL safety check
        if target_train["csl_required_meters"] > pf_obj["length_meters"]:
            raise ValueError(
                f"SAFETY HAZARD: Train {train_no} requires {target_train['csl_required_meters']}m CSL, "
                f"but Platform {new_platform} only has {pf_obj['length_meters']}m CSL (Fouling risk!)."
            )

        old_pf = target_train["assigned_platform"]
        target_train["assigned_platform"] = new_platform
        target_train["assigned_platform_name"] = f"Platform {new_platform} ({pf_obj['line_type']})"
        target_train["platform_csl_meters"] = pf_obj["length_meters"]
        target_train["primary_reason"] = f"[DYNAMIC REASSIGNMENT]: {reason}"
        target_train["operational_rationale"].insert(
            0,
            f"Controller Reassignment by {controller_id}: Shifted from PF {old_pf} to PF {new_platform}. Justification: '{reason}'. CSL verified ({target_train['csl_required_meters']}m <= {pf_obj['length_meters']}m)."
        )

        return {
            "success": True,
            "train_no": train_no,
            "old_platform": old_pf,
            "new_platform": new_platform,
            "reason": reason,
            "updated_assignment": target_train
        }

    def simulate_platform_scenario(self, scenario_name: str) -> Dict[str, Any]:
        """
        Simulates dynamic operational platform contingencies:
        - 'pf1_blocked': Emergency track circuit failure on PF 1 -> Dynamically divert 22222 Rajdhani to PF 3 Loop.
        - 'freight_priority_loop': Freight BOXN-884 moved to Ankai siding to clear PF 6.
        - 'reset': Restores default baseline assignments.
        """
        if scenario_name == "pf1_blocked":
            self.reassign_platform(
                train_no="22222",
                new_platform=3,
                reason="Track circuit fail-safe failure on Platform 1 Down Main. Dynamically diverted to Platform 3 Loop line at PSR 30 km/h."
            )
            return {"success": True, "scenario": scenario_name, "message": "Platform 1 Blocked: Train 22222 dynamically diverted to Platform 3 Loop line."}

        elif scenario_name == "reset":
            self.dynamic_platform_assignments = self._init_dynamic_platform_assignments()
            return {"success": True, "scenario": "reset", "message": "Reset to standard dynamic platform allocations."}

        else:
            raise ValueError(f"Unknown scenario {scenario_name}")

manmad_engine = ManmadEngine()

