# Sección "Destacados" en el home — diseño

## Contexto

El home hoy es 100% texto hasta que el visitante hace click en una categoría:
Hero → Sobre mí (texto) → Índice de 4 filas (texto, con miniaturas que solo
aparecen al hacer hover en desktop, invisibles en mobile) → Contacto. No hay
ningún preview visual del trabajo en la primera pantalla ni en el scroll
inicial. Para un portfolio que se va a usar para conseguir trabajo, eso es un
hueco: la primera impresión no muestra nada del trabajo en sí.

## Objetivo

Agregar una sección "Destacados" entre Sobre mí y el Índice de categorías,
con una selección curada y fija de piezas que representen el rango completo
del trabajo (Motion, 3D, Gráfica, Web) más un diferencial de código en vivo,
en un formato visualmente fuerte (carrusel deslizable), sin agregar
dependencias nuevas ni reconstruir el sistema de modales existente.

## Contenido — selección fija en código

Cinco piezas, una por categoría más un bonus:

1. **Feedback Ritual** (Motion) — `touchDesignerAssets.feedbackRitual`, loop
   de `/images/loops/feedback-ritual.mp4` con su poster, ya optimizado.
2. **Golden Faces** (3D) — `blenderAssets.goldenFaces`, imagen estática
   `/images/blender/golden-faces/golden-1.png`.
3. **Blastkick** (Gráfica) — `flyerAssets.blastkick`, imagen estática
   `/images/flyers/blastkick/blastkick_preview.png`.
4. **Tamara González** (Web) — `webProjectAssets.tamara`, screenshot
   `/images/previews/screenshot_tamaraportfolio.webp`, con badge "en vivo"
   (ya está en producción, `previewUrl` apunta al sitio real).
5. **Enjambre 145** (Lab generativo, bonus) — pieza `enjambre` de
   `src/lab/pieces/`, renderizada en vivo con `GenerativeCanvas` (no una
   imagen). Es el diferencial que conecta directo con el ángulo
   "developer": código corriendo en el navegador, no un asset estático.

La selección queda hardcodeada como un array en un nuevo archivo
`src/showcaseContent.js` (o dentro de `siteContent.i18n.js` si el volumen de
texto por locale lo justifica — a decidir en el plan de implementación).
Cada entrada normalizada:

```js
{
  id: "feedback-ritual",
  category: "motion",        // motion | 3d | grafica | web | lab
  categorySlug: "motion",     // ruta a la que navega el click
  media: { type: "video" | "image" | "generative", src, pieceId },
  title: { es, en, pt },
  description: { es, en, pt },
}
```

(La forma exacta de i18n —objeto por idioma vs. reusar el patrón de
`locales.es/en/pt` existente— se resuelve en el plan, siguiendo la
convención que ya usa el resto del sitio.)

## Componente: `ShowcaseCarousel.jsx`

- Recibe la lista de 5 entradas ya resueltas al idioma activo.
- Cada card es un `<Link to={"/" + categorySlug}>` — click navega a la
  categoría correspondiente. No abre modal: las 5 piezas vienen de
  estructuras de datos distintas (loop, render, flyer, proyecto web, pieza
  generativa) y adaptar `DetailModal` a las cinco sería reconstruir un
  sistema que ya funciona bien para la vista por categoría.
- Media de la card:
  - `type: "image"` / `"video"` → reusa `MediaAsset` tal cual existe hoy
    (lazy load, poster, pausa fuera de viewport, todo ya construido).
  - `type: "generative"` → renderiza el `GenerativeCanvas` de la pieza
    (`src/lab/pieces/`), heredando su modo estático para
    `prefers-reduced-motion` y su PRNG con semilla ya existentes. No se
    escribe lógica de animación nueva.
- Debajo de la media: tag de categoría (mono, chico, mismo estilo que el
  resto del sitio), título, una línea de descripción.

## Formato visual: carrusel horizontal

- Contenedor con `scroll-snap-type: x mandatory` / `scroll-snap-align` por
  card — scroll táctil nativo en mobile, sin librería nueva.
- Cards grandes, aspect ratio ~4:3, para que la media domine.
- En desktop, botones prev/next con flecha, mismo lenguaje visual que ya usa
  `DetailModal` para navegar entre slides (`handlePrev`/`handleNext`,
  aria-label "Previous"/"Next" → acá en español "Anterior"/"Siguiente" +
  equivalentes en las otras dos locales). No dependen de que el usuario sepa
  hacer scroll horizontal con el trackpad.

## Integración en Home.jsx

Nueva `<section id="showcase">` entre `#about` y `#index`. Renumeración de
`SectionHead`: Sobre mí sigue 01, Destacados pasa a 02, Índice a 03,
Contacto a 04. Sin entrada nueva en la nav superior — se descubre en el
scroll natural, igual que pasa hoy con "Sobre mí" (que tampoco tiene botón
propio más allá del que ya existe).

Label de sección: "Destacados" / "Selected Work" / "Destaques", siguiendo el
patrón i18n ya usado para "Sobre mí"/"Índice"/"Contacto" en las tres
locales.

## Fuera de alcance

- No se toca el panel de `/admin`: la selección queda fija en código (ya
  decidido — no vale la pena el panel nuevo para algo que no cambia seguido).
- No se agrega la sección a la nav superior.
- No se adapta `DetailModal` a las cinco estructuras de datos distintas.
- No se agregan librerías de carrusel — todo con CSS scroll-snap nativo.

## Testing

- Build y lint limpios.
- Verificado en desktop (botones prev/next, hover) y mobile (swipe táctil)
  en el navegador real, no solo con medidas de layout.
- Verificado con `prefers-reduced-motion: reduce` activo, para confirmar que
  la card de Enjambre 145 cae a su frame estático en vez de animar.
- Verificado que las cards con video (Feedback Ritual) se pausan fuera de
  viewport, reusando el comportamiento ya probado de `MediaAsset`.
