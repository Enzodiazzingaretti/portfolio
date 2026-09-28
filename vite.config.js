import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // react-dom/client es otra entrada del paquete: sin nombrarla, el
          // renderer entero terminaba en el chunk principal.
          react: ["react", "react-dom", "react-dom/client", "react-router-dom"],
          three: ["three"],
        },
      },
    },
  },
});
