import React, { useEffect, useRef, useState } from 'react';
import { 
  MapPin, 
  Navigation2, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Train, 
  Eye, 
  RefreshCw,
  Compass,
  SlidersHorizontal,
  Info
} from 'lucide-react';

export default function ManmadRegionalMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const trainsGroupRef = useRef(null);
  const tracksGroupRef = useRef(null);
  const platformsGroupRef = useRef(null);

  const [currentZoom, setCurrentZoom] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStations, setShowStations] = useState(true);
  const [showLiveTrains, setShowLiveTrains] = useState(true);
  const [showPlatforms, setShowPlatforms] = useState(true);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [activePreset, setActivePreset] = useState('section');

  // Comprehensive Railway Stations Network across all 4 converging corridors
  const stationsData = [
    // 1. Manmad Central Junction Hub
    { code: "MMR", name: "Manmad Junction", coords: [20.2498, 74.4384], type: "junction", distKm: 0, line: "Central Junction Hub", pfs: 6, div: "Bhusawal (CR)" },

    // 2. Daund / Kopargaon / Pune Line (South Corridor)
    { code: "ANK", name: "Ankai Junction", coords: [20.1983, 74.4521], type: "junction", distKm: 12, line: "Daund–Manmad Chord", pfs: 2, div: "Bhusawal (CR)" },
    { code: "AAK", name: "Ankai Killa", coords: [20.1740, 74.4620], type: "regular", distKm: 16, line: "Daund–Manmad Line", pfs: 2, div: "Bhusawal (CR)" },
    { code: "TR", name: "Tarur", coords: [20.1320, 74.4710], type: "regular", distKm: 21, line: "Daund–Manmad Line", pfs: 2, div: "Bhusawal (CR)" },
    { code: "YL", name: "Yeola", coords: [20.0450, 74.4890], type: "regular", distKm: 29, line: "Daund–Manmad Line", pfs: 2, div: "Solapur (CR)" },
    { code: "KPG", name: "Kopargaon", coords: [20.0094, 74.4842], type: "junction", distKm: 41, line: "Daund–Manmad Line", pfs: 2, div: "Solapur (CR)" },
    { code: "SNVR", name: "Sanvatsar", coords: [19.9320, 74.5240], type: "regular", distKm: 49, line: "Daund–Manmad Line", pfs: 2, div: "Solapur (CR)" },
    { code: "PB", name: "Puntamba Junction", coords: [19.8820, 74.6040], type: "junction", distKm: 56, line: "Shirdi Branch Interchange", pfs: 3, div: "Solapur (CR)" },
    { code: "BAP", name: "Belapur", coords: [19.7820, 74.6540], type: "regular", distKm: 75, line: "Daund–Manmad Line", pfs: 3, div: "Solapur (CR)" },
    { code: "ANG", name: "Ahmednagar", coords: [19.0950, 74.7490], type: "junction", distKm: 154, line: "Daund–Manmad Line", pfs: 3, div: "Solapur (CR)" },
    { code: "DD", name: "Daund Junction", coords: [18.4650, 74.5820], type: "junction", distKm: 238, line: "Pune–Daund Main Line", pfs: 6, div: "Pune (CR)" },

    // 3. Mumbai / Kalyan Line (Southwest Corridor)
    { code: "LS", name: "Lasalgaon (Onion Terminal)", coords: [20.1472, 74.2281], type: "regular", distKm: 25, line: "Bhusawal–Kalyan Main Line", pfs: 3, div: "Bhusawal (CR)" },
    { code: "UGN", name: "Ugaon", coords: [20.1120, 74.1560], type: "regular", distKm: 35, line: "Bhusawal–Kalyan Main Line", pfs: 2, div: "Bhusawal (CR)" },
    { code: "NR", name: "Niphad", coords: [20.0810, 74.1080], type: "regular", distKm: 42, line: "Bhusawal–Kalyan Main Line", pfs: 3, div: "Bhusawal (CR)" },
    { code: "KW", name: "Kherwadi", coords: [20.0240, 73.9740], type: "regular", distKm: 59, line: "Bhusawal–Kalyan Main Line", pfs: 2, div: "Bhusawal (CR)" },
    { code: "NK", name: "Nashik Road", coords: [19.9570, 73.8340], type: "junction", distKm: 73, line: "Bhusawal–Kalyan Main Line", pfs: 4, div: "Bhusawal (CR)" },
    { code: "DVL", name: "Devlali", coords: [19.9240, 73.8180], type: "regular", distKm: 82, line: "Bhusawal–Kalyan Main Line", pfs: 3, div: "Bhusawal (CR)" },
    { code: "IGP", name: "Igatpuri (Ghat Banking)", coords: [19.6980, 73.5620], type: "junction", distKm: 124, line: "Thal Ghat Catenary Section", pfs: 4, div: "Mumbai (CR)" },
    { code: "KSRA", name: "Kasara", coords: [19.6450, 73.4840], type: "regular", distKm: 138, line: "Mumbai Suburban Terminal", pfs: 4, div: "Mumbai (CR)" },
    { code: "KYN", name: "Kalyan Junction", coords: [19.2380, 73.1310], type: "junction", distKm: 206, line: "Central Railway Suburban Hub", pfs: 8, div: "Mumbai (CR)" },
    { code: "CSMT", name: "Mumbai CSMT", coords: [18.9400, 72.8350], type: "junction", distKm: 258, line: "CR Headquarters Terminal", pfs: 18, div: "Mumbai (CR)" },

    // 4. Bhusawal / Nagpur / Howrah Trunk Line (Northeast Corridor)
    { code: "NGN", name: "Nandgaon", coords: [20.3125, 74.6542], type: "regular", distKm: 25, line: "Howrah–Nagpur–Mumbai Trunk", pfs: 2, div: "Bhusawal (CR)" },
    { code: "NYH", name: "Naydongri", coords: [20.3850, 74.8020], type: "regular", distKm: 46, line: "Howrah–Nagpur–Mumbai Trunk", pfs: 2, div: "Bhusawal (CR)" },
    { code: "CSN", name: "Chalisgaon Junction", coords: [20.4600, 74.9900], type: "junction", distKm: 68, line: "Dhule Branch Interchange", pfs: 4, div: "Bhusawal (CR)" },
    { code: "KJ", name: "Kajgaon", coords: [20.5280, 75.1240], type: "regular", distKm: 87, line: "Howrah–Nagpur–Mumbai Trunk", pfs: 2, div: "Bhusawal (CR)" },
    { code: "PC", name: "Pachora Junction", coords: [20.6680, 75.3520], type: "junction", distKm: 114, line: "Jamner Branch Interchange", pfs: 3, div: "Bhusawal (CR)" },
    { code: "JL", name: "Jalgaon Junction", coords: [20.9980, 75.5670], type: "junction", distKm: 160, line: "Surat Line Interchange", pfs: 5, div: "Bhusawal (CR)" },
    { code: "BSL", name: "Bhusawal Junction", coords: [21.0455, 75.7885], type: "junction", distKm: 184, line: "CR Divisional Headquarters", pfs: 8, div: "Bhusawal (CR)" },

    // 5. Nanded / Secunderabad Line (Southeast Corridor)
    { code: "NSL", name: "Nagarsol", coords: [20.1780, 74.5720], type: "regular", distKm: 24, line: "Secunderabad–Manmad Line", pfs: 3, div: "Nanded (SCR)" },
    { code: "RGO", name: "Rotegaon", coords: [19.9800, 75.0500], type: "regular", distKm: 52, line: "Secunderabad–Manmad Line", pfs: 2, div: "Nanded (SCR)" },
    { code: "LSR", name: "Lasur", coords: [19.9320, 75.1840], type: "regular", distKm: 79, line: "Secunderabad–Manmad Line", pfs: 2, div: "Nanded (SCR)" },
    { code: "AWB", name: "Aurangabad (Chhatrapati Sambhajinagar)", coords: [19.8762, 75.3433], type: "junction", distKm: 113, line: "Marathwada Hub", pfs: 4, div: "Nanded (SCR)" },
    { code: "J", name: "Jalna", coords: [19.8410, 75.8820], type: "regular", distKm: 176, line: "Secunderabad–Manmad Line", pfs: 3, div: "Nanded (SCR)" },
    { code: "NED", name: "Hazur Sahib Nanded", coords: [19.1550, 77.3180], type: "junction", distKm: 348, line: "SCR Divisional Headquarters", pfs: 4, div: "Nanded (SCR)" }
  ];

  // Active Simulated Trains with Coordinates along Real Railway Alignment
  const liveTrainsData = [
    {
      id: "22222",
      name: "CSMT Rajdhani Express",
      prio: "P1 (Rajdhani)",
      color: "#10b981", // Green
      coords: [20.2780, 74.5100], // Down Main between Nandgaon and MMR
      speedKmh: 112,
      delayMin: 12,
      heading: "Towards MMR (Down Main)",
      nextStop: "MMR Platform 1 (Clear)",
      route: "Hazrat Nizamuddin → CSMT Mumbai",
      status: "Approaching MMR Yard (Precedence Awarded)"
    },
    {
      id: "11078",
      name: "Jhelum Express",
      prio: "P3 (Express)",
      color: "#ef4444", // Red
      coords: [20.2050, 74.4510], // Held at Ankai Outer
      speedKmh: 0,
      delayMin: 28,
      heading: "Towards MMR via Ankai Throat",
      nextStop: "Signal S-42 (Red Aspect)",
      route: "Jammu Tawi → Pune Jn",
      status: "REGULATED AT ANKAI OUTER (Waiting Clearance)"
    },
    {
      id: "12138",
      name: "Punjab Mail",
      prio: "P2 (Superfast)",
      color: "#0ea5e9", // Cyan
      coords: [20.2498, 74.4384], // At MMR Platform 3
      speedKmh: 0,
      delayMin: 18,
      heading: "Platform 3 Halt",
      nextStop: "Departing for Lasalgaon",
      route: "Firozpur Cantt → CSMT Mumbai",
      status: "Berthing at Platform 3 (Dep in 2 min)"
    },
    {
      id: "12780",
      name: "Goa Express",
      prio: "P2 (Superfast)",
      color: "#f59e0b", // Amber
      coords: [20.0850, 74.4780], // Moving past Yeola towards Ankai
      speedKmh: 84,
      delayMin: 4,
      heading: "Northbound toward MMR",
      nextStop: "MMR Platform 4 (13:10)",
      route: "Hazrat Nizamuddin → Vasco-da-Gama",
      status: "Cruising in Section (Single Line Track)"
    },
    {
      id: "17057",
      name: "Devagiri Express",
      prio: "P3 (Express)",
      color: "#a855f7", // Purple
      coords: [20.1250, 74.1980], // Between Lasalgaon and MMR
      speedKmh: 76,
      delayMin: 6,
      heading: "Eastbound toward MMR & Nanded",
      nextStop: "MMR Platform 5",
      route: "CSMT Mumbai → Secunderabad",
      status: "Running on Schedule"
    },
    {
      id: "20705",
      name: "Jalna - CSMT Vande Bharat",
      prio: "P1 (Vande Bharat)",
      color: "#38bdf8", // Sky Blue
      coords: [20.0800, 74.8200], // Between Rotegaon and Nagarsol
      speedKmh: 110,
      delayMin: 0,
      heading: "Westbound to MMR",
      nextStop: "Manmad Jn (PF 2)",
      route: "Jalna → CSMT Mumbai",
      status: "High-Speed Running (OT - On Time)"
    },
    {
      id: "BOXN-884",
      name: "FCI Grain Freight Special",
      prio: "P5 (Freight)",
      color: "#94a3b8", // Slate
      coords: [19.9850, 74.4920], // At Kopargaon Goods Siding
      speedKmh: 0,
      delayMin: 45,
      heading: "Held on Kopargaon Loop",
      nextStop: "Belapur Yard",
      route: "Bhusawal Yard → Daund Goods Yard",
      status: "Regulated on Loop line for passenger pass"
    }
  ];

  // MMR 6 Physical Platforms Geographic Data with Live Berthing Telemetry
  const mmrPlatformsData = [
    {
      pf: 1,
      name: "Platform 1",
      lineType: "Down Main Line (Mumbai Through)",
      lengthMeters: 650,
      coaches: 24,
      status: "Occupied (Berthed)",
      color: "#10b981", // Emerald
      track: [
        [20.2514, 74.4358],
        [20.2505, 74.4382],
        [20.2496, 74.4406]
      ],
      labelCoord: [20.2505, 74.4382],
      facilities: "Ambulance Ramp, 24-Coach Rake Length, Direct Down Main Access",
      liveTrain: {
        trainNo: "22222",
        name: "CSMT Rajdhani Express",
        priority: "P1 (Rajdhani)",
        exactLocation: "Manmad Jn Platform 1, Down Main (Km 261/2)",
        exactCoords: [20.2505, 74.4382],
        rake: "22 LHB Coaches (580m)",
        speedKmh: 0,
        delayMin: 12,
        dwellStatus: "BERTHED ON PF 1 (Clearance Authorized)",
        expectedDeparture: "10:38 AM",
        signalAspect: "Signal S-14 Green (Down Main Clear)",
        route: "Hazrat Nizamuddin → CSMT Mumbai"
      }
    },
    {
      pf: 2,
      name: "Platform 2",
      lineType: "Up Main Line (Bhusawal Through)",
      lengthMeters: 650,
      coaches: 24,
      status: "Clear (Line Available)",
      color: "#38bdf8", // Sky Blue
      track: [
        [20.2511, 74.4360],
        [20.2502, 74.4384],
        [20.2493, 74.4408]
      ],
      labelCoord: [20.2502, 74.4384],
      facilities: "Mainline High Speed Through, Full Canopy, Water Vending",
      liveTrain: null
    },
    {
      pf: 3,
      name: "Platform 3",
      lineType: "Bidirectional Loop Line",
      lengthMeters: 620,
      coaches: 24,
      status: "Occupied (Berthed)",
      color: "#0ea5e9", // Cyan
      track: [
        [20.2508, 74.4362],
        [20.2499, 74.4386],
        [20.2490, 74.4410]
      ],
      labelCoord: [20.2499, 74.4386],
      facilities: "Superfast Commercial Halt, FOB & Lift Access",
      liveTrain: {
        trainNo: "12138",
        name: "Punjab Mail",
        priority: "P2 (Superfast)",
        exactLocation: "Manmad Jn Platform 3 Loop Line (Km 261/4)",
        exactCoords: [20.2499, 74.4386],
        rake: "24 Coaches (620m)",
        speedKmh: 0,
        delayMin: 18,
        dwellStatus: "BERTHED ON PF 3 (Boarding in Progress)",
        expectedDeparture: "10:45 AM",
        signalAspect: "Signal S-08 Starter Caution Yellow",
        route: "Firozpur Cantt → CSMT Mumbai"
      }
    },
    {
      pf: 4,
      name: "Platform 4",
      lineType: "South Corridor Line (Daund / KPG / Pune)",
      lengthMeters: 600,
      coaches: 22,
      status: "Reserved for Arrival",
      color: "#f59e0b", // Amber
      track: [
        [20.2505, 74.4364],
        [20.2496, 74.4388],
        [20.2487, 74.4412]
      ],
      labelCoord: [20.2496, 74.4388],
      facilities: "Direct Southern Throat Entry, Single-Line Chord Interlocking",
      liveTrain: {
        trainNo: "11078",
        name: "Jhelum Express (Target: PF 4)",
        priority: "P3 (Express)",
        exactLocation: "Held at Ankai Outer Signal S-42 (Track Km 258/6)",
        exactCoords: [20.2050, 74.4510],
        rake: "24 Coaches (620m)",
        speedKmh: 0,
        delayMin: 28,
        dwellStatus: "RESERVED BERTH PF 4 (Regulated at Outer Signal)",
        expectedArrival: "10:48 AM",
        signalAspect: "Signal S-42 Red (Danger Held)",
        route: "Jammu Tawi → Pune Jn"
      }
    },
    {
      pf: 5,
      name: "Platform 5",
      lineType: "East Branch Line (Nanded / Aurangabad)",
      lengthMeters: 580,
      coaches: 22,
      status: "Clear (Line Available)",
      color: "#a855f7", // Purple
      track: [
        [20.2502, 74.4366],
        [20.2493, 74.4390],
        [20.2484, 74.4414]
      ],
      labelCoord: [20.2493, 74.4390],
      facilities: "Marathwada Line Branch Interlocking, Passenger Waiting Hall",
      liveTrain: null
    },
    {
      pf: 6,
      name: "Platform 6",
      lineType: "Shunting & Heavy Freight Loop",
      lengthMeters: 720,
      coaches: 26,
      status: "Occupied (Stabled Freight)",
      color: "#94a3b8", // Slate
      track: [
        [20.2499, 74.4368],
        [20.2490, 74.4392],
        [20.2481, 74.4416]
      ],
      labelCoord: [20.2490, 74.4392],
      facilities: "720m CSL Long Haul Freight Bypass, Loco Reversal & Yard Siding",
      liveTrain: {
        trainNo: "BOXN-MMR-884",
        name: "FCI Grain Special Rake",
        priority: "P5 (Freight)",
        exactLocation: "Manmad Platform 6 / Freight Loop (Km 261/8)",
        exactCoords: [20.2490, 74.4392],
        rake: "58 BOXN Wagons (680m)",
        speedKmh: 0,
        delayMin: 45,
        dwellStatus: "STABLED ON PF 6 SIDING (Awaiting Slot)",
        expectedDeparture: "11:15 AM",
        signalAspect: "Shunt Ground Signal",
        route: "Bhusawal Goods Yard → Pune Goods Terminal"
      }
    }
  ];

  // Initialize and update map
  useEffect(() => {
    if (!window.L) {
      const interval = setInterval(() => {
        if (window.L) {
          clearInterval(interval);
          setupMap();
        }
      }, 300);
      return () => clearInterval(interval);
    } else {
      setupMap();
    }

    function setupMap() {
      if (!mapContainerRef.current) return;

      const L = window.L;

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Manmad coordinates
      const mmrCoords = [20.2498, 74.4384];

      const map = L.map(mapContainerRef.current, {
        center: mmrCoords,
        zoom: 10,
        minZoom: 6, // Allows full regional zoom out to Mumbai & Bhusawal!
        maxZoom: 18, // Allows deep yard-level inspection!
        scrollWheelZoom: true, // Smooth scroll wheel zoom
        doubleClickZoom: true,
        zoomControl: false // Custom controls positioned cleanly
      });

      // Free CartoDB Dark Matter tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(map);

      // Track zoom level state
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Create layer groups
      tracksGroupRef.current = L.layerGroup().addTo(map);
      platformsGroupRef.current = L.layerGroup().addTo(map);
      markersGroupRef.current = L.layerGroup().addTo(map);
      trainsGroupRef.current = L.layerGroup().addTo(map);

      // 1. Plot the 4 Full Railway Corridors
      // Corridor 1: Kalyan / Mumbai Line (Southwest)
      const mumbaiTrack = [
        [18.9400, 72.8350], // CSMT
        [19.2380, 73.1310], // Kalyan
        [19.6450, 73.4840], // Kasara
        [19.6980, 73.5620], // Igatpuri
        [19.9240, 73.8180], // Devlali
        [19.9570, 73.8340], // Nashik Road
        [20.0240, 73.9740], // Kherwadi
        [20.0810, 74.1080], // Niphad
        [20.1472, 74.2281], // Lasalgaon
        [20.2498, 74.4384]  // MMR
      ];
      L.polyline(mumbaiTrack, {
        color: '#0ea5e9',
        weight: 5,
        opacity: 0.85
      }).addTo(tracksGroupRef.current).bindTooltip("Mumbai–Kalyan–Manmad Main Line (Double Track Electrified)", { sticky: true });

      // Corridor 2: Bhusawal / Nagpur / Howrah Trunk Line (Northeast)
      const bhusawalTrack = [
        [20.2498, 74.4384], // MMR
        [20.3125, 74.6542], // Nandgaon
        [20.3850, 74.8020], // Naydongri
        [20.4600, 74.9900], // Chalisgaon
        [20.6680, 75.3520], // Pachora
        [20.9980, 75.5670], // Jalgaon
        [21.0455, 75.7885]  // Bhusawal
      ];
      L.polyline(bhusawalTrack, {
        color: '#10b981',
        weight: 5,
        opacity: 0.85
      }).addTo(tracksGroupRef.current).bindTooltip("Howrah–Nagpur–Mumbai Trunk Corridor (130 km/h ABS)", { sticky: true });

      // Corridor 3: Daund / Kopargaon / Pune Line (South Single/Doubled Chord)
      const daundTrack = [
        [20.2498, 74.4384], // MMR
        [20.1983, 74.4521], // Ankai
        [20.0450, 74.4890], // Yeola
        [20.0094, 74.4842], // Kopargaon
        [19.8820, 74.6040], // Puntamba
        [19.7820, 74.6540], // Belapur
        [19.0950, 74.7490], // Ahmednagar
        [18.4650, 74.5820]  // Daund
      ];
      L.polyline(daundTrack, {
        color: '#f59e0b',
        weight: 4.5,
        opacity: 0.9,
        dashArray: '8, 6'
      }).addTo(tracksGroupRef.current).bindTooltip("Daund–Manmad Chord Line (MMR–KPG Section)", { sticky: true });

      // Corridor 4: Nanded / Secunderabad Line (Southeast)
      const nandedTrack = [
        [20.2498, 74.4384], // MMR
        [20.1780, 74.5720], // Nagarsol
        [19.9800, 75.0500], // Rotegaon
        [19.9320, 75.1840], // Lasur
        [19.8762, 75.3433], // Aurangabad
        [19.8410, 75.8820], // Jalna
        [19.1550, 77.3180]  // Nanded
      ];
      L.polyline(nandedTrack, {
        color: '#a855f7',
        weight: 4,
        opacity: 0.85
      }).addTo(tracksGroupRef.current).bindTooltip("Secunderabad–Manmad Line (Marathwada Corridor)", { sticky: true });

      mapInstanceRef.current = map;
      renderMarkersAndTrains(map);
    }
  }, []);

  // Re-render markers, trains, and platforms when filter toggles change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    renderMarkersAndTrains(mapInstanceRef.current);
  }, [showStations, showLiveTrains, showPlatforms]);

  const renderMarkersAndTrains = (map) => {
    const L = window.L;
    if (!L) return;

    // Clear existing
    if (markersGroupRef.current) markersGroupRef.current.clearLayers();
    if (trainsGroupRef.current) trainsGroupRef.current.clearLayers();
    if (platformsGroupRef.current) platformsGroupRef.current.clearLayers();

    // 1. Render Stations
    if (showStations && markersGroupRef.current) {
      stationsData.forEach(stn => {
        const isMmrHub = stn.code === "MMR";
        const isJunction = stn.type === "junction";

        const markerHtml = `
          <div style="
            background: ${isMmrHub ? '#0284c7' : isJunction ? '#0f172a' : '#1e293b'};
            border: ${isMmrHub ? '2px solid #38bdf8' : isJunction ? '1.5px solid #0ea5e9' : '1px solid #64748b'};
            color: #ffffff;
            font-family: monospace;
            font-size: ${isMmrHub ? '11px' : isJunction ? '9.5px' : '8.5px'};
            font-weight: ${isMmrHub ? 'bold' : '600'};
            padding: ${isMmrHub ? '3px 7px' : '2px 5px'};
            border-radius: 4px;
            box-shadow: ${isMmrHub ? '0 0 14px rgba(56,189,248,0.8)' : '0 0 6px rgba(0,0,0,0.5)'};
            white-space: nowrap;
            text-align: center;
            cursor: pointer;
          ">
            ${isMmrHub ? '⭐ ' : isJunction ? '⚑ ' : '• '}${stn.name} (${stn.code})
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-station-pill',
          html: markerHtml,
          iconSize: [isMmrHub ? 120 : 90, 22],
          iconAnchor: [isMmrHub ? 60 : 45, 11]
        });

        const marker = L.marker(stn.coords, { icon }).addTo(markersGroupRef.current);

        marker.bindPopup(`
          <div style="font-family: sans-serif; color: #0f172a; padding: 4px; min-width: 180px;">
            <div style="font-weight: 800; font-size: 13px; color: #0284c7;">${stn.name} [${stn.code}]</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Division: <strong>${stn.div}</strong></div>
            <div style="font-size: 11px; color: #334155;">Track Section: <strong>${stn.line}</strong></div>
            <div style="font-size: 11px; color: #334155;">Platforms: <strong>${stn.pfs}</strong> | Distance from MMR: <strong>${stn.distKm} km</strong></div>
            <div style="margin-top: 6px; padding: 3px 6px; background: #e0f2fe; border-radius: 4px; font-size: 10px; font-weight: bold; color: #0369a1;">
              Interlocking Status: ALL CLEAR (NORMAL ASPECT)
            </div>
          </div>
        `);
      });
    }

    // 2. Render Live Trains with Telemetry & Animations
    if (showLiveTrains && trainsGroupRef.current) {
      liveTrainsData.forEach(train => {
        const isHeld = train.speedKmh === 0 && train.delayMin > 20;

        const trainHtml = `
          <div style="
            background: ${train.color};
            border: 2px solid #ffffff;
            color: ${train.color === '#ffffff' ? '#000' : '#000000'};
            font-family: monospace;
            font-size: 10px;
            font-weight: 900;
            padding: 2px 7px;
            border-radius: 9999px;
            box-shadow: 0 0 16px ${train.color};
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            animation: ${isHeld ? 'pulse 1.5s infinite' : 'none'};
          ">
            <span>🚆</span>
            <span>${train.id} (${train.speedKmh} km/h)</span>
            ${isHeld ? '<span style="background: #991b1b; color: #fff; padding: 0 4px; border-radius: 3px; font-size: 8px;">HELD</span>' : ''}
          </div>
        `;

        const trainIcon = L.divIcon({
          className: 'custom-train-pill',
          html: trainHtml,
          iconSize: [120, 24],
          iconAnchor: [60, 12]
        });

        const marker = L.marker(train.coords, { icon: trainIcon }).addTo(trainsGroupRef.current);

        marker.on('click', () => {
          setSelectedTrain(train);
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; color: #0f172a; padding: 4px; min-width: 220px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 800; font-size: 13px; color: #0f172a;">🚆 Train ${train.id}</span>
              <span style="font-size: 10px; font-weight: bold; background: #fef08a; padding: 1px 4px; border-radius: 3px;">${train.prio}</span>
            </div>
            <div style="font-weight: bold; font-size: 11px; color: #0284c7; margin-top: 1px;">${train.name}</div>
            <div style="font-size: 10px; color: #64748b;">${train.route}</div>
            <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px; font-family: monospace;">
              <div>Speed: <strong>${train.speedKmh} km/h</strong></div>
              <div>Delay: <strong style="color: ${train.delayMin > 15 ? '#b91c1c' : '#15803d'}">+${train.delayMin} min</strong></div>
            </div>
            <div style="font-size: 10px; margin-top: 4px;">Status: <strong>${train.status}</strong></div>
            <div style="font-size: 10px; color: #0284c7; margin-top: 2px;">Next: <strong>${train.nextStop}</strong></div>
          </div>
        `);
      });
    }

    // 3. Render MMR 6 Physical Platforms
    if (showPlatforms && platformsGroupRef.current) {
      mmrPlatformsData.forEach(pf => {
        // Platform track polyline
        L.polyline(pf.track, {
          color: pf.color,
          weight: 7,
          opacity: 0.95
        }).addTo(platformsGroupRef.current).bindTooltip(`MMR ${pf.name}: ${pf.lineType} (${pf.lengthMeters}m CSL)`, { sticky: true });

        // Platform Center Marker Pill
        const pfIconHtml = `
          <div style="
            background: #090d16;
            border: 2px solid ${pf.color};
            color: #ffffff;
            font-family: monospace;
            font-size: 9.5px;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 4px;
            box-shadow: 0 0 12px ${pf.color}88;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
          ">
            <span style="background: ${pf.color}; color: #000; padding: 0 4px; border-radius: 2px; font-size: 8.5px; font-weight: 900;">PF ${pf.pf}</span>
            <span>${pf.lengthMeters}m</span>
          </div>
        `;

        const pfIcon = L.divIcon({
          className: 'custom-platform-pill',
          html: pfIconHtml,
          iconSize: [110, 22],
          iconAnchor: [55, 11]
        });

        const marker = L.marker(pf.labelCoord, { icon: pfIcon }).addTo(platformsGroupRef.current);

        marker.on('click', () => {
          setSelectedPlatform(pf);
        });

        const liveTrainInfo = pf.liveTrain ? `
          <div style="margin-top: 6px; padding: 5px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 4px;">
            <div style="font-weight: 800; font-size: 11px; color: #065f46;">🚆 LIVE BERTHED TRAIN: ${pf.liveTrain.trainNo} - ${pf.liveTrain.name}</div>
            <div style="font-size: 10px; color: #047857; margin-top: 2px;"><strong>Live Location:</strong> ${pf.liveTrain.exactLocation}</div>
            <div style="font-size: 10px; color: #065f46;"><strong>GPS:</strong> [${pf.liveTrain.exactCoords[0]}, ${pf.liveTrain.exactCoords[1]}] | <strong>Rake:</strong> ${pf.liveTrain.rake}</div>
            <div style="font-size: 10px; color: #047857;"><strong>Status:</strong> ${pf.liveTrain.dwellStatus}</div>
            <div style="font-size: 10px; color: #065f46;"><strong>Signal:</strong> ${pf.liveTrain.signalAspect}</div>
          </div>
        ` : `
          <div style="margin-top: 6px; padding: 4px; background: #f0fdf4; border-radius: 4px; font-size: 10px; font-weight: bold; color: #166534;">
            ✓ Line Clear: No train currently berthed. Ready for incoming signal clearance.
          </div>
        `;

        marker.bindPopup(`
          <div style="font-family: sans-serif; color: #0f172a; padding: 4px; min-width: 240px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 800; font-size: 13px; color: #0284c7;">Manmad Junction ${pf.name}</span>
              <span style="font-size: 10px; font-weight: bold; background: ${pf.status.includes('Occupied') ? '#fef08a' : '#dcfce7'}; padding: 1px 5px; border-radius: 3px;">
                ${pf.status}
              </span>
            </div>
            <div style="font-size: 11px; font-weight: 600; color: #334155; margin-top: 2px;">${pf.lineType}</div>
            <div style="font-size: 10px; color: #64748b; font-family: monospace;">Yard Coordinates: [${pf.labelCoord[0]}, ${pf.labelCoord[1]}]</div>
            <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
            <div style="font-size: 10px; font-family: monospace; line-height: 1.5;">
              <div>Clear Standing Length (CSL): <strong>${pf.lengthMeters} meters</strong></div>
              <div>Coach Capacity: <strong>${pf.coaches} Coaches (Full Rake)</strong></div>
              <div>Facilities: ${pf.facilities}</div>
            </div>
            ${liveTrainInfo}
          </div>
        `);

        // If there is a live train berthed or reserved on this platform, render the live train rake directly on the platform track!
        if (pf.liveTrain) {
          const t = pf.liveTrain;
          const trainPillHtml = `
            <div style="
              background: ${pf.color};
              border: 2px solid #ffffff;
              color: #000000;
              font-family: monospace;
              font-size: 9.5px;
              font-weight: 900;
              padding: 2px 7px;
              border-radius: 9999px;
              box-shadow: 0 0 16px ${pf.color};
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
              cursor: pointer;
              animation: pulse 2s infinite;
            ">
              <span>🚆</span>
              <span>${t.trainNo} [PF ${pf.pf}]</span>
              <span style="background: rgba(0,0,0,0.3); color: #fff; padding: 0 4px; border-radius: 3px; font-size: 8px;">
                ${t.dwellStatus.includes('BERTHED') ? 'BERTHED' : 'ROUTED'}
              </span>
            </div>
          `;

          const trainPillIcon = L.divIcon({
            className: 'custom-platform-train-pill',
            html: trainPillHtml,
            iconSize: [140, 24],
            iconAnchor: [70, 26]
          });

          const trainMarker = L.marker(pf.labelCoord, { icon: trainPillIcon }).addTo(platformsGroupRef.current);
          trainMarker.on('click', () => {
            setSelectedPlatform(pf);
          });

          trainMarker.bindPopup(`
            <div style="font-family: sans-serif; color: #0f172a; padding: 4px; min-width: 250px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 800; font-size: 13px; color: #0f172a;">🚆 ${t.trainNo} - ${t.name}</span>
                <span style="font-size: 10px; font-weight: bold; background: #fef08a; padding: 1px 4px; border-radius: 3px;">
                  ${t.priority}
                </span>
              </div>
              <div style="font-size: 11px; font-weight: bold; color: #0284c7; margin-top: 3px;">
                📍 Live Location: ${t.exactLocation}
              </div>
              <div style="font-size: 10px; color: #64748b;">GPS / Yard Coordinates: [${t.exactCoords[0]}, ${t.exactCoords[1]}]</div>
              <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
              <div style="font-size: 10.5px; font-family: monospace; line-height: 1.5;">
                <div>Berth: <strong style="color: #0369a1;">Platform ${pf.pf} (${pf.lineType})</strong></div>
                <div>Status: <strong>${t.dwellStatus}</strong></div>
                <div>Rake Formation: <strong>${t.rake}</strong></div>
                <div>Signal Aspect: <strong>${t.signalAspect}</strong></div>
                <div>Departure / Arrival: <strong>${t.expectedDeparture || t.expectedArrival}</strong></div>
              </div>
            </div>
          `);
        }
      });
    }
  };

  // Zoom preset handlers
  const setZoomLevel = (zoom, coords = [20.2498, 74.4384], preset = '') => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(coords, zoom, { duration: 1.2 });
    setActivePreset(preset);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl relative transition-all duration-300">
      {/* Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Live Regional Train Movements & Nearby Stations GIS Map
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ZOOM LEVEL: {currentZoom}x
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive OpenStreetMap GIS • 4 Converging Corridors • Live Trains Telemetry • Feeder Stations
            </p>
          </div>
        </div>

        {/* Quick Zoom Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-cyan-400" /> Zoom View:
          </span>
          <button
            onClick={() => setZoomLevel(14.5, [20.2500, 74.4385], 'yard')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
              activePreset === 'yard' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            MMR 6 Platforms (14.5x)
          </button>
          <button
            onClick={() => setZoomLevel(10, [20.1500, 74.4500], 'section')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
              activePreset === 'section' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            MMR–KPG Section (10x)
          </button>
          <button
            onClick={() => setZoomLevel(8, [20.3000, 74.7000], 'division')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
              activePreset === 'division' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Division (8x)
          </button>
          <button
            onClick={() => setZoomLevel(6.5, [19.8000, 74.5000], 'regional')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
              activePreset === 'regional' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Full Central Railway (6.5x)
          </button>

          {/* Expand Map Height Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse Map Height" : "Expand Map Height"}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition ml-1"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Live Platform Berthing Status Bar */}
      <div className="mb-3 p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-cyan-400">PLATFORM LIVE BERTHING:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {mmrPlatformsData.map((pf) => (
            <button
              key={pf.pf}
              onClick={() => {
                setSelectedPlatform(pf);
                setZoomLevel(15, pf.labelCoord, 'yard');
              }}
              title={`Click to focus camera on Platform ${pf.pf} live location`}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex items-center gap-1.5 border cursor-pointer ${
                pf.liveTrain
                  ? 'bg-slate-900/90 border-cyan-500/50 text-cyan-300 hover:bg-slate-800 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="font-extrabold" style={{ color: pf.color }}>PF {pf.pf}</span>
              {pf.liveTrain ? (
                <span className="text-white font-semibold flex items-center gap-1">
                  <span>🚆</span>
                  <span>{pf.liveTrain.trainNo}</span>
                  <span className="text-[9px] px-1 py-0.2 bg-slate-800 text-amber-300 rounded">
                    {pf.liveTrain.dwellStatus.includes('BERTHED') ? 'BERTHED' : 'ROUTED'}
                  </span>
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold">🟢 CLEAR</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Layer Toggles & Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2 px-1 text-xs font-mono">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={showPlatforms}
              onChange={(e) => setShowPlatforms(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              MMR 6 Platforms (PF 1–6)
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={showLiveTrains}
              onChange={(e) => setShowLiveTrains(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <Train className="w-3.5 h-3.5 text-emerald-400" />
              Live Simulated Trains ({liveTrainsData.length})
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={showStations}
              onChange={(e) => setShowStations(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Nearby Stations ({stationsData.length})
            </span>
          </label>
        </div>

        {/* Corridor Color Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1 bg-[#10b981] inline-block" /> Bhusawal Main
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1 bg-[#0ea5e9] inline-block" /> Mumbai Main
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1 bg-[#f59e0b] inline-block border-b border-dashed" /> Daund/KPG
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1 bg-[#a855f7] inline-block" /> Nanded Line
          </span>
        </div>
      </div>

      {/* Map Container with Zoom Buttons */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800">
        <div
          ref={mapContainerRef}
          style={{ height: isExpanded ? '600px' : '420px' }}
          className="w-full bg-[#070b14] transition-all duration-300"
        />

        {/* In-Map Floating Zoom Controls */}
        <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5 bg-slate-950/80 backdrop-blur-sm p-1 rounded-lg border border-slate-700 shadow-xl">
          <button
            onClick={() => mapInstanceRef.current && mapInstanceRef.current.zoomIn()}
            title="Zoom In (or use mouse scroll wheel)"
            className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current && mapInstanceRef.current.zoomOut()}
            title="Zoom Out (to see entire Mumbai-Bhusawal-Pune region)"
            className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(10, [20.2498, 74.4384], 'section')}
            title="Recenter on Manmad Junction"
            className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Active Selected Train Telemetry Card Overlay */}
        {selectedTrain && (
          <div className="absolute bottom-3 left-3 right-3 md:right-auto md:w-96 z-[1000] bg-slate-950/95 backdrop-blur-md p-3.5 rounded-xl border border-cyan-500/40 shadow-2xl font-mono text-xs text-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-sm text-cyan-300 flex items-center gap-1.5">
                🚆 {selectedTrain.id} - {selectedTrain.name}
              </span>
              <button
                onClick={() => setSelectedTrain(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
              >
                ✕ Close
              </button>
            </div>
            <div className="text-[11px] text-slate-400 mb-2">{selectedTrain.route}</div>
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Speed</span>
                <span className="font-bold text-emerald-400">{selectedTrain.speedKmh} km/h</span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Delay</span>
                <span className={`font-bold ${selectedTrain.delayMin > 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  +{selectedTrain.delayMin} min
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500 font-bold">Status:</span> {selectedTrain.status}
            </div>
            <div className="text-[11px] text-cyan-400 mt-0.5">
              <span className="text-slate-500 font-bold">Target:</span> {selectedTrain.nextStop}
            </div>
          </div>
        )}

        {/* Selected Platform Details Card Overlay */}
        {selectedPlatform && (
          <div className="absolute bottom-3 left-3 right-3 md:right-auto md:w-96 z-[1000] bg-slate-950/95 backdrop-blur-md p-3.5 rounded-xl border border-cyan-500/40 shadow-2xl font-mono text-xs text-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-sm text-cyan-300 flex items-center gap-1.5">
                🚉 Manmad Junction {selectedPlatform.name}
              </span>
              <button
                onClick={() => setSelectedPlatform(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
              >
                ✕ Close
              </button>
            </div>
            <div className="text-[11px] font-semibold text-slate-300 mb-2">{selectedPlatform.lineType}</div>
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Length (CSL)</span>
                <span className="font-bold text-cyan-400">{selectedPlatform.lengthMeters} meters</span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Coach Capacity</span>
                <span className="font-bold text-emerald-400">{selectedPlatform.coaches} Coaches</span>
              </div>
            </div>
            {selectedPlatform.liveTrain ? (
              <div className="p-2.5 rounded bg-slate-900 border border-emerald-500/30 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">
                    🚆 {selectedPlatform.liveTrain.trainNo} - {selectedPlatform.liveTrain.name}
                  </span>
                  <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300 border border-emerald-500/40 font-bold">
                    {selectedPlatform.liveTrain.priority}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  <span className="text-slate-500 font-bold">Live Location:</span>{" "}
                  <strong className="text-cyan-300">{selectedPlatform.liveTrain.exactLocation}</strong>
                </div>
                <div className="text-[10.5px] text-slate-400 mt-0.5">
                  <span className="text-slate-500 font-bold">Formation:</span> {selectedPlatform.liveTrain.rake}
                </div>
                <div className="text-[10.5px] text-slate-400 mt-0.5">
                  <span className="text-slate-500 font-bold">Berth Status:</span>{" "}
                  <strong className="text-amber-300">{selectedPlatform.liveTrain.dwellStatus}</strong>
                </div>
                <div className="text-[10.5px] text-slate-400 mt-0.5">
                  <span className="text-slate-500 font-bold">Signal Aspect:</span>{" "}
                  <strong className="text-emerald-400">{selectedPlatform.liveTrain.signalAspect}</strong>
                </div>
                <div className="text-[10.5px] text-slate-400 mt-0.5">
                  <span className="text-slate-500 font-bold">Expected Clearance:</span>{" "}
                  <strong className="text-white">{selectedPlatform.liveTrain.expectedDeparture || selectedPlatform.liveTrain.expectedArrival}</strong>
                </div>
              </div>
            ) : (
              <div className="p-2 rounded bg-slate-900/60 border border-dashed border-emerald-500/30 text-[11px] text-emerald-400 font-semibold">
                ✓ Line Clear: No train berthed. Track circuit energized for next signal clearance.
              </div>
            )}
            <div className="text-[10.5px] text-slate-400 mt-1.5">
              <span className="text-slate-500 font-bold">Features:</span> {selectedPlatform.facilities}
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Information */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Use mouse wheel or pinch gesture to zoom in/out anywhere on the map. Click any station or train for details.</span>
        </div>
        <div className="flex items-center gap-3">
          <span>MMR Hub: 20.2498° N, 74.4384° E</span>
          <span>OpenStreetMap & CartoDB Dark Matter (Free Tiles)</span>
        </div>
      </div>
    </div>
  );
}
