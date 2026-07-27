import TextField from "../fields/TextField.jsx";
import TextArea from "../fields/TextArea.jsx";

// Las piezas del Lab están atadas a código generativo por su `id`: acá solo se
// editan el título y la descripción de cada una (no se agregan ni reordenan).
export default function LabPanel({ draft, update }) {
  const pieces = draft.labPieces || [];
  return (
    <div>
      <p className="font-mono text-[10px] text-white/35 mb-4 tracking-wide">
        Los cinco sistemas generativos son fijos (están en el código). Acá editás su nombre y descripción.
      </p>
      <div className="space-y-3">
        {pieces.map((piece, i) => (
          <div key={piece.id ?? i} className="border border-white/10 bg-black/30 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-raveRedBright/70 mb-3">{piece.id}</p>
            <TextField label="Título" value={piece.title} onChange={(v) => update(["labPieces", i, "title"], v)} />
            <TextArea label="Descripción" value={piece.description} onChange={(v) => update(["labPieces", i, "description"], v)} rows={2} />
          </div>
        ))}
      </div>
    </div>
  );
}
