import { StrictMode, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Shell from "./layout/Shell.jsx";
import Home from "./routes/Home.jsx";
import CategoryPage from "./routes/CategoryPage.jsx";
import NotFound from "./routes/NotFound.jsx";
import CasoEnTech from "./routes/CasoEnTech.jsx";
import "./index.css";
// La capa «vidrio ahumado» va después: pisa lo que haga falta de index.css.
import "./styles/vidrio.css";
import "./styles/paletas.css";

// El admin es otra app: fuera del bundle del portfolio
const Admin = lazy(() => import("./admin/Admin.jsx"));
// Los casos de estudio traen sus textos en tres idiomas: entran con su página
const CasePage = lazy(() => import("./routes/CasePage.jsx"));

// Paleta de prueba (paletas.css): `?paleta=<id>` la activa para la sesión y
// muestra el selector; `?paleta=off` vuelve a la de siempre.
try {
  const pedida = new URLSearchParams(window.location.search).get("paleta");
  if (pedida === "off") {
    sessionStorage.removeItem("paleta");
    sessionStorage.removeItem("paleta-prueba");
  } else if (pedida) {
    sessionStorage.setItem("paleta-prueba", "1");
    if (pedida === "grafito") sessionStorage.removeItem("paleta");
    else sessionStorage.setItem("paleta", pedida);
  }
  const paleta = sessionStorage.getItem("paleta");
  if (paleta) document.documentElement.dataset.paleta = paleta;
} catch {
  /* sin sessionStorage: la paleta de siempre */
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <Admin />
            </Suspense>
          }
        />
        {/* El 404 vive adentro del Shell: conserva barra, fondo y paneles en
            vez de escupir al visitante al home sin explicacion. */}
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="/web" element={<Navigate to="/tech" replace />} />
          <Route path="/web/:caso" element={<CasoEnTech />} />
          <Route path="/:slug" element={<CategoryPage />} />
          <Route
            path="/:slug/:caso"
            element={
              <Suspense fallback={<div className="case-fallback" />}>
                <CasePage />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
