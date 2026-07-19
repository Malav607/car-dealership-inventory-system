/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#06080D",
          900: "#0B0F19",
          850: "#111726",
          800: "#1A2338",
          700: "#263352",
        },
        cyan: {
          accent: "#00F0FF",
          glow: "rgba(0, 240, 255, 0.35)",
        },
        gold: {
          accent: "#E2B857",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        glow: "0 0 25px rgba(0, 240, 255, 0.25)",
      },
    },
  },
  plugins: [],
};

