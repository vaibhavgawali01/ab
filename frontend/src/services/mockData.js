// Auto-generated comprehensive client-side fallback data for Vercel / Offline Preview Mode

export const mockOverview = {
  "station": {
    "code": "MMR",
    "name": "Manmad Junction",
    "division": "Bhusawal Division",
    "zone": "Central Railway (CR)",
    "state": "Maharashtra",
    "district": "Nashik",
    "coordinates": {
      "lat": 20.2498,
      "lng": 74.4384
    },
    "platforms_count": 6,
    "converging_routes_count": 4,
    "interlocking_type": "Route Relay Interlocking (RRI) with Electronic Interlocking (EI)",
    "csl_standard_meters": 720,
    "source_disclaimer": "Simulated Station Operations Prototype - No connection to live Indian Railways GPS or CRIS feeds [Synthetic Scenario Data]"
  },
  "converging_routes": [
    {
      "id": "MMR-KYN",
      "name": "Mumbai / Kalyan Line",
      "section": "Bhusawal\u2013Kalyan Main Line",
      "cardinal_direction": "Southwest",
      "track_type": "Double Line Electrified (25kV AC)",
      "max_permissible_speed_kmh": 120,
      "block_system": "Automatic Block Signaling (ABS)",
      "connected_stations": [
        "Lasalgaon",
        "Nashik Road",
        "Igatpuri",
        "Kalyan Jn",
        "Mumbai CSMT"
      ],
      "traffic_density": "Very High (Quadruple tracking proposed)"
    },
    {
      "id": "MMR-BSL",
      "name": "Bhusawal / Nagpur / Howrah Line",
      "section": "Howrah\u2013Nagpur\u2013Mumbai Trunk Corridor",
      "cardinal_direction": "Northeast",
      "track_type": "Double Line Electrified (25kV AC)",
      "max_permissible_speed_kmh": 130,
      "block_system": "Automatic Block Signaling (ABS)",
      "connected_stations": [
        "Nandgaon",
        "Chalisgaon Jn",
        "Pachora Jn",
        "Bhusawal Jn",
        "Nagpur Jn"
      ],
      "traffic_density": "Very High"
    },
    {
      "id": "MMR-NED",
      "name": "Nanded / Secunderabad Line",
      "section": "Secunderabad\u2013Manmad Main Line",
      "cardinal_direction": "Southeast",
      "track_type": "Single Line Electrified (25kV AC - Recently Doubled Sections)",
      "max_permissible_speed_kmh": 100,
      "block_system": "Absolute Block System with Tokenless Operation",
      "connected_stations": [
        "Nagarsol",
        "Rotegaon",
        "Aurangabad",
        "Jalna",
        "Nanded",
        "Secunderabad Jn"
      ],
      "traffic_density": "High Passenger & Agricultural Freight"
    },
    {
      "id": "MMR-DD",
      "name": "Daund / Pune / Shirdi Line",
      "section": "Daund\u2013Manmad Chord & Line",
      "cardinal_direction": "South",
      "track_type": "Single Line Electrified (Doubling in progress)",
      "max_permissible_speed_kmh": 110,
      "block_system": "Absolute Block System with Axle Counters",
      "connected_stations": [
        "Ankai",
        "Kopargaon",
        "Belapur",
        "Ahmednagar",
        "Daund Jn",
        "Pune Jn"
      ],
      "traffic_density": "High (Key route to Shirdi Sai Nagar, Pune, and South India)"
    }
  ],
  "weather": {
    "station": "Manmad Junction (MMR)",
    "reporting_station": "IMD Nashik Regional Agromet Observatory",
    "temperature_c": 28.6,
    "condition": "Dry / Light Haze",
    "visibility_meters": 3400,
    "humidity_percent": 58,
    "wind_speed_kmh": 12,
    "rainfall_mm": 0.0,
    "fog_flag": false,
    "speed_restriction_active": false,
    "caution_order": "Normal Track Permissible Speed (110\u2013130 km/h) Authorized",
    "last_updated": "2026-09-10 04:29:06 UTC",
    "data_mode": "[Synthetic Scenario Data - Calibrated with IMD Seasonal Baselines]"
  },
  "platform_summary": {
    "total_platforms": 6,
    "occupied": 2,
    "clear": 3,
    "reserved": 1
  },
  "active_trains_count": 3,
  "active_conflicts_count": 2,
  "interlocking_health": "100% Green Normal Aspect - Electronic Interlocking Operational",
  "prototype_mode_notice": "PROTOTYPE MODE: All delays and conflicts derived from synthetic models and historical datasets. No live GPS or CRIS feeds."
};

