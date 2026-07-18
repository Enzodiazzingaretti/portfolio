/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fondos: ink es el fondo global, surface para cards/thumbnails,
        // surfaceDeep para paneles de modal
        ink: "#050505",
        surface: "#0A0A0A",
        surfaceDeep: "#080808",
        // Texto: paper para titulares/principal, dim para secundario
        paper: "#EAEAEA",
        dim: "#C8C8C8",
        raveRed: "#8B0000",
        raveRedHover: "#B11212",
        // Variante luminosa para texto chico sobre fondo oscuro (WCAG AA)
        raveRedBright: "#FF3B3B",
      },
      // Escala micro para labels tipo HUD; un solo lugar para ajustarla
      fontSize: {
        // 7px era ilegible; nano y micro comparten piso de 8px
        nano: "8px",
        micro: "8px",
        label: "9px",
        caption: "10px",
        meta: "11px",
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
