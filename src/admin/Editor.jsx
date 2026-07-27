import { useEffect, useState, useCallback } from "react";
import { Save, Check, Loader2, AlertCircle, LogOut, ExternalLink } from "lucide-react";
import { getContent, putContent, logout } from "./api.js";
import Section from "./Section.jsx";
import HeroPanel from "./panels/HeroPanel.jsx";
import AboutPanel from "./panels/AboutPanel.jsx";
import ContactPanel from "./panels/ContactPanel.jsx";
import ProjectListPanel from "./panels/ProjectListPanel.jsx";

const CATEGORIES = [
  {
    key: "webProjects", slot: "web", title: "Proyectos web", subtitle: "Sitios y apps", titleKey: "title", addLabel: "Agregar proyecto",
    fields: [
      { key: "title", label: "Título" },
      { key: "type", label: "Tipo", placeholder: "Web / Diseño" },
      { key: "year", label: "Año" },
      { key: "status", label: "Estado", placeholder: "Online" },
      { key: "role", label: "Rol" },
      { key: "description", label: "Descripción", type: "textarea" },
      { key: "tags", label: "Tags", type: "tags" },
      { key: "features", label: "Características", type: "tags" },
      { key: "previewUrl", label: "Link del sitio (URL)" },
      { key: "previewImage", label: "Captura de preview", type: "image" },
      { key: "scrollPreview", label: "Preview con scroll animado", type: "toggle", hint: "Activá esto si la captura es larga (página completa): al pasar el mouse se desplaza sola." },
      { key: "imageUrl", label: "Imagen de portada", type: "image" },
      { key: "slides", label: "Galería", type: "slides" },
    ],
    newItem: () => ({ id: "web-" + Date.now(), title: "", type: "Web", year: "", status: "", role: "", description: "", tags: [], features: [], previewUrl: "", previewImage: "", scrollPreview: false, imageUrl: null, slides: [], enabled: true }),
  },
  {
    key: "touchDesignerLoops", slot: "motion", title: "Motion", subtitle: "Loops de TouchDesigner", titleKey: "name", addLabel: "Agregar loop",
    fields: [
      { key: "name", label: "Nombre" },
      { key: "notes", label: "Notas", type: "textarea", rows: 2 },
      { key: "thumbnail", label: "Miniatura", type: "image" },
      { key: "slides", label: "Galería / video", type: "slides" },
    ],
    newItem: () => ({ id: "mo-" + Date.now(), name: "", notes: "", thumbnail: "", slides: [], enabled: true }),
  },
  {
    key: "blenderWorks", slot: "render", title: "3D", subtitle: "Renders de Blender", titleKey: "title", addLabel: "Agregar render",
    fields: [
      { key: "title", label: "Título" },
      { key: "description", label: "Descripción", type: "textarea", rows: 2 },
      { key: "slides", label: "Imágenes", type: "slides" },
      { key: "portrait", label: "Formato vertical", type: "toggle" },
      { key: "square", label: "Formato cuadrado", type: "toggle" },
    ],
    newItem: () => ({ id: "3d-" + Date.now(), title: "", description: "", slides: [], portrait: false, square: false, enabled: true }),
  },
  {
    key: "flyers", slot: "flyer", title: "Flyers", subtitle: "Piezas para eventos", titleKey: "title", addLabel: "Agregar flyer",
    fields: [
      { key: "title", label: "Título" },
      { key: "type", label: "Tipo", placeholder: "Flyer" },
      { key: "description", label: "Descripción", type: "textarea", rows: 2 },
      { key: "tags", label: "Tags", type: "tags" },
      { key: "imageUrl", label: "Imagen de portada", type: "image" },
      { key: "portrait", label: "Formato vertical", type: "toggle" },
      { key: "slides", label: "Galería / video", type: "slides" },
    ],
    newItem: () => ({ id: "fl-" + Date.now(), title: "", type: "Flyer", description: "", tags: [], imageUrl: "", portrait: false, slides: [], enabled: true }),
  },
  {
    key: "logos", slot: "logo", title: "Logos", subtitle: "Logos e identidades", titleKey: "title", addLabel: "Agregar logo",
    fields: [
      { key: "title", label: "Título" },
      { key: "type", label: "Tipo" },
      { key: "description", label: "Descripción", type: "textarea", rows: 2 },
      { key: "tags", label: "Tags", type: "tags" },
      { key: "imageUrl", label: "Imagen de portada", type: "image" },
      { key: "square", label: "Formato cuadrado", type: "toggle" },
      { key: "slides", label: "Galería", type: "slides" },
    ],
    newItem: () => ({ id: "lg-" + Date.now(), title: "", type: "", description: "", tags: [], imageUrl: "", square: false, slides: [], enabled: true }),
  },
  {
    key: "espacios", slot: "espacio", title: "Arquitectura", subtitle: "Visualización arquitectónica", titleKey: "title", addLabel: "Agregar pieza",
    fields: [
      { key: "title", label: "Título" },
      { key: "type", label: "Tipo" },
      { key: "description", label: "Descripción", type: "textarea", rows: 2 },
      { key: "tags", label: "Tags", type: "tags" },
      { key: "imageUrl", label: "Imagen de portada", type: "image" },
      { key: "portrait", label: "Formato vertical", type: "toggle" },
      { key: "slides", label: "Galería", type: "slides" },
    ],
    newItem: () => ({ id: "sp-" + Date.now(), title: "", type: "", description: "", tags: [], imageUrl: "", portrait: false, slides: [], enabled: true }),
  },
];

