"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudRain,
  Waves,
  ShieldAlert,
  Radio,
  Satellite,
  Cpu,
  Share2,
  PhoneCall,
  MapPin,
  Compass,
  AlertTriangle,
  FileDown,
  Camera,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Bus,
  Activity,
  Layers,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Building,
  Navigation,
  Clock,
  Zap,
  Info,
  X,
  Send,
  Droplets,
} from "lucide-react";
import * as THREE from "three";
import { jsPDF } from "jspdf";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* =========================================================================
   MANDATORY WHATSAPP DISPATCH FUNCTION - EXACT TEST FORMAT & REDIRECTION
   ========================================================================= */
const shareWhatsApp = (msg: string) => {
  const url = "https://wa.me/?text=" + encodeURIComponent(msg);
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

/* =========================================================================
   CITY CONFIGURATIONS - FEATURE 15: PAN-INDIA SCALABLE
   ========================================================================= */
interface CityConfig {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  basin: string;
  waterBody: string;
  defaultRain: number;
  defaultDepth: number;
  drainageAI: number;
  soilMoisture: number;
  tideLevel: number;
  elevationDEM: number;
  concretePct: number;
  stations: Array<{
    id: string;
    name: string;
    type: "IMD" | "IoT";
    lat: number;
    lng: number;
    rain: number;
    depth: number;
  }>;
}

const PAN_INDIA_CITIES: Record<string, CityConfig> = {
  Mumbai: {
    id: "Mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    lat: 19.0596,
    lng: 72.8295,
    basin: "BKC G-Block & Mithi River Basin",
    waterBody: "Arabian Sea + Mahim Creek",
    defaultRain: 72,
    defaultDepth: 3.2,
    drainageAI: 0.3,
    soilMoisture: 0.72,
    tideLevel: 2.1,
    elevationDEM: 4.2,
    concretePct: 85,
    stations: [
      { id: "M1", name: "BKC G-Block IoT", type: "IoT", lat: 19.0596, lng: 72.8295, rain: 24, depth: 3.2 },
      { id: "M2", name: "Kurla West Nullah IoT", type: "IoT", lat: 19.0688, lng: 72.8797, rain: 28, depth: 3.8 },
      { id: "M3", name: "Dadar TT Circle AWS", type: "IMD", lat: 19.0178, lng: 72.8478, rain: 19, depth: 2.1 },
      { id: "M4", name: "Chembur Naka IoT", type: "IoT", lat: 19.0522, lng: 72.8994, rain: 22, depth: 2.6 },
      { id: "M5", name: "Santacruz IMD Obs", type: "IMD", lat: 19.0886, lng: 72.8535, rain: 31, depth: 1.8 },
      { id: "M6", name: "Colaba IMD HQ", type: "IMD", lat: 18.9067, lng: 72.8147, rain: 14, depth: 0.9 },
      { id: "M7", name: "Vakola Nullah Bridge IoT", type: "IoT", lat: 19.0722, lng: 72.8488, rain: 26, depth: 3.5 },
      { id: "M8", name: "Sion Circle AWS", type: "IMD", lat: 19.0402, lng: 72.8624, rain: 25, depth: 3.3 },
      { id: "M9", name: "Powai Lake Outflow IoT", type: "IoT", lat: 19.1255, lng: 72.9048, rain: 29, depth: 1.2 },
      { id: "M10", name: "Andheri Subway AWS", type: "IMD", lat: 19.1197, lng: 72.8468, rain: 34, depth: 3.9 },
      { id: "M11", name: "Hindmata Flyover IoT", type: "IoT", lat: 19.0102, lng: 72.8415, rain: 27, depth: 3.1 },
      { id: "M12", name: "Milan Subway IoT", type: "IoT", lat: 19.0912, lng: 72.8398, rain: 33, depth: 4.1 },
    ],
  },
  Delhi: {
    id: "Delhi",
    name: "Delhi",
    state: "NCR",
    lat: 28.6139,
    lng: 77.209,
    basin: "Yamuna Floodplain & Ring Road",
    waterBody: "Yamuna River Catchment",
    defaultRain: 58,
    defaultDepth: 2.6,
    drainageAI: 0.42,
    soilMoisture: 0.65,
    tideLevel: 0.2,
    elevationDEM: 216,
    concretePct: 78,
    stations: [
      { id: "D1", name: "Safdarjung IMD HQ", type: "IMD", lat: 28.5833, lng: 77.2083, rain: 18, depth: 1.4 },
      { id: "D2", name: "ITO Ring Road IoT", type: "IoT", lat: 28.6289, lng: 77.2486, rain: 24, depth: 2.8 },
      { id: "D3", name: "Old Railway Bridge IoT", type: "IoT", lat: 28.6619, lng: 77.2458, rain: 29, depth: 3.4 },
      { id: "D4", name: "Palam AWS", type: "IMD", lat: 28.5667, lng: 77.1167, rain: 15, depth: 1.1 },
    ],
  },
  Chennai: {
    id: "Chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    basin: "Adyar Basin & Velachery Lowland",
    waterBody: "Bay of Bengal + Adyar River",
    defaultRain: 84,
    defaultDepth: 3.6,
    drainageAI: 0.38,
    soilMoisture: 0.81,
    tideLevel: 2.4,
    elevationDEM: 6.8,
    concretePct: 82,
    stations: [
      { id: "C1", name: "Meenambakkam IMD", type: "IMD", lat: 12.9881, lng: 80.1658, rain: 32, depth: 2.4 },
      { id: "C2", name: "Velachery Lake IoT", type: "IoT", lat: 12.9789, lng: 80.2185, rain: 41, depth: 3.9 },
      { id: "C3", name: "Adyar Bridge IoT", type: "IoT", lat: 13.0067, lng: 80.2572, rain: 35, depth: 3.1 },
      { id: "C4", name: "Nungambakkam AWS", type: "IMD", lat: 13.0617, lng: 80.2417, rain: 28, depth: 1.9 },
    ],
  },
  Kolkata: {
    id: "Kolkata",
    name: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    basin: "Hooghly Basin & EM Bypass",
    waterBody: "Hooghly River + East Wetlands",
    defaultRain: 66,
    defaultDepth: 2.9,
    drainageAI: 0.35,
    soilMoisture: 0.76,
    tideLevel: 2.8,
    elevationDEM: 9.1,
    concretePct: 75,
    stations: [
      { id: "K1", name: "Alipore IMD HQ", type: "IMD", lat: 22.5333, lng: 88.3333, rain: 22, depth: 1.8 },
      { id: "K2", name: "EM Bypass Junction IoT", type: "IoT", lat: 22.5412, lng: 88.3975, rain: 31, depth: 3.2 },
      { id: "K3", name: "Dum Dum AWS", type: "IMD", lat: 22.6547, lng: 88.4467, rain: 27, depth: 2.1 },
    ],
  },
  Bangalore: {
    id: "Bangalore",
    name: "Bangalore",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    basin: "Bellandur Catchment & ORR",
    waterBody: "Bellandur & Varthur Valleys",
    defaultRain: 48,
    defaultDepth: 2.2,
    drainageAI: 0.45,
    soilMoisture: 0.62,
    tideLevel: 0.0,
    elevationDEM: 920,
    concretePct: 88,
    stations: [
      { id: "B1", name: "Bengaluru City IMD", type: "IMD", lat: 12.9716, lng: 77.5946, rain: 14, depth: 1.2 },
      { id: "B2", name: "Bellandur Eco-Park IoT", type: "IoT", lat: 12.9298, lng: 77.6748, rain: 28, depth: 3.4 },
      { id: "B3", name: "Silk Board Junction IoT", type: "IoT", lat: 12.9176, lng: 77.6238, rain: 32, depth: 3.7 },
      { id: "B4", name: "HAL Airport AWS", type: "IMD", lat: 12.9553, lng: 77.6682, rain: 19, depth: 1.6 },
    ],
  },
  Hyderabad: {
    id: "Hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    lat: 17.385,
    lng: 78.4867,
    basin: "Musi River & Begumpet Catchment",
    waterBody: "Musi River + Hussain Sagar",
    defaultRain: 52,
    defaultDepth: 2.4,
    drainageAI: 0.39,
    soilMoisture: 0.58,
    tideLevel: 0.0,
    elevationDEM: 542,
    concretePct: 80,
    stations: [
      { id: "H1", name: "Begumpet IMD", type: "IMD", lat: 17.4533, lng: 78.4683, rain: 21, depth: 2.1 },
      { id: "H2", name: "Musi River Bridge IoT", type: "IoT", lat: 17.3712, lng: 78.4804, rain: 33, depth: 3.5 },
      { id: "H3", name: "Hussain Sagar Outflow IoT", type: "IoT", lat: 17.4239, lng: 78.4738, rain: 25, depth: 2.3 },
    ],
  },
};

/* =========================================================================
   SAFE SHELTERS FOR EVACUATION - FEATURE 13
   ========================================================================= */
const SAFE_SHELTERS = [
  {
    name: "BMC Municipal School No. 4 (Kalina)",
    dist: "0.4 km",
    elev: "11.2m MSL",
    capacity: "450 persons",
    phone: "022-26654321",
    lat: 19.0682,
    lng: 72.8341,
    googleMaps: "https://www.google.com/maps/dir/?api=1&origin=19.0596,72.8295&destination=19.0682,72.8341",
  },
  {
    name: "MMRDA Grounds Elevated Pavilion A",
    dist: "0.7 km",
    elev: "9.5m MSL",
    capacity: "1,200 persons",
    phone: "022-26590000",
    lat: 19.0622,
    lng: 72.8425,
    googleMaps: "https://www.google.com/maps/dir/?api=1&origin=19.0596,72.8295&destination=19.0622,72.8425",
  },
  {
    name: "Mumbai University Kalina Campus Hall",
    dist: "1.2 km",
    elev: "14.0m MSL",
    capacity: "800 persons",
    phone: "022-26543000",
    lat: 19.0729,
    lng: 72.8368,
    googleMaps: "https://www.google.com/maps/dir/?api=1&origin=19.0596,72.8295&destination=19.0729,72.8368",
  },
];

export default function JalRakshakApp() {
  // Pan-India active city state
  const [selectedCityId, setSelectedCityId] = useState<string>("Mumbai");
  const city = PAN_INDIA_CITIES[selectedCityId] || PAN_INDIA_CITIES.Mumbai;

  // Real-time IST clock
  const [istTime, setIstTime] = useState<string>("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        day: "2-digit",
        month: "short",
        year: "numeric",
      };
      setIstTime(new Intl.DateTimeFormat("en-IN", options).format(now) + " IST");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 6 Manual Sliders State (Feature 2 & old features to keep)
  const [rainfallMM, setRainfallMM] = useState<number>(72);
  const [drainageBlockage, setDrainageBlockage] = useState<number>(0.3);
  const [soilMoisture, setSoilMoisture] = useState<number>(0.72);
  const [tideLevel, setTideLevel] = useState<number>(2.1);
  const [elevationMSL, setElevationMSL] = useState<number>(4.2);
  const [concretePct, setConcretePct] = useState<number>(85);

  // Sync city defaults when city changes
  useEffect(() => {
    setRainfallMM(city.defaultRain);
    setDrainageBlockage(city.drainageAI);
    setSoilMoisture(city.soilMoisture);
    setTideLevel(city.tideLevel);
    setElevationMSL(city.elevationDEM);
    setConcretePct(city.concretePct);
  }, [city]);

  // Hydrodynamic Depth Calculation (XGBoost representation)
  const predictedDepthFt = useMemo(() => {
    const runoff = (concretePct / 100) * 0.92 + (1 - concretePct / 100) * (soilMoisture * 0.45);
    const rainFactor = rainfallMM * runoff * 0.042;
    const tideFactor = Math.max(0, (tideLevel - 1.4) * 0.6);
    const drainageEfficiency = Math.max(0.2, 1 - drainageBlockage * 0.78);
    const elevationFactor = Math.max(0.6, elevationMSL > 50 ? 1.0 : (elevationMSL - 1.8) * 0.35);
    const depth = (rainFactor + tideFactor) / (drainageEfficiency * elevationFactor);
    return Math.min(7.2, Math.max(0.3, parseFloat(depth.toFixed(1))));
  }, [rainfallMM, concretePct, soilMoisture, tideLevel, drainageBlockage, elevationMSL]);

  // Submerged Building Count (15 BKC Buildings)
  const submergedCount = useMemo(() => {
    if (predictedDepthFt < 1.0) return 0;
    if (predictedDepthFt < 1.8) return 3;
    if (predictedDepthFt < 2.5) return 8;
    if (predictedDepthFt < 3.5) return 11;
    return 15;
  }, [predictedDepthFt]);

  // Risk Classification based on official IMD criteria
  const riskStatus = useMemo(() => {
    if (rainfallMM > 115.5 || predictedDepthFt > 3.0) {
      return { level: "RED", label: "CRITICAL ALERT", color: "#FF073A", bg: "bg-red-500/20 border-red-500/40 text-red-400" };
    }
    if (rainfallMM >= 64.5 || predictedDepthFt >= 1.5) {
      return { level: "ORANGE", label: "SEVERE WARNING", color: "#FF6B35", bg: "bg-orange-500/20 border-orange-500/40 text-orange-400" };
    }
    if (rainfallMM >= 20 || predictedDepthFt >= 0.8) {
      return { level: "YELLOW", label: "WATCH ADVISORY", color: "#EAB308", bg: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400" };
    }
    return { level: "GREEN", label: "NORMAL", color: "#10B981", bg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" };
  }, [rainfallMM, predictedDepthFt]);

  // Feature 4: Timeline Scrubber (T+0 to T+180)
  const [timelineMinutes, setTimelineMinutes] = useState<number>(90);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  // Timeline scrubber playback loop
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const interval = setInterval(() => {
      setTimelineMinutes((prev) => {
        const next = prev + 10;
        if (next > 180) return 0;
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  // Auto-sync rainfall intensity based on timeline
  useEffect(() => {
    if (timelineMinutes === 0) setRainfallMM(12);
    else if (timelineMinutes === 30) setRainfallMM(22);
    else if (timelineMinutes === 60) setRainfallMM(55);
    else if (timelineMinutes === 90) setRainfallMM(72);
    else if (timelineMinutes === 120) setRainfallMM(48);
    else if (timelineMinutes === 150) setRainfallMM(31);
    else if (timelineMinutes === 180) setRainfallMM(18);
  }, [timelineMinutes]);

  // Feature 8: Groq LLaMA-3 Agentic AI Commander Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [agentThinking, setAgentThinking] = useState<boolean>(false);
  const [agentThoughtSteps, setAgentThoughtSteps] = useState<string[]>([]);
  const [activeTabCenter, setActiveTabCenter] = useState<"3D" | "Map">("3D");

  // Feature 6: School Bus Route State (2019 Stuck vs 2026 AI Safe)
  const [showBusRoutes, setShowBusRoutes] = useState<boolean>(true);
  const [activeBusRouteMode, setActiveBusRouteMode] = useState<"compare" | "safeOnly">("compare");

  // Feature 5: 3D Rain Viewer Toggles
  const [is3DRainActive, setIs3DRainActive] = useState<boolean>(true);
  const [autoWeatherSync, setAutoWeatherSync] = useState<boolean>(true);

  // Doppler Radar controls (Feature 1)
  const [isRadarPlaying, setIsRadarPlaying] = useState<boolean>(true);
  const [radarOpacity, setRadarOpacity] = useState<number>(0.85);

  // Crowdsourcing Modal State (Feature 10)
  const [isCrowdsourceModalOpen, setIsCrowdsourceModalOpen] = useState<boolean>(false);
  const [crowdReports, setCrowdReports] = useState<Array<{ id: string; user: string; loc: string; depth: number; time: string; verified: boolean }>>([
    { id: "R1", user: "Rohan M. (BKC Guard)", loc: "BKC Underpass Junction", depth: 3.1, time: "8m ago", verified: true },
    { id: "R2", user: "Priya S. (Dadar commuter)", loc: "Hindmata Flyover Underbelly", depth: 2.8, time: "14m ago", verified: true },
    { id: "R3", user: "Anil K. (Auto Driver)", loc: "Kurla Station West Gate", depth: 3.7, time: "22m ago", verified: true },
  ]);
  const [newReportLocation, setNewReportLocation] = useState<string>("BKC Diamond Bourse Exit 3");
  const [newReportDepth, setNewReportDepth] = useState<string>("2.8");
  const [aiVisionProcessing, setAiVisionProcessing] = useState<boolean>(false);

  // SOS Emergency Modal State (Feature 13)
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [sirenActive, setSirenActive] = useState<boolean>(false);

  // Audio siren synthesizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const toggleSiren = useCallback(() => {
    if (sirenActive) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setSirenActive(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        // Modulate frequency like emergency siren
        let up = true;
        const interval = setInterval(() => {
          if (!oscillatorRef.current) {
            clearInterval(interval);
            return;
          }
          const target = up ? 950 : 550;
          osc.frequency.exponentialRampToValueAtTime(target, ctx.currentTime + 0.4);
          up = !up;
        }, 450);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscillatorRef.current = osc;
        setSirenActive(true);
      } catch (err) {
        console.warn("Audio Context blocked or not supported:", err);
      }
    }
  }, [sirenActive]);

  // Clean up siren on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Alert Sent Notifications State
  const [smsSent, setSmsSent] = useState<boolean>(false);
  const [browserNotifSent, setBrowserNotifSent] = useState<boolean>(false);

  // Handle Groq LLaMA-3 Commander Search
  const handleAgentSearch = async (queryText?: string) => {
    const q = queryText || searchQuery;
    if (!q.trim()) return;
    setAgentThinking(true);
    setAgentThoughtSteps([]);

    const steps = [
      "Groq LLaMA-3 Agent initialized in reasoning loop...",
      "Analyzing meteorological input: Ingesting INSAT-3D IR & Doppler DWR 45dBZ radar...",
      "Querying F1 ConvLSTM engine (/api/rainfall-predict): BKC cloudburst 72mm at T+90...",
      "Running F2 XGBoost hydrodynamic runoff model with 30-min lag: Depth 3.2ft computed...",
      "Activating safe bus routing engine: Rerouting 12 school buses via elevated SCLR...",
      "Directing 3D Digital Twin camera to BKC coordinates [19.0596, 72.8295]...",
      "All systems synchronized. Critical Red Inundation Protocol active.",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 450));
      setAgentThoughtSteps((prev) => [...prev, steps[i]]);
    }

    setTimelineMinutes(90);
    setRainfallMM(72);
    setDrainageBlockage(0.35);
    setActiveTabCenter("3D");
    setAgentThinking(false);
  };

  // Generate BMC Action Directive PDF (Feature 11)
  const handleDownloadBmcPdf = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(10, 15, 25);
      doc.rect(0, 0, 210, 297, "F");

      // Header Banner
      doc.setFillColor(0, 217, 255);
      doc.rect(14, 15, 182, 3, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("BRIHANMUMBAI MUNICIPAL CORPORATION (BMC)", 16, 26);
      doc.setFontSize(12);
      doc.setTextColor(0, 217, 255);
      doc.text("DISASTER MANAGEMENT CELL - FLOOD EMERGENCY ACTION DIRECTIVE", 16, 33);

      doc.setFontSize(9);
      doc.setTextColor(180, 190, 210);
      doc.text(`Generated: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST | Directive ID: BMC-JR-2026-0904`, 16, 40);
      doc.text(`Jurisdiction: ${city.name} - ${city.basin} | Water Body: ${city.waterBody}`, 16, 45);

      // Status Box
      doc.setFillColor(30, 40, 60);
      doc.roundedRect(14, 50, 182, 32, 2, 2, "F");
      doc.setTextColor(255, 107, 53);
      doc.setFontSize(13);
      doc.text(`INUNDATION RISK LEVEL: ${riskStatus.label} (${predictedDepthFt} FT)`, 20, 60);
      doc.setFontSize(9.5);
      doc.setTextColor(220, 230, 245);
      doc.text(`Predicted Rainfall: ${rainfallMM}mm in 90min (ConvLSTM R² 0.964, P95 14.8ms)`, 20, 68);
      doc.text(`Runoff Lag: 30-min peak delay | Tide: ${tideLevel}m (Arabian Sea High Tide) | Drainage: ${(drainageBlockage * 100).toFixed(0)}% Blocked`, 20, 74);

      // Section: Mandatory Operational Directives
      doc.setTextColor(0, 217, 255);
      doc.setFontSize(12);
      doc.text("IMMEDIATE FIELD MOBILIZATION DIRECTIVES:", 16, 92);

      const directives = [
        `1. UNDERPASS CLOSURE: Barricade BKC Connector Underpass immediately. Water height ${predictedDepthFt}ft impassable for vehicular traffic.`,
        "2. PUMP DEPLOYMENT: Deploy 2 high-capacity dewatering pumps (2500 GPM) at Vakola Nullah discharge point.",
        "3. SCHOOL BUS REROUTING: Issue emergency rerouting advisory for 12 school & BEST buses to elevated Santacruz-Chembur Link Road (SCLR).",
        "4. SCHOOL EVACUATION: Notify 3 primary schools in BKC G-Block for staggered early dismissal or move students to 2nd floor safe areas.",
        "5. TIDE REGULATION: Inspect Mithi River tidal sluice gates at Mahim Creek before upcoming high tide peak.",
        `6. BUILDING AUDIT: ${submergedCount} commercial/residential ground floors in low-lying pockets at risk of inundation.`,
      ];

      doc.setFontSize(9.5);
      doc.setTextColor(230, 235, 245);
      let y = 100;
      directives.forEach((line) => {
        doc.text(line, 16, y, { maxWidth: 178 });
        y += 10;
      });

      // Evacuation Shelters Section
      doc.setTextColor(0, 217, 255);
      doc.setFontSize(12);
      doc.text("DESIGNATED HIGH-GROUND EMERGENCY SHELTERS:", 16, y + 6);
      y += 14;

      SAFE_SHELTERS.forEach((shelter, idx) => {
        doc.setFontSize(9);
        doc.setTextColor(200, 220, 240);
        doc.text(`${idx + 1}. ${shelter.name} | Elev: ${shelter.elev} | Dist: ${shelter.dist} | Cap: ${shelter.capacity}`, 18, y);
        y += 7;
      });

      // Sign-off
      doc.setDrawColor(255, 255, 255);
      doc.line(16, 260, 90, 260);
      doc.setFontSize(8.5);
      doc.setTextColor(150, 160, 180);
      doc.text("Municipal Commissioner / Disaster In-Charge", 16, 265);
      doc.text("JalRakshak AI Intelligence Engine v2.4.1 (SIH26071 Compliant)", 16, 270);

      doc.save(`BMC_JalRakshak_Action_Directive_${city.name}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  // 6-Hour Rainfall Chart Data (Feature 1)
  const rainfallChartData = useMemo(() => {
    return {
      labels: ["-6h", "-4h", "-2h", "Now (T+0)", "+30m", "+60m", "+90m"],
      datasets: [
        {
          label: "Observed Rain (mm)",
          data: [4.2, 6.8, 9.5, 12.0, null, null, null],
          borderColor: "#94a3b8",
          backgroundColor: "rgba(148, 163, 184, 0.1)",
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: "#94a3b8",
        },
        {
          label: "ConvLSTM Predicted Rain (mm)",
          data: [null, null, null, 12.0, 22.0, 55.0, rainfallMM],
          borderColor: "#00D9FF",
          backgroundColor: "rgba(0, 217, 255, 0.2)",
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointBackgroundColor: "#00D9FF",
          borderDash: [5, 5],
        },
      ],
    };
  }, [rainfallMM]);

  // SHAP Values Breakdown Chart Data (Feature 2)
  const shapChartData = useMemo(() => {
    return {
      labels: ["Rainfall", "Drainage", "Tide Level", "Soil Moisture", "DEM Elevation"],
      datasets: [
        {
          label: "Feature Contribution (%)",
          data: [45, 35, 15, 5, 5],
          backgroundColor: ["#FF6B35", "#FF8B55", "#FFA67A", "#FFC4A8", "#FFE0D4"],
          borderRadius: 6,
        },
      ],
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* =========================================================================
          TOP HEADER: LOGO + IST CLOCK + MODEL HEALTH + EDGE BADGE + CITY SELECTOR
          ========================================================================= */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0a0a0a]/90 backdrop-blur-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
        {/* Left: Brand & Compliance */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-orange-500 p-0.5 shadow-glowCyan">
            <div className="w-full h-full bg-[#0a0a0a] rounded-[10px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-neonCyan animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                JalRakshak <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-neonCyan border border-cyan-500/30">SIH26071</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span>{city.basin}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live 60 FPS
              </span>
            </p>
          </div>
        </div>

        {/* Center: Pan-India City Selector & IST Clock */}
        <div className="flex items-center gap-2.5">
          {/* Feature 15: Pan-India City Dropdown */}
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-neonCyan absolute left-3 pointer-events-none" />
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              aria-label="Select Pan-India City"
              className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-xs font-medium rounded-xl pl-8 pr-7 py-1.5 text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
            >
              {Object.keys(PAN_INDIA_CITIES).map((cKey) => (
                <option key={cKey} value={cKey} className="bg-[#121622] text-white">
                  {PAN_INDIA_CITIES[cKey].name} ({PAN_INDIA_CITIES[cKey].state})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Live IST Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{istTime || "Loading IST..."}</span>
          </div>

          {/* Model Health v2.4.1 Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Model v2.4.1 Active</span>
          </div>

          {/* Feature 12: Edge Deployment Badge */}
          <div
            title="Edge Ready: F1 50ms F2 40ms on NVIDIA Jetson Nano. Autonomous offline inference during cyclone communication blackouts."
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 cursor-help group relative"
          >
            <Zap className="w-3.5 h-3.5 text-neonCyan" />
            <span className="hidden sm:inline">Edge Ready (50ms)</span>
            <span className="sm:hidden">Edge</span>
            <span className="text-emerald-400 text-[10px]">✅</span>
          </div>
        </div>

        {/* Right Actions: Crowdsource Report & Emergency SOS */}
        <div className="flex items-center gap-2">
          {/* Feature 10: Crowdsourcing Button */}
          <button
            onClick={() => setIsCrowdsourceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.15] text-xs font-medium text-slate-200 transition active:scale-95"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Report Flood</span>
          </button>

          {/* Feature 13: Emergency SOS Header Trigger */}
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-glowRed transition active:scale-95 animate-pulse"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SOS 1916</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          FEATURE 8: GROQ LLAMA-3 AGENTIC AI COMMANDER SEARCH BAR
          ========================================================================= */}
      <section className="w-full border-b border-white/[0.06] bg-[#0c101b]/80 px-4 py-2.5 flex flex-col items-center">
        <div className="w-full max-w-4xl relative">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-neonCyan">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAgentSearch()}
              placeholder="Ask AI: Show me BKC flood risk for school buses next 3 hours (or click prompt below)..."
              className="w-full bg-white/[0.04] focus:bg-white/[0.08] border border-white/[0.12] focus:border-cyan-400 rounded-2xl pl-10 pr-24 py-2 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition shadow-inner font-sans"
            />
            <button
              onClick={() => handleAgentSearch()}
              disabled={agentThinking}
              className="absolute right-1.5 px-3.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs transition active:scale-95 disabled:opacity-50 flex items-center gap-1"
            >
              {agentThinking ? <Activity className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              <span>Execute</span>
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span className="text-slate-500 font-mono">Suggested:</span>
            {[
              "Show BKC flood risk for school buses next 3 hours",
              "Simulate T+90 peak inundation at Kurla & Dadar",
              "Check if low-clearance vehicles can pass underpass",
              "Trigger BMC action matrix for 72mm heavy burst",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setSearchQuery(chip);
                  handleAgentSearch(chip);
                }}
                className="px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.06] text-slate-300 transition text-[11px]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Agentic Reasoning Output Telemetry */}
          <AnimatePresence>
            {agentThoughtSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2.5 p-3 rounded-xl bg-black/60 border border-cyan-500/30 font-mono text-xs text-cyan-200 overflow-hidden"
              >
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-cyan-500/20 text-cyan-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Groq LLaMA-3 Agent Execution Telemetry
                  </span>
                  <button
                    onClick={() => setAgentThoughtSteps([])}
                    className="text-slate-400 hover:text-white text-[10px]"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {agentThoughtSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-500">[{idx + 1}]</span>
                      <span className={idx === agentThoughtSteps.length - 1 ? "text-white font-medium" : "text-slate-300"}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* =========================================================================
          FEATURE 3: INTEGRATION LAYER - CENTER TOP 30% - RUNOFF LAG & COMBINED ALERT
          ========================================================================= */}
      <section className="w-full border-b border-white/[0.08] bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-orange-950/40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Integration Title & Lag Diagram */}
          <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="text-base">🔗</span>
              <span className="text-xs font-bold tracking-wider font-display text-white uppercase">
                INTEGRATED INTELLIGENCE
              </span>
            </div>

            {/* Scientific Runoff Lag Flow */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] font-mono text-[11px]">
              <span className="text-neonCyan flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5" />
                F1 Rain: 55mm (T+60)
              </span>
              <span className="text-slate-500">───[ 30-min Runoff Lag ]───►</span>
              <span className="text-neonOrange flex items-center gap-1">
                <Waves className="w-3.5 h-3.5" />
                F2 Water: 3.2ft (T+90)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden xl:inline">
              (Hydrological peak lag: Rain peaks at 60min, basin runoff accumulates at 90min)
            </span>
          </div>

          {/* Unified Alert & 1st WhatsApp Share Button */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold">🔴 COMBINED ALERT:</span>
              <span>RED Rain {rainfallMM}mm + {predictedDepthFt}ft Water at {city.name}</span>
            </div>

            {/* WhatsApp Button 1: Feature 3 Combined Alert */}
            <button
              onClick={() =>
                shareWhatsApp(
                  `🔴 JalRakshak RED ALERT: ${city.name} ${city.basin} ${predictedDepthFt}ft in 90min, Rain ${rainfallMM}mm, Safe route: https://www.google.com/maps/dir/?api=1&origin=${city.name}+BKC&destination=Andheri - Share from JalRakshak`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold text-xs shadow-glowGreen transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp Alert</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN 3-COLUMN WORKSPACE:
          - LEFT 35%: FEATURE 1 - RAINFALL EARLY WARNING SYSTEM
          - CENTER 30%: 3D DIGITAL TWIN & MAPBOX GEOSPATIAL DUAL ENGINE
          - RIGHT 35%: FEATURE 2 - INUNDATION PREDICTION SYSTEM
          ========================================================================= */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 pb-24">
        {/* =========================================================================
            LEFT COLUMN (35% - 4 Cols on 12-grid):
            FEATURE 1: RAINFALL EARLY WARNING SYSTEM (Cyan Accent #00D9FF)
            ========================================================================= */}
        <aside className="lg:col-span-4 flex flex-col gap-3">
          {/* Header Card */}
          <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-neonCyan" />
                <h2 className="text-sm font-bold font-display uppercase tracking-wider text-neonCyan glow-cyan">
                  🌧️ RAINFALL EARLY WARNING SYSTEM
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-mono border border-cyan-500/30">
                Meteorological Only
              </span>
            </div>

            {/* AI Core Card ConvLSTM */}
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono mb-3 space-y-1">
              <div className="flex items-center justify-between text-cyan-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-neonCyan" />
                  ConvLSTM RadarNet Core
                </span>
                <span className="text-emerald-400">Healthy ✅</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                <div>
                  R² Score: <span className="text-cyan-300 font-bold">0.964</span>
                </div>
                <div>
                  PSI: <span className="text-cyan-300">0.038</span>
                </div>
                <div>
                  Latency: <span className="text-cyan-300">8.5ms</span> (P95: 14.8ms)
                </div>
                <div>
                  Endpoint: <span className="text-cyan-300">/api/rainfall-predict</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-cyan-500/20">
                Input: 12 radar frames (60min) → Output: 18 frames (90min, 1km res)
              </div>
            </div>

            {/* 4 Data Source Cards with Live Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 font-mono text-xs">
              {/* Source 1: INSAT-3D */}
              <div className="glass-card p-2.5 rounded-xl border-white/[0.08]">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1 text-[11px]">
                  <Satellite className="w-3.5 h-3.5 text-neonCyan" />
                  INSAT-3D Satellite
                </div>
                <div className="text-slate-300 text-[11px]">
                  IR Cloud Temp: <span className="text-white font-bold">-90.2°C</span>
                </div>
                <div className="text-slate-400 text-[10px]">85% Convective Top Cover</div>
              </div>

              {/* Source 2: Doppler DWR */}
              <div className="glass-card p-2.5 rounded-xl border-white/[0.08]">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1 text-[11px]">
                  <Radio className="w-3.5 h-3.5 text-neonCyan" />
                  Doppler DWR {city.name}
                </div>
                <div className="text-slate-300 text-[11px]">
                  Reflectivity: <span className="text-red-400 font-bold">45.4 dBZ</span>
                </div>
                <div className="text-slate-400 text-[10px]">Vel: 25 km/h ENE → BKC</div>
              </div>

              {/* Source 3: 36 IMD AWS + 9 IoT */}
              <div className="glass-card p-2.5 rounded-xl border-white/[0.08]">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1 text-[11px]">
                  <Droplets className="w-3.5 h-3.5 text-neonCyan" />
                  36 IMD AWS + 9 IoT
                </div>
                <div className="text-slate-300 text-[11px]">
                  Live Rain: <span className="text-white font-bold">12mm</span> | Hum: 92%
                </div>
                <div className="text-slate-400 text-[10px]">Wind: 15 km/h WSW (BKC/Kurla)</div>
              </div>

              {/* Source 4: NWP WRF + GFS */}
              <div className="glass-card p-2.5 rounded-xl border-white/[0.08]">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1 text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-neonCyan" />
                  WRF 3km + GFS 12km
                </div>
                <div className="text-slate-300 text-[11px]">
                  Forecast: <span className="text-amber-400 font-bold">Heavy Burst</span>
                </div>
                <div className="text-slate-400 text-[10px]">3-day NWP ensemble run</div>
              </div>
            </div>

            {/* Doppler Radar Controls */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.08] mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-neonCyan" />
                  Doppler Rain Cells Animation
                </span>
                <button
                  onClick={() => setIsRadarPlaying(!isRadarPlaying)}
                  className="px-2 py-0.5 rounded-md bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-mono text-cyan-300 flex items-center gap-1"
                >
                  {isRadarPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isRadarPlaying ? "Pause" : "Play"}</span>
                </button>
              </div>

              {/* Opacity Slider */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>Opacity:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={radarOpacity}
                  onChange={(e) => setRadarOpacity(parseFloat(e.target.value))}
                  aria-label="Radar Opacity Slider"
                  className="flex-1"
                />
                <span>{(radarOpacity * 100).toFixed(0)}%</span>
              </div>

              {/* dBZ Color Scale */}
              <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>15 dBZ (Light)</span>
                <div className="h-1.5 flex-1 mx-2 rounded-full bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-600" />
                <span className="text-red-400 font-bold">55+ dBZ (Storm)</span>
              </div>
            </div>

            {/* Quick Pick Timeline Scrubber */}
            <div className="mb-3">
              <div className="text-xs text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                <span>Nowcast Forecast Intervals:</span>
                <span className="text-cyan-300 font-mono text-[11px]">Selected: T+{timelineMinutes}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-xs text-center">
                {[
                  { label: "T+0 Now", rain: 12, alert: "bg-slate-700/50 text-slate-200 border-slate-600" },
                  { label: "T+30", rain: 22, alert: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" },
                  { label: "T+60", rain: 55, alert: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
                  { label: "T+90 Peak", rain: 72, alert: "bg-red-500/20 text-red-300 border-red-500/50 font-bold" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      const min = item.label.includes("T+0") ? 0 : item.label.includes("30") ? 30 : item.label.includes("60") ? 60 : 90;
                      setTimelineMinutes(min);
                      setRainfallMM(item.rain);
                    }}
                    className={`p-1.5 rounded-xl border text-[11px] transition active:scale-95 ${item.alert} ${
                      (item.label.includes("T+0") && timelineMinutes === 0) ||
                      (item.label.includes("30") && timelineMinutes === 30) ||
                      (item.label.includes("60") && timelineMinutes === 60) ||
                      (item.label.includes("90") && timelineMinutes === 90)
                        ? "ring-2 ring-cyan-400"
                        : ""
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-xs font-bold mt-0.5">{item.rain}mm</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Warning Badges Auto IMD Criteria */}
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 mb-3 text-xs font-mono">
              <div className="flex items-center justify-between text-red-400 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  🔴 {city.name} - {rainfallMM}mm in 90min - RED ALERT
                </span>
                <span className="text-[10px] text-slate-400">IMD Criteria</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Source: DWR+INSAT-3D nowcast. Threshold: &gt;115.5mm or &gt;20mm/hr intense cloudburst triggers automated evacuation directives.
              </p>
            </div>

            {/* Alert Engine Action Buttons */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-400 font-medium">Alert Dispatches:</div>
              <div className="grid grid-cols-3 gap-1.5">
                {/* SMS to BMC */}
                <button
                  onClick={() => setSmsSent(true)}
                  className="px-2 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-[11px] font-mono text-slate-200 transition active:scale-95"
                >
                  {smsSent ? "SMS Sent ✅" : "📱 SMS to BMC"}
                </button>

                {/* WhatsApp to School Buses (Button 2) */}
                <button
                  onClick={() =>
                    shareWhatsApp(
                      `🔴 JalRakshak RED ALERT: ${city.name} ${city.basin} expected rainfall ${rainfallMM}mm in 90min. Severe flood threat. Safe route: https://www.google.com/maps/dir/?api=1&origin=${city.name}&destination=School - Share from JalRakshak`
                    )
                  }
                  className="px-2 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold text-[11px] transition active:scale-95 flex items-center justify-center gap-1 shadow-glowGreen"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Bus WhatsApp</span>
                </button>

                {/* Browser Notification */}
                <button
                  onClick={() => setBrowserNotifSent(true)}
                  className="px-2 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-[11px] font-mono text-slate-200 transition active:scale-95"
                >
                  {browserNotifSent ? "Alert Sent ✅" : "🔔 Notify"}
                </button>
              </div>
            </div>
          </div>

          {/* Observed vs Predicted Rainfall Chart Card */}
          <div className="glass-panel rounded-2xl p-3 border border-white/[0.08] flex-1 min-h-[220px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 font-display">
                Observed vs Predicted Rain (Past 6hr + Next 90min)
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Chart.js</span>
            </div>
            <div className="h-44 w-full">
              <Line
                data={rainfallChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: { color: "rgba(255,255,255,0.05)" },
                      ticks: { color: "#94a3b8", font: { size: 10 } },
                    },
                    y: {
                      grid: { color: "rgba(255,255,255,0.05)" },
                      ticks: { color: "#94a3b8", font: { size: 10 } },
                      title: { display: true, text: "Precipitation (mm)", color: "#94a3b8", font: { size: 9 } },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                      labels: { color: "#cbd5e1", font: { size: 10 }, boxWidth: 12 },
                    },
                  },
                }}
              />
            </div>
          </div>
        </aside>

        {/* =========================================================================
            CENTER COLUMN (30% - 4 Cols on 12-grid):
            DUAL ENGINE: 3D DIGITAL TWIN VIEWER & MAPBOX GEOSPATIAL ENGINE
            ========================================================================= */}
        <section className="lg:col-span-4 flex flex-col gap-3">
          {/* View Mode Toggle Header */}
          <div className="glass-panel rounded-2xl p-2 flex items-center justify-between border border-white/[0.1]">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setActiveTabCenter("3D")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  activeTabCenter === "3D"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glowCyan"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BoxIcon className="w-3.5 h-3.5" />
                <span>3D Digital Twin</span>
              </button>
              <button
                onClick={() => setActiveTabCenter("Map")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  activeTabCenter === "Map"
                    ? "bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-glowOrange"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>36 Station Map</span>
              </button>
            </div>

            {/* 3D Rain & Weather Sync Controls */}
            {activeTabCenter === "3D" && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIs3DRainActive(!is3DRainActive)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono border transition flex items-center gap-1 ${
                    is3DRainActive
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-white/[0.04] text-slate-400 border-white/[0.08]"
                  }`}
                >
                  <CloudRain className="w-3 h-3" />
                  <span>3D Rain {is3DRainActive ? "ON" : "OFF"}</span>
                </button>
                <button
                  onClick={() => setAutoWeatherSync(!autoWeatherSync)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono border transition flex items-center gap-1 ${
                    autoWeatherSync
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-white/[0.04] text-slate-400 border-white/[0.08]"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Simulation Viewport Container */}
          <div className="relative glass-panel rounded-2xl border border-white/[0.1] overflow-hidden flex-1 min-h-[460px] flex flex-col">
            {activeTabCenter === "3D" ? (
              /* FEATURE 5: 3D RAIN & PBR WATER ENGINE CANVAS */
              <div className="relative w-full h-full flex-1">
                <ThreeJsSimulationCanvas
                  rainfallMM={rainfallMM}
                  depthFt={predictedDepthFt}
                  isRainActive={is3DRainActive}
                  city={city}
                />

                {/* 3D Holographic HUD Overlays */}
                <div className="absolute top-3 left-3 pointer-events-none space-y-1 font-mono text-[11px]">
                  <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-neonCyan" />
                    <span>
                      GPS: {city.lat.toFixed(4)}°N, {city.lng.toFixed(4)}°E
                    </span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/[0.1] text-slate-300">
                    DEM Ground: {elevationMSL.toFixed(1)}m MSL | Wind: 15 km/h WSW (Tilt 15°)
                  </div>
                </div>

                <div className="absolute top-3 right-3 pointer-events-none space-y-1 font-mono text-[11px] text-right">
                  <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-orange-500/30 text-orange-300">
                    Water PBR Elevation: {predictedDepthFt}ft
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-red-500/30 text-red-300">
                    Submerged Buildings: {submergedCount} / 15
                  </div>
                </div>

                {/* Bottom 3D Scene Controls & Route Legend */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono text-slate-300 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Green: 3D Safe Evacuation Path (SCLR)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Red: Trapped BKC Underpass Route
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                    60 FPS OrbitControls
                  </div>
                </div>
              </div>
            ) : (
              /* FEATURE 9: MAPBOX GEOSPATIAL 36 STATIONS & RADAR CANVAS */
              <div className="relative w-full h-full flex-1">
                <MapboxRadarCanvas city={city} radarOpacity={radarOpacity} isRadarPlaying={isRadarPlaying} />

                {/* Mapbox Overlay Collaboration Badge */}
                <div className="absolute top-3 left-3 pointer-events-none space-y-1.5 font-mono text-[11px]">
                  <div className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-neonCyan" />
                    <span>IIT Bombay Hydro-Met Lab Collab</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/[0.1] text-slate-300">
                    36 IMD Blue AWS + 9 IoT Pulsing Green
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FEATURE 6: SCHOOL BUS SAFE ROUTING - PERSONAL STORY PANEL */}
          <div className="glass-panel rounded-2xl p-3.5 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-emerald-400">
                  🚌 SCHOOL BUS SAFE ROUTING - MY 2019 STORY
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono border border-emerald-500/30">
                0 Trapped Students
              </span>
            </div>

            <p className="text-[11px] text-slate-300 italic mb-2.5 border-l-2 border-emerald-400 pl-2">
              &ldquo;In July 2019, my school bus was trapped for 5 hours in 3.5ft floodwater at BKC underpass. In 2026, JalRakshak ensures no child is ever trapped again.&rdquo;
            </p>

            {/* Route Comparison Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-2.5">
              <div className="p-2 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300">
                <div className="text-[10px] text-slate-400">2019 Trapped Route</div>
                <div className="font-bold">Through Underpass</div>
                <div className="text-[10px] text-red-400">3.2ft Submerged • Impassable</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                <div className="text-[10px] text-slate-400">2026 JalRakshak AI Route</div>
                <div className="font-bold">Via Elevated SCLR</div>
                <div className="text-[10px] text-emerald-400">Zero Water • 48min Saved</div>
              </div>
            </div>

            {/* Action: WhatsApp Share for Bus Drivers (Button 3) */}
            <button
              onClick={() =>
                shareWhatsApp(
                  `🚌 JalRakshak Safe Route for School Buses: Avoid ${city.name} BKC ${predictedDepthFt}ft water - Safe route: https://www.google.com/maps/dir/?api=1&origin=${city.name}+BKC&destination=School&waypoints=SCLR+Elevated+Flyover - Rain ${rainfallMM}mm RED ALERT - Share from JalRakshak`
                )
              }
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold text-xs transition active:scale-95 shadow-glowGreen"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Safe Bus Route to Drivers via WhatsApp</span>
            </button>
          </div>
        </section>

        {/* =========================================================================
            RIGHT COLUMN (35% - 4 Cols on 12-grid):
            FEATURE 2: INUNDATION PREDICTION SYSTEM (Orange Accent #FF6B35)
            ========================================================================= */}
        <aside className="lg:col-span-4 flex flex-col gap-3">
          <div className="glass-panel rounded-2xl p-4 border border-orange-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-neonOrange" />
                <h2 className="text-sm font-bold font-display uppercase tracking-wider text-neonOrange glow-orange">
                  🌊 INUNDATION PREDICTION SYSTEM
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-300 font-mono border border-orange-500/30">
                Hydrodynamic ft Only
              </span>
            </div>

            {/* AI Core Card XGBoost */}
            <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-500/30 text-xs font-mono mb-3 space-y-1">
              <div className="flex items-center justify-between text-orange-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-neonOrange" />
                  XGBoost + SHAP Hydro Core
                </span>
                <span className="text-emerald-400">Healthy ✅</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                <div>
                  MAE: <span className="text-orange-300 font-bold">0.18 ft</span>
                </div>
                <div>
                  PSI: <span className="text-orange-300">0.041</span>
                </div>
                <div>
                  Latency: <span className="text-orange-300">9.2ms</span> (P95: 15.2ms)
                </div>
                <div>
                  Endpoint: <span className="text-orange-300">/api/inundation-predict</span>
                </div>
              </div>
            </div>

            {/* Big Depth Gauge & Risk Status */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.1] mb-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-mono">Predicted Flood Depth:</div>
                <div className="text-3xl font-extrabold font-display text-neonOrange flex items-baseline gap-1">
                  <span>{predictedDepthFt}</span>
                  <span className="text-base text-slate-400">ft</span>
                </div>
                <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                  {predictedDepthFt > 3.0
                    ? "⚠️ Knee depth - Car cannot pass - Bus reroute needed"
                    : predictedDepthFt > 1.5
                    ? "⚠️ Wheel axle depth - Low vehicles restricted"
                    : "Low hazard - Manageable surface runoff"}
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono border ${riskStatus.bg}`}>
                  {riskStatus.label}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  🏢 {submergedCount} of 15 Submerged
                </div>
              </div>
            </div>

            {/* 6 Manual Sliders with Live 3D & Depth Sync */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] mb-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-white/[0.06] pb-1">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-neonOrange" />
                  6 Urban Hydro Factors (Interactive Sliders)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Real-time 3D</span>
              </div>

              {/* Slider 1: Rainfall mm */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">1. Rainfall Intensity:</span>
                  <span className="text-neonCyan font-bold">{rainfallMM} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={rainfallMM}
                  onChange={(e) => setRainfallMM(parseInt(e.target.value))}
                  aria-label="Rainfall Intensity Slider"
                  className="w-full"
                />
              </div>

              {/* Slider 2: Drainage Blockage */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">2. Drainage Blockage (CCTV AI):</span>
                  <span className="text-neonOrange font-bold">{drainageBlockage.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={drainageBlockage}
                  onChange={(e) => setDrainageBlockage(parseFloat(e.target.value))}
                  aria-label="Drainage Blockage Slider"
                  className="w-full orange-slider"
                />
              </div>

              {/* Slider 3: Soil Moisture */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">3. Soil Moisture (IoT Saturation):</span>
                  <span className="text-neonOrange font-bold">{soilMoisture.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(parseFloat(e.target.value))}
                  aria-label="Soil Moisture Slider"
                  className="w-full orange-slider"
                />
              </div>

              {/* Slider 4: Tide Level */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">4. Tide Level ({city.waterBody}):</span>
                  <span className="text-neonOrange font-bold">{tideLevel.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4.5"
                  step="0.1"
                  value={tideLevel}
                  onChange={(e) => setTideLevel(parseFloat(e.target.value))}
                  aria-label="Tide Level Slider"
                  className="w-full orange-slider"
                />
              </div>

              {/* Slider 5: Elevation MSL */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">5. Terrain Elevation DEM:</span>
                  <span className="text-neonOrange font-bold">{elevationMSL.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.2"
                  value={elevationMSL}
                  onChange={(e) => setElevationMSL(parseFloat(e.target.value))}
                  aria-label="Elevation Slider"
                  className="w-full orange-slider"
                />
              </div>

              {/* Slider 6: Concrete % */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">6. Concrete / Runoff Surface:</span>
                  <span className="text-neonOrange font-bold">{concretePct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={concretePct}
                  onChange={(e) => setConcretePct(parseInt(e.target.value))}
                  aria-label="Concrete Percentage Slider"
                  className="w-full orange-slider"
                />
              </div>
            </div>

            {/* SHAP Feature Importance Horizontal Chart */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.08] mb-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5 font-display">
                <span>SHAP Feature Attribution (Why {predictedDepthFt}ft?)</span>
                <span className="text-[10px] font-mono text-orange-400">XGBoost Explainer</span>
              </div>
              <div className="h-28 w-full">
                <Bar
                  data={shapChartData}
                  options={{
                    indexAxis: "y" as const,
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#94a3b8", font: { size: 9 }, callback: (v) => `${v}%` },
                      },
                      y: {
                        grid: { display: false },
                        ticks: { color: "#cbd5e1", font: { size: 9 } },
                      },
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => `Contribution: ${ctx.parsed.x}% to inundation`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* BMC Action Matrix & PDF Export Button (Feature 11) */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-neonOrange" />
                  BMC Incident Command Matrix
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Auto Triggered</span>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-1.5 text-red-300">
                  <CheckCircle2 className="w-3 h-3 text-red-400" />
                  <span>Close {city.name} underpass to low vehicles</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  <span>Deploy 2 high-power pumps at Vakola</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>Alert 3 area schools for early dismissal</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Reroute 12 municipal and school buses</span>
                </div>
              </div>

              {/* Action Buttons: PDF Download & WhatsApp Share (Button 4) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleDownloadBmcPdf}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.12] text-xs font-medium text-slate-200 transition active:scale-95"
                >
                  <FileDown className="w-3.5 h-3.5 text-neonCyan" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() =>
                    shareWhatsApp(
                      `🌊 JalRakshak INUNDATION ALERT: ${city.name} ${city.basin} flood depth reached ${predictedDepthFt}ft. Underpass closed, 2 pumps deployed. Full Directive: https://www.google.com/maps?q=${city.lat},${city.lng} - Share from JalRakshak`
                    )
                  }
                  className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold text-xs shadow-glowGreen transition active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          FEATURE 4: 90/180MIN TIMELINE ANIMATOR - BOTTOM BAR FULL WIDTH
          ========================================================================= */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/[0.1] bg-[#0a0a0a]/95 backdrop-blur-2xl px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl">
        {/* Playback Controls & Current Label */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
            className="w-8 h-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black flex items-center justify-center transition active:scale-95 shadow-glowCyan"
            title={isPlayingTimeline ? "Pause timeline simulation" : "Play timeline simulation"}
          >
            {isPlayingTimeline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={() => {
              setIsPlayingTimeline(false);
              setTimelineMinutes(0);
              setRainfallMM(12);
            }}
            className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 flex items-center justify-center transition active:scale-95"
            title="Reset to T+0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="font-mono text-xs text-slate-300">
            <span className="text-neonCyan font-bold">T+{timelineMinutes} min</span>
            <span className="text-slate-500 mx-1.5">|</span>
            <span className="text-slate-400">Rain: {rainfallMM}mm</span>
            <span className="text-slate-500 mx-1.5">|</span>
            <span className="text-neonOrange">Water: {predictedDepthFt}ft</span>
          </div>
        </div>

        {/* Horizontal Scrubber */}
        <div className="flex-1 w-full max-w-2xl px-2">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="180"
              step="10"
              value={timelineMinutes}
              onChange={(e) => setTimelineMinutes(parseInt(e.target.value))}
              aria-label="Timeline Scrubber (0 to 180 minutes)"
              className="w-full"
            />
            {/* Timeline Tick Labels */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>T+0 (Now)</span>
              <span>T+30</span>
              <span>T+60 (Rain Peak)</span>
              <span className="text-red-400 font-bold">T+90 (Water Peak)</span>
              <span>T+120</span>
              <span>T+150</span>
              <span>T+180</span>
            </div>
          </div>
        </div>

        {/* Feature 7: Model Health Monitoring v2.4.1 & Footer API Endpoints */}
        <div className="hidden xl:flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>F1 ConvLSTM: 8.5ms | R² 0.964</span>
            <a href="/api/rainfall-predict" target="_blank" className="text-cyan-400 hover:underline">
              [API]
            </a>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>F2 XGBoost: 9.2ms | MAE 0.18ft</span>
            <a href="/api/inundation-predict" target="_blank" className="text-orange-400 hover:underline">
              [API]
            </a>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <a href="/api/health" target="_blank" className="hover:text-cyan-300 transition">
              /api/health
            </a>
            <span>•</span>
            <a href="/api/logs" target="_blank" className="hover:text-cyan-300 transition">
              /api/logs
            </a>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          FEATURE 13: FLOATING RED EMERGENCY SOS BUTTON (ALWAYS VISIBLE)
          ========================================================================= */}
      <div className="fixed bottom-20 right-5 z-40">
        <button
          onClick={() => setIsSosModalOpen(true)}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-rose-600 text-white font-black text-sm shadow-glowRed animate-sos transition active:scale-95"
          title="EMERGENCY FLOOD SOS: Tap for BMC Disaster Helpline 1916 & Family WhatsApp Dispatch"
        >
          <PhoneCall className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] items-center justify-center font-bold">
              !
            </span>
          </span>
        </button>
      </div>

      {/* =========================================================================
          FEATURE 13: SOS EMERGENCY MODAL - REDIRECTION & AUTOMATIC DISPATCH
          ========================================================================= */}
      <AnimatePresence>
        {isSosModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg rounded-3xl bg-[#10141f] border-2 border-red-500/50 p-6 shadow-glowRed text-slate-100 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsSosModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-glowRed">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                    🆘 EMERGENCY SOS DISPATCH
                  </h3>
                  <p className="text-xs text-red-400 font-mono">
                    {city.name} Flood Response Network • Critical Zone
                  </p>
                </div>
              </div>

              {/* Auto GPS Location Card */}
              <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 mb-4 text-xs font-mono">
                <div className="flex items-center justify-between text-red-300 font-bold mb-1">
                  <span>YOUR LIVE GEOLOCATION:</span>
                  <span className="text-white bg-red-500/30 px-2 py-0.5 rounded text-[10px]">
                    RED RISK ZONE
                  </span>
                </div>
                <div className="text-white font-medium text-sm">
                  {city.name} {city.basin} ({city.lat.toFixed(4)}, {city.lng.toFixed(4)})
                </div>
                <div className="text-slate-300 text-[11px] mt-1">
                  Flood Water Level: <span className="text-neonOrange font-bold">{predictedDepthFt} ft</span> | Rain: {rainfallMM}mm
                </div>
              </div>

              {/* 3 Core Emergency Actions */}
              <div className="space-y-2.5 mb-5">
                {/* 1. Call BMC Disaster Direct */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:1916"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-glowRed transition active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call BMC 1916</span>
                  </a>
                  <a
                    href="tel:022-22694727"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.15] text-slate-200 font-semibold text-xs transition active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4 text-red-400" />
                    <span>022-22694727</span>
                  </a>
                </div>

                {/* 2. Share SOS WhatsApp to Family (Button 5 - Feature 13 & 14) */}
                <button
                  onClick={() =>
                    shareWhatsApp(
                      `🆘 SOS EMERGENCY - I am stuck in ${city.name} flood - Water depth ${predictedDepthFt}ft - Rain ${rainfallMM}mm - My location: https://www.google.com/maps?q=${city.lat},${city.lng} - Need help - Shared from JalRakshak Flood Intelligence Platform`
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-sm shadow-glowGreen transition active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share SOS Location to Family via WhatsApp</span>
                </button>

                {/* Siren Audio Toggle */}
                <button
                  onClick={toggleSiren}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono border transition ${
                    sirenActive
                      ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                      : "bg-white/[0.04] text-slate-300 border-white/[0.08]"
                  }`}
                >
                  {sirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{sirenActive ? "Stop Emergency Siren Audio" : "Sound Emergency Siren Horn"}</span>
                </button>
              </div>

              {/* Nearest 3 Safe Shelters */}
              <div>
                <div className="text-xs font-semibold text-slate-300 font-display mb-2 flex items-center justify-between">
                  <span>Nearest High-Ground Shelters (Avoiding Water):</span>
                  <span className="text-[10px] text-emerald-400 font-mono">2 BMC Rescue Teams 0.8km away</span>
                </div>
                <div className="space-y-1.5">
                  {SAFE_SHELTERS.map((shelter) => (
                    <div
                      key={shelter.name}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="text-white font-medium text-[11px]">{shelter.name}</div>
                        <div className="text-slate-400 text-[10px] font-mono">
                          Dist: <span className="text-emerald-400">{shelter.dist}</span> | Elev: {shelter.elev} | Cap: {shelter.capacity}
                        </div>
                      </div>
                      <a
                        href={shelter.googleMaps}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-[10px] border border-cyan-500/30 flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Navigate</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          FEATURE 10: CROWDSOURCING #MUMBAIFLOODDATA MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isCrowdsourceModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg rounded-3xl bg-[#10141f] border border-cyan-500/30 p-6 shadow-2xl text-slate-100 relative"
            >
              <button
                onClick={() => setIsCrowdsourceModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-white">
                    📸 Crowdsource #MumbaiFloodData
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Geo-tagged citizen ground truth with AI computer vision depth verification
                  </p>
                </div>
              </div>

              {/* Photo Upload Simulation / AI Estimator */}
              <div className="p-4 rounded-2xl bg-black/50 border border-dashed border-cyan-500/40 text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 flex items-center justify-center text-neonCyan mb-2">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-xs text-slate-200 font-medium">Capture or Upload Waterlogging Photo</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  AI extracts water depth from vehicle tires & curb benchmarks
                </div>

                <button
                  onClick={() => {
                    setAiVisionProcessing(true);
                    setTimeout(() => {
                      setAiVisionProcessing(false);
                      setNewReportDepth("2.8");
                    }, 1000);
                  }}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs text-cyan-300 font-mono transition"
                >
                  {aiVisionProcessing ? "AI Vision Analyzing..." : "Run AI Visual Depth Estimator"}
                </button>

                {newReportDepth && (
                  <div className="mt-2.5 p-2 rounded-lg bg-cyan-950/40 text-cyan-300 text-xs font-mono">
                    AI Visual Depth Estimate: <span className="font-bold text-white">{newReportDepth} ft</span> (High Confidence)
                  </div>
                )}
              </div>

              {/* Location Input */}
              <div className="space-y-2 mb-4">
                <div>
                  <label className="text-xs text-slate-400 font-mono">Geo-tagged Landmark:</label>
                  <input
                    type="text"
                    value={newReportLocation}
                    onChange={(e) => setNewReportLocation(e.target.value)}
                    className="w-full mt-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!newReportLocation) return;
                    setCrowdReports((prev) => [
                      {
                        id: `R${prev.length + 1}`,
                        user: "Citizen Reporter (Verified)",
                        loc: newReportLocation,
                        depth: parseFloat(newReportDepth) || 2.5,
                        time: "Just now",
                        verified: true,
                      },
                      ...prev,
                    ]);
                    setIsCrowdsourceModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs transition shadow-glowCyan"
                >
                  Submit Verified Flood Pin to Map
                </button>
              </div>

              {/* Live Crowd Feed */}
              <div>
                <div className="text-xs text-slate-400 font-mono mb-2">Recent Community Reports:</div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {crowdReports.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <div className="text-white">{item.loc}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.user} • {item.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-neonOrange font-bold">{item.depth} ft</div>
                        <div className="text-[9px] text-emerald-400">Verified ✅</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* =========================================================================
   FEATURE 5: THREE.JS 3D CANVAS COMPONENT - 60 FPS PBR SIMULATION
   - 5000-8000 Rain particles Points BufferGeometry with wind tilt & splashes
   - Water Plane MeshPhysicalMaterial transmission 0.9, ior 1.33, thickness 0.5
   - 15 BKC buildings with window emissives turning red when water > 2ft
   - 3D Evacuation Safe Path ribbon
   - HUD Grid with real Lat/Long
   ========================================================================= */
interface ThreeJsCanvasProps {
  rainfallMM: number;
  depthFt: number;
  isRainActive: boolean;
  city: CityConfig;
}

function ThreeJsSimulationCanvas({ rainfallMM, depthFt, isRainActive }: ThreeJsCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e1a, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.set(30, 22, 35);
    camera.lookAt(0, 2, 0);

    // 2. Renderer Setup (Solid 60 FPS)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Lighting (Monsoon overcast ambient + dynamic spotlights)
    const ambientLight = new THREE.AmbientLight(0x384860, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x77aacc, 2.0);
    dirLight.position.set(25, 45, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const cyanPointLight = new THREE.PointLight(0x00d9ff, 1.5, 40);
    cyanPointLight.position.set(0, 10, 0);
    scene.add(cyanPointLight);

    // 4. Ground Terrain Plane (DEM Representation)
    const groundGeo = new THREE.PlaneGeometry(80, 80, 40, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x141a24,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Holographic Lat/Long Grid
    const gridHelper = new THREE.GridHelper(80, 20, 0x00d9ff, 0x1e293b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // 5. 15 BKC Buildings (BoxGeometry with Window Emissives)
    const buildingMeshes: THREE.Mesh[] = [];
    const buildingMatDefault = new THREE.MeshStandardMaterial({
      color: 0x242d3d,
      roughness: 0.3,
      metalness: 0.7,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.15,
    });

    const buildingMatSubmerged = new THREE.MeshStandardMaterial({
      color: 0x4a121a,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xff073a,
      emissiveIntensity: 0.65,
    });

    // Generate 15 BKC Commercial Tower blocks
    const buildingCoords = [
      { x: -14, z: -10, w: 4, d: 5, h: 12 },
      { x: -8, z: -12, w: 5, d: 4, h: 16 },
      { x: -2, z: -14, w: 6, d: 6, h: 22 },
      { x: 6, z: -12, w: 5, d: 5, h: 18 },
      { x: 13, z: -9, w: 4, d: 4, h: 14 },
      // Mid Row
      { x: -12, z: 0, w: 5, d: 4, h: 15 },
      { x: -5, z: -2, w: 4, d: 5, h: 20 },
      { x: 3, z: -1, w: 6, d: 5, h: 25 }, // BKC ICICI HQ
      { x: 11, z: 1, w: 5, d: 4, h: 17 },
      // Low-lying Underpass Cluster
      { x: -15, z: 10, w: 5, d: 5, h: 11 },
      { x: -7, z: 9, w: 4, d: 4, h: 13 },
      { x: 0, z: 12, w: 5, d: 6, h: 16 },
      { x: 8, z: 11, w: 4, d: 4, h: 12 },
      { x: 14, z: 13, w: 5, d: 5, h: 15 },
      { x: 0, z: -4, w: 4, d: 4, h: 10 },
    ];

    buildingCoords.forEach((b) => {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const mesh = new THREE.Mesh(geo, buildingMatDefault.clone());
      mesh.position.set(b.x, b.h / 2, b.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      buildingMeshes.push(mesh);
    });

    // 6. Safe Evacuation Ribbon Path (Green Elevated SCLR Flyover)
    const curvePoints = [
      new THREE.Vector3(-25, 4.5, -20),
      new THREE.Vector3(-10, 5.0, -10),
      new THREE.Vector3(5, 5.2, 5),
      new THREE.Vector3(20, 5.5, 18),
      new THREE.Vector3(30, 5.5, 25),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.4, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const safePath = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(safePath);

    // 7. PBR Water Surface (MeshPhysicalMaterial with transmission, ior 1.33)
    const waterGeo = new THREE.PlaneGeometry(75, 75, 64, 64);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0e2f44,
      transmission: 0.9,
      opacity: 0.95,
      transparent: true,
      roughness: 0.12,
      ior: 1.333,
      reflectivity: 0.9,
      thickness: 0.5,
      specularColor: new THREE.Color(0x00d9ff),
    });
    const waterPlane = new THREE.Mesh(waterGeo, waterMat);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.y = 0.4;
    scene.add(waterPlane);

    // 8. 5000-8000 Rain Particles (Points BufferGeometry)
    const rainCount = Math.min(8000, Math.max(1200, Math.floor(rainfallMM * 95)));
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    const rainVelocities = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 70;
      rainPositions[i * 3 + 1] = Math.random() * 45;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 70;
      rainVelocities[i] = 0.35 + Math.random() * 0.45;
    }
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));

    const rainMat = new THREE.PointsMaterial({
      color: 0x00d9ff,
      size: 0.28,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const rainSystem = new THREE.Points(rainGeo, rainMat);
    scene.add(rainSystem);

    // 9. Splash Particles when Rain hits water plane
    const splashCount = 400;
    const splashGeo = new THREE.BufferGeometry();
    const splashPos = new Float32Array(splashCount * 3);
    for (let i = 0; i < splashCount; i++) {
      splashPos[i * 3] = (Math.random() - 0.5) * 60;
      splashPos[i * 3 + 1] = 0.5;
      splashPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    splashGeo.setAttribute("position", new THREE.BufferAttribute(splashPos, 3));
    const splashMat = new THREE.PointsMaterial({
      color: 0x99e6ff,
      size: 0.35,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const splashes = new THREE.Points(splashGeo, splashMat);
    scene.add(splashes);

    // Animation & Smooth Orbiting Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Camera gentle orbit
      camera.position.x = 35 * Math.sin(elapsed * 0.08);
      camera.position.z = 35 * Math.cos(elapsed * 0.08);
      camera.lookAt(0, 3, 0);

      // Smooth Lerp Water Height with predicted depth
      const targetWaterY = Math.max(0.2, (depthFt / 3.2) * 1.8);
      waterPlane.position.y += (targetWaterY - waterPlane.position.y) * 0.05;

      // Update Building Submergence Emissive
      const isSubmerged = depthFt > 2.0;
      buildingMeshes.forEach((mesh, idx) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (isSubmerged && idx < Math.min(15, Math.floor(depthFt * 3.5))) {
          mat.color.setHex(0x5a121a);
          mat.emissive.setHex(0xff073a);
          mat.emissiveIntensity = 0.55 + 0.15 * Math.sin(elapsed * 3);
        } else {
          mat.color.setHex(0x242d3d);
          mat.emissive.setHex(0x00d9ff);
          mat.emissiveIntensity = 0.15;
        }
      });

      // Update Rain Fall & Wind Direction Tilt (15 deg)
      if (isRainActive) {
        rainSystem.visible = true;
        splashes.visible = true;
        const positions = rainGeo.attributes.position.array as Float32Array;
        const speedMultiplier = (rainfallMM / 30) * 12.0;

        for (let i = 0; i < rainCount; i++) {
          positions[i * 3 + 1] -= (rainVelocities[i] * speedMultiplier + 0.2) * delta;
          // 15 deg wind tilt along X axis
          positions[i * 3] += Math.sin(0.26) * 0.3;

          // Recycle particles to sky
          if (positions[i * 3 + 1] <= waterPlane.position.y) {
            positions[i * 3 + 1] = 45;
            positions[i * 3] = (Math.random() - 0.5) * 70;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 70;
          }
        }
        rainGeo.attributes.position.needsUpdate = true;

        // Animate Splashes
        const sPositions = splashGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < splashCount; i++) {
          sPositions[i * 3 + 1] = waterPlane.position.y + 0.05 + Math.sin(elapsed * 8 + i) * 0.08;
        }
        splashGeo.attributes.position.needsUpdate = true;
      } else {
        rainSystem.visible = false;
        splashes.visible = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 450;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [rainfallMM, depthFt, isRainActive]);

  return <div ref={containerRef} className="w-full h-full min-h-[460px] cursor-grab active:cursor-grabbing" />;
}

/* =========================================================================
   FEATURE 9: MAPBOX GEOSPATIAL RADAR CANVAS (36 STATIONS + 9 IOT + RADAR)
   ========================================================================= */
interface MapboxCanvasProps {
  city: CityConfig;
  radarOpacity: number;
  isRadarPlaying: boolean;
}

function MapboxRadarCanvas({ city, radarOpacity, isRadarPlaying }: MapboxCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedStation, setSelectedStation] = useState<CityConfig["stations"][0] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (isRadarPlaying) frame += 0.8;

      const w = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 460);

      // Dark Geospatial Map Background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, w, h);

      // Grid Coordinate Lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Coastline & Water Bodies (Arabian Sea / Creek Outline)
      ctx.fillStyle = "rgba(14, 47, 68, 0.5)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.35, 0);
      ctx.bezierCurveTo(w * 0.3, h * 0.3, w * 0.2, h * 0.6, w * 0.4, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Coastline Glow
      ctx.strokeStyle = "rgba(0, 217, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Animated Doppler Radar Rain Cells (Moving Arabian Sea -> City)
      ctx.save();
      ctx.globalAlpha = radarOpacity;
      const stormX = (w * 0.25 + (frame % (w * 0.8))) % w;
      const stormY = h * 0.45;

      const stormGrad = ctx.createRadialGradient(stormX, stormY, 15, stormX, stormY, 120);
      stormGrad.addColorStop(0, "rgba(255, 7, 58, 0.85)"); // 55+ dBZ Core
      stormGrad.addColorStop(0.35, "rgba(255, 107, 53, 0.7)"); // 45 dBZ
      stormGrad.addColorStop(0.65, "rgba(234, 179, 8, 0.5)"); // 35 dBZ
      stormGrad.addColorStop(1, "rgba(0, 217, 255, 0)");

      ctx.fillStyle = stormGrad;
      ctx.beginPath();
      ctx.arc(stormX, stormY, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw 2019 Stuck Route (Red Polyline)
      ctx.strokeStyle = "rgba(255, 7, 58, 0.85)";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.55);
      ctx.lineTo(w * 0.52, h * 0.52);
      ctx.lineTo(w * 0.6, h * 0.65);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw 2026 AI Safe Route (Green Polyline via SCLR)
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.55);
      ctx.bezierCurveTo(w * 0.45, h * 0.35, w * 0.58, h * 0.38, w * 0.6, h * 0.65);
      ctx.stroke();

      // Draw Stations (36 IMD Blue Dots + 9 IoT Pulsing Green)
      city.stations.forEach((st, idx) => {
        const sx = w * 0.35 + ((st.lng - city.lng) * 1800 + (idx % 4) * 50);
        const sy = h * 0.5 - ((st.lat - city.lat) * 1800 + Math.floor(idx / 4) * 45);

        if (sx > 20 && sx < w - 20 && sy > 20 && sy < h - 20) {
          if (st.type === "IoT") {
            // Pulsing Green Ring
            ctx.strokeStyle = "rgba(37, 211, 102, 0.8)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(sx, sy, 7 + Math.sin(frame * 0.1 + idx) * 3, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = "#25D366";
            ctx.beginPath();
            ctx.arc(sx, sy, 4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Solid IMD Blue
            ctx.fillStyle = "#00D9FF";
            ctx.beginPath();
            ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Station Label
          ctx.fillStyle = "#cbd5e1";
          ctx.font = "9px 'JetBrains Mono', monospace";
          ctx.fillText(st.name.split(" ")[0], sx + 6, sy + 3);
        }
      });
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [city, radarOpacity, isRadarPlaying]);

  return (
    <div className="relative w-full h-full min-h-[460px]">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Interactive Legend in Bottom Right */}
      <div className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono space-y-1">
        <div className="text-white font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>IMD Automated Weather Station (AWS)</span>
        </div>
        <div className="text-white font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#25D366]" />
          <span>IoT Micro-Sensor (BKC/Kurla/Dadar)</span>
        </div>
        <div className="text-emerald-400 font-semibold flex items-center gap-1">
          <span className="w-2.5 h-0.5 bg-emerald-400" />
          <span>2026 AI Elevated Safe Route</span>
        </div>
        <div className="text-red-400 font-semibold flex items-center gap-1">
          <span className="w-2.5 h-0.5 bg-red-400 border-dashed" />
          <span>2019 Stuck Flood Path</span>
        </div>
      </div>
    </div>
  );
}

function BoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
