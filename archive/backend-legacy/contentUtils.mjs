const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/** Stored wins; baseline fills missing keys. Arrays replaced entirely when present in stored. */
export function fillDefaults(baseline, stored) {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    return structuredClone(baseline);
  }
  const out = structuredClone(baseline);
  for (const key of Object.keys(stored)) {
    const b = baseline[key];
    const s = stored[key];
    if (!(key in baseline)) {
      out[key] = s;
      continue;
    }
    if (Array.isArray(b)) {
      out[key] = Array.isArray(s) ? s : b;
      continue;
    }
    if (isPlainObject(b) && isPlainObject(s)) {
      out[key] = fillDefaults(b, s);
      continue;
    }
    out[key] = s;
  }
  return out;
}

/** PATCH-style merge for PUT: current file + partial body. */
export function mergePatch(current, patch) {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return structuredClone(current);
  }
  const out = structuredClone(current);
  for (const key of Object.keys(patch)) {
    const p = patch[key];
    const c = out[key];
    if (Array.isArray(p)) {
      out[key] = p;
      continue;
    }
    if (isPlainObject(p) && isPlainObject(c)) {
      out[key] = mergePatch(c, p);
      continue;
    }
    out[key] = p;
  }
  return out;
}

export function validateSiteContent(doc) {
  const errors = [];
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
    return ["El documento debe ser un objeto."];
  }

  const need = (cond, msg) => {
    if (!cond) errors.push(msg);
  };

  need(typeof doc.brand === "string" && doc.brand.trim(), "brand debe ser un string no vacío.");
  need(typeof doc.heroImage === "string" && doc.heroImage.trim(), "heroImage debe ser una ruta o URL.");
  need(Array.isArray(doc.nav) && doc.nav.length > 0, "nav debe ser un array con al menos un ítem.");
  need(
    doc.nav?.every((i) => i && typeof i.label === "string" && typeof i.href === "string"),
    "cada ítem de nav necesita label y href.",
  );

  need(doc.hero && typeof doc.hero === "object", "hero es obligatorio.");
  if (doc.hero) {
    need(typeof doc.hero.tagline === "string", "hero.tagline obligatorio.");
    need(typeof doc.hero.title === "string", "hero.title obligatorio.");
    need(typeof doc.hero.description === "string", "hero.description obligatorio.");
  }

  need(Array.isArray(doc.tourDates), "tourDates debe ser un array.");
  need(
    doc.tourDates?.every((r) => r && typeof r.date === "string" && typeof r.city === "string" && typeof r.venue === "string"),
    "cada tourDate necesita date, city y venue.",
  );

  need(Array.isArray(doc.projects), "projects debe ser un array.");
  need(
    doc.projects?.every((p) => {
      if (!p || typeof p.title !== "string" || typeof p.type !== "string" || typeof p.description !== "string") {
        return false;
      }
      if (p.tags !== undefined) {
        if (!Array.isArray(p.tags) || !p.tags.every((t) => typeof t === "string")) return false;
      }
      if (p.imageUrl !== undefined && typeof p.imageUrl !== "string") return false;
      return true;
    }),
    "cada project necesita title, type y description; tags (array de strings) e imageUrl son opcionales.",
  );

  need(Array.isArray(doc.touchDesignerLoops), "touchDesignerLoops debe ser un array.");
  need(
    doc.touchDesignerLoops?.every((l) => l && typeof l.name === "string" && typeof l.notes === "string"),
    "cada loop necesita name y notes.",
  );

  need(Array.isArray(doc.blenderWorks), "blenderWorks debe ser un array de strings.");
  need(doc.blenderWorks?.every((w) => typeof w === "string"), "blenderWorks solo puede contener strings.");

  need(doc.about && typeof doc.about.paragraph === "string", "about.paragraph obligatorio.");

  need(doc.contact && typeof doc.contact === "object", "contact es obligatorio.");
  if (doc.contact) {
    ["headline", "email", "instagram", "soundcloud"].forEach((f) => {
      need(typeof doc.contact[f] === "string", `contact.${f} obligatorio.`);
    });
  }

  const sectionKeys = ["tour", "projects", "touchDesigner", "blender", "about", "contact"];
  need(doc.sections && typeof doc.sections === "object", "sections es obligatorio.");
  if (doc.sections) {
    for (const k of sectionKeys) {
      const s = doc.sections[k];
      need(s && typeof s === "object", `sections.${k} obligatorio.`);
      if (s) {
        need(typeof s.index === "string", `sections.${k}.index obligatorio.`);
        need(typeof s.title === "string", `sections.${k}.title obligatorio.`);
        need(typeof s.subtitle === "string", `sections.${k}.subtitle debe ser string (puede vacío).`);
      }
    }
  }

  return errors;
}
