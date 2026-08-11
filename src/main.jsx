import { StrictMode, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Shell from "./layout/Shell.jsx";
import Home from "./routes/Home.jsx";
import CategoryPage from "./routes/CategoryPage.jsx";
import NotFound from "./routes/NotFound.jsx";
import "./index.css";

// El admin es otra app: fuera del bundle del portfolio
const Admin = lazy(() => import("./admin/Admin.jsx"));

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
          <Route path="/:slug" element={<CategoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