export const mockPlatforms = [
  {
    "platform_number": 1,
    "line_type": "Main Down Line",
    "length_meters": 650,
    "max_coaches": 24,
    "electrified": true,
    "status": "Occupied",
    "approach_direction": "From Bhusawal / Nagpur towards Mumbai",
    "current_train": {
      "train_no": "22222",
      "name": "CSMT Rajdhani Express",
      "route": "Hazrat Nizamuddin -> CSMT Mumbai",
      "priority": "P1 (Rajdhani)",
      "expected_departure": "10:38"
    },
    "through_clearance_capable": true,
    "facilities": [
      "Ambulance Ramp",
      "Escalator",
      "Water Vending",
      "Full Canopy"
    ]
  },
  {
    "platform_number": 2,
    "line_type": "Main Up Line",
    "length_meters": 650,
    "max_coaches": 24,
    "electrified": true,
    "status": "Clear",
    "approach_direction": "From Mumbai / Kalyan towards Bhusawal",
    "current_train": null,
    "through_clearance_capable": true,
    "facilities": [
      "Ambulance Ramp",
      "Waiting Hall",
      "Water Vending",
      "Full Canopy"
    ]
  },
  {
    "platform_number": 3,
    "line_type": "Bidirectional Loop Line",
    "length_meters": 620,
    "max_coaches": 24,
    "electrified": true,
    "status": "Occupied",
    "approach_direction": "Bidirectional (Kalyan / Bhusawal)",
    "current_train": {
      "train_no": "12138",
      "name": "Punjab Mail",
      "route": "Firozpur Cantt -> CSMT Mumbai",
      "priority": "P2 (Superfast)",
      "expected_departure": "10:45"
    },
    "through_clearance_capable": false,
    "facilities": [
      "FOB Access",
      "Tea Stalls",
      "Water Vending"
    ]
  },
  {
    "platform_number": 4,
    "line_type": "South Line (Daund / Pune Corridor)",
    "length_meters": 600,
    "max_coaches": 22,
    "electrified": true,
    "status": "Reserved for Arrival",
    "approach_direction": "From / Towards Kopargaon, Puntamba & Pune",
    "current_train": {
      "train_no": "11078",
      "name": "Jhelum Express (Approaching)",
      "route": "Jammu Tawi -> Pune Jn",
      "priority": "P3 (Express)",
      "expected_arrival": "10:48"
    },
    "through_clearance_capable": false,
    "facilities": [
      "Direct Southern Throat Access",
      "FOB Access"
    ]
  },
  {
    "platform_number": 5,
    "line_type": "East Line (Nanded / Marathwada Corridor)",
    "length_meters": 580,
    "max_coaches": 22,
    "electrified": true,
    "status": "Clear",
    "approach_direction": "From / Towards Aurangabad, Jalna & Secunderabad",
    "current_train": null,
    "through_clearance_capable": false,
    "facilities": [
      "Branch Line Interlocking",
      "FOB Access"
    ]
  },
  {
    "platform_number": 6,
    "line_type": "Shunting Loop & Secondary Passenger Line",
    "length_meters": 720,
    "max_coaches": 26,
    "electrified": true,
    "status": "Clear",
    "approach_direction": "Goods Yard & Passenger Overflow",
    "current_train": null,
    "through_clearance_capable": false,
    "facilities": [
      "Heavy Freight Loop",
      "Watering Point",
      "Loco Reversal"
    ]
  }
];

export const mockConflicts = [
  {
    "id": "MMR-CONF-01",
    "title": "East Throat Diamond Interlocking Contention: Rajdhani vs Jhelum Express",
    "severity": "Critical",
    "location": "Manmad East Crossover Point 14B (Km 261/8)",
    "active": true,
    "is_emergency": false,
    "emergency_type": null,
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
      "is_overridden": false,
      "overridden_by": null,
      "override_timestamp": null,
      "override_reason": null,
      "previous_favored_train": null
    }
  },
  {
    "id": "MMR-CONF-02",
    "title": "West Throat Crossover Conflict: Punjab Mail vs Devagiri Express",
    "severity": "Warning",
    "location": "Manmad West Crossover Point 08A (Km 259/4)",
    "active": true,
    "is_emergency": false,
    "emergency_type": null,
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
      "is_overridden": false,
      "overridden_by": null,
      "override_timestamp": null,
      "override_reason": null,
      "previous_favored_train": null
    }
  }
];

export const mockTomorrowTimetable = [
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
    "track_section": "Bhusawal\u2013Kalyan Main Line",
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
    "track_section": "Secunderabad\u2013Manmad & Bhusawal\u2013Kalyan",
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
    "track_section": "Bhusawal\u2013Kalyan Main Line",
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
    "track_section": "Daund\u2013Manmad Chord Line",
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
    "track_section": "Secunderabad\u2013Manmad Branch Line",
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
    "track_section": "Bhusawal\u2013Kalyan Main Line",
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
    "track_section": "Daund\u2013Manmad Line",
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
    "track_section": "Daund\u2013Manmad & Howrah\u2013Mumbai Trunk",
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
    "track_section": "Secunderabad\u2013Manmad Line",
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
    "track_section": "Howrah\u2013Nagpur\u2013Mumbai Main Line",
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
    "track_section": "Daund\u2013Manmad Line",
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
    "track_section": "Bhusawal\u2013Kalyan Main Line",
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
    "track_section": "Daund\u2013Manmad Line",
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
    "track_section": "Secunderabad\u2013Manmad Line",
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
    "track_section": "Bhusawal\u2013Kalyan Main Line",
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
    "track_section": "Daund\u2013Manmad Chord",
    "frequency": "Tri-weekly",
    "classification_note": "[Static Scheduled Timetable - Not ML]"
  }
];

export const mockAuditLogs = [];

export const mockDynamicAssignments = [
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
      "Branch Corridor Segregation: Platform 5 is physically aligned with the start of the Secunderabad\u2013Manmad single line towards Nagarsol and Aurangabad.",
      "Traffic Segregation: Isolating branch departures on Platform 5 prevents cross-traffic blocking on the Mumbai\u2013Howrah trunk lines.",
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
];

