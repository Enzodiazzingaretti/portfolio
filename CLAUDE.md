# kexxy-portfolio — contexto para Claude Code

Portfolio de Enzo Diaz Zingaretti (Kexxy). React 19 + Vite + Tailwind + three.js.
Deploy en Vercel. Panel de administración propio en `/admin` con API serverless.

**Rama activa: `redesign-minimal`.** `main` tiene la versión vieja (scroll largo de
9 secciones). El hero ya está calibrado en GPU real (2026-08-10) y no queda nada
bloqueando el merge, pero **todavía no se verificó en producción**.

---

## 1. Cómo levantarlo

```
abrir-local.bat          # limpia locks de git, instala si falta, arranca Vite y abre el navegador
npm run dev              # equivalente manual, http://localhost:5173
npm run build
npm run lint             # limpio salvo 2 warnings preexistentes en src/admin/ReorderableList.jsx
```

---

## 2. Qué se rehizo en esta rama

### 2.1 De 9 secciones a 4 categorías con rutas propias

Antes: una sola página con scroll de nueve secciones apiladas (about, web,
motion, 3D, flyers, logos, arquitectura, lab, contacto). Se hacía interminable.

Ahora: **hero + índice de 4 filas**, y una ruta por disciplina.

| Ruta       | Categoría | Agrupa                          |
|------------|-----------|---------------------------------|
| `/`        | Home      | Hero three.js + índice          |
| `/motion`  | MOTION    | TouchDesigner + Lab generativo  |
| `/3d`      | 3D        | Blender + Arquitectura          |
| `/grafica` | GRÁFICA   | Flyers + Logos                  |
| `/web`     | WEB       | Proyectos web                   |
| `/admin`   | —         | Panel (lazy, chunk aparte)      |

About y Contacto dejaron de ser secciones numeradas: son un panel lateral
(`InfoPanel`) que se abre desde cualquier ruta.

### 2.2 Archivos nuevos

```
src/main.jsx                      react-router (BrowserRouter + Routes)
src/layout/Shell.jsx              shell persistente: fondo, barra, paneles, <Outlet>
src/routes/Home.jsx               hero + índice
src/routes/CategoryPage.jsx       página de categoría, 4 layouts de grilla
src/categories.js                 mapeo 9 secciones -> 4 categorías + normalizadores
src/hooks/useSiteContent.js       idioma + content.json (extraído del App.jsx viejo)
src/components/CategoryIndex.jsx  las 4 filas del índice
src/components/InfoPanel.jsx      about / contacto
src/components/HeroBackdrop.jsx   fondo three.js persistente y su ciclado
src/components/LabGrid.jsx        el lab sin la envoltura de sección
src/components/AsciiPass.js       post-proceso ASCII
```

Lo viejo se movió a `archive/scroll-largo/` (App.jsx, Navbar, SideNav,
SectionHeading, CellularDivider, GlobalFX, HudOverlay, RenderCarousel,
MotionCard, AboutSection, ContactSection, hooks de scroll, voronoi).
No está borrado por si hace falta recuperar algo.

### 2.3 Decisiones no obvias

**El fondo WebGL vive en el Shell, fuera de `<Routes>`.** Al navegar entre
categorías no se recrea el contexto: se pausa el `requestAnimationFrame`
(`paused` en `HeroThreeBackground`, vía ref para no reconstruir la escena) y se
atenúa por CSS (`.hero-backdrop--dim`). Cero GPU mientras se scrollean decenas
de `.mp4`, sin el coste de reinicializar three.js en cada ruta.

**La grilla de obra es masonry por columnas CSS**, no grid. Las piezas
verticales rompían la fila y dejaban huecos enormes. Efecto secundario: el
orden es por columna, no por fila — por eso las tarjetas no llevan número
visible (leería 01, 03, 05 de izquierda a derecha). Llevan una barra roja.

**`MediaAsset` usa `preload="metadata"`.** Con `none`, los `.mp4` usados como
portada salían en negro hasta entrar en viewport.

**`siteContent.i18n.js`**: `sections` se reemplazó por `categories` y `nav`
ahora apunta a rutas. Las claves de los arrays de obra (`blenderWorks`,
`flyers`, `logos`, `espacios`, `touchDesignerLoops`, `webProjects`,
`labPieces`) **no cambiaron**, así que el panel de admin sigue funcionando
igual. Traducciones completas en es / en / pt.

**`vercel.json`** reescribe todo a `index.html` menos `api/`, `images/`,
`assets/`, `content.json` y favicon. Sin eso las rutas dan 404 en recarga.

---

