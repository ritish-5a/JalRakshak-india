import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  return NextResponse.json({
    engine: "JalRakshak Ingestion & Inference Pipeline",
    audit_id: "JR-MUM-2026-X8",
    logs: [
      {
        timestamp: new Date(now.getTime() - 120000).toISOString(),
        level: "INFO",
        source: "INSAT-3D",
        message: "Satellite IR brightness temperature ingest -90.2°C at 85% convective cloud cover over Arabian Sea.",
      },
      {
        timestamp: new Date(now.getTime() - 95000).toISOString(),
        level: "INFO",
        source: "DWR-Mumbai",
        message: "Doppler DWR Mumbai sweep complete: 45.4 dBZ core tracking ENE at 25.1 km/h towards BKC/Kurla.",
      },
      {
        timestamp: new Date(now.getTime() - 60000).toISOString(),
        level: "INFO",
        source: "ConvLSTM-Engine",
        message: "Inference 8.5ms: 90-min nowcasting matrix computed. Predicted max BKC precipitation: 72mm RED alert.",
      },
      {
        timestamp: new Date(now.getTime() - 40000).toISOString(),
        level: "WARN",
        source: "XGBoost-Hydro",
        message: "Runoff lag 30min simulated: Inundation at BKC estimated 3.2ft (critical knee-level). Reroute triggered.",
      },
      {
        timestamp: new Date(now.getTime() - 15000).toISOString(),
        level: "SUCCESS",
        source: "BMC-Dispatcher",
        message: "Emergency telemetry pushed to BMC Disaster Control 1916 & WhatsApp driver dispatch queue.",
      },
    ],
  });
}
