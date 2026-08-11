import TextField from "../fields/TextField.jsx";
import TextArea from "../fields/TextArea.jsx";
import TagsField from "../fields/TagsField.jsx";

export default function HeroPanel({ draft, update }) {
  const h = draft.hero || {};
  const set = (k) => (v) => update(["hero", k], v);
  return (
    <div>
      <TextField label="Título" value={h.title} onChange={set("title")} placeholder="ENZO DIAZ ZINGARETTI" />
      <TextArea label="Descripción" value={h.description} onChange={set("description")} rows={3} />
      <TextField label="Ubicación" value={h.location} onChange={set("location")} />
      <TextField label="Disponibilidad" value={h.availability} onChange={set("availability")} />
      <TextField label="Botón (texto)" value={h.cta} onChange={set("cta")} />
      <TagsField label="Roles" value={h.roles} onChange={set("roles")} placeholder="Artista 3D, Motion Designer, ..." />
    </div>
  );
}