export const mockTrains = [
  {
    "train_number": "12301",
    "name": "Howrah Rajdhani Express",
    "type": "Rajdhani Express",
    "priority": 1,
    "corridor_code": "NDLS-HWH",
    "origin": "HWH",
    "destination": "NDLS",
    "locomotive": "WAP-7 (Ghaziabad Shed #30245)",
    "rake_type": "LHB AC 22 Coaches",
    "max_speed_kmh": 130,
    "avg_speed_kmh": 86.5,
    "schedule": [
      {
        "station_code": "HWH",
        "day": 1,
        "scheduled_arr": "16:50",
        "scheduled_dep": "16:55",
        "distance_km": 0,
        "platform": "9"
      },
      {
        "station_code": "ASN",
        "day": 1,
        "scheduled_arr": "18:55",
        "scheduled_dep": "18:57",
        "distance_km": 200,
        "platform": "4"
      },
      {
        "station_code": "DDU",
        "day": 2,
        "scheduled_arr": "00:45",
        "scheduled_dep": "00:55",
        "distance_km": 659,
        "platform": "2"
      },
      {
        "station_code": "PRYJ",
        "day": 2,
        "scheduled_arr": "02:43",
        "scheduled_dep": "02:45",
        "distance_km": 812,
        "platform": "1"
      },
      {
        "station_code": "CNB",
        "day": 2,
        "scheduled_arr": "04:50",
        "scheduled_dep": "04:55",
        "distance_km": 1007,
        "platform": "1"
      },
      {
        "station_code": "NDLS",
        "day": 2,
        "scheduled_arr": "10:05",
        "scheduled_dep": "10:05",
        "distance_km": 1447,
        "platform": "1"
      }
    ],
    "status": {
      "current_status": "Running",
      "current_km": 890,
      "current_speed_kmh": 118,
      "last_reported_station": "PRYJ",
      "next_station": "CNB",
      "simulated_delay_mins": 14,
      "signal_aspect": "Green",
      "block_section": "PRYJ-FTP Block 4",
      "pnp_score": 94.2
    }
  },
  {
    "train_number": "12302",
    "name": "New Delhi - Howrah Rajdhani",
    "type": "Rajdhani Express",
    "priority": 1,
    "corridor_code": "NDLS-HWH",
    "origin": "NDLS",
    "destination": "HWH",
    "locomotive": "WAP-7 (Howrah Shed #30310)",
    "rake_type": "LHB AC 22 Coaches",
    "max_speed_kmh": 130,
    "avg_speed_kmh": 87.1,
    "schedule": [
      {
        "station_code": "NDLS",
        "day": 1,
        "scheduled_arr": "16:50",
        "scheduled_dep": "16:55",
        "distance_km": 0,
        "platform": "2"
      },
      {
        "station_code": "CNB",
        "day": 1,
        "scheduled_arr": "21:32",
        "scheduled_dep": "21:37",
        "distance_km": 440,
        "platform": "1"
      },
      {
        "station_code": "PRYJ",
        "day": 1,
        "scheduled_arr": "23:43",
        "scheduled_dep": "23:45",
        "distance_km": 635,
        "platform": "4"
      },
      {
        "station_code": "DDU",
        "day": 2,
        "scheduled_arr": "01:37",
        "scheduled_dep": "01:47",
        "distance_km": 788,
        "platform": "1"
      },
      {
        "station_code": "ASN",
        "day": 2,
        "scheduled_arr": "06:55",
        "scheduled_dep": "06:57",
        "distance_km": 1247,
        "platform": "5"
      },
      {
        "station_code": "HWH",
        "day": 2,
        "scheduled_arr": "09:55",
        "scheduled_dep": "09:55",
        "distance_km": 1447,
        "platform": "8"
      }
    ],
    "status": {
      "current_status": "Running",
      "current_km": 380,
      "current_speed_kmh": 124,
      "last_reported_station": "TDL",
      "next_station": "CNB",
      "simulated_delay_mins": 6,
      "signal_aspect": "Green",
      "block_section": "TDL-CNB Block 9",
      "pnp_score": 97.5
    }
  },
  {
    "train_number": "22436",
    "name": "Vande Bharat Express",
    "type": "Vande Bharat",
    "priority": 1,
    "corridor_code": "NDLS-HWH",
    "origin": "NDLS",
    "destination": "DDU",
    "locomotive": "Distributed Traction EMU (Train 18)",
    "rake_type": "Train 18 16 Coaches",
    "max_speed_kmh": 160,
    "avg_speed_kmh": 95.0,
    "schedule": [
      {
        "station_code": "NDLS",
        "day": 1,
        "scheduled_arr": "05:55",
        "scheduled_dep": "06:00",
        "distance_km": 0,
        "platform": "16"
      },
      {
        "station_code": "CNB",
        "day": 1,
        "scheduled_arr": "10:08",
        "scheduled_dep": "10:10",
        "distance_km": 440,
        "platform": "1"
      },
      {
        "station_code": "PRYJ",
        "day": 1,
        "scheduled_arr": "12:08",
        "scheduled_dep": "12:10",
        "distance_km": 635,
        "platform": "6"
      },
      {
        "station_code": "DDU",
        "day": 1,
        "scheduled_arr": "14:00",
        "scheduled_dep": "14:00",
        "distance_km": 788,
        "platform": "3"
      }
    ],
    "status": {
      "current_status": "Running",
      "current_km": 465,
      "current_speed_kmh": 128,
      "last_reported_station": "CNB",
      "next_station": "PRYJ",
      "simulated_delay_mins": 2,
      "signal_aspect": "Green",
      "block_section": "CNB-PRYJ Block 2",
      "pnp_score": 99.1
    }
  },
  {
    "train_number": "12951",
    "name": "Mumbai Tejas Rajdhani Express",
    "type": "Rajdhani Express",
    "priority": 1,
    "corridor_code": "NDLS-MMCT",
    "origin": "MMCT",
    "destination": "NDLS",
    "locomotive": "WAP-7 (Vadodara Shed #30489)",
    "rake_type": "Tejas Smart Sleeper 20 Coaches",
    "max_speed_kmh": 130,
    "avg_speed_kmh": 89.2,
    "schedule": [
      {
        "station_code": "MMCT",
        "day": 1,
        "scheduled_arr": "16:55",
        "scheduled_dep": "17:00",
        "distance_km": 0,
        "platform": "1"
      },
      {
        "station_code": "BVI",
        "day": 1,
        "scheduled_arr": "17:22",
        "scheduled_dep": "17:24",
        "distance_km": 30,
        "platform": "6"
      },
      {
        "station_code": "ST",
        "day": 1,
        "scheduled_arr": "19:43",
        "scheduled_dep": "19:48",
        "distance_km": 263,
        "platform": "1"
      },
      {
        "station_code": "BRC",
        "day": 1,
        "scheduled_arr": "21:06",
        "scheduled_dep": "21:16",
        "distance_km": 392,
        "platform": "2"
      },
      {
        "station_code": "RTM",
        "day": 2,
        "scheduled_arr": "00:25",
        "scheduled_dep": "00:28",
        "distance_km": 653,
        "platform": "4"
      },
      {
        "station_code": "KOTA",
        "day": 2,
        "scheduled_arr": "03:15",
        "scheduled_dep": "03:20",
        "distance_km": 920,
        "platform": "1"
      },
      {
        "station_code": "NDLS",
        "day": 2,
        "scheduled_arr": "08:32",
        "scheduled_dep": "08:32",
        "distance_km": 1384,
        "platform": "3"
      }
    ],
    "status": {
      "current_status": "Running",
      "current_km": 1050,
      "current_speed_kmh": 110,
      "last_reported_station": "KOTA",
      "next_station": "MTJ",
      "simulated_delay_mins": 9,
      "signal_aspect": "Double Yellow",
      "block_section": "KOTA-MTJ Block 12",
      "pnp_score": 96.0
    }
  },
  {
    "train_number": "12004",
    "name": "Lucknow Shatabdi Express",
    "type": "Shatabdi Express",
    "priority": 2,
    "corridor_code": "NDLS-HWH",
    "origin": "NDLS",
    "destination": "CNB",
    "locomotive": "WAP-5 (Ghaziabad Shed #30022)",
    "rake_type": "LHB Chair Car 14 Coaches",
    "max_speed_kmh": 130,
    "avg_speed_kmh": 82.0,
    "schedule": [
      {
        "station_code": "NDLS",
        "day": 1,
        "scheduled_arr": "06:05",
        "scheduled_dep": "06:10",
        "distance_km": 0,
        "platform": "9"
      },
      {
        "station_code": "GZB",
        "day": 1,
        "scheduled_arr": "06:43",
        "scheduled_dep": "06:45",
        "distance_km": 25,
        "platform": "2"
      },
      {
        "station_code": "ALJN",
        "day": 1,
        "scheduled_arr": "07:48",
        "scheduled_dep": "07:50",
        "distance_km": 131,
        "platform": "3"
      },
      {
        "station_code": "TDL",
        "day": 1,
        "scheduled_arr": "08:45",
        "scheduled_dep": "08:47",
        "distance_km": 209,
        "platform": "3"
      },
      {
        "station_code": "CNB",
        "day": 1,
        "scheduled_arr": "11:20",
        "scheduled_dep": "11:25",
        "distance_km": 440,
        "platform": "5"
      }
    ],
    "status": {
      "current_status": "Running",
      "current_km": 195,
      "current_speed_kmh": 105,
      "last_reported_station": "ALJN",
      "next_station": "TDL",
      "simulated_delay_mins": 18,
      "signal_aspect": "Yellow",
      "block_section": "ALJN-TDL Block 6",
      "pnp_score": 88.4
    }
  },
  {
    "train_number": "12802",
    "name": "Purushottam Express",
    "type": "Superfast Express",
    "priority": 3,
    "corridor_code": "NDLS-HWH",
    "origin": "NDLS",
    "destination": "DDU",
    "locomotive": "WAP-7 (Tughlakabad #30412)",
    "rake_type": "LHB Sleeper/AC 22 Coaches",
    "max_speed_kmh": 110,
    "avg_speed_kmh": 68.4,
    "schedule": [
      {
        "station_code": "NDLS",
        "day": 1,
        "scheduled_arr": "22:35",
        "scheduled_dep": "22:40",
        "distance_km": 0,
        "platform": "8"
      },
      {
        "station_code": "CNB",
        "day": 2,
        "scheduled_arr": "03:55",
        "scheduled_dep": "04:00",
        "distance_km": 440,
        "platform": "4"
      },
      {
        "station_code": "PRYJ",
        "day": 2,
        "scheduled_arr": "06:55",
        "scheduled_dep": "07:00",
        "distance_km": 635,
        "platform": "2"
      },
      {
        "station_code": "DDU",
        "day": 2,
        "scheduled_arr": "09:50",
        "scheduled_dep": "10:00",
        "distance_km": 788,
        "platform": "2"
      }
    ],
    "status": {
      "current_status": "Delayed",
      "current_km": 520,
      "current_speed_kmh": 82,
      "last_reported_station": "CNB",
      "next_station": "PRYJ",
      "simulated_delay_mins": 46,
      "signal_aspect": "Double Yellow",
      "block_section": "CNB-PRYJ Block 7",
      "pnp_score": 76.8
    }
  },
  {
    "train_number": "BOXN-50102",
    "name": "Thermal Coal Freight Rake",
    "type": "Freight",
    "priority": 4,
    "corridor_code": "NDLS-HWH",
    "origin": "DDU",
    "destination": "GZB",
    "locomotive": "WAG-9 twin-unit (Asansol Shed #31502)",
    "rake_type": "58 BOXN Heavy Haul (5200 MT)",
    "max_speed_kmh": 75,
    "avg_speed_kmh": 42.0,
    "schedule": [
      {
        "station_code": "DDU",
        "day": 1,
        "scheduled_arr": "02:00",
        "scheduled_dep": "02:30",
        "distance_km": 0,
        "platform": "Yard-4"
      },
      {
        "station_code": "PRYJ",
        "day": 1,
        "scheduled_arr": "06:30",
        "scheduled_dep": "07:15",
        "distance_km": 153,
        "platform": "Goods-1"
      },
      {
        "station_code": "CNB",
        "day": 1,
        "scheduled_arr": "12:00",
        "scheduled_dep": "13:30",
        "distance_km": 348,
        "platform": "Loop-2"
      },
      {
        "station_code": "TDL",
        "day": 1,
        "scheduled_arr": "18:45",
        "scheduled_dep": "19:20",
        "distance_km": 579,
        "platform": "Goods-3"
      },
      {
        "station_code": "GZB",
        "day": 2,
        "scheduled_arr": "01:15",
        "scheduled_dep": "01:15",
        "distance_km": 763,
        "platform": "Yard-1"
      }
    ],
    "status": {
      "current_status": "Held at Loop",
      "current_km": 441,
      "current_speed_kmh": 0,
      "last_reported_station": "CNB",
      "next_station": "TDL",
      "simulated_delay_mins": 82,
      "signal_aspect": "Red",
      "block_section": "CNB West Yard Loop line 3",
      "pnp_score": 55.0
    }
  },
  {
    "train_number": "20608",
    "name": "Mysuru-Chennai Vande Bharat",
    "type": "Vande Bharat",
    "priority": 1,
    "corridor_code": "MAS-SBC",
    "origin": "SBC",
    "destination": "MAS",
    "locomotive": "Distributed Traction EMU (Train 18)",
    "rake_type": "Train 18 16 Coaches",
    "max_speed_kmh": 130,
    "avg_speed_kmh": 81.3,
    "schedule": [
      {
        "station_code": "SBC",
        "day": 1,
        "scheduled_arr": "14:45",
        "scheduled_dep": "14:50",
        "distance_km": 0,
        "platform": "7"
      },
      {
        "station_code": "KPD",
        "day": 1,
        "scheduled_arr": "17:33",
        "scheduled_dep": "17:35",
        "distance_km": 228,
        "platform": "2"
      },
      {
        "station_code": "MAS",
        "day": 1,
        "scheduled_arr": "19:20",
        "scheduled_dep": "19:20",
        "distance_km": 358,
        "platform": "2"
      }
    ],
    "status": {
      "current_status": "Running",
      "current_km": 210,
      "current_speed_kmh": 115,
      "last_reported_station": "SBC",
      "next_station": "KPD",
      "simulated_delay_mins": 4,
      "signal_aspect": "Green",
      "block_section": "JTJ-KPD Block 3",
      "pnp_score": 98.2
    }
  },
  {
    "train_number": "12131",
    "name": "Shirdi Superfast Express",
    "type": "Superfast Express",
    "priority": 2,
    "corridor_code": "MMR-KPG",
    "origin": "MMR",
    "destination": "KPG",
    "locomotive": "WAP-7 (Kalyan Shed #37105)",
    "rake_type": "LHB AC/Sleeper 20 Coaches",
    "max_speed_kmh": 110,
    "avg_speed_kmh": 68.5,
    "schedule": [
      {
        "station_code": "MMR",
        "station_name": "Manmad Junction",
        "day": 1,
        "scheduled_arr": "02:40",
        "scheduled_dep": "02:45",
        "distance_km": 0,
        "platform": "4"
      },
      {
        "station_code": "KPG",
        "station_name": "Kopargaon",
        "day": 1,
        "scheduled_arr": "03:28",
        "scheduled_dep": "03:30",
        "distance_km": 42,
        "platform": "2"
      }
    ],
    "status": {
      "current_status": "Running",
      "current_km": 278,
      "current_speed_kmh": 82,
      "last_reported_station": "MMR",
      "next_station": "KPG",
      "simulated_delay_mins": 9,
      "signal_aspect": "Green",
      "block_section": "MMR-KPG Block 3",
      "pnp_score": 92.4,
      "current_delay_mins": 4,
      "predicted_delay_mins": 3,
      "delay_probability": 45,
      "conflict_status": "NONE",
      "hold_status": "CLEAR",
      "hold_time_mins": 0
    }
  },
  {
    "train_number": "12432",
    "name": "Marathwada Rajdhani Link",
    "type": "Rajdhani",
    "priority": 1,
    "corridor_code": "MMR-KPG",
    "origin": "MMR",
    "destination": "KPG",
    "locomotive": "WAP-7 (Ajni Shed #30412)",
    "rake_type": "LHB AC 18 Coaches",
    "max_speed_kmh": 110,
    "avg_speed_kmh": 78.0,
    "schedule": [
      {
        "station_code": "MMR",
        "station_name": "Manmad Junction",
        "day": 1,
        "scheduled_arr": "10:10",
        "scheduled_dep": "10:15",
        "distance_km": 0,
        "platform": "1"
      },
      {
        "station_code": "KPG",
        "station_name": "Kopargaon",
        "day": 1,
        "scheduled_arr": "10:48",
        "scheduled_dep": "10:50",
        "distance_km": 42,
        "platform": "1"
      }
    ],
    "status": {
      "current_status": "Running",
      "current_km": 18,
      "current_speed_kmh": 85,
      "last_reported_station": "MMR",
      "next_station": "KPG",
      "current_delay_mins": 0,
      "predicted_delay_mins": 2,
      "delay_probability": 18,
      "conflict_status": "NONE",
      "hold_status": "CLEAR",
      "hold_time_mins": 0,
      "simulated_delay_mins": 2,
      "signal_aspect": "Green",
      "block_section": "MMR-KPG Single Block A",
      "pnp_score": 97.5
    }
  },
  {
    "train_number": "11077",
    "name": "Jhelum Express",
    "type": "Express",
    "priority": 3,
    "corridor_code": "MMR-KPG",
    "origin": "MMR",
    "destination": "KPG",
    "locomotive": "WAP-4 (Bhushawal Shed #22384)",
    "rake_type": "ICF Conventional 22 Coaches",
    "max_speed_kmh": 90,
    "avg_speed_kmh": 58.0,
    "schedule": [
      {
        "station_code": "MMR",
        "station_name": "Manmad Junction",
        "day": 1,
        "scheduled_arr": "09:45",
        "scheduled_dep": "09:50",
        "distance_km": 0,
        "platform": "3"
      },
      {
        "station_code": "KPG",
        "station_name": "Kopargaon",
        "day": 1,
        "scheduled_arr": "10:35",
        "scheduled_dep": "10:37",
        "distance_km": 42,
        "platform": "2"
      }
    ],
    "status": {
      "current_status": "Delayed",
      "current_km": 30,
      "current_speed_kmh": 55,
      "last_reported_station": "MMR",
      "next_station": "KPG",
      "current_delay_mins": 12,
      "predicted_delay_mins": 4,
      "delay_probability": 78,
      "conflict_status": "NONE",
      "hold_status": "CLEAR",
      "hold_time_mins": 0,
      "simulated_delay_mins": 16,
      "signal_aspect": "Yellow",
      "block_section": "MMR-KPG Single Block B",
      "pnp_score": 79.2
    }
  },
  {
    "train_number": "12780",
    "name": "Goa Express",
    "type": "Express",
    "priority": 3,
    "corridor_code": "MMR-KPG",
    "origin": "MMR",
    "destination": "KPG",
    "locomotive": "WAP-7 (Tughlakabad Shed #30612)",
    "rake_type": "LHB 22 Coaches",
    "max_speed_kmh": 100,
    "avg_speed_kmh": 65.0,
    "schedule": [
      {
        "station_code": "MMR",
        "station_name": "Manmad Junction",
        "day": 1,
        "scheduled_arr": "11:15",
        "scheduled_dep": "11:20",
        "distance_km": 0,
        "platform": "2"
      },
      {
        "station_code": "KPG",
        "station_name": "Kopargaon",
        "day": 1,
        "scheduled_arr": "12:02",
        "scheduled_dep": "12:04",
        "distance_km": 42,
        "platform": "1"
      }
    ],
    "status": {
      "current_status": "Predicted Delay",
      "current_km": 5,
      "current_speed_kmh": 70,
      "last_reported_station": "MMR",
      "next_station": "KPG",
      "current_delay_mins": 3,
      "predicted_delay_mins": 8,
      "delay_probability": 84,
      "conflict_status": "NONE",
      "hold_status": "CLEAR",
      "hold_time_mins": 0,
      "simulated_delay_mins": 11,
      "signal_aspect": "Double Yellow",
      "block_section": "MMR Outer Approach",
      "pnp_score": 83.1
    }
  },
  {
    "train_number": "51503",
    "name": "Manmad - Pune Passenger",
    "type": "Passenger",
    "priority": 4,
    "corridor_code": "MMR-KPG",
    "origin": "MMR",
    "destination": "KPG",
    "locomotive": "WAP-4 (Kalyan Shed #22510)",
    "rake_type": "ICF Unreserved 14 Coaches",
    "max_speed_kmh": 75,
    "avg_speed_kmh": 45.0,
    "schedule": [
      {
        "station_code": "MMR",
        "station_name": "Manmad Junction",
        "day": 1,
        "scheduled_arr": "10:15",
        "scheduled_dep": "10:20",
        "distance_km": 0,
        "platform": "5"
      },
      {
        "station_code": "KPG",
        "station_name": "Kopargaon",
        "day": 1,
        "scheduled_arr": "11:18",
        "scheduled_dep": "11:20",
        "distance_km": 42,
        "platform": "2"
      }
    ],
    "status": {
      "current_status": "Held - Conflict",
      "current_km": 0,
      "current_speed_kmh": 0,
      "last_reported_station": "MMR",
      "next_station": "KPG",
      "current_delay_mins": 5,
      "predicted_delay_mins": 3,
      "delay_probability": 89,
      "conflict_status": "CONFLICT DETECTED",
      "hold_status": "HELD AT LOOP",
      "hold_time_mins": 8,
      "conflict_with": "12432 (Rajdhani)",
      "hold_reason": "Single-track section precedence given to higher-priority Rajdhani Express",
      "simulated_delay_mins": 16,
      "signal_aspect": "Red",
      "block_section": "MMR Platform 5 Loop Line",
      "pnp_score": 64.0
    }
  },
  {
    "train_number": "51504",
    "name": "Kopargaon - Manmad Shuttle",
    "type": "Passenger",
    "priority": 4,
    "corridor_code": "MMR-KPG",
    "origin": "KPG",
    "destination": "MMR",
    "locomotive": "WAP-4 (Bhusawal Shed #22601)",
    "rake_type": "ICF Shuttle 12 Coaches",
    "max_speed_kmh": 75,
    "avg_speed_kmh": 46.0,
    "schedule": [
      {
        "station_code": "KPG",
        "station_name": "Kopargaon",
        "day": 1,
        "scheduled_arr": "12:30",
        "scheduled_dep": "12:35",
        "distance_km": 0,
        "platform": "2"
      },
      {
        "station_code": "MMR",
        "station_name": "Manmad Junction",
        "day": 1,
        "scheduled_arr": "13:30",
        "scheduled_dep": "13:35",
        "distance_km": 42,
        "platform": "4"
      }
    ],
    "status": {
      "current_status": "On Time",
      "current_km": 0,
      "current_speed_kmh": 0,
      "last_reported_station": "KPG",
      "next_station": "MMR",
      "current_delay_mins": 0,
      "predicted_delay_mins": 0,
      "delay_probability": 12,
      "conflict_status": "NONE",
      "hold_status": "CLEAR",
      "hold_time_mins": 0,
      "simulated_delay_mins": 0,
      "signal_aspect": "Green",
      "block_section": "KPG Yard Staging Line",
      "pnp_score": 98.0
    }
  }
];

