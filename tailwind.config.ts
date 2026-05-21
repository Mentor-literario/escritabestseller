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
          900: "#5B21B6",
          800: "#6D28D9",
          700: "#7C3AED",
          600: "#8B5CF6",
          500: "#A855F7",
          400: "#C084FC",
          300: "#D8B4FE",
        },
        silver: {
          400: "#A1A1AA",
          300: "#C0C0C8",
          200: "#D4D4DC",
          100: "#E8E8F0",
        },
        frost: "#F8FAFC",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(124, 58, 237, 0.25)",
        "glow-violet": "0 0 30px rgba(168, 85, 247, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