export default function Editor({ onLogout }) {
  const [draft, setDraft] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getContent().then(setDraft).catch(() => setLoadError("No se pudo cargar el contenido."));
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const h = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const update = useCallback((path, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) {
        if (obj[path[i]] == null) obj[path[i]] = {};
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return next;
    });
    setDirty(true);
    setSaveState("idle");
  }, []);

  async function save() {
    setSaveState("saving");
    try {
      await putContent(draft);
      setDirty(false);
      setSaveState("saved");
    } catch (e) {
      setErrorMsg(e.message);
      setSaveState("error");
    }
  }

  async function doLogout() { await logout().catch(() => {}); onLogout(); }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#050505] grid place-items-center text-center px-6 text-[#EAEAEA]">
        <div>
          <AlertCircle size={28} className="text-raveRedBright mx-auto mb-3" strokeWidth={1.5} />
          <p>{loadError}</p>
          <p className="text-white/50 text-sm mt-1">Recargá la página o volvé a entrar.</p>
        </div>
      </div>
    );
  }
  if (!draft) {
    return (
      <div className="min-h-screen bg-[#050505] grid place-items-center text-white/50">
        <Loader2 size={26} className="animate-spin text-raveRedBright" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#EAEAEA]">
      <header className="sticky top-0 z-20 bg-[#050505]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="leading-tight">
            <h1 className="font-display text-xl font-bold uppercase tracking-[0.14em]">Panel</h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">Enzo Diaz Zingaretti</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <SaveStatus dirty={dirty} state={saveState} error={errorMsg} />
            <button
              onClick={save}
              disabled={!dirty || saveState === "saving"}
              className="inline-flex items-center gap-2 bg-raveRed text-white px-4 py-2.5 text-sm font-display font-bold uppercase tracking-[0.16em] transition-colors disabled:opacity-40 hover:bg-raveRedBright"
            >
              {saveState === "saving" ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} strokeWidth={1.75} />}
              Publicar
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer" title="Ver el sitio"
              className="grid place-items-center w-10 h-10 border border-white/15 text-white/60 hover:text-raveRedBright hover:border-raveRedBright/50 transition-colors">
              <ExternalLink size={16} strokeWidth={1.5} />
            </a>
            <button onClick={doLogout} title="Salir"
              className="grid place-items-center w-10 h-10 border border-white/15 text-white/60 hover:text-raveRedBright hover:border-raveRedBright/50 transition-colors">
              <LogOut size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-6 py-8">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold uppercase tracking-[0.08em]">Contenido del sitio</h2>
          <p className="text-white/50 text-sm mt-1 font-mono tracking-wide">
            Editás el contenido en español. Al publicar, los cambios se ven en ~1 minuto.
          </p>
        </div>

        <div className="space-y-4">
          <Section title="Sobre mí" subtitle="Titular, texto y foto" defaultOpen>
            <AboutPanel draft={draft} update={update} />
          </Section>

          {CATEGORIES.map((cat) => (
            <Section key={cat.key} title={cat.title} subtitle={cat.subtitle} count={(draft[cat.key] || []).length}>
              <ProjectListPanel
                draft={draft}
                update={update}
                listKey={cat.key}
                slot={cat.slot}
                titleKey={cat.titleKey}
                addLabel={cat.addLabel}
                fields={cat.fields}
                newItem={cat.newItem}
              />
            </Section>
          ))}

          <Section title="Contacto" subtitle="Textos y enlaces">
            <ContactPanel draft={draft} update={update} />
          </Section>

          <Section title="Portada (hero)" subtitle="Título, tagline y roles del inicio">
            <HeroPanel draft={draft} update={update} />
          </Section>
        </div>
      </main>
    </div>
  );
}

function SaveStatus({ dirty, state, error }) {
  if (state === "saving") return <span className="hidden sm:inline text-sm text-white/50">Publicando…</span>;
  if (state === "error")
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-raveRedBright" title={error}>
        <AlertCircle size={14} /> Error
      </span>
    );
  if (state === "saved" && !dirty)
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-raveRedBright">
        <Check size={14} /> Publicado
      </span>
    );
  if (dirty)
    return (
      <span className="hidden sm:inline-flex items-center gap-2 text-sm text-white/50">
        <span className="w-1.5 h-1.5 rounded-full bg-raveRedBright" /> Sin publicar
      </span>
    );
  return null;
}
