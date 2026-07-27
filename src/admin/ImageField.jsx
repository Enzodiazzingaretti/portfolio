import { useState } from "react";
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { compressImage } from "../lib/compressImage.js";
import { uploadImage } from "./api.js";

export default function ImageField({ label, value, slot, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try {
      const dataUrl = await compressImage(file);
      const res = await uploadImage(slot, dataUrl);
      onChange(res.url);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return (
    <div className="mb-4">
      <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 mb-1.5">{label}</span>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 shrink-0 bg-black/40 border border-white/10 overflow-hidden grid place-items-center">
          {busy ? (
            <Loader2 size={20} className="text-raveRedBright animate-spin" />
          ) : value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={22} className="text-white/25" strokeWidth={1.25} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex items-center gap-2 border border-white/15 text-white/80 px-4 py-2.5 text-xs font-mono uppercase tracking-[0.2em] cursor-pointer hover:border-raveRedBright/60 hover:text-white transition-colors">
            <Upload size={14} strokeWidth={1.75} />
            {busy ? "Subiendo…" : value ? "Cambiar" : "Subir imagen"}
            <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 text-white/40 hover:text-raveRedBright text-[11px] transition-colors self-start px-1"
            >
              <Trash2 size={12} strokeWidth={1.75} /> Quitar
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-raveRedBright text-xs mt-2">{error}</p>}
    </div>
  );
}
