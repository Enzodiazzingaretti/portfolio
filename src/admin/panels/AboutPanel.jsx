import TextField from "../fields/TextField.jsx";
import TextArea from "../fields/TextArea.jsx";
import TagsField from "../fields/TagsField.jsx";
import ImageField from "../ImageField.jsx";

export default function AboutPanel({ draft, update }) {
  const a = draft.about || {};
  const set = (k) => (v) => update(["about", k], v);
  return (
    <div>
      <TextField label="Titular" value={a.headline} onChange={set("headline")} />
      <TextArea label="Párrafo" value={a.paragraph} onChange={set("paragraph")} rows={5} />
      <TagsField label="Especializaciones" value={a.specializations} onChange={set("specializations")} hint="Separadas por coma. Aparecen como lista." />
      <ImageField label="Foto / retrato" value={a.portrait} slot="about" onChange={set("portrait")} />
    </div>
  );
}
