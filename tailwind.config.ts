import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#022c22",
          900: "#064e3b",
          800: "#065f46",
          700: "#047857",
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        mint: {
          50: "#f4fbf7",
          100: "#e8f7ef",
          200: "#d4f0e0",
        },
        ink: {
          900: "#0b1f17",
          700: "#1f3b2f",
          500: "#3f5c4f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-lexend)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "forest-radial":
          "radial-gradient(120% 120% at 50% 0%, #0c3a2c 0%, #022c22 60%, #01140f 100%)",
        "mint-fade":
          "linear-gradient(180deg, #f4fbf7 0%, #e8f7ef 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(6, 78, 59, 0.15)",
        "glass-lg": "0 20px 60px -10px rgba(6, 78, 59, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
