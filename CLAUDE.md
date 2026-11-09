# kexxy-portfolio — contexto para Claude Code

Portfolio profesional de Enzo Diaz Zingaretti. React 19 + Vite + Tailwind + three.js.
Deploy en Vercel. Panel de administración propio en `/admin` con API serverless.

**Todo vive en `main`** (el rediseño de `redesign-minimal` ya está en producción).
Ojo con las ramas remotas que quedan: el historial de `main` arranca el 2026-08-20
desde cero, así que `admin-panel` y `redesign-minimal` son el único registro de julio
y agosto (sus commits no están en `main`, ni con otro hash). No borrarlas sin que Enzo
lo decida. `tmp/shodnan-capturas` (sus capturas de Shodnan están iguales en `main`;
las de Kexxy se rehicieron) y `claude/portfolio-interactive-sliders-lertja` (mergeada)
sí se pueden borrar sin perder nada.

> [!warning] En español manda `public/content.json`, no `siteContent.i18n.js`
> `useSiteContent` superpone `content.json` (lo que edita `/admin`) sobre los
> defaults del bundle, **solo en español**: `hero`, `about` y `contact` con merge
> profundo (los arrays como `roles` se reemplazan enteros) y las listas de obra
> reemplazadas completas. Un cambio de texto hecho solo en `siteContent.i18n.js`
> no se ve en ES. Pasó el 2026-09-24: el posicionamiento nuevo se veía en EN/PT y
> en español seguía el viejo hasta el 2026-09-27. Todo texto en español se toca
> en los dos archivos.

## Posicionamiento y alias (2026-11)

- **Título: «Motion & 3D Designer»** (`hero.headline`, en inglés en los tres
  idiomas) y las disciplinas en `hero.roles`. Pasa a «Creative AI & Motion
  Designer» recién cuando haya piezas de IA publicadas, y a la par en LinkedIn
  y en los CV. La sección de comerciales con IA no se publica vacía.
- **Nombre visible: «Enzo Zingaretti»** (desde el 2026-11-05, a pedido): el
  `hero.title` (bundle y `content.json`) y `brand` de la barra. Los
  metadatos, el JSON-LD (con `alternateName`), el dominio, los CV y LinkedIn
  siguen con el nombre completo, que es como lo buscan.
- **KEXXY es el alias musical.** Las piezas que lo mencionan se quedan (su
  press kit, su reel, el flyer de DIST b2b RAPTIS), contadas en tercera persona
  como una pieza más; lo que no entra es el vínculo: nada de «mi press kit» ni
  «mis sets», ni el Instagram del alias, ni la consola firmada por KEXXY.
- **Dominio: `enzo-diaz-zingaretti.vercel.app`.** `portfolio-kexxy.vercel.app`
  sigue asignado y redirige con un 308 por host desde `vercel.json`, así los
  links viejos de CV y LinkedIn siguen andando. La raíz tiene su propia regla
  (`"source": "/"`): `/:path*` no la agarraba y el home viejo daba 200.
- **Trabajo seleccionado** (`showcasePicks.js`): reel del caso Sonar, Golden
  Faces y 240 KM/H (desde el 2026-11-07: sin el key visual, para no repetir
  Sonar). Como las tres son verticales o cuadradas, en desktop el escenario
  del showreel va alto (`clamp(32rem, 80svh, 48rem)`). En celular y tablet
  (2026-11-07, «que no se vean los espacios vacíos») toma el formato de cada
  pieza (`--reel-ar`, que `Showreel.jsx` mide al cargarla; tope de 84svh), la
  obra lo llena y el título va encima, sobre `.reel-velo`: una franja con blur
  que se desvanece hacia arriba. Es la única excepción a «sin
  `backdrop-filter` en táctiles» y a «la obra nunca bajo vidrio esmerilado»,
  por pedido explícito. Los sitios y el lab quedan en sus categorías.
- **Sacados por completo el 2026-11-07, a pedido:** Feedback Ritual (loop de
  TouchDesigner) y Glass Skullz (render). Sin archivos en `public/` ni en
  `portfolio-media`; no volver a sumarlos.
- **Comerciales con IA:** grupo `ia` de MOTION, primero, con la lista
  `aiCommercials` (bundle en tres idiomas, `content.json` y `/admin`). Vacía:
  el grupo no se dibuja. Con las primeras piezas publicadas cambian a la par
  el título, LinkedIn, los CV y el trabajo seleccionado.
- **Ficha del visor:** cliente, año, duración, rol, herramientas y estado, solo
  lo que la pieza tiene cargado. Las herramientas salen de los `tags` que
  figuran en `HERRAMIENTAS` (`categories.js`: Blender, Photoshop, After
  Effects, Runway, Kling…) o del grupo (un render es de Blender); el resto de
  los tags queda como disciplinas y formatos. Una pieza con `caseSlug` suma
  «Leer el caso».

## Rediseño «vidrio ahumado» (2026-11)

