import { Navigate, useParams } from "react-router-dom";

/**
 * /web pasó a /tech (2026-11). vercel.json redirige con un 308; esto cubre los
 * links internos viejos y el servidor de desarrollo. El caso de CTRL.Z es un
 * capítulo de los press kits desde el 2026-10-17.
 */
export default function CasoEnTech() {
  const { caso } = useParams();
  return <Navigate to={caso === "ctrl-z" ? "/tech/press-kits" : `/tech/${caso}`} replace />;
}
