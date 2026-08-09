import { StrictMode, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Shell from "./layout/Shell.jsx";
import Home from "./routes/Home.jsx";
import CategoryPage from "./routes/CategoryPage.jsx";
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
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="/:slug" element={<CategoryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
