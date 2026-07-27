import { useState } from "react";
import { ImagePlus, ArrowLeft, ArrowRight, X, Loader2, Plus, Film } from "lucide-react";
import { compressImage } from "../lib/compressImage.js";
import { uploadImage } from "./api.js";
import { move, removeAt } from "./ReorderableList.jsx";

const isVideo = (p) => /\.(mp4|webm|mov)$/i.test(p || "");

// Editor de la galería (slides): subís imágenes o pegás una ruta/URL (por ej. un video .mp4).
export default function SlidesField({ slot, slides, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [path, setPath] = useState("");
  const list = slides || [];

  async function onFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true); setError("");
    try {
      const uploaded = [];
      for (const f of files) {
        const dataUrl = await compressImage(f);
        const res = await uploadImage(slot, dataUrl);
        uploaded.push(res.url);
      }
      onChange([...list, ...uploaded]);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  function addPath() {
    const p = path.trim();
    if (!p) return;
    onChange([...list, p]);
    setPath("");
  }

  return (
    <div className="mt-2 mb-2">
      <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 mb-2">
        Galería / slides · <span className="text-white/70 tabular-nums">{list.length}</span>
      </span>

      {list.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {list.map((src, i) => (
            <div key={src + i} className="relative group aspect-square overflow-hidden border border-white/10 bg-black/40">
              {isVideo(src) ? (
                <div className="w-full h-full grid place-items-center text-white/40">
                  <Film size={20} />
                </div>
              ) : (
                <img src={src} alt="" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 flex items-center justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/85 via-black/20 to-black/40">
                <button type="button" aria-label="Mover antes" onClick={() => onChange(move(list, i, i - 1))} disabled={i === 0}
                  className="grid place-items-center w-6 h-6 bg-black/70 text-white hover:text-raveRedBright disabled:opacity-30">
                  <ArrowLeft size={13} />
                </button>
                <button type="button" aria-label="Quitar" onClick={() => onChange(removeAt(list, i))}
                  className="grid place-items-center w-6 h-6 bg-black/70 text-white hover:text-raveRedBright">
                  <X size={13} />
                </button>
                <button type="button" aria-label="Mover después" onClick={() => onChange(move(list, i, i + 1))} disabled={i === list.length - 1}
                  className="grid place-items-center w-6 h-6 bg-black/70 text-white hover:text-raveRedBright disabled:opacity-30">
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 border border-white/15 text-white/80 px-3 py-2 text-xs font-mono uppercase tracking-[0.2em] cursor-pointer hover:border-raveRedBright/60 hover:text-white transition-colors">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} strokeWidth={1.75} />}
          {busy ? "Subiendo…" : "Subir imágenes"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} disabled={busy} />
        </label>
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPath(); } }}
            placeholder="/images/... o un .mp4"
            className="flex-1 bg-black/40 border border-white/10 px-3 py-2 text-xs text-[#EAEAEA] placeholder-white/25 outline-none focus:border-raveRedBright"
          />
          <button type="button" onClick={addPath} aria-label="Agregar ruta"
            className="grid place-items-center w-9 h-9 border border-white/15 text-white/60 hover:text-raveRedBright hover:border-raveRedBright/50 transition-colors">
            <Plus size={15} />
          </button>
        </div>
      </div>
      <p className="font-mono text-[10px] text-white/35 mt-2 tracking-wide">Subí imágenes o pegá una ruta (útil para videos .mp4).</p>
      {error && <p className="text-raveRedBright text-xs mt-2">{error}</p>}
    </div>
  );
}
