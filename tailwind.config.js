/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        spin: "spin 0.7s linear infinite",
        busMove: "busMove 3s linear forwards",
        bounceSlow: "bounce 2s infinite",
        dot: "dotFlare 1.5s infinite",
      },
      keyframes: {
        busMove: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        dotFlare: {
          "0%, 20%": { opacity: 0 },
          "50%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
