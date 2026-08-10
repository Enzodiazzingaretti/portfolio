# kexxy-portfolio — contexto para Claude Code

Portfolio de Enzo Diaz Zingaretti (Kexxy). React 19 + Vite + Tailwind + three.js.
Deploy en Vercel. Panel de administración propio en `/admin` con API serverless.

**Rama activa: `redesign-minimal`.** `main` tiene la versión vieja (scroll largo de
9 secciones). No mergear hasta que el hero esté calibrado — ver "Pendiente".

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

Lo último que se hizo y **lo único que queda por calibrar**.

### 3.1 Cómo funciona

`src/components/AsciiPass.js`. La escena se dibuja a un `WebGLRenderTarget` y
un quad de pantalla completa la reescribe como grilla de caracteres: cada celda
promedia la luminancia de su región y elige un glifo de un atlas generado en
runtime sobre un canvas 2D.

El ciclado de las tres escenas (sculpture / particles / organic) se mantiene, a
14s, sin selector manual visible.

### 3.2 Cuatro trampas que ya se resolvieron — no las repitas

1. **Lineal vs sRGB.** El render target guarda valores lineales y el canvas los
   interpreta como sRGB. Escribirlos crudos hundía el hero a negro absoluto.
   Hay un `linearToSRGB()` en el fragment shader.

2. **Una sola ganancia no sirve.** La escultura es un sólido brillante y el
   enjambre son puntos dispersos: la misma curva saturaba una en rojo y dejaba
   la otra invisible. Ganancia por escena en `ASCII_GAIN`
   (`HeroThreeBackground.jsx`): sculpture 2.0, particles 3.1, organic 2.4.

3. **El glow additivo del fondo dejaba un piso de luz** que llenaba la pantalla
   entera de caracteres, encima de la barra y del titular. De ahí el umbral
   `uFloor` y la máscara de legibilidad (`maskX`, `maskTop`, `maskBottom`) que
   apaga el ASCII sobre la columna del título y la franja de la nav.

4. **Reemplazar la escena mataba la animación.** Con el ASCII sustituyendo el
   render, el orbe dejaba de leerse como forma y el movimiento de las
   partículas quedaba cuantizado a diez niveles, o sea invisible. Ahora el
   ASCII **se suma** sobre la escena atenuada (`uSceneKeep`).

También: nueve taps por celda (no uno al centro) para que las partículas finas
no parpadeen, y rampa de 14 caracteres porque con 10 los degradados se cortaban
en parches planos.

### 3.3 El enjambre

`createParticleSwarm()` en `HeroThreeBackground.jsx`. 16.000 partículas (6.000
en compact) movidas enteras en el vertex shader: órbita, respiración y reacción
al cursor. Antes eran 560 puntos con un `for` por frame.

Cerca del cursor se apartan radialmente, se enroscan en tangente, **crecen** y
queman. El crecimiento es clave: a través del filtro de caracteres, un
desplazamiento pequeño es invisible; más luz por celda es lo único que el
ASCII traduce de forma legible.

### 3.4 PENDIENTE: calibrar

Enzo tiene que elegir los valores mirándolo en GPU real. Con el dev server
corriendo hay un handle de calibración en vivo (solo en dev, no viaja al build,
está en `HeroThreeBackground.jsx` bajo `import.meta.env.DEV`):

```js
__ascii.ascii.setSceneKeep(0.7)  // cuánta escena queda debajo (actual 0.42)
__ascii.ascii.setMix(0.6)        // intensidad de los caracteres (actual 1)
__ascii.ascii.setCell(12)        // tamaño de celda en px CSS (actual 8)
__ascii.ascii.setGain(4)         // caracteres en las sombras
__ascii.ascii.setFloor(0.05)     // umbral del piso de luz (actual 0.14)
```

Cuando elija, fijar los defaults en `AsciiPass.js` (uniforms) y en `ASCII_GAIN`.

Feedback pendiente de resolver: dijo que el orbe "se ve algo raro" y que no
parecían las animaciones de antes. El cambio a `uSceneKeep` apunta a eso pero
**no está confirmado por él todavía**.

### 3.5 Riesgo de rendimiento no medido

El pase hace 9 muestras de textura por píxel a resolución completa. En una
pantalla 1440×900 a dpr 2 son ~47M fetches por frame. No se midió en GPU real.
Si hay caídas de framerate, la optimización correcta es dos pases: primero un
downsample a resolución de celda, después una sola muestra. Bajaría el coste a
~1 tap por píxel.

---

## 4. Quirks del entorno

- **Locks huérfanos de git.** Quedaron `.git/index.lock` y `.git/HEAD.lock` de
  una sesión anterior y bloquean cualquier commit. `abrir-local.bat` los borra
  al arrancar. Si un commit falla con "Another git process seems to be
  running", es esto.
- **Line endings.** El repo está en CRLF; conviene `git config core.autocrlf true`
  para que `git status` no muestre los 99 archivos como modificados.
- **`dist/`** está versionado y desactualizado; el build real lo hace Vercel.

---

## 5. Historial de la rama

```
8e9e06c  refactor: hero + indice de 4 categorias en rutas propias
```

El trabajo del filtro ASCII y el enjambre está en el working tree **sin
commitear** por los locks de git. Archivos afectados:

```
A  abrir-local.bat
A  src/components/AsciiPass.js
M  src/components/HeroThreeBackground.jsx
M  src/index.css
```
