/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        primary: {
          DEFAULT: "#E50914",
          hover: "#B20710",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
        },
        accent: {
          DEFAULT: "#00E5FF",
          hover: "#00B8D4",
        },
        luxuryGold: "#FFD700",
        darkCard: "rgba(255, 255, 255, 0.04)",
        glassBorder: "rgba(255, 255, 255, 0.08)",

        // ─── Cinema Pro Max — Volume 7 Design System tokens ───
        // Additive semantic palette (Black / Gold / Red premium theme).
        cpm: {
          bg: "#050505",
          bg2: "#0F1117",
          surface: "#1B1F2A",
          glass: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.12)",
          text: "#FFFFFF",
          muted: "#B0B7C3",
        },
        gold: {
          DEFAULT: "#FFD700",
          premium: "#F4C542",
        },
        cinemaRed: "#FF3B30",
        success: "#00C853",
        warning: "#FFC107",
        error: "#FF1744",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        number: ["Montserrat", "sans-serif"],
      },
      letterSpacing: {
        cpm: "0.5px",
      },
      borderRadius: {
        cpm: "16px",
      },
      boxShadow: {
        redGlow: "0 0 20px rgba(229, 9, 20, 0.4)",
        purpleGlow: "0 0 20px rgba(139, 92, 246, 0.4)",
        blueGlow: "0 0 20px rgba(0, 229, 255, 0.4)",
        goldGlow: "0 0 20px rgba(255, 215, 0, 0.4)",
        goldGlowStrong: "0 0 32px rgba(255, 215, 0, 0.55)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        cpmFloat: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        cpmShimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        cpmGlowPulse: {
          "0%,100%": { boxShadow: "0 0 12px rgba(255,215,0,0.35)" },
          "50%": { boxShadow: "0 0 26px rgba(255,215,0,0.6)" },
        },
      },
      animation: {
        cpmFloat: "cpmFloat 4s ease-in-out infinite",
        cpmShimmer: "cpmShimmer 1.6s infinite",
        cpmGlow: "cpmGlowPulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
