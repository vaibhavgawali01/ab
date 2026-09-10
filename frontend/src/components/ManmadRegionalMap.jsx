import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useLanguage } from '../context/LanguageContext';

export default function ManmadRegionalMap({ onOpenStationSchematic }) {
  const { t } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const trainsGroupRef = useRef(null);
  const tracksGroupRef = useRef(null);
  const platformsGroupRef = useRef(null);
  const interlockingGroupRef = useRef(null);
  const approachesGroupRef = useRef(null);

  const [currentZoom, setCurrentZoom] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStations, setShowStations] = useState(true);
  const [showLiveTrains, setShowLiveTrains] = useState(true);
  const [showPlatforms, setShowPlatforms] = useState(true);
  const [showInterlocking, setShowInterlocking] = useState(true);
  const [showApproaches, setShowApproaches] = useState(true);
  const [activeExplainTab, setActiveExplainTab] = useState('overview'); // 'overview' | 'interlocking' | 'platforms'
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedInterlocking, setSelectedInterlocking] = useState(null);
  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const [stationCorridorFilter, setStationCorridorFilter] = useState('ALL');
  const [activePreset, setActivePreset] = useState('section');
  const [baseMapType, setBaseMapType] = useState('google-roadmap');
  const tileLayerRef = useRef(null);

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

  // Active Simulated Trains with Coordinates along Real Railway Alignment matching EI CTC Schematic
  const liveTrainsData = [
    {
      id: "22222",
      name: "CSMT Rajdhani Express (P1)",
      prio: "P1 (Rajdhani)",
      color: "#10b981", // Emerald Green
      coords: [20.2505, 74.4382], // Berthed on MMR Platform 1 Down Main
      speedKmh: 0,
      delayMin: 12,
      heading: "Departing for Bhusawal / Howrah Trunk Line",
      nextStop: "Bhusawal Jn (PF 1)",
      route: "Hazrat Nizamuddin → CSMT Mumbai",
      status: "BERTHED ON PF 1 (Signal S-14 Green Clear)"
    },
    {
      id: "11078",
      name: "Jhelum Express (P3)",
      prio: "P3 (Express)",
      color: "#ef4444", // Red
      coords: [20.2050, 74.4510], // Held at Ankai Outer / Signal S-42
      speedKmh: 0,
      delayMin: 28,
      heading: "Towards MMR Platform 4 (Target Berth)",
      nextStop: "Signal S-42 (Red - Danger Held)",
      route: "Jammu Tawi → Pune Jn",
      status: "REGULATED AT ANKAI OUTER (Waiting Clearance due to PT 14B)"
    },
    {
      id: "12138",
      name: "Punjab Mail (P2)",
      prio: "P2 (Superfast)",
      color: "#0ea5e9", // Cyan
      coords: [20.2499, 74.4386], // Berthed on MMR Platform 3 Loop Line
      speedKmh: 0,
      delayMin: 18,
      heading: "Towards Kalyan / Mumbai CSMT",
      nextStop: "Lasalgaon (PF 2)",
      route: "Firozpur Cantt → CSMT Mumbai",
      status: "BERTHED ON PF 3 (Boarding in Progress)"
    },
    {
      id: "BOXN-884",
      name: "FCI Grain Freight Special (P5)",
      prio: "P5 (Freight)",
      color: "#94a3b8", // Slate
      coords: [20.2490, 74.4392], // Stabled on Platform 6 / Goods Yard Siding
      speedKmh: 0,
      delayMin: 45,
      heading: "Stabled on Manmad Goods Siding",
      nextStop: "Daund Goods Yard",
      route: "Bhusawal Yard → Daund Goods Yard",
      status: "STABLED ON PF 6 SIDING (Freight Bypass)"
    },
    {
      id: "20705",
      name: "Jalna - CSMT Vande Bharat (P1)",
      prio: "P1 (Vande Bharat)",
      color: "#38bdf8", // Sky Blue
      coords: [20.0800, 74.8200], // Between Rotegaon and Nagarsol
      speedKmh: 110,
      delayMin: 0,
      heading: "Westbound to MMR Platform 2 (Up Main)",
      nextStop: "Manmad Jn (PF 2 Up Main)",
      route: "Jalna → CSMT Mumbai",
      status: "High-Speed Running (OT - On Time)"
    },
    {
      id: "12715",
      name: "Sachkhand Express (P2)",
      prio: "P2 (Superfast)",
      color: "#a855f7", // Purple
      coords: [19.9320, 75.1840], // Near Lasur on Marathwada Line
      speedKmh: 85,
      delayMin: 6,
      heading: "Eastbound toward MMR",
      nextStop: "Manmad Jn (PF 5 / Loop)",
      route: "Hazur Sahib Nanded → Amritsar Jn",
      status: "Approaching via Marathwada Line"
    }
  ];

  // Electronic Interlocking (EI) CTC Signals & Point Machines from Mimic Schematic
  const interlockingElements = [
    {
      id: "PT-14B",
      type: "point",
      name: "Point 14B (Conflict Point)",
      coords: [20.2503, 74.4397],
      status: "LOCKED NORMAL (22222 Green / 11078 Red)",
      conflict: true,
      badge: "⚡ PT 14B [CONFLICT POINT: INTERLOCKING CUT]",
      details: "Critical Diamond Crossover between Down Main line and Southern Throat. 22222 Down Main route locked Green. 11078 held at S-42 Red to prevent route cutting.",
      trainA: "22222 Down Main (CSMT Rajdhani)",
      trainB: "11078 South Throat (Jhelum Exp)",
      lockStatus: "22222 Green / 11078 Red"
    },
    {
      id: "S-14",
      type: "signal",
      aspect: "green",
      name: "Signal S-14 (CLR)",
      coords: [20.2492, 74.4418],
      badge: "🟢 S-14 (CLR)",
      details: "Platform 1 Down Main starter signal. Route locked towards Bhusawal/Howrah Trunk route (130 km/h). Granted to 22222 CSMT Rajdhani Express.",
      corridor: "Bhusawal / Howrah Trunk Route"
    },
    {
      id: "S-42",
      type: "signal",
      aspect: "red",
      name: "Signal S-42 (DANGER)",
      coords: [20.2472, 74.4372],
      badge: "🔴 S-42 (DANGER)",
      details: "South Throat outer home signal. Held Red to regulate 11078 Jhelum Express at Ankai Outer until Point 14B diamond crossover is completely cleared by 22222 Rajdhani.",
      corridor: "Daund / Kopargaon / Pune Chord Line"
    },
    {
      id: "S-88",
      type: "signal",
      aspect: "yellow",
      name: "Signal S-88 (APPROACH)",
      coords: [20.2522, 74.4340],
      badge: "🟡 S-88",
      details: "Western throat approach block signal from Kalyan/Mumbai direction.",
      corridor: "Mumbai / Kalyan Main Line"
    },
    {
      id: "GOODS-YARD",
      type: "yard",
      name: "Manmad Goods Yard (मनमाड गुड्स यार्ड)",
      coords: [20.2480, 74.4365],
      badge: "🏭 Manmad Goods Yard",
      details: "Heavy freight siding & loco reversal lines along Nagarchowki Rd & Panch Temple. Stabling location for FCI Grain Freight rake BOXN-884.",
      capacity: "720m CSL Siding"
    }
  ];

  // 4 Converging Approaches (from 2nd image)
  const convergingApproaches = [
    {
      id: "APP-KALYAN",
      coords: [20.2530, 74.4300],
      name: "⬅ TO KALYAN / MUMBAI (CSMT)",
      subtext: "Double Line Electrified (ABS)",
      color: "#0ea5e9"
    },
    {
      id: "APP-BHUSAWAL",
      coords: [20.2482, 74.4455],
      name: "➡ TO BHUSAWAL / HOWRAH",
      subtext: "Trunk Route (130 km/h)",
      color: "#10b981"
    },
    {
      id: "APP-DAUND",
      coords: [20.2460, 74.4350],
      name: "↙ TO KOPARGAON / DAUND / PUNE",
      subtext: "Single Line Tokenless Chord (Km 258)",
      color: "#f59e0b"
    },
    {
      id: "APP-NANDED",
      coords: [20.2452, 74.4425],
      name: "↘ TO AURANGABAD / NANDED",
      subtext: "Marathwada Line (Single Track)",
      color: "#a855f7"
    }
  ];

  // Comprehensive Live Train Movements & Interlocking Explanations Dataset
  const movementExplanations = [
    {
      id: "22222",
      name: "CSMT Rajdhani Express",
      prio: "P1 (Rajdhani Express)",
      type: "standing", // 🛑 उभी आहे
      statusTextMr: "उभी आहे (प्रस्थान सज्ज - Ready for Departure)",
      statusTextEn: "Berthed / Standing (Ready for Departure)",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      stationMr: "मनमाड जंक्शन (MMR)",
      stationEn: "Manmad Junction (MMR)",
      platformMr: "प्लॅटफॉर्म १ [६५० मी / २४ डबे] - डाऊन मेन",
      platformEn: "Platform 1 [650m / 24 Coaches] - Down Main",
      currentLocationMr: "मनमाड जंक्शन प्लॅटफॉर्म १ (किमी २६१/२)",
      currentLocationEn: "Manmad Jn Platform 1 (Km 261/2)",
      destination: "Hazrat Nizamuddin → CSMT Mumbai",
      speedKmh: 0,
      delayMin: 12,
      rake: "22 LHB Coaches (580m)",
      signalAspect: "Signal S-14 Green (CLR - Line Clear)",
      reasonMr: "राजधानी एक्सप्रेसला सर्वोच्च प्राधान्य (P1) आहे. पॉईंट १४B (PT 14B) चा रूट डाऊन मेनसाठी ग्रीन लॉक करण्यात आला आहे. भुसावळ/हावडा ट्रंक मार्गावर जाण्यासाठी स्टार्टर सिग्नल S-14 ग्रीन (CLR) आहे. प्रवाशांची चढ-उतार पूर्ण झाली असून १०:३८ वाजता गाडी रवाना होईल.",
      reasonEn: "Highest operational priority (P1). Point 14B diamond crossover is locked in normal alignment. S-14 starter signal cleared Green towards Bhusawal trunk line. Departure scheduled at 10:38 AM.",
      focusCoords: [20.2505, 74.4382],
      zoom: 15.5
    },
    {
      id: "12138",
      name: "Punjab Mail",
      prio: "P2 (Superfast Express)",
      type: "standing", // 🛑 उभी आहे
      statusTextMr: "उभी आहे (पॅसेंजर बोर्डिंग सुरू - Boarding in Progress)",
      statusTextEn: "Berthed / Standing (Passenger Boarding in Progress)",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      stationMr: "मनमाड जंक्शन (MMR)",
      stationEn: "Manmad Junction (MMR)",
      platformMr: "प्लॅटफॉर्म ३ [६२० मी / २४ डबे] - लूप लाईन",
      platformEn: "Platform 3 [620m / 24 Coaches] - Loop Line",
      currentLocationMr: "मनमाड जंक्शन प्लॅटफॉर्म ३ (किमी २६१/४)",
      currentLocationEn: "Manmad Jn Platform 3 (Km 261/4)",
      destination: "Firozpur Cantt → CSMT Mumbai",
      speedKmh: 0,
      delayMin: 18,
      rake: "24 Coaches (620m)",
      signalAspect: "Signal S-08 Caution Yellow",
      reasonMr: "प्लॅटफॉर्म ३ लूप लाईनवर गाडी सुरक्षित थांबवली आहे. कल्याण/मुंबईकडे जाणाऱ्या प्रवाशांची चढ-उतार सुरू आहे. डाऊन मेनवरील राजधानी निघाल्यानंतर स्टार्टर सिग्नल पूर्ण क्लिअर होऊन गाडी १०:४५ वाजता सुटेल.",
      reasonEn: "Safely berthed on Platform 3 loop line. Dwell and passenger boarding in progress. Will receive full starter clearance towards Kalyan/Mumbai after Rajdhani clears yard.",
      focusCoords: [20.2499, 74.4386],
      zoom: 15.5
    },
    {
      id: "BOXN-884",
      name: "FCI Grain Special (मालगाडी)",
      prio: "P5 (Freight Consist)",
      type: "standing", // 🛑 उभी आहे
      statusTextMr: "उभी आहे (यार्ड सायडिंगमध्ये स्टेबल - Stabled in Goods Yard)",
      statusTextEn: "Stabled / Standing (Manmad Goods Yard Siding)",
      badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/40",
      stationMr: "मनमाड गुड्स यार्ड (Manmad Goods Yard)",
      stationEn: "Manmad Goods Yard",
      platformMr: "प्लॅटफॉर्म ६ [७२० मी CSL] - फ्रेट बायपास सायडिंग",
      platformEn: "Platform 6 [720m CSL] - Freight Bypass Siding",
      currentLocationMr: "मनमाड गुड्स यार्ड / प्लॅटफॉर्म ६ (किमी २६१/८)",
      currentLocationEn: "Manmad Goods Yard / PF 6 (Km 261/8)",
      destination: "Bhusawal Goods Yard → Daund Goods Terminal",
      speedKmh: 0,
      delayMin: 45,
      rake: "58 BOXN Heavy Wagons (680m)",
      signalAspect: "Shunt Ground Position Light",
      reasonMr: "राजधानी व सुपरफास्ट प्रवासी गाड्यांच्या संचलनाला अडथळा होऊ नये म्हणून मालगाडी मनमाड गुड्स यार्ड / प्लॅटफॉर्म ६ च्या ७२० मीटर सायडिंगवर थांबवण्यात आली आहे. सर्व प्रवासी गाड्या क्लिअर झाल्यावर लाईन दिली जाईल.",
      reasonEn: "Regulated on 720m CSL freight bypass siding in Manmad Goods Yard to grant through-line precedence to higher-priority passenger services. Line slot will open post peak window.",
      focusCoords: [20.2490, 74.4392],
      zoom: 15.5
    },
    {
      id: "11078",
      name: "Jhelum Express (झेलम एक्सप्रेस)",
      prio: "P3 (Express)",
      type: "incoming_held", // ⚠️ येत आहे परंतु आउटरवर थांबवली
      statusTextMr: "येत आहे - अंकई आउटरवर थांबवली (HELD AT ANKAI OUTER)",
      statusTextEn: "Incoming / Approaching - HELD at Ankai Outer Signal",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      stationMr: "मनमाड जंक्शन (MMR कडे येत आहे)",
      stationEn: "Approaching Manmad Junction (MMR)",
      platformMr: "लक्षित: प्लॅटफॉर्म ४ [६०० मी] - दौंड / पुणे कॉर्ड लाईन",
      platformEn: "Target: Platform 4 [600m] - Daund / Pune Chord Line",
      currentLocationMr: "अंकई आउटर सिग्नल S-42 (किमी २५८/६ - अंतर १२ किमी)",
      currentLocationEn: "Ankai Outer Signal S-42 (Km 258/6 - Dist 12 km)",
      destination: "Jammu Tawi → Pune Jn",
      speedKmh: 0,
      delayMin: 28,
      rake: "24 Coaches (620m)",
      signalAspect: "Signal S-42 Red (DANGER HELD)",
      reasonMr: "⚠️ पॉईंट १४B (PT 14B) इंटरलॉकिंग कट कॉन्फ्लिक्ट! साउदर्न थ्रोटवरून येणारी ही गाडी प्लॅटफॉर्म ४ वर येणार आहे, परंतु डाऊन मेन लाईनवर २२२२२ राजधानी एक्सप्रेस उभी असून तिचा रूट लॉक आहे. रेल्वे नियमांनुसार एकाच वेळी दोन क्रॉसिंग मार्ग क्लिअर करता येत नाहीत. त्यामुळे सिग्नल S-42 लाल (DANGER) करून गाडी अंकई आउटरवर थांबवली आहे. राजधानी १०:३८ ला निघून ट्रॅक सर्किट १४B मोकळा होताच सिग्नल हिरवा होऊन झेलम एक्सप्रेस प्लॅटफॉर्म ४ वर येईल.",
      reasonEn: "⚠️ POINT 14B INTERLOCKING CUT CONFLICT: Approaches via single-track southern throat targeted for PF 4. Because 22222 CSMT Rajdhani has Down Main route locked, interlocking prevents clearing S-42 to avert conflicting flank movements. Once Rajdhani clears track circuit TC-14B, S-42 will turn Yellow/Green allowing Jhelum Exp to pull into PF 4.",
      focusCoords: [20.2050, 74.4510],
      zoom: 13.5
    },
    {
      id: "20705",
      name: "Jalna - CSMT Vande Bharat (वंदे भारत)",
      prio: "P1 (Vande Bharat Semi-High Speed)",
      type: "incoming_moving", // 🚆 येत आहे - धावत आहे
      statusTextMr: "येत आहे - ११० किमी/तास वेगाने मनमाडकडे धावत आहे",
      statusTextEn: "Incoming / Approaching - High Speed (110 km/h)",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      stationMr: "मनमाड जंक्शन (MMR कडे येत आहे)",
      stationEn: "Approaching Manmad Junction (MMR)",
      platformMr: "लक्षित: प्लॅटफॉर्म २ [६५० मी / २४ डबे] - अप मेन लाईन",
      platformEn: "Target: Platform 2 [650m / 24 Coaches] - Up Main Line",
      currentLocationMr: "रोटेगाव व नगरसूल दरम्यान (किमी २४२/८ - अंतर ३५ किमी)",
      currentLocationEn: "Between Rotegaon & Nagarsol (Km 242/8 - Dist 35 km)",
      destination: "Jalna → Aurangabad → Manmad → CSMT Mumbai",
      speedKmh: 110,
      delayMin: 0,
      rake: "16 Vande Bharat Coaches",
      signalAspect: "Advanced Section Automatic Signals Green",
      reasonMr: "गाडी वेळेवर (On Time) धावत आहे. मनमाड जंक्शनचा प्लॅटफॉर्म २ (Up Main Line) पूर्णपणे मोकळा (CLEAR) ठेवण्यात आला असून अप मेन थ्रोट रूट सेट आहे. १०:४२ वाजता गाडी थेट प्लॅटफॉर्म २ वर दाखल होईल.",
      reasonEn: "Operating on time (OT) at 110 km/h. Platform 2 Up Main line is completely CLEAR with approach route set. Scheduled to arrive smoothly at Platform 2 at 10:42 AM.",
      focusCoords: [20.0800, 74.8200],
      zoom: 11.5
    },
    {
      id: "12715",
      name: "Sachkhand Express (सचखंड एक्सप्रेस)",
      prio: "P2 (Superfast Express)",
      type: "incoming_moving", // 🚆 येत आहे
      statusTextMr: "येत आहे - लासूरजवळ धावत आहे (८५ किमी/तास)",
      statusTextEn: "Incoming / Approaching - Near Lasur (85 km/h)",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      stationMr: "मनमाड जंक्शन (MMR कडे येत आहे)",
      stationEn: "Approaching Manmad Junction (MMR)",
      platformMr: "लक्षित: प्लॅटफॉर्म ५ किंवा पर्यायी लूप लाईन",
      platformEn: "Target: Platform 5 or Alternate Loop Line",
      currentLocationMr: "लासूर स्टेशन सेक्शन (किमी २१०/४ - अंतर ६५ किमी)",
      currentLocationEn: "Near Lasur Section (Km 210/4 - Dist 65 km)",
      destination: "Hazur Sahib Nanded → Amritsar Jn",
      speedKmh: 85,
      delayMin: 6,
      rake: "24 Coaches (620m)",
      signalAspect: "Intermediate Block Signals Clear",
      reasonMr: "नांदेड-औरंगाबाद मार्गावरून मनमाडकडे येत आहे. मनमाडमध्ये पंजाब मेल आणि झेलम एक्सप्रेसचे संचलन पूर्ण झाल्यानंतर प्लॅटफॉर्म ५ किंवा लूप लाईनवर गाडीला प्रवेश दिला जाईल.",
      reasonEn: "Approaching from Marathwada single-line corridor. Will be received on Platform 5 or loop line after yard peak movements stabilize.",
      focusCoords: [19.9320, 75.1840],
      zoom: 11
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

  // Live Google Maps & Base Tile Layer Switcher
  const updateTileLayer = (type, map) => {
    if (!map) return;
    const L = window.L;
    if (!L) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    let subdomains = ['0', '1', '2', '3'];
    let maxZoom = 20;
    let attribution = '&copy; <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a>';

    if (type === 'google-hybrid') {
      url = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      attribution = '&copy; <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps Satellite</a>';
    } else if (type === 'google-terrain') {
      url = 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
      attribution = '&copy; <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps Terrain</a>';
    } else if (type === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      subdomains = ['a', 'b', 'c'];
      maxZoom = 19;
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';
    }

    tileLayerRef.current = L.tileLayer(url, {
      maxZoom,
      subdomains,
      attribution
    }).addTo(map);

    if (tileLayerRef.current.bringToBack) {
      tileLayerRef.current.bringToBack();
    }
  };

  // Re-attach tile layer when baseMapType changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateTileLayer(baseMapType, mapInstanceRef.current);
    }
  }, [baseMapType]);

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

      // Live Google Maps Tiles
      updateTileLayer(baseMapType, map);

      // Track zoom level state
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Create layer groups
      tracksGroupRef.current = L.layerGroup().addTo(map);
      approachesGroupRef.current = L.layerGroup().addTo(map);
      platformsGroupRef.current = L.layerGroup().addTo(map);
      interlockingGroupRef.current = L.layerGroup().addTo(map);
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
      }).addTo(tracksGroupRef.current)
        .bindTooltip("Mumbai–Kalyan–Manmad Main Line (Double Track Electrified) • Click to inspect", { sticky: true })
        .on('click', () => {
          setSelectedCorridor(convergingApproaches[0]);
          setSelectedStation(null);
          setSelectedTrain(null);
          setSelectedPlatform(null);
          setSelectedInterlocking(null);
        });

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
      }).addTo(tracksGroupRef.current)
        .bindTooltip("Howrah–Nagpur–Mumbai Trunk Corridor (130 km/h ABS) • Click to inspect", { sticky: true })
        .on('click', () => {
          setSelectedCorridor(convergingApproaches[1]);
          setSelectedStation(null);
          setSelectedTrain(null);
          setSelectedPlatform(null);
          setSelectedInterlocking(null);
        });

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
      }).addTo(tracksGroupRef.current)
        .bindTooltip("Daund–Manmad Chord Line (MMR–KPG Section) • Click to inspect", { sticky: true })
        .on('click', () => {
          setSelectedCorridor(convergingApproaches[2]);
          setSelectedStation(null);
          setSelectedTrain(null);
          setSelectedPlatform(null);
          setSelectedInterlocking(null);
        });

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
      }).addTo(tracksGroupRef.current)
        .bindTooltip("Secunderabad–Manmad Line (Marathwada Corridor) • Click to inspect", { sticky: true })
        .on('click', () => {
          setSelectedCorridor(convergingApproaches[3]);
          setSelectedStation(null);
          setSelectedTrain(null);
          setSelectedPlatform(null);
          setSelectedInterlocking(null);
        });

      mapInstanceRef.current = map;
      renderMarkersAndTrains(map);
    }
  }, []);

  // Re-render markers, trains, and platforms when filter toggles change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    renderMarkersAndTrains(mapInstanceRef.current);
  }, [showStations, showLiveTrains, showPlatforms, showInterlocking, showApproaches]);

  const renderMarkersAndTrains = (map) => {
    const L = window.L;
    if (!L) return;

    // Clear existing
    if (markersGroupRef.current) markersGroupRef.current.clearLayers();
    if (trainsGroupRef.current) trainsGroupRef.current.clearLayers();
    if (platformsGroupRef.current) platformsGroupRef.current.clearLayers();
    if (interlockingGroupRef.current) interlockingGroupRef.current.clearLayers();
    if (approachesGroupRef.current) approachesGroupRef.current.clearLayers();

    // 0. Render 4 Converging Approaches Floating Route Banners
    if (showApproaches && approachesGroupRef.current) {
      convergingApproaches.forEach(app => {
        const appHtml = `
          <div style="
            background: #090d16;
            border: 1.5px solid ${app.color};
            color: #ffffff;
            font-family: monospace;
            font-size: 9.5px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 6px;
            box-shadow: 0 0 12px ${app.color}88;
            white-space: nowrap;
            text-align: center;
            cursor: pointer;
          ">
            <div style="color: ${app.color};">${app.name}</div>
            <div style="font-size: 8px; color: #94a3b8;">${app.subtext}</div>
          </div>
        `;
        const appIcon = L.divIcon({
          className: 'custom-approach-pill',
          html: appHtml,
          iconSize: [180, 28],
          iconAnchor: [90, 14]
        });
        const marker = L.marker(app.coords, { icon: appIcon }).addTo(approachesGroupRef.current);
        marker.on('click', () => {
          setSelectedCorridor(app);
          setSelectedStation(null);
          setSelectedTrain(null);
          setSelectedPlatform(null);
          setSelectedInterlocking(null);
          setZoomLevel(8.5, app.coords, 'division');
        });
        marker.bindTooltip(`${app.name} • ${app.subtext} (Click to inspect corridor)`, { sticky: true });
      });
    }

    // 0.1 Render EI CTC Interlocking Signals & Points from 2nd Image
    if (showInterlocking && interlockingGroupRef.current) {
      interlockingElements.forEach(el => {
        let elHtml = '';
        let iconSize = [120, 24];
        let iconAnchor = [60, 12];

        if (el.type === 'point') {
          elHtml = `
            <div style="
              background: #450a0a;
              border: 2px solid #ef4444;
              color: #fecaca;
              font-family: monospace;
              font-size: 9.5px;
              font-weight: 900;
              padding: 3px 8px;
              border-radius: 4px;
              box-shadow: 0 0 16px rgba(239,68,68,0.9);
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
              cursor: pointer;
              animation: pulse 1.5s infinite;
            ">
              <span style="font-size: 12px;">⚡</span>
              <span>PT 14B [CONFLICT POINT]</span>
            </div>
          `;
          iconSize = [170, 26];
          iconAnchor = [85, 13];
        } else if (el.type === 'signal') {
          const isGreen = el.aspect === 'green';
          const isRed = el.aspect === 'red';
          const bgColor = isGreen ? '#064e3b' : isRed ? '#7f1d1d' : '#78350f';
          const borderColor = isGreen ? '#10b981' : isRed ? '#ef4444' : '#f59e0b';
          const lampColor = borderColor;
          elHtml = `
            <div style="
              background: ${bgColor};
              border: 2px solid ${borderColor};
              color: #ffffff;
              font-family: monospace;
              font-size: 9px;
              font-weight: 800;
              padding: 2px 7px;
              border-radius: 9999px;
              box-shadow: 0 0 12px ${lampColor};
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
              cursor: pointer;
              ${isRed ? 'animation: pulse 1s infinite;' : ''}
            ">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${lampColor}; box-shadow: 0 0 6px ${lampColor};"></span>
              <span>${el.name}</span>
            </div>
          `;
          iconSize = [110, 22];
          iconAnchor = [55, 11];
        } else if (el.type === 'yard') {
          elHtml = `
            <div style="
              background: #0f172a;
              border: 1.5px solid #64748b;
              color: #e2e8f0;
              font-family: monospace;
              font-size: 9px;
              font-weight: bold;
              padding: 2px 7px;
              border-radius: 4px;
              box-shadow: 0 0 8px rgba(0,0,0,0.6);
              white-space: nowrap;
              cursor: pointer;
            ">
              ${el.badge}
            </div>
          `;
          iconSize = [160, 22];
          iconAnchor = [80, 11];
        }

        const icon = L.divIcon({
          className: 'custom-interlocking-pill',
          html: elHtml,
          iconSize,
          iconAnchor
        });

        const marker = L.marker(el.coords, { icon }).addTo(interlockingGroupRef.current);
        marker.on('click', () => {
          setSelectedInterlocking(el);
          setSelectedStation(null);
          setSelectedTrain(null);
          setSelectedPlatform(null);
          setSelectedCorridor(null);
          setZoomLevel(15.5, el.coords, 'yard');
        });

        let popupContent = '';
        if (el.type === 'point') {
          popupContent = `
            <div style="font-family: monospace; color: #0f172a; padding: 4px; min-width: 260px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 800; font-size: 12px; color: #b91c1c;">⚡ PT 14B (CONFLICT POINT)</span>
                <span style="font-size: 9px; font-weight: bold; background: #fee2e2; color: #991b1b; padding: 1px 5px; border-radius: 3px;">INTERLOCKING CUT</span>
              </div>
              <div style="margin-top: 6px; padding: 4px 6px; background: #fef2f2; border: 1px dashed #ef4444; border-radius: 4px; font-size: 10px; color: #991b1b; font-weight: bold;">
                ⚡ CONFLICT: 22222 Down Main vs 11078 South Throat<br/>
                Route Locked: 22222 Green / 11078 Red
              </div>
              <div style="font-size: 10.5px; color: #334155; margin-top: 6px; line-height: 1.4;">
                <div>Train A: <strong>${el.trainA}</strong> (Precedence Green)</div>
                <div>Train B: <strong>${el.trainB}</strong> (Held at S-42 Red)</div>
                <div>Status: <strong>${el.status}</strong></div>
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 5px;">
                ${el.details}
              </div>
            </div>
          `;
        } else if (el.type === 'signal') {
          const isGreen = el.aspect === 'green';
          popupContent = `
            <div style="font-family: monospace; color: #0f172a; padding: 4px; min-width: 230px;">
              <div style="font-weight: 800; font-size: 12px; color: ${isGreen ? '#047857' : '#b91c1c'};">
                ${isGreen ? '🟢' : '🔴'} ${el.name}
              </div>
              <div style="font-size: 10.5px; color: #334155; margin-top: 4px; line-height: 1.4;">
                <div>Aspect: <strong style="color: ${isGreen ? '#047857' : '#b91c1c'};">${el.aspect.toUpperCase()}</strong></div>
                <div>Corridor: <strong>${el.corridor}</strong></div>
                <div style="margin-top: 4px; color: #475569;">${el.details}</div>
              </div>
            </div>
          `;
        } else {
          popupContent = `
            <div style="font-family: monospace; color: #0f172a; padding: 4px; min-width: 200px;">
              <div style="font-weight: 800; font-size: 12px; color: #0369a1;">${el.name}</div>
              <div style="font-size: 10px; color: #475569; margin-top: 3px;">${el.details}</div>
              <div style="font-size: 10px; font-weight: bold; color: #0f172a; margin-top: 3px;">Capacity: ${el.capacity}</div>
            </div>
          `;
        }
        marker.bindPopup(popupContent);
      });
    }

    // 1. Render Stations (ALL STATIONS FULLY CLICKABLE)
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
            transition: transform 0.15s ease;
          " title="Click to inspect ${stn.name} (${stn.code})">
            ${isMmrHub ? '⭐ ' : isJunction ? '⚑ ' : '• '}${stn.name} (${stn.code})${isMmrHub ? ' ➔ [CTC ⚡]' : ''}
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-station-pill',
          html: markerHtml,
          iconSize: [isMmrHub ? 170 : 90, 22],
          iconAnchor: [isMmrHub ? 85 : 45, 11]
        });

        const marker = L.marker(stn.coords, { icon }).addTo(markersGroupRef.current);

        // Every Station is Clickable!
        marker.on('click', () => {
          setSelectedStation(stn);
          setSelectedTrain(null);
          setSelectedPlatform(null);
          setSelectedInterlocking(null);
          setSelectedCorridor(null);
          setZoomLevel(isMmrHub ? 14.5 : 12.5, stn.coords, isMmrHub ? 'yard' : 'section');
        });

        const popupHtml = isMmrHub ? `
          <div style="font-family: sans-serif; color: #0f172a; padding: 4px; min-width: 230px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 800; font-size: 13px; color: #0284c7;">⭐ ${stn.name} [${stn.code}]</span>
              <span style="font-size: 10px; font-weight: bold; background: #38bdf8; color: #000; padding: 1px 5px; border-radius: 3px;">MAIN HUB</span>
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Division: <strong>${stn.div}</strong></div>
            <div style="font-size: 11px; color: #334155;">Track Section: <strong>${stn.line}</strong></div>
            <div style="font-size: 11px; color: #334155;">Platforms: <strong>${stn.pfs} (All Active)</strong></div>
            <div style="margin-top: 6px; padding: 3px 6px; background: #e0f2fe; border-radius: 4px; font-size: 10px; font-weight: bold; color: #0369a1;">
              Interlocking Status: ALL CLEAR (SOLID STATE EI)
            </div>
            <button id="btn-inspect-stn-${stn.code}" style="
              width: 100%;
              margin-top: 6px;
              padding: 6px 10px;
              background: #0284c7;
              color: #ffffff;
              font-weight: bold;
              font-size: 11px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">
              📊 Inspect Station Details & Infrastructure
            </button>
            <button id="btn-open-mmr-schematic-popup" style="
              width: 100%;
              margin-top: 6px;
              padding: 7px 10px;
              background: linear-gradient(135deg, #0284c7, #0369a1);
              color: #ffffff;
              font-weight: bold;
              font-size: 11px;
              border: 1px solid #38bdf8;
              border-radius: 4px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 5px;
              box-shadow: 0 2px 6px rgba(2,132,199,0.4);
            ">
              ⚡ Open MMR CTC Mimic Schematic Overview
            </button>
            <a href="https://www.google.com/maps/place/Manmad+Junction/@20.2498,74.4384,15z" target="_blank" rel="noopener noreferrer" style="
              width: 100%;
              margin-top: 6px;
              padding: 6px 10px;
              background: #0f172a;
              color: #38bdf8;
              font-weight: 600;
              font-size: 10.5px;
              border: 1px solid #0284c7;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 5px;
              text-decoration: none;
              box-sizing: border-box;
            ">
              📍 Open in Google Maps ↗
            </a>
          </div>
        ` : `
          <div style="font-family: sans-serif; color: #0f172a; padding: 4px; min-width: 180px;">
            <div style="font-weight: 800; font-size: 13px; color: #0284c7;">${stn.name} [${stn.code}]</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Division: <strong>${stn.div}</strong></div>
            <div style="font-size: 11px; color: #334155;">Track Section: <strong>${stn.line}</strong></div>
            <div style="font-size: 11px; color: #334155;">Platforms: <strong>${stn.pfs}</strong> | Distance from MMR: <strong>${stn.distKm} km</strong></div>
            <div style="margin-top: 6px; padding: 3px 6px; background: #e0f2fe; border-radius: 4px; font-size: 10px; font-weight: bold; color: #0369a1;">
              Interlocking Status: ALL CLEAR (NORMAL ASPECT)
            </div>
            <button id="btn-inspect-stn-${stn.code}" style="
              width: 100%;
              margin-top: 6px;
              padding: 5px 8px;
              background: #0284c7;
              color: #ffffff;
              font-weight: bold;
              font-size: 10.5px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">
              📊 Inspect Station Details
            </button>
            <a href="https://www.google.com/maps/@${stn.coords[0]},${stn.coords[1]},15z" target="_blank" rel="noopener noreferrer" style="
              width: 100%;
              margin-top: 6px;
              padding: 5px 8px;
              background: #0f172a;
              color: #38bdf8;
              font-weight: 600;
              font-size: 10px;
              border: 1px solid #0284c7;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 5px;
              text-decoration: none;
              box-sizing: border-box;
            ">
              📍 Open in Google Maps ↗
            </a>
          </div>
        `;

        marker.bindPopup(popupHtml);

        marker.on('popupopen', () => {
          const btnInspect = document.getElementById(`btn-inspect-stn-${stn.code}`);
          if (btnInspect) {
            btnInspect.onclick = (e) => {
              e.stopPropagation();
              setSelectedStation(stn);
              setSelectedTrain(null);
              setSelectedPlatform(null);
              setSelectedInterlocking(null);
              setSelectedCorridor(null);
            };
          }
          if (isMmrHub) {
            const btnSchematic = document.getElementById('btn-open-mmr-schematic-popup');
            if (btnSchematic) {
              btnSchematic.onclick = (e) => {
                e.stopPropagation();
                if (onOpenStationSchematic) onOpenStationSchematic();
              };
            }
          }
        });

        if (isMmrHub) {
          marker.on('popupopen', () => {
            const btn = document.getElementById('btn-open-mmr-schematic-popup');
            if (btn) {
              btn.onclick = (e) => {
                e.stopPropagation();
                if (onOpenStationSchematic) onOpenStationSchematic();
              };
            }
          });
        }
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

  // Helper handlers for selecting features on the map
  const handleSelectStation = (station) => {
    setSelectedStation(station);
    setSelectedTrain(null);
    setSelectedPlatform(null);
    setSelectedInterlocking(null);
    setSelectedCorridor(null);
    const zoom = station.code === 'MMR' ? 14.5 : 12.5;
    setZoomLevel(zoom, station.coords, station.code === 'MMR' ? 'yard' : 'section');
  };

  const handleSelectInterlocking = (item) => {
    setSelectedInterlocking(item);
    setSelectedStation(null);
    setSelectedTrain(null);
    setSelectedPlatform(null);
    setSelectedCorridor(null);
    setZoomLevel(15.5, item.coords, 'yard');
  };

  const handleSelectCorridor = (corr) => {
    setSelectedCorridor(corr);
    setSelectedStation(null);
    setSelectedTrain(null);
    setSelectedPlatform(null);
    setSelectedInterlocking(null);
    setZoomLevel(corr.zoom || 8.5, corr.coords || [20.25, 74.44], 'division');
  };

  // Filtered stations for Quick Clickable Station Jump Strip
  const filteredStations = useMemo(() => {
    return stationsData.filter(stn => {
      if (stationCorridorFilter === 'ALL') return true;
      if (stationCorridorFilter === 'BHUSAWAL') return stn.line.includes('Howrah') || stn.line.includes('Trunk') || stn.code === 'MMR';
      if (stationCorridorFilter === 'MUMBAI') return stn.line.includes('Kalyan') || stn.line.includes('Suburban') || stn.code === 'MMR';
      if (stationCorridorFilter === 'DAUND') return stn.line.includes('Daund') || stn.line.includes('Shirdi') || stn.code === 'MMR';
      if (stationCorridorFilter === 'NANDED') return stn.line.includes('Secunderabad') || stn.line.includes('Marathwada') || stn.code === 'MMR';
      return true;
    });
  }, [stationCorridorFilter, stationsData]);

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
                {t('map.title')}
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ZOOM LEVEL: {currentZoom}x
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t('map.subtext')}
            </p>
          </div>
        </div>

        {/* Base Map Selector & Quick Zoom Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Base Map Selector (Google Maps Live Roadmap, Satellite Hybrid, Terrain, OSM) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-[10px] text-slate-400 font-bold px-1 uppercase flex items-center gap-1">
              🗺️ {t('map.baseMap')}:
            </span>
            <button
              onClick={() => setBaseMapType('google-roadmap')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                baseMapType === 'google-roadmap' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t('map.googleLive')}
            </button>
            <button
              onClick={() => setBaseMapType('google-hybrid')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                baseMapType === 'google-hybrid' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t('map.googleSatellite')}
            </button>
            <button
              onClick={() => setBaseMapType('google-terrain')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                baseMapType === 'google-terrain' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t('map.googleTerrain')}
            </button>
            <button
              onClick={() => setBaseMapType('osm')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                baseMapType === 'osm' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t('map.osm')}
            </button>
          </div>

          {/* Open Google Maps Live External Link */}
          <a
            href="https://www.google.com/maps/@20.2498,74.4384,15z"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
            title="Open MMR in Google Maps"
          >
            <span>📍</span>
            <span>{t('map.openGoogleMaps')} ↗</span>
          </a>

          <span className="text-xs font-mono text-slate-400 mr-1 ml-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-cyan-400" /> {t('map.zoomView')}
          </span>
          <button
            onClick={() => setZoomLevel(14.5, [20.2500, 74.4385], 'yard')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
              activePreset === 'yard' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('map.zoomYard')}
          </button>
          <button
            onClick={() => setZoomLevel(10, [20.1500, 74.4500], 'section')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
              activePreset === 'section' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('map.zoomSection')}
          </button>
          <button
            onClick={() => setZoomLevel(8, [20.3000, 74.7000], 'division')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
              activePreset === 'division' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('map.zoomDivision')}
          </button>
          <button
            onClick={() => setZoomLevel(6.5, [19.8000, 74.5000], 'regional')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
              activePreset === 'regional' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('map.zoomRegional')}
          </button>

          {/* Expand Map Height Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse Map Height" : "Expand Map Height"}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition ml-1"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Trigger for MMR CTC Schematic Overview */}
          {onOpenStationSchematic && (
            <button
              onClick={onOpenStationSchematic}
              title={t('map.clickToOpenSchematic')}
              className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.4)] border border-cyan-400 transition ml-1 cursor-pointer"
            >
              <span>⚡</span>
              <span>{t('map.openMmrSchematic')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Platform Berthing Status Bar */}
      <div className="mb-3 p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-cyan-400">{t('map.platformLiveBerthing')}</span>
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
                <span className="text-emerald-400 font-semibold">🟢 {t('common.clear')}</span>
              )}
            </button>
          ))}

          {onOpenStationSchematic && (
            <button
              onClick={onOpenStationSchematic}
              title={t('map.clickToOpenSchematic')}
              className="px-2.5 py-1 rounded bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)] border border-cyan-400 transition ml-auto cursor-pointer"
            >
              <span>⚡</span>
              <span>{t('map.viewSchematicOverview')}</span>
            </button>
          )}
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
              {t('map.filterPlatforms')}
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
              {t('map.filterTrains')} ({liveTrainsData.length})
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
              {t('map.filterStations')} ({stationsData.length})
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={showInterlocking}
              onChange={(e) => setShowInterlocking(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <span className="text-amber-400">⚡</span>
              {t('map.filterInterlocking')}
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={showApproaches}
              onChange={(e) => setShowApproaches(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
              {t('map.filterApproaches')}
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

      {/* Quick Clickable Station Jump Strip (Every Single Station 1-Click Interactive) */}
      <div className="mb-3 p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-sky-300">{t('map.quickStationSelector')}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/50">
              {filteredStations.length} {t('map.allFeaturesClickable')}
            </span>
          </div>
          {/* Corridor quick filter buttons */}
          <div className="flex flex-wrap items-center gap-1">
            {[
              { id: 'ALL', label: t('map.allStationsFilter') },
              { id: 'BHUSAWAL', label: 'Bhusawal' },
              { id: 'MUMBAI', label: 'Mumbai/IGP' },
              { id: 'DAUND', label: 'Daund/Pune' },
              { id: 'NANDED', label: 'Nanded' },
            ].map((corr) => (
              <button
                key={corr.id}
                onClick={() => setStationCorridorFilter(corr.id)}
                className={`px-2 py-0.5 rounded text-[10.5px] transition cursor-pointer ${
                  stationCorridorFilter === corr.id
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {corr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal scrollable pills for all stations */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredStations.map((stn) => {
            const isSelected = selectedStation?.code === stn.code;
            const isMmr = stn.code === 'MMR';
            return (
              <button
                key={stn.code}
                onClick={() => handleSelectStation(stn)}
                title={`Click to zoom camera & inspect ${stn.name} (${stn.code}) - ${stn.distKm} km from MMR`}
                className={`shrink-0 px-2 py-1 rounded text-[11px] font-mono transition flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.5)] font-bold'
                    : isMmr
                    ? 'bg-sky-950/80 text-sky-300 border-sky-500/60 hover:bg-sky-900/60 font-bold'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span>{isMmr ? '⭐' : stn.type === 'junction' ? '⚑' : '•'}</span>
                <span>{stn.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-slate-400 font-normal">
                  {stn.code}
                </span>
                <span className="text-[9px] text-amber-400/90 font-mono">
                  {stn.distKm === 0 ? 'HUB' : `${stn.distKm}km`}
                </span>
              </button>
            );
          })}
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

        {/* Active Selected Station Details Card Overlay */}
        {selectedStation && (
          <div className="absolute bottom-3 left-3 right-3 md:right-auto md:w-[420px] z-[1000] bg-slate-950/95 backdrop-blur-md p-4 rounded-xl border border-sky-500/50 shadow-2xl font-mono text-xs text-white">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <span className="font-extrabold text-sm text-sky-300 flex items-center gap-1.5">
                <span>{selectedStation.code === 'MMR' ? '⭐' : selectedStation.type === 'junction' ? '⚑' : '🚉'}</span>
                <span>{selectedStation.name} [{selectedStation.code}]</span>
                {selectedStation.code === 'MMR' && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded">
                    MAIN HUB
                  </span>
                )}
              </span>
              <button
                onClick={() => setSelectedStation(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">DIVISION</span>
                  <span className="font-bold text-slate-200">{selectedStation.div}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">DISTANCE FROM MMR</span>
                  <span className="font-bold text-amber-400">{selectedStation.distKm} km</span>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">CORRIDOR / SECTION</span>
                <span className="font-semibold text-cyan-300">{selectedStation.line}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">PLATFORMS</span>
                  <span className="font-bold text-emerald-400">{selectedStation.pfs} Active</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">GPS COORDS</span>
                  <span className="font-mono text-slate-300 text-[10px]">[{selectedStation.coords[0].toFixed(4)}, {selectedStation.coords[1].toFixed(4)}]</span>
                </div>
              </div>

              <div className="p-2 rounded bg-sky-950/40 border border-sky-800/40 text-[10.5px]">
                <div className="text-sky-300 font-bold flex items-center gap-1 mb-1">
                  <span>⚡</span>
                  <span>Interlocking & Signalling State:</span>
                </div>
                <div className="text-slate-300">
                  {selectedStation.code === 'MMR'
                    ? 'Electronic Interlocking (EI) Centralized Traffic Control (CTC) Mimic with route auto-setting & dual VDU consoles.'
                    : `Multi-Aspect Colour Light Signalling (MACLS) with Track Circuiting & Absolute/Automatic Block on ${selectedStation.div}.`}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => setZoomLevel(15, selectedStation.coords, selectedStation.code === 'MMR' ? 'yard' : 'section')}
                  className="flex-1 px-2.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-center transition cursor-pointer text-xs flex items-center justify-center gap-1"
                >
                  <span>🎯</span>
                  <span>{t('map.zoomToStation')}</span>
                </button>
                <a
                  href={`https://www.google.com/maps/@${selectedStation.coords[0]},${selectedStation.coords[1]},15z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-center transition cursor-pointer text-xs flex items-center justify-center gap-1"
                >
                  <span>📍</span>
                  <span>Google Maps ↗</span>
                </a>
              </div>

              {selectedStation.code === 'MMR' && onOpenStationSchematic && (
                <button
                  onClick={onOpenStationSchematic}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-extrabold text-xs shadow-lg border border-cyan-300 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  <span>{t('map.viewSchematicOverview')}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active Selected Interlocking Element Details Card Overlay */}
        {selectedInterlocking && (
          <div className="absolute bottom-3 left-3 right-3 md:right-auto md:w-[400px] z-[1000] bg-slate-950/95 backdrop-blur-md p-4 rounded-xl border border-amber-500/50 shadow-2xl font-mono text-xs text-white">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <span className="font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                <span>⚡</span>
                <span>{selectedInterlocking.name || selectedInterlocking.id}</span>
              </span>
              <button
                onClick={() => setSelectedInterlocking(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              {selectedInterlocking.type === 'point' && (
                <div className="p-2.5 rounded bg-rose-950/60 border border-rose-500/50">
                  <div className="font-bold text-rose-300 text-xs flex items-center justify-between">
                    <span>⚠️ CONFLICT POINT: PT 14B</span>
                    <span className="text-[9px] bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/40 text-rose-200">
                      INTERLOCKING CUT
                    </span>
                  </div>
                  <div className="text-slate-300 mt-1">
                    Route conflict between <strong className="text-white">22222 Down Main</strong> and <strong className="text-amber-300">11078 South Throat</strong>.
                  </div>
                  <div className="text-[10px] text-rose-300 font-bold mt-1">
                    Status: {selectedInterlocking.status}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {selectedInterlocking.details}
                  </div>
                </div>
              )}

              {selectedInterlocking.type === 'signal' && (
                <div className={`p-2.5 rounded border ${
                  selectedInterlocking.aspect === 'green'
                    ? 'bg-emerald-950/50 border-emerald-500/50'
                    : 'bg-rose-950/50 border-rose-500/50'
                }`}>
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span className={selectedInterlocking.aspect === 'green' ? 'text-emerald-300' : 'text-rose-300'}>
                      {selectedInterlocking.aspect === 'green' ? '🟢 PROCEED' : '🔴 DANGER / STOP'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {selectedInterlocking.corridor}
                    </span>
                  </div>
                  <div className="text-slate-300 mt-1.5 text-[10.5px]">
                    {selectedInterlocking.details}
                  </div>
                </div>
              )}

              {selectedInterlocking.type === 'yard' && (
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="font-bold text-cyan-300 text-xs mb-1">
                    {selectedInterlocking.badge}
                  </div>
                  <div className="text-slate-300 text-[10.5px]">
                    {selectedInterlocking.details}
                  </div>
                  <div className="text-amber-300 text-[10px] font-bold mt-1">
                    Capacity: {selectedInterlocking.capacity}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">GPS COORDINATES</span>
                  <span className="font-bold text-slate-300">[{selectedInterlocking.coords[0]}, {selectedInterlocking.coords[1]}]</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block">SYSTEM</span>
                  <span className="font-bold text-cyan-400">Solid State EI</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setZoomLevel(15.5, selectedInterlocking.coords, 'yard')}
                  className="flex-1 px-2.5 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-center transition cursor-pointer text-xs"
                >
                  🎯 Focus Interlocking
                </button>
                {onOpenStationSchematic && (
                  <button
                    onClick={onOpenStationSchematic}
                    className="flex-1 px-2.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-center transition cursor-pointer text-xs"
                  >
                    ⚡ Open Schematic
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active Selected Corridor Details Card Overlay */}
        {selectedCorridor && (
          <div className="absolute bottom-3 left-3 right-3 md:right-auto md:w-[400px] z-[1000] bg-slate-950/95 backdrop-blur-md p-4 rounded-xl border border-cyan-500/50 shadow-2xl font-mono text-xs text-white">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <span className="font-extrabold text-sm text-cyan-300 flex items-center gap-1.5">
                <span>🛣️</span>
                <span>{selectedCorridor.name}</span>
              </span>
              <button
                onClick={() => setSelectedCorridor(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="text-slate-300 text-xs font-semibold">
                {selectedCorridor.subtext || selectedCorridor.description || selectedCorridor.name}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">MAX SPEED (MPS)</span>
                  <span className="font-bold text-emerald-400">130 km/h (Main Line)</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">TRACTION</span>
                  <span className="font-bold text-cyan-300">25 kV AC Electric OHE</span>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10.5px]">
                <span className="text-slate-500 block text-[9px]">SIGNALLING</span>
                <span className="font-semibold text-slate-200">
                  MACLS with Electronic Interlocking & Track Circuiting
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setZoomLevel(selectedCorridor.zoom || 8.5, selectedCorridor.coords || [20.25, 74.44], 'division')}
                  className="flex-1 px-2.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-center transition cursor-pointer text-xs"
                >
                  🎯 Fit Corridor View
                </button>
                <a
                  href={`https://www.google.com/maps/@${(selectedCorridor.coords || [20.25, 74.44])[0]},${(selectedCorridor.coords || [20.25, 74.44])[1]},11z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-center transition cursor-pointer text-xs flex items-center justify-center gap-1"
                >
                  <span>📍</span>
                  <span>Google Maps ↗</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* COMPREHENSIVE OPERATIONAL ANALYSIS & TRAIN MOVEMENTS BOARD */}
      {/* ============================================================ */}
      <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-slate-800 shadow-2xl">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                ⚡
              </span>
              <h3 className="text-sm md:text-base font-bold text-white tracking-wide">
                {t('map.explanationTitle')}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t('map.explanationSubtitle')}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveExplainTab('overview')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                activeExplainTab === 'overview'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🚆 {t('map.tabOverview')}
            </button>
            <button
              onClick={() => setActiveExplainTab('interlocking')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                activeExplainTab === 'interlocking'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              ⚡ {t('map.tabInterlocking')}
            </button>
            <button
              onClick={() => setActiveExplainTab('platforms')}
              className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                activeExplainTab === 'platforms'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🚉 {t('map.tabPlatforms')}
            </button>
          </div>
        </div>

        {/* Tab 1: All Trains Status (Standing vs Incoming) */}
        {activeExplainTab === 'overview' && (
          <div className="mt-4 space-y-4">
            {/* 1. STANDING / BERTHED TRAINS (🛑 उभी असलेली गाडी) */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  {t('map.standingBadge')} — मनमाड जंक्शन व यार्डात प्रत्यक्ष उभ्या असलेल्या गाड्या
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {movementExplanations.filter(m => m.type === 'standing').map(train => (
                  <div
                    key={train.id}
                    className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                            {train.id}
                          </span>
                          <h5 className="text-xs font-bold text-white mt-1">
                            {train.name}
                          </h5>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${train.badgeColor}`}>
                          {t('common.language') === 'mr' ? train.statusTextMr : train.statusTextEn}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1 text-[11px] font-mono">
                        <div className="flex items-start gap-1">
                          <span className="text-slate-500 font-bold">{t('map.standingAt')}</span>
                          <strong className="text-cyan-300">
                            {t('common.language') === 'mr' ? train.platformMr : train.platformEn}
                          </strong>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-slate-500 font-bold">{t('map.currentlyAt')}</span>
                          <span className="text-slate-300">
                            {t('common.language') === 'mr' ? train.currentLocationMr : train.currentLocationEn}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-slate-500 font-bold">{t('map.speedAndDelay')}</span>
                          <span className="text-slate-300">{train.speedKmh} km/h</span>
                          <span className="text-amber-400 font-bold">+{train.delayMin} min</span>
                          <span className="text-slate-400">({train.rake})</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-slate-500 font-bold">{t('map.signalState')}</span>
                          <span className="text-emerald-400 font-semibold">{train.signalAspect}</span>
                        </div>
                      </div>

                      <div className="mt-2.5 p-2 rounded bg-slate-950/70 border border-slate-800 text-[10.5px] leading-relaxed text-slate-300">
                        <span className="text-slate-500 font-bold block mb-0.5">{t('map.operationalReason')}</span>
                        {t('common.language') === 'mr' ? train.reasonMr : train.reasonEn}
                      </div>
                    </div>

                    <button
                      onClick={() => setZoomLevel(train.zoom, train.focusCoords, 'yard')}
                      className="mt-3 w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 border border-slate-700 hover:border-cyan-500 transition cursor-pointer"
                    >
                      <span>🎯</span>
                      <span>{t('map.focusOnMap')}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. INCOMING / APPROACHING TRAINS (🚆 येत असलेली गाडी) */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></span>
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                  {t('map.incomingBadge')} — मनमाड जंक्शनच्या दिशेने येत असलेल्या व आउटरवर थांबवलेल्या गाड्या
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {movementExplanations.filter(m => m.type !== 'standing').map(train => {
                  const isHeld = train.type === 'incoming_held';
                  return (
                    <div
                      key={train.id}
                      className={`p-3 rounded-lg bg-slate-900/80 border ${
                        isHeld ? 'border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.15)]' : 'border-slate-800 hover:border-slate-700'
                      } transition flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                              {train.id}
                            </span>
                            <h5 className="text-xs font-bold text-white mt-1">
                              {train.name}
                            </h5>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${train.badgeColor}`}>
                            {t('common.language') === 'mr' ? train.statusTextMr : train.statusTextEn}
                          </span>
                        </div>

                        <div className="mt-2.5 space-y-1 text-[11px] font-mono">
                          <div className="flex items-start gap-1">
                            <span className="text-slate-500 font-bold">{t('map.incomingTo')}</span>
                            <strong className="text-cyan-300">
                              {t('common.language') === 'mr' ? train.platformMr : train.platformEn}
                            </strong>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-slate-500 font-bold">{t('map.currentlyAt')}</span>
                            <span className={isHeld ? 'text-rose-300 font-semibold' : 'text-slate-300'}>
                              {t('common.language') === 'mr' ? train.currentLocationMr : train.currentLocationEn}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-slate-500 font-bold">{t('map.speedAndDelay')}</span>
                            <span className="text-slate-300">{train.speedKmh} km/h</span>
                            <span className="text-rose-400 font-bold">+{train.delayMin} min</span>
                            <span className="text-slate-400">({train.rake})</span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-slate-500 font-bold">{t('map.signalState')}</span>
                            <span className={isHeld ? 'text-rose-400 font-bold' : 'text-emerald-400 font-semibold'}>
                              {train.signalAspect}
                            </span>
                          </div>
                        </div>

                        <div className={`mt-2.5 p-2 rounded ${
                          isHeld ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200' : 'bg-slate-950/70 border border-slate-800 text-slate-300'
                        } text-[10.5px] leading-relaxed`}>
                          <span className="text-slate-500 font-bold block mb-0.5">{t('map.operationalReason')}</span>
                          {t('common.language') === 'mr' ? train.reasonMr : train.reasonEn}
                        </div>
                      </div>

                      <button
                        onClick={() => setZoomLevel(train.zoom, train.focusCoords, isHeld ? 'yard' : 'section')}
                        className={`mt-3 w-full py-1.5 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                          isHeld
                            ? 'bg-rose-900/60 hover:bg-rose-800 text-white border-rose-500'
                            : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700 hover:border-cyan-500'
                        }`}
                      >
                        <span>🎯</span>
                        <span>{t('map.focusOnMap')}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interlocking & Signals Breakdown */}
        {activeExplainTab === 'interlocking' && (
          <div className="mt-4 space-y-3 font-mono text-xs">
            {/* Point 14B Conflict Centerpiece */}
            <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span className="font-extrabold text-rose-400 text-sm">
                    {t('map.pt14BTitle')}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[10px]">
                  CONFLICT ACTIVE (INTERLOCKING CUT)
                </span>
              </div>
              <p className="text-slate-300 mt-2 text-xs leading-relaxed">
                {t('map.pt14BDesc')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 text-[11px]">
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold block">🟢 22222 Down Main (CSMT Rajdhani)</span>
                  <span className="text-slate-300">Route: Normal Lock • Signal S-14 Green Clear • Target: Bhusawal</span>
                </div>
                <div className="p-2 rounded bg-rose-950/40 border border-rose-500/30">
                  <span className="text-rose-400 font-bold block">🔴 11078 South Throat (Jhelum Exp)</span>
                  <span className="text-slate-300">Route: Interlocking Cut • Signal S-42 Red Danger • Held: Ankai Outer</span>
                </div>
              </div>
            </div>

            {/* Signal S-14 vs Signal S-42 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">{t('map.s14Title')}</span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
                </div>
                <p className="text-slate-300 mt-1.5 text-[11px] leading-relaxed">
                  {t('map.s14Desc')}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-rose-500/30">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400">{t('map.s42Title')}</span>
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                </div>
                <p className="text-slate-300 mt-1.5 text-[11px] leading-relaxed">
                  {t('map.s42Desc')}
                </p>
              </div>
            </div>

            {/* 4 Converging Corridors Reference */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="font-bold text-slate-300 block mb-2">
                🧭 {t('map.filterApproaches')} (४ संगम रेल्वे कॉरिडॉर):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                  {t('map.approachKalyan')}
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-300">
                  {t('map.approachBhusawal')}
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-amber-300">
                  {t('map.approachDaund')}
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-purple-300">
                  {t('map.approachNanded')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Platforms 1 to 6 Matrix */}
        {activeExplainTab === 'platforms' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            {mmrPlatformsData.map((pf) => (
              <div
                key={pf.pf}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm" style={{ color: pf.color }}>
                      PF {pf.pf}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {pf.status}
                    </span>
                  </div>
                  <div className="text-slate-300 font-semibold mt-1 text-[11px]">
                    {pf.lineType}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                    <span>CSL: <strong className="text-white">{pf.lengthMeters}m</strong></span>
                    <span>Cap: <strong className="text-white">{pf.coaches} Coaches</strong></span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500">
                    {pf.facilities}
                  </div>

                  {pf.liveTrain ? (
                    <div className="mt-2.5 p-2 rounded bg-slate-950 border border-emerald-500/30 text-[11px]">
                      <span className="font-bold text-emerald-400 block">
                        🚆 {pf.liveTrain.trainNo} - {pf.liveTrain.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {pf.liveTrain.dwellStatus}
                      </span>
                      <span className="text-[10px] text-cyan-300 block mt-0.5">
                        {pf.liveTrain.signalAspect}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2.5 p-2 rounded bg-slate-950/50 border border-dashed border-slate-800 text-[10px] text-emerald-400">
                      ✓ Line Clear & Available
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedPlatform(pf);
                    setZoomLevel(15, pf.labelCoord, 'yard');
                  }}
                  className="mt-3 w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <span>🎯</span>
                  <span>Zoom to Platform {pf.pf}</span>
                </button>
              </div>
            ))}
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
          <a
            href="https://www.google.com/maps/@20.2498,74.4384,15z"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>🗺️ {t('map.googleLiveActive')}</span>
            <span>(https://www.google.com/maps) ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