La capa visual del sitio público es `src/styles/vidrio.css` (va después de
`index.css` y pisa lo que hace falta). Dirección: grafito `#17191D` de fondo
(nunca negro puro), gunmetal `#292C32`, humo `#85858C`, off-white `#E5E3E0` y
rojo `#E52436` solo de acento; para texto chico en rojo, `#FF5A66` (el otro no
llega a AA a 10 px). Titulares en **Anton** (`font-poster`), texto en Inter,
datos en JetBrains Mono. Las letras van en tinta plana, sin cromado (desde el
2026-11-05, a pedido: nombre, títulos de categoría, de caso y de contacto).
Vidrio en tres niveles (fino: barra, chips, botones;
panel: visor, leyendas, marcos; líquido: solo la escultura del hero) y una
regla: **la obra nunca va debajo de vidrio esmerilado**, el vidrio la enmarca.

- **Atmósfera** (`src/fx/Atmosphere.jsx`): capa fija con dos luces y la
  retícula; también escribe `--scroll-k` en `<html>` y maneja la inclinación
  de todo lo que tenga `data-tilt` (un listener delegado; `data-tilt="0.35"`
  baja la intensidad). Sin mouse fino o con movimiento reducido no inclina.
  Desde que el fondo WebGL va en todas las rutas, el lienzo la tapa: queda
  como respaldo si WebGL falla (el lienzo dibuja la misma atmósfera).
- **Fondo y hero** (`src/components/HeroGlass.jsx`, montado por
  `HeroBackdrop` en todas las rutas): las animaciones ASCII en todo el fondo
  y, en el home, el nombre y la escultura de vidrio que las refracta. Ver la
  sección 3.0.
- **Reels** (grupo `reels` de Motion, array `motionReels`): bundle en tres
  idiomas, `content.json` y su lista en `/admin`. Cada reel tiene un loop
  liviano en `/images/loops/reel-<slug>.mp4` (+ `-poster.jpg`, 8 s, 360 px) y
  el reel entero en `/images/reels/<slug>.mp4` (720 px, 30 fps, sin audio). Los
  originales están en el Drive, carpeta «reels portfolio». Un reel de cliente
  entra recién cuando el cliente lo publicó.
- **Componentes del home:** `Showreel`, `ReelsRail` (celulares de vidrio),
  `CategoryIndex` (contorno que se llena + tarjetas que siguen al cursor; sin
  hover, ver «El índice sin hover» más abajo), `CasePosters` (tarjetas en capas) y
  `SectionHead` en `src/fx/Hud.jsx` (título con máscara y el mismo título en
  contorno detrás, con parallax por `animation-timeline: view()` donde existe).
- **El índice sin hover** (celular y tablet; 2026-11-05, a pedido: «más
  grande, dinámico, bello»). Cada fila: número, cuenta y flecha arriba, el
  título a todo el ancho y una tira de fotogramas grandes de borde a borde
  (76vw de alto, tope 380 px), cada uno en su formato (los posters de loops,
  9:16; el resto, el de la sala) y con su rótulo, como una hoja de contactos.
  La fila que cruza el medio de la pantalla (una franja del 2 %) hace de
  hover: se llena el título, el visor se pone rojo y su tira corre; las otras
  quedan quietas bajo un velo (no con opacity: se veía el ASCII a través de la
  obra). La pista tiene tres tandas y corre de un tercio a dos tercios de su
  largo, con margen y no gap para que el loop no salte; la duración sale del
  largo de la tanda (`--ix-dur`), así todas van a ~33 px/s. Las filas alternan
  el sentido y el scroll las empuja (`view()`). Los fotogramas se montan 700 px
  antes de que llegue la fila y sin `lazy`: con lazy bajaban recién al entrar
  a la tira y aparecían en blanco. Los posters de loops miden 360 px de ancho:
  por eso la tira no pasa de ~190 px por fotograma vertical.
- **Transición entre rutas:** `src/fx/SignalCut.jsx` (paneles de vidrio y una
  línea roja, ~0,75 s; no corre en la primera carga ni con movimiento reducido).
- **Capturas sin GPU:** `?sinfondo` (solo dev) no monta el WebGL; para filmar el
  fondo existe `window.__glass.anim.film = { t, px, py, escena }` (solo dev),
  que fija tiempo, puntero y escena ASCII (`sculpture`, `particles` u
  `organic`) cuadro por cuadro. El render por software da ~1 fps.

**Sin adornos genéricos (2026-11-08, a pedido: «sacar las coordenadas y
elementos genéricos»).** Fuera las coordenadas del hero, el chip «SIG.01 · En
vivo», el reloj UTC−3 y el «№ 0xx», las miras y destellos (`Crosshair`,
`Sparkle`, `HudClock` ya no existen en `Hud.jsx`), el «SIG 01/03» y el
timecode del showreel, el «ON AIR» y el «REEL 01» con su punto de grabación
y la línea de escaneo de los reels. Quedan las marcas de visor de la obra (la
regla del marco) y la retícula del fondo. No volver a sumar HUD decorativo.

**Celular: carrusel lateral (2026-11-08, a pedido).** En Motion, Tech y
Gráfica (`cat-page--<slug>`), por debajo de 768 px cada grupo es una fila que
se desliza de costado (`scroll-snap`, la pieza al 82 % y las verticales al
64 %, así asoma la siguiente), sin el número gigante de la sala. Es solo CSS,
al final de `vidrio.css`. 3D y la galería de los casos siguen en columna.

