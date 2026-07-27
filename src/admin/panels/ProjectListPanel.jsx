import ReorderableList from "../ReorderableList.jsx";
import TextField from "../fields/TextField.jsx";
import TextArea from "../fields/TextArea.jsx";
import TagsField from "../fields/TagsField.jsx";
import Toggle from "../fields/Toggle.jsx";
import ImageField from "../ImageField.jsx";
import SlidesField from "../SlidesField.jsx";

// Panel genérico para las categorías de proyectos. `fields` describe qué editar.
export default function ProjectListPanel({ draft, update, listKey, slot, titleKey = "title", addLabel, fields, newItem }) {
  return (
    <ReorderableList
      items={draft[listKey] || []}
      onChange={(arr) => update([listKey], arr)}
      addLabel={addLabel}
      title={titleKey}
      newItem={newItem}
      renderItem={(item, patch) => (
        <div>
          {fields.map((f) => {
            const value = item[f.key];
            const common = { key: f.key, label: f.label };
            if (f.type === "textarea")
              return <TextArea {...common} value={value} onChange={(v) => patch({ [f.key]: v })} rows={f.rows || 3} placeholder={f.placeholder} hint={f.hint} />;
            if (f.type === "tags")
              return <TagsField {...common} value={value} onChange={(v) => patch({ [f.key]: v })} placeholder={f.placeholder} hint={f.hint} />;
            if (f.type === "image")
              return <ImageField {...common} value={value} slot={slot} onChange={(v) => patch({ [f.key]: v })} />;
            if (f.type === "slides")
              return <SlidesField key={f.key} slot={slot} slides={value} onChange={(v) => patch({ [f.key]: v })} />;
            if (f.type === "toggle")
              return (
                <div key={f.key} className="mb-3">
                  <Toggle label={f.label} checked={!!value} onChange={(v) => patch({ [f.key]: v })} />
                  {f.hint && <p className="font-mono text-[10px] text-white/35 mt-1 tracking-wide">{f.hint}</p>}
                </div>
              );
            return <TextField {...common} value={value} onChange={(v) => patch({ [f.key]: v })} placeholder={f.placeholder} hint={f.hint} />;
          })}
        </div>
      )}
    />
  );
}
