import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7ff",
          100: "#d9e7ff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e3a8a",
        },
        ink: {
          950: "#07111f",
        },
      },
      boxShadow: {
        panel: "0 18px 40px rgba(7, 17, 31, 0.08)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
    },
  },
  plugins: [],
};

export default config;