**Paletas y selector de color (2026-11-08, a pedido).** Todos los colores
salen de canales «R G B» en `:root` de `vidrio.css` y se usan como
`rgb(var(--red-ch) / 0.4)`: `--bg-ch` (fondo), `--deep-ch`, `--g820-ch`,
`--glass-ch`, `--gun-ch`, `--smoke-ch`, `--paper-ch` (texto), `--fg-ch` (el
«blanco» de bordes, brillos y `text-white/xx`: tinta en las claras),
`--red-ch` (acento) con `--red-hi-ch` (texto chico), `--red-deep-ch`,
`--red2-ch`; `--on-accent` es el texto sobre el acento. El Tailwind también
(`white`, `ink`, `paper`, `raveRed`, `kexxy`, `surface`…). **Un color nuevo va
por canal, nunca en hex ni rgba fijo**, o rompe las paletas claras. El lienzo
lee los canales (`canal()` en `HeroGlass.jsx`), rehace reflejos y nombre si
cambia `data-paleta`, y con `--claro: 1` mezcla en vez de sumar (tinta sobre
papel). Las paletas viven en `src/styles/paletas.css` y la lista en
`src/paletas.js`: oscuras (Grafito, Brasa, Cobalto, Ultravioleta, Ácido),
monocromas (Hueso, Tinta, Acero) y claras (Papel, Papel y tinta, Hormigón).
El visitante elige en el selector de la barra (`ColorSelector.jsx`, al lado
del idioma); queda en `localStorage` y un link con `?paleta=<id>` la fija. El
cambio va con un fundido (View Transitions). Por defecto, Grafito. Enzo va a
quedarse con las mejores: sacar una es borrar su bloque y su línea.

**Videos en alta (2026-11-07, a pedido: «se ve en muy mala calidad el reel»).**
Los videos de `public/` son livianos (360–720 px, poca tasa): el reel del home era
un loop de 360 px estirado a ~1200 y recortado de vertical a horizontal. Ahora cada
video tiene su versión en alta en un proyecto aparte, **`portfolio-media`** (repo y
deploy propios en Vercel, sin build), para que el repo del sitio no cargue cientos
de MB: `<MEDIA_BASE>/1080/<camino>` (lado corto hasta 1080, CRF 19) y
`<MEDIA_BASE>/720/<camino>` (celular, CRF 21), más `1080/<camino>-poster.jpg`, con
el mismo camino que la versión liviana. `src/media.js` tiene la base
(`VITE_MEDIA_BASE` la pisa) y la lista `VIDEOS_HQ`; `MediaAsset` usa la alta para
todo video de la lista y elige el tamaño por lo que mide en pantalla (720 si el lado
corto por el dpr, con tope 2, no pasa de 760 px; si no, 1080) y, si no carga, vuelve a
la liviana del repo, que queda como respaldo. Salen de los originales del Drive
(`reels portfolio`, `PORTFOLIO/01_3D-Renders`, `02_Arquitectura-Escenografia`,
`03_Visuales-Generativo`, `PROYECTOS/…`), identificados cuadro por cuadro; los
recortes y el arranque de cada loop se midieron contra los originales. Sin
original encontrado (quedan livianos): `calvarian-animation` y su loop,
`patrullero-1` y `rathermodular-2`. **Para sumar un video:** encodear los dos
tamaños y el poster con el mismo camino en `portfolio-media`, pushear ahí y sumar
el camino a `VIDEOS_HQ`; el liviano va igual en `public/`. Los loops de 8 s van
más livianos que las piezas enteras (CRF 23 con tope de 2,5 Mbps en 1080; CRF 24 y
1,2 Mbps en 720): con el tope de 6 Mbps pesaban 6,6 MB cada uno y /motion bajaba 46 MB
scrolleando entera. Medido el 2026-11-07 en producción, scrolleando toda la página:
home 5,8 MB, /motion 8,9, /tech 11,2, /3d 5,2 (antes de los videos en alta, /motion
3,6); sin scrollear, 1,5 a 2 MB como antes.

**El showreel del home muestra la obra entera** (`object-fit: contain`), corrida
a la derecha con el título a la izquierda y, detrás, la misma imagen desenfocada;
en el celular, la obra arriba y el título debajo. Antes recortaba las piezas
verticales a 16:9.

**Idioma inicial:** sin elección guardada, sale del navegador (`es`/`en`/`pt`); si
ninguno coincide, inglés. El portfolio apunta a trabajo remoto.

**`repoUrl`** en un proyecto web dibuja el botón «Código» en la tarjeta y en el
modal. Los repos enlazados son públicos y tienen README bilingüe.

**Overlays y Lenis.** Con un overlay abierto Lenis cancela la rueda y el touch
(y el modal de obra ni siquiera lo detiene). Todo contenedor que tenga que
scrollear adentro de un overlay lleva `data-lenis-prevent`: `.info-panel`, la
raíz de `DetailModal` y `.konsole-body`. Un overlay nuevo, también.