## 3. El hero: filtro ASCII + enjambre

Calibrado el 2026-08-10 mirándolo en GPU real, no ya sobre capturas de un
render por software. Los valores están fijados en el código.

### 3.1 Cómo funciona

`src/components/AsciiPass.js`. La escena se dibuja a un `WebGLRenderTarget` y
un quad de pantalla completa la reescribe como grilla de caracteres: cada celda
promedia la luminancia de su región con nueve taps y elige un glifo de un atlas
generado en runtime sobre un canvas 2D. El ASCII **se suma** sobre la escena
atenuada (`uSceneKeep`), no la reemplaza.

El ciclado de las tres escenas (sculpture / particles / organic) se mantiene, a
14s, sin selector manual visible.

### 3.2 Niveles por escena, no una sola curva

`uFloor` es el **punto de negro** y `uGain` el **punto de blanco**, los dos en
unidades de luminancia, y el recorte va **antes** de la curva `pow(x, 0.62)`.
Aplicarlo después comprimía el interior de la escultura —que ocupa un rango
estrecho, 0.27 a 0.60— dentro de los últimos cuatro glifos de la rampa: leía
como una mancha llena, no como una forma.

Los tres rangos medidos sobre el render target no se parecen en nada, así que
cada escena tiene los suyos (`ASCII_GAIN` / `ASCII_FLOOR` en
`HeroThreeBackground.jsx`):

| Escena | gain | floor | luminancia por celda |
|--------|------|-------|----------------------|
| sculpture | 3.2 | 0.29 | p5 0.27 → max 0.60 |
| particles | 1.1 | 0.30 | p50 0.33, max 0.97 |
| organic   | 9.0 | 0.01 | p50 0.02, max 0.28 |

En compact el enjambre tiene 6.000 puntos en vez de 16.000 y más chicos: la
luminancia máxima por celda cae de 0.97 a 0.11 y el punto de negro de desktop
lo borra entero. De ahí `ASCII_LEVELS_COMPACT` (particles: gain 12, floor
0.006). La escultura y las hebras son la misma geometría en las dos
resoluciones y comparten valores.

> [!warning] Si cambia el brillo de una escena hay que volver a medir
> Los números salen de leer el render target con `readRenderTargetPixels` y
> mirar el histograma de glifos, no de elegir a ojo. Tocar el material de una
> escena (color, opacidad, cantidad de puntos) invalida sus niveles.

### 3.3 Cinco trampas que ya se resolvieron — no las repitas

1. **Lineal vs sRGB.** El render target guarda valores lineales y el canvas los
   interpreta como sRGB. Escribirlos crudos hundía el hero a negro absoluto.
   Hay un `linearToSRGB()` en el fragment shader.

2. **La escena de abajo se muestrea a resolución plena.** `uSceneKeep` reusaba
   el promedio por celda, así que lo que quedaba debajo de los caracteres era
   una versión cuantizada en bloques del tamaño de celda — el orbe perdía la
   forma, que era justo lo que `uSceneKeep` venía a salvar. Hay un tap aparte
   (`srcFull`) para eso.

3. **El plano de glow era un rectángulo de color plano.** A ojo desnudo un wash
   invisible; a través del filtro, sus cuatro bordes duros se dibujaban como
   una pared de caracteres con esquinas rectas, encima de la barra y del
   titular. Ahora tiene caída radial.

4. **La máscara de legibilidad atenúa la tinta, no la densidad.** Multiplicando
   la densidad, el borde caía escalón por escalón de la rampa y se veía como
   una pared recta al costado del titular. Atenuando el color, los caracteres
   se apagan sin cambiar de forma.

5. **La máscara depende del breakpoint.** `uMaskX` y `uMaskTop` son uniforms
   porque la composición cambia: en desktop el titular ocupa una columna a la
   izquierda; en mobile todo el texto es de ancho completo y apilado, y hay que
   bajar el corte de arriba hasta pasar la línea de disponibilidad. Se setean
   con `ascii.setMask()` desde `HeroThreeBackground.jsx`.

También: nueve taps por celda (no uno al centro) para que las partículas finas
no parpadeen, y rampa de 14 caracteres porque con 10 los degradados se cortaban
en parches planos. Y la barra del home volvió a tener un velo mínimo
(`.shell-bar--home`): sin nada debajo, la nav se pierde entre los caracteres.

### 3.4 El enjambre y el cursor

`createParticleSwarm()` en `HeroThreeBackground.jsx`. 16.000 partículas (6.000
en compact) movidas enteras en el vertex shader: órbita, respiración y reacción
al cursor.

