import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111114",
        champagne: "#f6efe3",
        pearl: "#fffaf2",
        gold: "#c6a15b",
        rose: "#b76e79",
        emerald: "#204b3b"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(17, 17, 20, 0.16)"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
