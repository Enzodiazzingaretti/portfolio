import { useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

/**
 * Antes cualquier URL inexistente hacia <Navigate to="/" replace />: el
 * visitante terminaba en el home sin entender por que, y para un buscador era
 * un soft 404 —contenido distinto al pedido, devuelto con 200—. Vercel sirve
 * la SPA con 200 pase lo que pase, asi que el status no se puede cambiar desde
 * acá; lo que sí se puede es decirlo en pantalla y sacar la URL del indice.
 */
export default function NotFound() {
  const { content, categories } = useOutletContext();
  const ui = content.ui.notFound ?? {};

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, follow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="notfound">
      <p className="notfound-code font-mono">404</p>
      <h1 className="notfound-title font-display">{ui.title ?? "Esta página no existe"}</h1>
      <p className="notfound-text">{ui.text ?? "El enlace es viejo o está mal escrito."}</p>

      <nav className="notfound-links" aria-label={content.ui.nav.index}>
        <Link to="/" className="notfound-link font-mono">
          {content.ui.nav.home}
        </Link>
        {categories.map((category) => (
          <Link key={category.id} to={`/${category.slug}`} className="notfound-link font-mono">
            {category.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
