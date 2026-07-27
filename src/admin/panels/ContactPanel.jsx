import TextField from "../fields/TextField.jsx";
import TagsField from "../fields/TagsField.jsx";

export default function ContactPanel({ draft, update }) {
  const c = draft.contact || {};
  const links = draft.contactLinks || {};
  const setC = (k) => (v) => update(["contact", k], v);
  const setL = (k) => (v) => update(["contactLinks", k], v);
  return (
    <div>
      <TextField label="Titular" value={c.headline} onChange={setC("headline")} placeholder="HABLEMOS" />
      <TagsField label="Disponible para" value={c.availableFor} onChange={setC("availableFor")} />
      <TextField label="Botón (texto)" value={c.cta} onChange={setC("cta")} placeholder="Escribime" />
      <TextField label="Nota" value={c.note} onChange={setC("note")} placeholder="Respondo en menos de 24 horas" />

      <div className="mt-5 pt-5 border-t border-white/10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45 mb-3">Enlaces</p>
        <TextField label="Email" value={links.email} onChange={setL("email")} />
        <TextField label="Instagram (URL)" value={links.instagram} onChange={setL("instagram")} placeholder="https://instagram.com/..." />
        <TextField label="LinkedIn (URL)" value={links.linkedin} onChange={setL("linkedin")} hint="Dejalo vacío para ocultar el enlace." />
        <TextField label="Press Kit (URL)" value={links.presskit} onChange={setL("presskit")} />
      </div>
    </div>
  );
}