export const mockStations = [
  {
    "code": "NDLS",
    "name": "New Delhi",
    "lat": 28.6429,
    "lng": 77.2195,
    "zone": "NR",
    "division": "Delhi",
    "platforms": 16,
    "category": "NSG-1"
  },
  {
    "code": "GZB",
    "name": "Ghaziabad Junction",
    "lat": 28.6678,
    "lng": 77.4349,
    "zone": "NR",
    "division": "Delhi",
    "platforms": 6,
    "category": "NSG-3"
  },
  {
    "code": "ALJN",
    "name": "Aligarh Junction",
    "lat": 27.8974,
    "lng": 78.088,
    "zone": "NCR",
    "division": "Prayagraj",
    "platforms": 7,
    "category": "NSG-3"
  },
  {
    "code": "TDL",
    "name": "Tundla Junction",
    "lat": 27.2064,
    "lng": 78.2435,
    "zone": "NCR",
    "division": "Prayagraj",
    "platforms": 5,
    "category": "NSG-4"
  },
  {
    "code": "CNB",
    "name": "Kanpur Central",
    "lat": 26.4547,
    "lng": 80.3507,
    "zone": "NCR",
    "division": "Prayagraj",
    "platforms": 10,
    "category": "NSG-1"
  },
  {
    "code": "PRYJ",
    "name": "Prayagraj Junction",
    "lat": 25.4526,
    "lng": 81.8349,
    "zone": "NCR",
    "division": "Prayagraj",
    "platforms": 10,
    "category": "NSG-2"
  },
  {
    "code": "DDU",
    "name": "Pt. Deen Dayal Upadhyaya Junction",
    "lat": 25.2818,
    "lng": 83.1182,
    "zone": "ECR",
    "division": "Pt. DDU",
    "platforms": 8,
    "category": "NSG-2"
  },
  {
    "code": "BXR",
    "name": "Buxar",
    "lat": 25.5647,
    "lng": 83.9777,
    "zone": "ECR",
    "division": "Danapur",
    "platforms": 3,
    "category": "NSG-4"
  },
  {
    "code": "PNBE",
    "name": "Patna Junction",
    "lat": 25.6022,
    "lng": 85.1376,
    "zone": "ECR",
    "division": "Danapur",
    "platforms": 10,
    "category": "NSG-1"
  },
  {
    "code": "ASN",
    "name": "Asansol Junction",
    "lat": 23.6871,
    "lng": 86.9746,
    "zone": "ER",
    "division": "Asansol",
    "platforms": 7,
    "category": "NSG-2"
  },
  {
    "code": "HWH",
    "name": "Howrah Junction",
    "lat": 22.5839,
    "lng": 88.3426,
    "zone": "ER",
    "division": "Howrah",
    "platforms": 23,
    "category": "NSG-1"
  },
  {
    "code": "MTJ",
    "name": "Mathura Junction",
    "lat": 27.4924,
    "lng": 77.6737,
    "zone": "NCR",
    "division": "Agra",
    "platforms": 10,
    "category": "NSG-2"
  },
  {
    "code": "KOTA",
    "name": "Kota Junction",
    "lat": 25.2138,
    "lng": 75.8648,
    "zone": "WCR",
    "division": "Kota",
    "platforms": 6,
    "category": "NSG-2"
  },
  {
    "code": "RTM",
    "name": "Ratlam Junction",
    "lat": 23.3441,
    "lng": 75.0352,
    "zone": "WR",
    "division": "Ratlam",
    "platforms": 7,
    "category": "NSG-2"
  },
  {
    "code": "BRC",
    "name": "Vadodara Junction",
    "lat": 22.3107,
    "lng": 73.1812,
    "zone": "WR",
    "division": "Vadodara",
    "platforms": 7,
    "category": "NSG-1"
  },
  {
    "code": "ST",
    "name": "Surat",
    "lat": 21.2049,
    "lng": 72.8406,
    "zone": "WR",
    "division": "Mumbai WR",
    "platforms": 4,
    "category": "NSG-1"
  },
  {
    "code": "BVI",
    "name": "Borivali",
    "lat": 19.2294,
    "lng": 72.8574,
    "zone": "WR",
    "division": "Mumbai WR",
    "platforms": 10,
    "category": "NSG-1"
  },
  {
    "code": "MMCT",
    "name": "Mumbai Central",
    "lat": 18.9696,
    "lng": 72.8193,
    "zone": "WR",
    "division": "Mumbai WR",
    "platforms": 5,
    "category": "NSG-1"
  },
  {
    "code": "MAS",
    "name": "MGR Chennai Central",
    "lat": 13.0827,
    "lng": 80.2757,
    "zone": "SR",
    "division": "Chennai",
    "platforms": 17,
    "category": "NSG-1"
  },
  {
    "code": "KPD",
    "name": "Katpadi Junction",
    "lat": 12.9692,
    "lng": 79.1378,
    "zone": "SR",
    "division": "Chennai",
    "platforms": 5,
    "category": "NSG-2"
  },
  {
    "code": "SBC",
    "name": "KSR Bengaluru City Junction",
    "lat": 12.9781,
    "lng": 77.5694,
    "zone": "SWR",
    "division": "Bengaluru",
    "platforms": 10,
    "category": "NSG-1"
  },
  {
    "code": "MMR",
    "name": "Manmad Junction",
    "lat": 20.2503,
    "lng": 74.4378,
    "zone": "CR",
    "division": "Bhusawal",
    "platforms": 6,
    "category": "NSG-3"
  },
  {
    "code": "KPG",
    "name": "Kopargaon",
    "lat": 19.8914,
    "lng": 74.4786,
    "zone": "CR",
    "division": "Solapur",
    "platforms": 2,
    "category": "NSG-4"
  }
];