**El cursor se proyecta con la cámara real** (`projectPointer`), no con dos
constantes. Antes se estimaba con `mouse.x * 5.8` y `mouse.y * 3.6`, que son el
ancho y el alto visibles a esa distancia **solo en 16:10**; en cualquier otra
relación de aspecto el punto de influencia caía corrido y el enjambre
reaccionaba a un palmo del puntero. Verificado: el centro de influencia
reproyecta sobre el cursor con error de 0 px.

El radio y el empuje son cortos a propósito (gaussiana `exp(-d*d*5.0)`, radial
0.42, tangencial 0.30). Con la campana ancha de antes el hueco medía un tercio
de pantalla. Lo que hace legible la reacción a través del filtro no es el
desplazamiento sino el **tamaño**: más luz por celda es lo único que el ASCII
traduce, de ahí que el punto crezca 3.4x.

**Táctil.** En compact hay `touchstart` / `touchmove` / `touchend` (passive, no
bloquean el scroll). `uPointerAmp` amortigua la entrada y la salida: sube al
apoyar y vuelve a 0 en ~1s al soltar, si no el hueco queda clavado donde estuvo
el dedo. Arranca en 0, así que el enjambre no nace con la mordida puesta en
medio de la pantalla.

### 3.5 Handle de calibración en dev

Solo en dev, no viaja al build (`import.meta.env.DEV` en
`HeroThreeBackground.jsx`):

```js
__ascii.ascii.setSceneKeep(0.7)  // cuánta escena queda debajo (actual 0.42)
__ascii.ascii.setMix(0.6)        // intensidad de los caracteres (actual 1)
__ascii.ascii.setCell(12)        // celda en px CSS (11 desktop / 9 compact)
__ascii.ascii.setGain(4)         // punto de blanco
__ascii.ascii.setFloor(0.05)     // punto de negro
__ascii.ascii.setMask([0.16, 0.56], [0.91, 0.76])  // bordes de la máscara
```

### 3.6 Riesgo de rendimiento no medido

El pase hace 10 muestras de textura por píxel a resolución completa (9 para el
promedio de celda, 1 para la escena de abajo). En una pantalla 1440×900 a dpr 2
son ~52M fetches por frame. No se midió en GPU real. Si hay caídas de
framerate, la optimización correcta es dos pases: primero un downsample a
resolución de celda, después una sola muestra.

## 3bis. Portadas de grilla (`/images/loops/`)

La grilla usaba `slides[0]` como portada: el MP4 original, entero, autoreproduciendo.
`/motion` transfería **20 MB** (un solo archivo pesaba 28,7 MB). Ahora cada portada de
video tiene una versión liviana con su poster en `public/images/loops/`, y el original
queda para el modal. Medido después: **3,6 MB scrolleando toda la página, 600 KB sin
scrollear**.

Convención: `slug.mp4` + `slug-poster.jpg`. `MediaAsset` deriva el poster solo para esa
carpeta —fuera de ahí sería un 404 por video— y con poster usa `preload="none"`, así no
baja un byte hasta que el tile entra en viewport.

Para regenerarlas hace falta un ffmpeg con `h264_qsv`. En esta notebook está el que trae
Krita: `C:\Program Files\Krita (x64)\bin\ffmpeg.exe` (no tiene libx264, sí encoder por
hardware de Intel).

```
ffmpeg -i ORIGINAL.mp4 -t 8 -vf "scale=-2:'min(640,ih)'" -r 25 \
       -c:v h264_qsv -global_quality 30 -an -movflags +faststart loops/slug.mp4
ffmpeg -ss 5 -i ORIGINAL.mp4 -frames:v 1 -vf "scale=-2:'min(640,ih)'" \
       -c:v mjpeg -q:v 5 loops/slug-poster.jpg
```

> [!warning] `public/content.json` pisa el array entero en español
> Los `thumbnail` se agregaron en `siteContent.i18n.js` **y** en `content.json`. Si solo
> se toca el primero, en español no se ve el cambio: `useSiteContent` hace
> `editable.touchDesignerLoops ?? base.touchDesignerLoops`, o sea reemplazo completo, no
> merge. Vale para cualquier campo de las listas de obra.

---

## 4. Quirks del entorno

- **Locks huérfanos de git.** Quedaron `.git/index.lock` y `.git/HEAD.lock` de
  una sesión anterior y bloquean cualquier commit. `abrir-local.bat` los borra
  al arrancar. Si un commit falla con "Another git process seems to be
  running", es esto.
- **Line endings.** El repo está en CRLF; conviene `git config core.autocrlf true`
  para que `git status` no muestre los 99 archivos como modificados.
