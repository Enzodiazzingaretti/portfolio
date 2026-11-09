/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fondos: ink es el fondo global, surface para cards/thumbnails,
        // surfaceDeep para paneles de modal
        // «Vidrio ahumado» (2026-11): el fondo deja de ser negro puro y pasa a
        // grafito; gunmetal para superficies y humo para texto secundario.
        // El «blanco» de las clases (text-white/50…) es el primer plano: en
        // las paletas claras pasa a ser tinta
        white: "rgb(var(--fg-ch) / <alpha-value>)",
        ink: "rgb(var(--bg-ch) / <alpha-value>)",
        graphite: "rgb(var(--bg-ch) / <alpha-value>)",
        gunmetal: "rgb(var(--gun-ch) / <alpha-value>)",
        smoke: "rgb(var(--smoke-ch) / <alpha-value>)",
        surface: "rgb(var(--deep-ch) / <alpha-value>)",
        surfaceDeep: "rgb(var(--deep-ch) / <alpha-value>)",
        // Texto: paper para titulares/principal, dim para secundario
        paper: "rgb(var(--paper-ch) / <alpha-value>)",
        dim: "var(--dim)",
        raveRed: "rgb(var(--red-deep-ch) / <alpha-value>)",
        raveRedHover: "rgb(var(--red2-ch) / <alpha-value>)",
        // Variante luminosa para texto chico sobre fondo oscuro (WCAG AA)
        raveRedBright: "rgb(var(--red-hi-ch) / <alpha-value>)",
        // Rojo Kexxy: acento de la identidad (relleno y tipo grande)
        kexxy: "rgb(var(--red-ch) / <alpha-value>)",
        // Desde el 2026-11-08 los colores salen de los canales de vidrio.css
        // (--bg-ch, --red-ch…): así una paleta alternativa cambia todo.
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
        // Titulares de afiche: condensada, a gran escala
        poster: ["Anton", "Impact", "Arial Narrow", "sans-serif"],
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