export const mockRoutes = [
  {
    "id": "CORR-01",
    "code": "NDLS-HWH",
    "name": "Northern-Eastern Trunk Corridor (New Delhi - Howrah Main Line)",
    "total_distance_km": 1447,
    "electrified": true,
    "tracks": 2,
    "max_permissible_speed_kmh": 130,
    "stops": [
      {
        "station_code": "NDLS",
        "km": 0,
        "order": 1
      },
      {
        "station_code": "GZB",
        "km": 25,
        "order": 2
      },
      {
        "station_code": "ALJN",
        "km": 131,
        "order": 3
      },
      {
        "station_code": "TDL",
        "km": 209,
        "order": 4
      },
      {
        "station_code": "CNB",
        "km": 440,
        "order": 5
      },
      {
        "station_code": "PRYJ",
        "km": 635,
        "order": 6
      },
      {
        "station_code": "DDU",
        "km": 788,
        "order": 7
      },
      {
        "station_code": "BXR",
        "km": 882,
        "order": 8
      },
      {
        "station_code": "PNBE",
        "km": 1000,
        "order": 9
      },
      {
        "station_code": "ASN",
        "km": 1247,
        "order": 10
      },
      {
        "station_code": "HWH",
        "km": 1447,
        "order": 11
      }
    ],
    "critical_bottlenecks": [
      {
        "location": "CNB Yard",
        "km": 438,
        "reason": "Diamond crossing and intensive terminal shunting"
      },
      {
        "location": "GZB-ALJN Section",
        "km": 75,
        "reason": "High commuter & freight mix (135% line capacity utilization)"
      },
      {
        "location": "DDU East Cabin",
        "km": 790,
        "reason": "Coal freight convergence zone"
      }
    ]
  },
  {
    "id": "CORR-02",
    "code": "NDLS-MMCT",
    "name": "Western Trunk Corridor (New Delhi - Mumbai Central)",
    "total_distance_km": 1384,
    "electrified": true,
    "tracks": 2,
    "max_permissible_speed_kmh": 130,
    "stops": [
      {
        "station_code": "NDLS",
        "km": 0,
        "order": 1
      },
      {
        "station_code": "MTJ",
        "km": 141,
        "order": 2
      },
      {
        "station_code": "KOTA",
        "km": 465,
        "order": 3
      },
      {
        "station_code": "RTM",
        "km": 732,
        "order": 4
      },
      {
        "station_code": "BRC",
        "km": 992,
        "order": 5
      },
      {
        "station_code": "ST",
        "km": 1122,
        "order": 6
      },
      {
        "station_code": "BVI",
        "km": 1354,
        "order": 7
      },
      {
        "station_code": "MMCT",
        "km": 1384,
        "order": 8
      }
    ],
    "critical_bottlenecks": [
      {
        "location": "MTJ Junction",
        "km": 140,
        "reason": "North-Central route bifurcations"
      },
      {
        "location": "BVI-MMCT Suburban Section",
        "km": 1365,
        "reason": "Dense local suburban peak headway"
      }
    ]
  },
  {
    "id": "CORR-03",
    "code": "MAS-SBC",
    "name": "Southern Inter-City Trunk (Chennai Central - Bengaluru)",
    "total_distance_km": 358,
    "electrified": true,
    "tracks": 2,
    "max_permissible_speed_kmh": 110,
    "stops": [
      {
        "station_code": "MAS",
        "km": 0,
        "order": 1
      },
      {
        "station_code": "KPD",
        "km": 130,
        "order": 2
      },
      {
        "station_code": "SBC",
        "km": 358,
        "order": 3
      }
    ],
    "critical_bottlenecks": [
      {
        "location": "Arakkonam-Katpadi gradient",
        "km": 115,
        "reason": "Permanent curve speed restriction"
      }
    ]
  },
  {
    "id": "CORR-04",
    "code": "MMR-KPG",
    "name": "Manmad Jn - Kopargaon Single-Track Corridor",
    "total_distance_km": 42,
    "electrified": true,
    "tracks": 1,
    "track_type": "Single Track",
    "max_permissible_speed_kmh": 110,
    "stops": [
      {
        "station_code": "MMR",
        "km": 0,
        "order": 1
      },
      {
        "station_code": "KPG",
        "km": 42,
        "order": 2
      }
    ],
    "critical_bottlenecks": [
      {
        "location": "MMR South Outer Switch",
        "km": 2,
        "reason": "Transition from junction yard to single track section"
      },
      {
        "location": "Godavari River Single-Line Section",
        "km": 24,
        "reason": "No loop siding; strict absolute block working"
      }
    ]
  }
];
