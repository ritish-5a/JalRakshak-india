import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        neonCyan: "#00D9FF",
        neonOrange: "#FF6B35",
        neonRed: "#FF073A",
        whatsapp: "#25D366",
        surface: "rgba(255, 255, 255, 0.03)",
        surfaceBorder: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glowCyan: "0 0 25px -5px rgba(0, 217, 255, 0.4)",
        glowOrange: "0 0 25px -5px rgba(255, 107, 53, 0.4)",
        glowRed: "0 0 25px -5px rgba(255, 7, 58, 0.4)",
        glowGreen: "0 0 25px -5px rgba(37, 211, 102, 0.4)",
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radarSweep 4s linear infinite",
        "ripple": "ripple 2s linear infinite",
      },
      keyframes: {
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
