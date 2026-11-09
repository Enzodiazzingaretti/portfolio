import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El build de pregenerado (`--ssr`, scripts/prerender.mjs) deja react afuera
// como dependencia externa: ahí no van los chunks manuales.
export default defineConfig(({ isSsrBuild }) => ({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: isSsrBuild ? {} : {
        manualChunks: {
          // react-dom/client es otra entrada del paquete: sin nombrarla, el
          // renderer entero terminaba en el chunk principal.
          react: ["react", "react-dom", "react-dom/client", "react-router-dom"],
          three: ["three"],
        },
      },
    },
  },
}));
