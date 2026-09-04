import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JalRakshak | Mumbai & Pan-India Flood Intelligence Platform",
  description:
    "AI/ML-Based Integrated Heavy Rainfall Early Warning & Inundation Prediction System (SIH26071) powered by ConvLSTM, XGBoost, Radar, Satellite, and 3D PBR Simulations.",
  keywords: [
    "JalRakshak",
    "Mumbai Flood Prediction",
    "Early Warning System",
    "SIH 2026",
    "SIH26071",
    "ConvLSTM",
    "Inundation Modeling",
    "BKC Flood Risk",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0a] text-slate-100 antialiased min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