**CV.** `public/cv/Enzo-Diaz-Zingaretti-CV-{ES,EN,PT}.pdf` (el de Creative
Technologist). Cada idioma apunta al suyo con `contact.cv` en el bundle, y lo
usan el hero y Contacto. `vercel.json` excluye `cv/` del rewrite: sin eso el PDF
se servía como `index.html`. Salen de los .docx del Drive
(`CV_Enzo_Diaz_Zingaretti_{Diseno_ES,Design_EN,Design_PT}.docx`), exportados con
LibreOffice 26.2. El LibreOffice 24.2 de las sesiones en la nube arma la página
distinto (más interlineado, la columna gris no llega al pie), así que para
cambiar una línea se edita el PDF y, aparte, el .docx.

**`about.facts`** (experiencia, idiomas, zona horaria, disponibilidad,
herramientas) vive solo en el bundle: `content.json` no lo define y el merge
profundo lo conserva también en español.

**Carga (2026-09-28).** El preloader sale una vez por sesión y nunca en un
link directo a una categoría (`sessionStorage`, flag `kexxy-preloaded`).
three.js se monta recién la primera vez que se pisa el home. Las miniaturas de
avance del índice se montan al primer hover. El hero se pausa al salir de la
pantalla (por scroll, no por IntersectionObserver: el lienzo es `fixed`) y va a
60 fps en desktop. Las imágenes de obra tienen como máximo 1600 px de lado, el
mismo tope que aplica `/admin` al subir: si agregás una a mano, que no lo pase.
`vercel.json` pone caché inmutable a `/assets` y un día a `/images`.

**Ocultos con `enabled: false`** (en el bundle y en `content.json`): Aurora /
Cecilia Hospedajes, hasta que esté online; New Metals, mientras tenga datos de
muestra y noindex; y Screaming Head, cuya portada sale casi negra. Golden Faces
y Faces Alternative son una sola ficha, igual que NCY I y II (que desde el
2026-10-17 se llama Chrome Grotesque, como figura en Contra).

**Casos de estudio (2026-09-28).** `/<categoría>/<slug>` (los sitios en `/tech`,
la campaña de Sonar en `/grafica`): `src/routes/CasePage.jsx`, que
entra lazy con sus textos. Título, bajada y orden en `siteContent.i18n.js` →
`cases` (tres idiomas; el home los lista en «Casos» y las tarjetas de `/tech`
llevan a cada uno). La categoría de cada caso va en `CASE_ASSETS` y, para el
home, en `CASE_COVERS` (`caseHref()` arma la ruta; un test compara las dos). El cuerpo en `src/cases/{es,en,pt}.js`, con bloques `text`,
`decisions`, `list`, `stats` y `figure`; imágenes, año y stack en
`src/cases/index.js` (`CASE_ASSETS`, con el ancho y alto reales de cada
imagen). Un proyecto web se enlaza con `caseSlug` en `webProjectAssets` **y** en
`content.json` (el admin conserva el campo al editar); un caso de otra
categoría, con `caseSlug` en sus piezas (las de Sonar: campaña, logo y
reels), y el visor suma «Leer el caso». `tests/cases.test.js`
falla si un idioma cuenta un caso con otra estructura, si falta una imagen o
si no mide lo declarado. Regla del contenido: solo hechos registrados en la
bóveda o en el repo; ninguna cifra que no se haya medido. Para sumar un caso:
teaser en `cases` (tres idiomas), cuerpo en los tres archivos, assets,
`caseSlug` en el proyecto o las piezas (bundle y `content.json`), la
categoría en `CASE_COVERS`, capturas en `public/images/casos/<slug>/` (máx.
1600 px; un caso puede usar las imágenes que ya tienen sus piezas) y la URL en
`sitemap.xml`.

**Casos:** `sonar-produce` (desde el 2026-11-05, primero de la lista; solo con
lo registrado en las descripciones de las piezas y en el manual de marca),
`portfolio`, `andino-seguros`, `tamara-gonzalez` y `press-kits`. El de CTRL.Z pasó a ser un capítulo de `press-kits` (Kexxy,
CTRL.Z, Gabi Raíz, Martina Høbelar y, desde el 2026-11-02, Shodnan Ref en una
sola tarjeta) y `/web/ctrl-z` redirige con un 308 desde `vercel.json`, por si
ese link quedó compartido (desde 2026-11 va directo a `/tech/press-kits`). Las capturas de Kexxy (`portadas`, `kexxy-mobile` y
`previews/screenshot_presskits`) se rehicieron el 2026-11-02 desde el sitio
publicado: las del 23/10 eran de una versión previa (logo en cromo, «zine» y
sellos de shows que ya no están). Si un press kit cambia, se vuelve a capturar.
Una serie declara `sites` en `CASE_ASSETS` en vez de `site`: un botón por sitio.
El repo de Andino es privado, así que su tarjeta y su caso van sin «Código»
(`repoUrl` y `repo` en `null`). Las capturas del panel de Andino son con datos
de prueba: se levantó el sitio en local contra una base simulada; los datos
reales de clientes no salen del panel.

**El lienzo del hero en pantallas HiDPI (2026-09-28).** `resize()` llama a
`renderer.setSize(w, h, false)`, que no toca el estilo: el canvas se mostraba a
su tamaño en píxeles de dispositivo, así que con dpr 2 (Retina) medía el doble
del viewport y el hero salía ampliado y recortado. Ahora lleva `width` y
`height` al 100 %. Con dpr 1, donde se calibró, no se notaba; apareció
capturando a 2x.

