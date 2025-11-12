import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#dcecff",
          200: "#b8d9ff",
          300: "#8ac0ff",
          400: "#5ea5ff",
          500: "#2d87ff",
          600: "#1d6be6",
          700: "#1553b4",
          800: "#103b83",
          900: "#0a2554"
        }
      },
      boxShadow: {
        soft: "0 25px 50px -12px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;

