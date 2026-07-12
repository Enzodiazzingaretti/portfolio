/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        raveRed: "#8B0000",
        // Variante luminosa para texto chico sobre fondo oscuro (WCAG AA)
        raveRedBright: "#FF3B3B",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        display: ["Barlow Condensed", "Arial Narrow", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        brutal: "0.14em",
      },
      animation: {
        grain: "grain 8s steps(8) infinite",
        flicker: "flicker 2.8s linear infinite",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
        flicker: {
          "0%, 19%, 21%, 63%, 65%, 100%": { opacity: "0.75" },
          "20%, 64%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