**Campañas (2026-10-23).** Gráfica tiene un grupo nuevo, `campanas`, antes de
flyers: un cliente con varias piezas (key visual, motion, placas, manual) va
ahí para que no se diluya entre flyers sueltos. El array es `campaigns`, en el
bundle (tres idiomas, assets en `campaignAssets`) **y** en `content.json`, con
su lista en `/admin`. Hoy tiene Sonar Produce (SONAR 001): las imágenes salen
de `PROYECTOS/Sonar-Produce/compartido-con-cliente` en el Drive (las versiones
aprobadas) a `public/images/campanas/sonar/`.

**Un caso, una tarjeta (2026-11-07, a pedido: «todo gráfica es Sonar»).** En
Gráfica, las piezas de `campaigns` que comparten `caseSlug` se juntan en una
sola tarjeta (`porCaso` en `categories.js`, `agruparPorCaso`) con el texto del
caso, la cuenta de piezas y un link al caso en vez del visor. El caso termina
con «Todas las piezas» (`piezasDelCaso`: todas las categorías, sin repetir, en
la sala y con el visor). En Motion queda solo el reel del caso: los reels del
line-up y de la cuenta regresiva repetían piezas de la campaña y se sacaron.
El logo de Sonar **no se usó**: se sacó la tarjeta de Logos, la página de
versiones del logo del manual (`manual-04`) y su mención en el caso; no volver
a sumarlo. La cuenta regresiva estuvo con `enabled: false`
hasta que Sonar la publicó (del 27 al 30/10); desde el 2026-11-02 está a la
vista, en el bundle y en `content.json` a la vez.

**Canonical por ruta.** `index.html` declara el home como canonical; el `Shell`
lo reescribe con la ruta actual, si no cada categoría y cada caso le decían a
Google que eran el home.

---

## 1. Cómo levantarlo

```
abrir-local.bat          # limpia locks de git, instala si falta, arranca Vite y abre el navegador
npm run dev              # equivalente manual, http://localhost:5173
npm run build
npm run lint             # limpio salvo 2 warnings preexistentes en src/admin/ReorderableList.jsx
npm test                 # vitest: tests/ (contenido en 3 idiomas, casos, auth del admin, categorías)
```

`tests/content.test.js` falla si `content.json` y el bundle se desincronizan
(listas, archivos, hero y Sobre mí en español) o si una pieza apunta a un
archivo que no está en `public/`. Si agregás una obra desde `/admin`, el test
te va a pedir sumarla también en EN y PT del bundle: es a propósito. El CI
(`.github/workflows/ci.yml`) corre lint, tests y build en cada push; no frena
el deploy de Vercel, solo marca el commit.

---

## 2. Qué se rehizo en esta rama

### 2.1 De 9 secciones a 4 categorías con rutas propias

Antes: una sola página con scroll de nueve secciones apiladas (about, web,
motion, 3D, flyers, logos, arquitectura, lab, contacto). Se hacía interminable.

Ahora: **hero + índice de 4 filas**, y una ruta por disciplina.

| Ruta       | Categoría | Agrupa                          |
|------------|-----------|---------------------------------|
| `/`        | Home      | Hero three.js + índice          |
| `/motion`  | MOTION    | Comerciales con IA (oculto vacío) + Reels |
| `/3d`      | 3D        | Blender + Arquitectura          |
| `/grafica` | GRÁFICA   | Campañas + Flyers + Logos       |
| `/tech`    | TECH      | TouchDesigner + Lab + Sitios web |
| `/admin`   | —         | Panel (lazy, chunk aparte)      |

Desde el 2026-11-05 lo técnico va junto en TECH, como diferencial, y MOTION
queda para el motion de clientes: la categoría «WEB» presentaba el portfolio
como el de un desarrollador. `/web` y `/web/<caso>` redirigen con un 308 a
`/tech` desde `vercel.json` (y en la app, `CasoEnTech`, para links viejos).

About y Contacto dejaron de ser secciones numeradas: son un panel lateral
(`InfoPanel`) que se abre desde cualquier ruta.

**La «sala» (2026-11-05, a pedido: «más grandes, menos cuadrado, más
artístico»).** La obra de las categorías no va en grilla pareja: 3D (renders
y arquitectura), Gráfica (campañas, flyers, logos), los loops de
TouchDesigner y los comerciales con IA usan `Sala.jsx` (layouts `sala` y
`sala-loops`), y dónde cuelga cada pieza lo decide `salaPlan.js` (funciones
puras, con `tests/sala.test.js`): de a pares, una grande y una chica
alternando el lado, la chica desfasada; las panorámicas solas; tres del mismo
formato, tríptico. Los renders y las gráficas conservan su formato; los
loops, que son abstractos, salen en formatos distintos (`FORMATOS_LOOP`). Los
reels de /motion van de a tres, grandes y escalonados (de a uno y girados
apenas en el celular), y el lab, cada obra con su tablero al lado.

