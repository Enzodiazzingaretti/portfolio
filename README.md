# Kexxy Portfolio

**Personal portfolio of Enzo Diaz Zingaretti (Kexxy)** — 3D, motion, generative work and web development, behind a hero rendered as ASCII in real time.

🔗 **[portfolio-kexxy.vercel.app](https://portfolio-kexxy.vercel.app)**

<!-- Poné acá un GIF de 8s del hero. Es lo mejor que tenés y no se ve sin abrir el sitio.
     ![Hero](docs/hero.gif) -->

---

## Highlights

### Real-time ASCII post-processing

The hero scene renders to a Three.js render target, then a full-screen quad rewrites it as a grid of characters. Each cell **averages the luminance of the region it covers** and picks a glyph from an atlas generated at runtime on a 2D canvas.

Two decisions worth the detail:

- **Per-cell averaging instead of a single centre tap.** With one sample, a 3px swarm particle inside a 10px cell appears and disappears depending on where the centre lands — the whole swarm flickers. Averaging kills it.
- **A 14-level density ramp** (`" .,:;~=+*xX#%8@"`). With 10 levels the sculpture's gradients banded into flat patches.

### Generative pieces with a reduced-motion path

`GenerativeCanvas` owns the lifecycle: RAF with a clamped delta, paused when off-viewport and when the tab is hidden, and a **static mode for `prefers-reduced-motion`** that runs the warmup once and leaves a single composed frame — so the piece is still a finished image, not a blank canvas. Seeded PRNG: same seed, same artwork.

### Performance and accessibility as features

- `/motion` grid covers went from **20 MB to 3.6 MB**
- AA contrast across the palette
- Mobile category navigation, SEO metadata, scroll restoration between routes

### Git-backed admin panel

A private `/admin` route edits site content without touching code. Content lives in the repository — the serverless API commits it back through the GitHub API and Vercel redeploys on its own. No database. Session auth with an in-memory per-IP rate limiter.

---

## Stack

| | |
|---|---|
| **Framework** | React + Vite |
| **Routing** | React Router |
| **Styling** | Tailwind CSS |
| **3D / shaders** | Three.js (custom post-processing pass) |
| **Generative** | Canvas 2D, `d3-delaunay`, seeded PRNG |
| **Scroll** | Lenis |
| **Backend** | Vercel serverless functions |
| **Analytics** | Vercel Analytics |

## Running locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
├── components/
│   ├── AsciiPass.js          # Three.js ASCII post-processing pass
│   ├── HeroThreeBackground.jsx
│   ├── GenerativeCanvas.jsx  # RAF lifecycle + reduced-motion static mode
│   ├── DetailModal.jsx · CustomCursor.jsx · Preloader.jsx
│   └── …
├── lab/
│   ├── pieces/               # generative artworks
│   ├── prng.js               # seeded random
│   └── MANIFIESTO.md
├── routes/                   # Home · CategoryPage · NotFound
├── siteContent.i18n.js       # all copy, all languages
└── admin/
api/                          # serverless: login · session · content · upload
```

## Content

Every string lives in `src/siteContent.i18n.js`. Changing copy never means touching a component.

---

<details>
<summary><b>🇦🇷 Español</b></summary>

<br>

**Portfolio personal de Enzo Diaz Zingaretti (Kexxy)** — 3D, motion, obra generativa y desarrollo web, detrás de un hero renderizado como ASCII en tiempo real.

🔗 **[portfolio-kexxy.vercel.app](https://portfolio-kexxy.vercel.app)**

## Lo destacado

### Post-procesado ASCII en tiempo real

La escena del hero se dibuja a un render target de Three.js y después un quad de pantalla completa la reescribe como una grilla de caracteres. Cada celda **promedia la luminancia de la región que cubre** y elige un glifo de un atlas generado en runtime sobre un canvas 2D.

Dos decisiones que valen el detalle:

- **Promedio por celda en vez de un solo tap en el centro.** Con un único muestreo, una partícula de 3px dentro de una celda de 10px aparece y desaparece según dónde caiga el centro — el enjambre entero parpadea. El promedio lo elimina.
- **Rampa de densidad de 14 niveles** (`" .,:;~=+*xX#%8@"`). Con 10, los degradés de la escultura se cortaban en parches planos.

### Piezas generativas con camino para reduced motion

`GenerativeCanvas` maneja el ciclo de vida: RAF con dt clampeado, pausa fuera del viewport y con la pestaña oculta, y **modo estático para `prefers-reduced-motion`** que corre el warmup una sola vez y deja un frame compuesto — así la pieza sigue siendo una imagen terminada y no un canvas en blanco. PRNG con semilla: misma semilla, misma obra.

### Performance y accesibilidad como features

- Las portadas de la grilla de `/motion` bajaron de **20 MB a 3,6 MB**
- Contraste AA en toda la paleta
- Navegación de categorías en mobile, metadata de SEO, restauración del scroll entre rutas

### Panel de administración sobre git

Una ruta privada `/admin` edita el contenido del sitio sin tocar código. El contenido vive en el repositorio — la API serverless lo commitea de vuelta por la API de GitHub y Vercel redeploya solo. Sin base de datos. Sesión con autenticación y rate limiter en memoria por IP.

## Correr en local

```bash
npm install
npm run dev
```

## Contenido

Todos los textos viven en `src/siteContent.i18n.js`. Cambiar una palabra nunca implica tocar un componente.

</details>