- **`dist/`** está en `.gitignore` (igual que `.claude/`); el build real lo hace
  Vercel. La carpeta local que quedó de antes es basura, no la mires.

---

## 5. Historial de la rama

```
8e9e06c  refactor: hero + indice de 4 categorias en rutas propias
319bcfe  feat: filtro ASCII y enjambre reactivo en el hero + handover
```

La calibración del hero (2026-08-10) está en el working tree **sin commitear**:

```
M  src/components/AsciiPass.js       niveles, srcFull, mascara por uniform
M  src/components/HeroThreeBackground.jsx  glow radial, projectPointer, tactil
M  src/index.css                     velo de la barra, halo en la linea de estado
M  src/layout/Shell.jsx              arregla el selector de idioma (ver abajo)
```

**El selector de idioma estaba roto** y no tiene nada que ver con el hero: se
encontró probando. `Shell.jsx` le pasaba `onLanguageChange` a `LanguageSelector`,
que espera `onChange`, así que cada clic en ES/EN/PT tiraba
`TypeError: onChange is not a function` y el sitio nunca cambiaba de idioma.
Corregido y verificado — el sitio es trilingüe otra vez.

---

## 6. Auditoría del 2026-08-10 — lo que se arregló

Todo verificado en el navegador, no inferido del código.

**El modal de obra no se veía.** `.cat-page` tiene `animation: catEnter … both`, y el
`transform` retenido la convertía en bloque contenedor: el `position: fixed` del modal
se resolvía contra la página (1871 px de alto) y el contenido quedaba centrado fuera de
pantalla, con `body{overflow:hidden}` impidiendo llegar. Encima su `z-index: var(--z-content)`
creaba contexto de apilado y dejaba al modal debajo de la barra. En mobile no había ESC
y el visitante quedaba trabado. **`DetailModal` ahora va por `createPortal` a `<body>`**:
resuelve las dos causas y lo inmuniza contra cualquier transform futuro.

**`/admin` se usaba sin cursor.** La regla global `cursor: none !important` escondía el
del sistema en todo el documento, pero `CustomCursor` vive en el `Shell` y `/admin` se
monta fuera. Ahora la regla cuelga de `.has-custom-cursor`, clase que pone y saca el
propio componente.

**El modal descargaba el media dos veces.** Renderizaba el árbol mobile y el desktop,
escondiendo uno con `md:hidden`; cada uno montaba su `<video>`. Ahora elige uno en JS
(`useEsDesktop`).

**`viewer.sectionLabel` nunca se seteaba** — el rótulo del modal era un punto rojo sin
texto. Lo pasa `CategoryPage.open()` con el título del grupo.

**Contraste.** 24 elementos del home estaban debajo de WCAG AA, con ratios de 2,1 a 2,5
sobre un mínimo de 4,5 (blancos al 25–34 % de alfa en 9–10 px). Quedan 0. La regla:
sobre `#050505`, alfa 0,45 da 4,5:1 — ese es el piso para texto chico.

**Navegación en mobile.** `.shell-nav` era `display:none` y no había forma de saltar
entre categorías sin volver al home. Ahora baja a una segunda fila de la barra, solo
fuera del home.

**SEO.** `og:image` declaraba 1200×630 apuntando a un archivo de 1024×1024 (la tarjeta
social salía recortada): se generó `og-card.jpg` con el tamaño real. Se agregaron
`canonical`, `theme-color`, JSON-LD de `Person`, `robots.txt` y `sitemap.xml` —los dos
últimos exceptuados del rewrite en `vercel.json`, si no Vercel los servía como
`index.html`—. Las fuentes de Google dejaron de bloquear el render (`media="print"` +
`onload`). Y las URLs inexistentes muestran un 404 real con `noindex` en vez de redirigir
al home con 200.

> [!note] Lo que sigue pendiente de SEO
> Es una SPA sin prerender: el crawler ve el `#root` vacío y ningún título de obra se
> indexa. Los tres idiomas comparten URL, así que EN y PT no existen para Google.
> Arreglarlo de verdad pide prerender o SSG.

**El modal abría en un frame negro.** El video no arrancaba: sin metadata mide 0×0 y el
`IntersectionObserver` con `threshold: 0.25` lo daba por fuera de vista. En el modal ya
no hay observer —no se scrollea— y va con `autoPlay`.

**Estilo del modal.** Pasó de negro sólido a vidrio: scrim con blur, panel translúcido
con borde de 1 px, esquinas de 18 px, filo de luz arriba y controles en pastilla.