**Regla del marco (2026-11-05):** la obra va en un rectángulo casi recto
(4 px), entera, con las marcas de un visor de cámara en las esquinas (clase
`visor`, un solo `::after`; al pasar el mouse se cierra y se pone rojo); la
interfaz va en vidrio redondeado. Lo usan la sala, el lab, el showreel del
home y las tarjetas de casos; los rótulos que van encima de la obra se
corren hacia adentro para no pisar las esquinas. Primero se probaron marcos
con forma (arco, hoja, lente): recortaban la pieza, hablaban otro idioma que
el sitio (el arco es de marcas de bienestar y plantillas) y competían con la
obra. No volver a eso.

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

> [!warning] La raíz del Shell recorta con `overflow-x: clip`, no `hidden`
> `overflow-x: hidden` con `overflow-y: visible` hace que el `y` compute a
> `auto`: la raíz (`.shell-root`) quedaba como contenedor de scroll que nunca
> scrollea, y todo lo que mide el scroll estaba congelado sin que se notara:
> los `view()` de `SectionHead`, de la sala y del índice, y los títulos sticky
> de los casos. Se arregló el 2026-11-05. Vale para cualquier ancestro de algo
> con `view()` o `sticky` (`.sala-marco` y `.ix-strip` también van con clip);
> `hidden` queda antes como respaldo para navegadores sin clip.

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

## 3. El hero

### 3.0 Fondo ASCII y escultura de vidrio (desde 2026-11)

`HeroGlass.jsx`. Un solo contexto WebGL en el Shell, en **todas las rutas**
(desde el 2026-11-05): las animaciones con filtro ASCII ocupan todo el fondo y,
en el home, el nombre y la escultura de vidrio van encima y las refractan.

- **Las escenas son las del hero de 2026-08** (`src/fx/asciiScenes.js`:
  escultura, enjambre y hebras, al mismo tamaño), turnándose cada 14 s; cada
  una entra y sale por negro, así el cambio de niveles no se nota. En el hero
  se centran detrás del vidrio; más abajo y en las otras rutas, un poco a la
  derecha.
- **El ASCII va en dos pasos.** La escena se dibuja a px CSS (dpr 1, donde se
  midieron los niveles), un pase chico promedia cada celda con diez muestras
  en una textura de una celda por píxel, y el fondo solo elige el glifo. El
  pase viejo hacía diez muestras por píxel a resolución completa (3.6).
- **Niveles remedidos el 2026-11-05** (en `asciiScenes.js`): el enjambre ya no
  reproduce los de 3.2 (p50 0,05 y no 0,33; con piso 0,30 no salía ni un
  caracter): pasó a ganancia 12 y piso 0,03 (en celular, 16 y 0,02).
- **Máscara de legibilidad** (`src/fx/legibilidad.js`): donde hay texto,
  botones, imágenes o tarjetas (`#main`), los caracteres bajan al 14 % de
  tinta; en los huecos se ven enteros. Se dibuja a 1/8 en coordenadas de
  página, con margen y desenfoque, y se rehace solo cuando cambia el layout
  (`ResizeObserver`, `MutationObserver` de `#main`, ruta, fuentes); el shader
  la corre con el scroll. La barra fija se protege aparte, en coordenadas de
  pantalla. Lo `aria-hidden` no cuenta (el ancla del vidrio y las marcas del
  hero cubren zonas enteras), salvo los renglones del nombre.
- **Costo:** fuera del hero (y en celular) va a 30 cuadros; con un panel o el
  visor abiertos (`body` con `overflow: hidden`) o la pestaña oculta no dibuja;
  con movimiento reducido, un cuadro quieto.
- **Celular (2026-11-05, «se siente trabado»):** el lienzo mide 100lvh y solo
  se reasigna si cambia esa caja: la barra del navegador entra y sale al
  scrollear y antes rehacía lienzo, render targets, nombre y máscara en medio
  del scroll (`useFitLines` también ignora esos `resize`). En táctil va sin
  MSAA, a 1,25 px por px CSS y con el vidrio de menos vértices. **Sin
  `backdrop-filter` en pantallas táctiles** (regla al final de `vidrio.css`):
  cada capa de vidrio esmerilado se volvía a desenfocar en cada cuadro del
  lienzo; ahí el vidrio es un tinte denso. Un vidrio nuevo tiene que verse
  bien sin desenfoque. `--scroll-k` va en `.atmo`, no en `<html>` (en la raíz
  invalidaba el estilo de toda la página por cuadro), y con el lienzo dibujado
  la atmósfera se apaga (`html.fondo-vivo`). La máscara se mide con la página
  quieta, en `requestIdleCallback`. Medido con un scroll de prueba en 390×844:
  hilo principal de 7,6 s a 5,1 s, estilos de 1,1 s a 0,2 s. Un canvas que cambia de tamaño
  (nombre, máscara) se descarta en la GPU antes de volver a subirlo: encima del
  anterior daba `GL_INVALID_VALUE`.

