import { ChevronUp, ChevronDown, Trash2, Plus, GripVertical } from "lucide-react";
import Toggle from "./fields/Toggle.jsx";

export function move(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}
export function removeAt(arr, i) { const n = [...arr]; n.splice(i, 1); return n; }

function IconBtn({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid place-items-center w-8 h-8 border border-white/15 text-white/50 transition-colors hover:text-raveRedBright hover:border-raveRedBright/50 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export default function ReorderableList({ items, renderItem, onChange, newItem, addLabel = "Agregar", title }) {
  const list = items || [];
  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={item.id ?? i} className="border border-white/10 bg-black/30 overflow-hidden transition-colors hover:border-white/20">
          <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-1.5">
              <GripVertical size={15} className="text-white/25 mr-1" />
              <IconBtn label="Subir" onClick={() => onChange(move(list, i, i - 1))} disabled={i === 0}>
                <ChevronUp size={16} strokeWidth={1.75} />
              </IconBtn>
              <IconBtn label="Bajar" onClick={() => onChange(move(list, i, i + 1))} disabled={i === list.length - 1}>
                <ChevronDown size={16} strokeWidth={1.75} />
              </IconBtn>
              <span className="ml-2 font-mono text-[11px] tabular-nums text-white/40">
                {String(i + 1).padStart(2, "0")}
                {title && item[title] ? <span className="ml-2 text-white/60 normal-case">{item[title]}</span> : null}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Toggle
                label="Visible"
                checked={item.enabled !== false}
                onChange={(v) => { const n = [...list]; n[i] = { ...item, enabled: v }; onChange(n); }}
              />
              <IconBtn label="Eliminar" onClick={() => onChange(removeAt(list, i))}>
                <Trash2 size={15} strokeWidth={1.75} />
              </IconBtn>
            </div>
          </div>
          <div className="p-4">
            {renderItem(item, (patch) => { const n = [...list]; n[i] = { ...item, ...patch }; onChange(n); })}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...list, newItem()])}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-raveRedBright/40 text-raveRedBright py-3 text-sm font-mono uppercase tracking-[0.2em] hover:border-raveRedBright/70 hover:bg-raveRedBright/5 transition-colors"
      >
        <Plus size={16} strokeWidth={1.75} /> {addLabel}
      </button>
    </div>
  );
}
