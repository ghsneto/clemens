/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: {
          100: "rgba(255,255,255,0.82)",
          80: "rgba(255,255,255,0.7)",
          60: "rgba(255,255,255,0.56)",
          20: "rgba(255,255,255,0.2)"
        },
        brand: {
          ocean: "#0f766e",
          sky: "#0ea5e9",
          mint: "#10b981"
        }
      },
      boxShadow: {
        glass: "0 10px 30px rgba(10, 37, 64, 0.14)"
      },
      backdropBlur: {
        md: "12px"
      }
    }
  },
  plugins: []
};
