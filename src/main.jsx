import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Admin from "./admin/Admin.jsx";
import "./index.css";

const isAdmin = window.location.pathname.replace(/\/$/, "") === "/admin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>{isAdmin ? <Admin /> : <App />}</StrictMode>,
);