- **El nombre que se ve a través del vidrio es el `<h1>` real.** Cada renglón
  (`[data-glass-type]`) lleva una sonda de línea base (`[data-glass-baseline]`)
  y la escena lo redibuja en una textura con esas posiciones exactas; esa
  textura es el fondo de la escena. El `<h1>` se vuelve transparente recién
  cuando la textura está dibujada (`html.glass-type`): si WebGL falla, se ve el
  texto del DOM. `useFitLines` ajusta el cuerpo de cada renglón al ancho y avisa
  con el evento `hero-layout` para que la escena vuelva a medir. Reajusta
  también en cada `loadingdone` de `document.fonts` (y la escena redibuja el
  atlas de glifos): la hoja de Google Fonts entra asíncrona y `fonts.ready` se
  resolvía antes de registrar Anton, así que con la fuente lenta el nombre
  quedaba dibujado con la tipografía de reemplazo (pasó en producción el
  2026-11-05; se prueba demorando `fonts.gstatic.com` en Playwright).
- **El lugar y el tamaño de la escultura los decide el CSS** (`.vx-orb`, ancla
  `[data-glass-anchor]`): cambiar la composición no toca el JS. Desde el
  2026-11-05 (a pedido) es grande y va a la derecha: hasta 60vh (540 px en
  1440×900), limitada por el lugar que deja el nombre (`--name-w`, que pone
  `useFitLines` junto a `--name-h`), montada un 2 % sobre la última letra y
  corrida hacia la derecha si sobra lugar; en celular y tablet vertical, más
  grande y pasada del borde derecho (el hero recorta en x). `useFitLines`
  esconde el ancla mientras mide si el hero entra en la pantalla: contada,
  crecía cuando el nombre se achicaba y lo seguía achicando. Los dos renglones
  van al mismo cuerpo, el que hace entrar al más largo.
- **Lente de gota:** aumenta en el centro y llega intacta al canto, así lo que
  queda debajo del borde se sigue leyendo, curvado (con la lupa pareja, las
  letras debajo del canto desaparecían). Superficie lisa, filo de luz y un
  contraluz humo detrás del vidrio.
- **La refracción es un shader propio, no `transmission`.** Con
  `MeshPhysicalMaterial` el vidrio muestreaba un mip borroso del fondo y se veía
  lechoso, sin las letras de atrás (con `thickness` alto, además, el rayo se
  corría cientos de píxeles). Ahora el fondo se dibuja primero en un render
  target sin MSAA ni mipmaps y el vidrio lo muestrea corrido según la normal
  en pantalla (con dispersión por canal y efecto lupa), más un reflejo de un
  ambiente propio fotografiado una vez con una `CubeCamera`. Todo sale en sRGB:
  sin tone mapping de three.
- **`dt` con piso en 0.** El timestamp del rAF puede llegar antes que el último
  registro; sin el piso el dt negativo se acumulaba y la escultura se deformaba
  sin límite (amplitud ~390 en vez de 0,2).

### 3.1 a 3.6: el hero ASCII anterior (archivado)

Lo que sigue documenta `HeroThreeBackground` + `AsciiPass`, que siguen en el
repo pero ya no se montan. Sus escenas y el atlas de glifos los usa el fondo
nuevo (3.0); los niveles del enjambre de 3.2 ya no valen.

## 3.x El hero ASCII: filtro + enjambre

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

## 3ter. El lab: cada obra con su tablero

Las cinco obras dejaron de ser algo que se mira. Cada tarjeta tiene ahora dos
entradas independientes: el lienzo (click / Enter = nueva semilla, como antes) y
cuatro sliders debajo. Son ortogonales — cambiar la semilla no toca los
parámetros, y resetear los parámetros no toca la semilla.

### El contrato

Cada obra exporta su `controls` al lado del factory (`src/lab/pieces/*.js`);
los helpers están en `src/lab/controls.js`.

**Con todos los controles en su `def`, lo que se ve es exactamente la obra que
fija la semilla.** Por eso son multiplicadores neutros en 1 (o un offset en 0) y
nunca valores absolutos: si `turbulencia` fijara el curl en lugar de escalarlo,
la semilla dejaría de decidir y se cae el azar notarial del manifiesto.

**Mover un slider no reconstruye la obra.** `GenerativeCanvas` le pasa al factory
un objeto de identidad estable que muta en su lugar, y la obra lo lee en el frame
siguiente. Reconstruir vaciaría el lienzo, y en estas piezas la imagen es memoria
acumulada de miles de frames: un control que borra la pantalla no se siente como
un control, se siente como un reset. Lo único que sí se reconstruye es la
retícula de LITURGIA cuando cambian `profundidad` o `corte`, porque ahí la
composición **es** el estado.

Los ids se comparten entre obras (`estela` está en tres) y las etiquetas salen de
`ui.lab.controls` en `siteContent.i18n.js`, en los tres idiomas. Van en `ui` y no
en los arrays de obra a propósito: `content.json` pisa arrays enteros (ver la
nota de 3bis) y se las llevaría puestas.

### Gray-Scott no admite un slider crudo de F/K

Era lo obvio para COMUNIÓN y es justo lo que no hay que hacer: casi todo el plano
F/K es muerte. Medido sobre 4.000 pasos, moviendo la difusión de B:

| difusión de B | resultado |
|---------------|-----------|
| ≤ 0.90x | el Euler explícito diverge a **NaN**, y el NaN es permanente: la grilla queda negra hasta la próxima semilla |
| 0.95–1.00x | vivo en todo el recorrido |
| ≥ 1.05x | la mitosis se apaga (2 % de la grilla encendida) |

