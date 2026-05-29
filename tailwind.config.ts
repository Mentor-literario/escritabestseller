import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050509",
          900: "#0B0B12",
          800: "#13131E",
          700: "#1A1A28",
          600: "#222233",
        },
        purple: {
          950: "#3B0F8C",
          900: "#4A1A9E",
          800: "#5B21B6",
          700: "#6D28D9",
          600: "#7C3AED",
          500: "#8B5CF6",
          400: "#A78BFA",
          300: "#C4B5FD",
        },
        gold: {
          600: "#7A570F",
          500: "#C9A84C",
          400: "#D4A853",
          300: "#E2C27B",
          200: "#F0D9A8",
          100: "#FBF4E3",
        },
        silver: {
          400: "#A1A1AA",
          300: "#C0C0C8",
          200: "#D4D4DC",
          100: "#E8E8F0",
        },
        frost: "#F8F4EE",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(124, 58, 237, 0.15)",
        "glow-gold": "0 0 24px rgba(201, 168, 76, 0.18)",
      },
      letterSpacing: {
        editorial: "0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
