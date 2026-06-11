import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        soluna: {
          ivory: "#FAF8F5",
          nude: "#E8D9D7",
          rose: "#D6B5B0",
          champagne: "#C9A96E",
          charcoal: "#3B3B3B",
          white: "#FFFFFF"
        }
      },
      boxShadow: {
        soft: "0 16px 45px rgba(59, 59, 59, 0.08)",
        glow: "0 20px 70px rgba(201, 169, 110, 0.22)"
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