La banda viable era tan angosta que el slider no movía nada, así que la difusión
quedó fija y ese control pasó a ser `incandescencia`, que es ganancia de render y
no puede romper la ecuación. El **régimen** sí es regulable, pero como offset
sobre un camino curado entre los cinco presets (caos → laberintos → gusanos →
coral → mitosis) que solo interpola entre vecinos: verificado que en todo el
recorrido la reacción sigue viva.

### Los 20 extremos están medidos

Se recorrieron los dos extremos de los 20 controles en el navegador, leyendo el
canvas con `getImageData`: luminancia media, porcentaje quemado y porcentaje
negro. El único rango que destruía la obra era `incandescencia` hasta 5 — lavaba
la grilla entera a rosa, con 37,9 % de los píxeles quemados. El techo bajó a 3.6
(3,1 %). Ningún otro extremo apaga ni quema una pieza.

> [!warning] Si cambia el material de una obra, hay que volver a medir sus extremos
> Vale lo mismo que para los niveles del ASCII: los rangos salen de leer píxeles,
> no de elegir a ojo.

### Reduced motion

Sin animación no hay frame siguiente donde leer el parámetro, así que ahí sí se
recompone la obra entera con su warmup. En comunión son ~40M de actualizaciones
de celda: arrastrando un slider, eso traba la pestaña. Por eso la recomposición
del modo estático va con 220 ms de debounce.

### Las tres obras nuevas (2026-08-21)

De cinco a ocho. Cada una es una familia de algoritmo distinta a lo que ya
había, no una variante de color:

| Obra | Sistema | Controles |
|------|---------|-----------|
| SUDARIO | 5.200 puntos sobre una esfera irregular, deformados por ruido 3D y proyectados en perspectiva | densidad, deformación, campo, rotación |
| SALMO DE ARENA | figuras de Chladni: paso aleatorio proporcional a la vibración de la placa | modo, simetría, agitación, densidad |
| VELO DEL TEMPLO | tela de Verlet con restricciones que se cortan | gravedad, viento, rigidez, desgarro |

**SUDARIO.** La esfera de Fibonacci reparte parejo pero deja una espiral que a
través de puntos de 1 px se lee como trama de malla 3D, no como polvo: hay un
jitter angular de ±0.09 rad que la rompe. Y el color de cada punto no puede ser
un `fillStyle` propio —serían 5.200 cambios de contexto por frame—, así que los
puntos se reparten en tres cubos (lejos / cerca / estirado) y cada cubo se
dibuja en una pasada.

**SALMO DE ARENA.** El golpe multiplicativo no servía: el paso del grano es
proporcional a la amplitud de la placa y sobre la línea nodal esa amplitud es
cero, así que multiplicar por el pulso no movía justamente a la arena que forma
la figura. El golpe necesita un piso aditivo (`kick`) para que se vea.

**VELO DEL TEMPLO.** Tres cosas, todas encontradas mirando:

1. **El latigazo del pulso tenía signo fijo.** `beatEnv` es siempre positivo, así
   que sumaba una componente constante: en vez de un sacudón era un viento que
   empujaba el velo fuera del cuadro. Ahora alterna de lado en cada golpe.
2. **El corte va atado al golpe, no a la tensión sola.** Con el corte por
   estiramiento a secas, subir `gravedad` o bajar `rigidez` —dos controles que
   no hablan de desgarro— rompían el velo entero y dejaban el lienzo vacío
   hasta el próximo tejido.
3. **Paso de integración fijo (60 Hz, 3 subpasos por frame) y techo de
   velocidad.** Con dt variable un frame largo estira las restricciones más de
   lo que la relajación corrige. El techo evita que un nudo se dispare.

Además el velo se vuelve a tejer no solo cada 16 golpes, sino apenas quedan
menos del 45 % de los hilos o menos del 25 % de los nudos dentro del cuadro.

> [!warning] Las obras con estado hay que probarlas de a una, en carga limpia
> El barrido secuencial de extremos dio cinco falsos "APAGADO" seguidos en el
> velo: el primer extremo lo rompía y los cuatro siguientes medían el mismo
> desastre, no su propio parámetro. Con una carga por extremo, los ocho dan
> sano. Vale para todo lo que acumula estado entre frames.

### Lo que cuesta cada obra

Medido con un contexto 2D simulado: es el costo del algoritmo, sin la
rasterización. Presupuesto de un frame a 60 fps: 16,67 ms.

```
congregacion   0.35 ms      sudario   0.74 ms
himno          0.08 ms      salmo     1.13 ms
enjambre       0.94 ms      velo      0.11 ms
```

Las tres nuevas entran en el mismo orden que las que ya estaban —la más cara
empata con el enjambre, que ya se enviaba— y el `IntersectionObserver` deja
corriendo solo las que están a la vista. Lo que este número no mide son los
`fillRect` por punto: el salmo dibuja 7.000 por frame y el sudario 5.200,
contra los 7.500 del enjambre.

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

La calibración del hero (2026-08-10) quedó commiteada en `390390a` (niveles,
`srcFull`, máscara por uniform, glow radial, `projectPointer`, táctil, velo de
la barra) y ya está mergeada en `main`.

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
