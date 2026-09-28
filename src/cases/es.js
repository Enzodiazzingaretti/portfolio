/**
 * Casos de estudio en español. Solo datos registrados en la bóveda o en los
 * repos: nada de cifras redondeadas "a ojo" ni resultados que no se midieron.
 *
 * Tipos de bloque: text, decisions, list, stats y figure (ver CasePage.jsx).
 * Entre `backticks` el texto sale como código; no se acepta HTML.
 */
export default {
  portfolio: {
    role: "Diseño y desarrollo",
    blocks: [
      {
        type: "text",
        title: "El punto de partida",
        paragraphs: [
          "Era una sola página con nueve secciones apiladas: sobre mí, web, motion, 3D, flyers, logos, arquitectura, lab y contacto, cada una con su titular gigante. Encima corrían al mismo tiempo un shader de Three.js a pantalla completa, grano, un cursor propio, un HUD y dos menús. El scroll no terminaba nunca y la obra quedaba enterrada.",
          "Fui para el otro lado: un hero animado con Three.js y, desde ahí, acceso directo a cada disciplina.",
        ],
      },
      {
        type: "figure",
        figures: [
          {
            key: "hero",
            alt: "Home del portfolio: el nombre a la izquierda y, a la derecha, una escultura dibujada con caracteres ASCII.",
          },
        ],
        caption: "El hero: la escena de Three.js reescrita como una grilla de caracteres.",
      },
      {
        type: "decisions",
        title: "Decisiones",
        items: [
          {
            title: "Cuatro rutas en lugar de nueve secciones",
            text: "El home quedó en un hero más un índice de cuatro filas, y cada disciplina tiene su URL: `/motion`, `/3d`, `/grafica` y `/web`. Sobre mí y Contacto se abren en un panel lateral desde cualquier categoría.",
            discarded:
              "Un overlay a pantalla completa: más fluido, pero sin links propios, y en un portfolio importa poder mandar a alguien directo a `/3d`. También agrupar la obra en tres «mundos» conceptuales: quien busca flyers no sabría dónde mirar.",
          },
          {
            title: "Un solo contexto WebGL para todo el sitio",
            text: "El fondo vive en el shell, fuera de las rutas. Al cambiar de categoría no se destruye: el loop se pausa y la escena se atenúa con CSS. Y si alguien entra directo a una categoría, three.js ni se descarga hasta que pisa el home.",
            discarded:
              "Recrear la escena en cada ruta. Era más simple de escribir, pero la escultura tiene unos 46.000 triángulos y el tirón al volver al home se notaba.",
          },
          {
            title: "Un filtro ASCII escrito a mano",
            text: "La escena se dibuja en un render target y un quad de pantalla completa la reescribe como caracteres: cada celda promedia su luminancia con nueve muestras y elige un glifo de un atlas que se genera en el navegador. Los caracteres se suman sobre la escena atenuada, así la forma se sigue leyendo debajo.",
          },
          {
            title: "Niveles medidos para cada escena",
            text: "Las tres escenas del hero no se parecen: la escultura vive entre 0,27 y 0,60 de luminancia y las hebras orgánicas casi no pasan de 0,28. Cada una tiene su punto de negro y de blanco, sacados de leer el render target y contar qué glifos salían. El orden también importó: recortando después de la curva de respuesta, el interior de la escultura se apretaba en los últimos cuatro glifos de la rampa y se leía como una mancha.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "ascii", alt: "Detalle del hero: los caracteres que forman la escultura." },
          { key: "mobile", alt: "El hero en un teléfono, con el enjambre de partículas en caracteres." },
        ],
        caption: "De cerca, cada carácter es una celda que promedia la luminancia de la escena. En el teléfono el enjambre baja de 16.000 a 6.000 partículas.",
      },
      {
        type: "list",
        title: "Lo que encontré probando",
        intro: "Casi todo lo importante apareció usando la página:",
        items: [
          "Abrir cualquier obra daba pantalla negra. La animación de entrada de la página retenía un transform, y eso convertía a la página en el contenedor del modal: se centraba en una caja de 1871\u00a0px de alto, fuera de la pantalla. El modal pasó a un portal en el body.",
          "La grilla de `/motion` usaba el video original como portada: 17,2\u00a0MB al abrir la página, con un archivo de 28,7\u00a0MB. Ahora cada portada es un corte de 8 segundos con su póster, y el original solo se baja al abrir la pieza.",
          "Al cambiar de categoría se llegaba a la altura de scroll de la anterior. La librería de smooth scroll se tragaba el `scrollTo` nativo, y solo pasaba con el sitio publicado.",
          "En el home, 24 elementos no llegaban al contraste AA, con ratios de 2,1 a 2,5. Sobre este fondo negro, un 45\u00a0% de opacidad da 4,5:1 exacto, y ese quedó como piso para el texto chico.",
          "En pantallas de alta densidad, como las Retina, el lienzo del hero se mostraba al doble de tamaño y la escena salía recortada. En un monitor común no se veía; apareció capturando la página a 2x.",
        ],
      },
      {
        type: "stats",
        title: "En números",
        items: [
          { value: "17,2 → 0,6\u00a0MB", label: "lo que baja /motion al abrirse" },
          { value: "28,7 → 1,1\u00a0MB", label: "el archivo más pesado de la grilla" },
          { value: "24 → 0", label: "elementos del home debajo del contraste AA" },
          { value: "0\u00a0px", label: "de error entre el cursor y el centro del enjambre" },
        ],
      },
      {
        type: "decisions",
        title: "También adentro",
        items: [
          {
            title: "Un lab generativo",
            text: "Ocho piezas en canvas, cada una de una familia de algoritmo distinta, con cuatro controles en vivo. En su valor por defecto, los controles muestran exactamente la obra que fija la semilla. En la reacción-difusión de Gray-Scott, un slider crudo de parámetros era una trampa: casi todo el plano es muerte, y con la difusión por debajo de 0,90x la simulación diverge a NaN y la grilla queda negra hasta la próxima semilla. Ese control terminó siendo una ganancia de render, que no puede romper la ecuación, y hasta a esa ganancia hubo que ponerle techo: al máximo quemaba el 37,9\u00a0% de los píxeles; con el techo nuevo, el 3,1\u00a0%.",
          },
          {
            title: "Un panel sin base de datos",
            text: "En `/admin` se editan los textos y la obra. Al guardar, una función serverless hace commit del contenido al repo por la API de GitHub y Vercel vuelve a publicar. Contraseña con hash scrypt, cookie de sesión firmada con HMAC y una lista cerrada de archivos que se pueden escribir.",
          },
          {
            title: "Tests y CI",
            text: "Vitest revisa que los tres idiomas digan lo mismo y que ninguna obra apunte a un archivo que no existe, y prueba la autenticación del panel. Uno de esos tests encontró un bug real: la compresión de imágenes podía quedar por debajo de su piso de calidad. Cada push corre lint, tests y build.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          {
            key: "lab",
            alt: "Comunión celular, una de las obras del lab: manchas rojas de reacción-difusión sobre negro.",
          },
          {
            key: "lab2",
            alt: "Salmo de arena: granos blancos que dibujan las líneas nodales de una placa que vibra.",
          },
        ],
        caption: "Dos de las ocho obras del lab: reacción-difusión de Gray-Scott (Comunión celular) y figuras de Chladni (Salmo de arena).",
      },
      {
        type: "text",
        title: "Lo que me llevo",
        paragraphs: [
          "Los niveles del ASCII y los rangos del lab salen de leer píxeles, no de elegir a ojo. La contracara es que no son eternos: si cambia el material de una escena o de una obra, hay que volver a medir.",
        ],
      },
    ],
  },

  "tamara-gonzalez": {
    role: "Diseño y desarrollo",
    blocks: [
      {
        type: "text",
        title: "El punto de partida",
        paragraphs: [
          "El primer brief fue un portfolio de marketing digital y community management, con proyectos en formato caso y una estética clara: rosa apagado y vidrio. A mitad del desarrollo, Tamara trajo una nota escrita a mano y dos mockups de referencia, y el proyecto cambió de fondo. Lo que necesitaba era un perfil de artista visual: los tatuajes al frente, porque es lo que más vende y de lo que más obra tiene, y después ilustración y pintura.",
          "El marketing no desapareció: pasó a ser uno de sus servicios.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "home", alt: "Home del portfolio de Tamara González: titular en serif y su foto tatuando." }],
        caption: "El sitio en vivo: base borgoña casi negra, acentos rosa y la obra al frente.",
      },
      {
        type: "decisions",
        title: "Decisiones",
        items: [
          {
            title: "Rehacer a mitad de camino",
            text: "Cambié la estructura y la piel. Los casos de marketing pasaron a galerías de obra, el rosa quedó como acento sobre un borgoña casi negro, que era lo que traían sus referencias, y el formulario de contacto se reemplazó por WhatsApp, que es por donde realmente le escriben. Rabbit Studio, su marca de branding, quedó en el footer con el logo del conejo.",
            discarded: "Mantener el enfoque de marketing y la estética clara: su nota dejaba claro que el producto era su obra.",
          },
          {
            title: "Simple primero, lo avanzado a un clic",
            text: "El panel lo usa alguien que no programa. Arranca en modo simple y guarda detrás de «Mostrar opciones avanzadas» todo lo que puede romper el sitio, y recuerda la elección. Ese criterio lo repetí después en los paneles de otros tres sitios, este incluido.",
          },
          {
            title: "La obra, organizada por proyecto",
            text: "Al principio la galería era una lista de imágenes. Pasó a proyectos, cada uno con su modal, y el panel se reescribió en la misma tanda para que ella cargue cada trabajo con todas sus fotos y videos juntos. Las imágenes se suben por lote y se convierten a WebP en el navegador antes de subir.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          {
            key: "panel",
            alt: "El panel de administración en modo simple: siete secciones plegadas y el interruptor de opciones avanzadas.",
          },
        ],
        caption: "El panel en modo simple. Lo que puede romper el sitio espera detrás de un interruptor.",
      },
      {
        type: "text",
        title: "Cómo funciona",
        paragraphs: [
          "El sitio lee todo de un `content.json`. Al guardar, una función serverless hace commit al repo por la API de GitHub y Vercel publica solo, entre 30 y 60 segundos después. No hay base de datos: cada cambio queda como un commit con su historial.",
          "El login tiene límite de intentos y la subida valida el tipo real del archivo por sus primeros bytes, con un tope de 2\u00a0MB. Para tandas grandes hay además un script local con sharp y ffmpeg que procesa carpetas enteras: una subcarpeta por proyecto, imágenes a WebP de hasta 1600\u00a0px, miniaturas de 600\u00a0px y videos a MP4 sin audio.",
        ],
      },
      {
        type: "list",
        title: "Lo que encontré probando",
        items: [
          "El panel pasaba todos los tests y en producción no cargaba nada. La API leía `content.json` desde la raíz del repo, pero el sitio lo sirve desde `public/`. Los tests simulaban GitHub, así que el desajuste de rutas recién apareció contra el repo real.",
          "La galería no se cerraba: con React 19 en StrictMode, AnimatePresence no desmontaba el componente. Los tests pasaban y en la app quedaba pegada. La reemplacé por un render condicional y perdí la animación de salida, que no hacía falta.",
        ],
      },
      {
        type: "stats",
        title: "En números",
        items: [
          { value: "41", label: "tests con Vitest entre la API, el panel y los componentes" },
          { value: "375\u00a0px", label: "sin scroll horizontal, ni en el sitio ni en el panel" },
          { value: "30–60\u00a0s", label: "entre guardar en el panel y ver el cambio publicado" },
          { value: "3", label: "sitios que heredaron este panel" },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "gallery", alt: "Galería de tatuajes: una fila de cuatro proyectos." },
          { key: "mobile", alt: "El sitio de Tamara González en un teléfono." },
        ],
        caption: "La galería de tatuajes y el home en el teléfono.",
      },
      {
        type: "text",
        title: "Lo que me llevo",
        paragraphs: [
          "Un test que simula GitHub no prueba las rutas reales. Para eso hace falta una prueba contra el repositorio de verdad.",
        ],
      },
    ],
  },

  "ctrl-z": {
    role: "Diseño y desarrollo",
    blocks: [
      {
        type: "text",
        title: "El punto de partida",
        paragraphs: [
          "CTRL.Z es Brenda Hetcer, DJ de música urbana de Mendoza. Todo su material estaba en un PDF de una sola página de 1290\u00a0×\u00a05230\u00a0px, casi todo imagen y texto vectorizado: extraer el texto devolvía 467 bytes, solo los links.",
          "Lo rendericé por tajadas para poder leerlo y saqué las 18 imágenes que traía adentro, en su resolución original. Esas imágenes son las fotos del sitio, y el diagrama del rider salió del mismo PDF renderizado al triple de escala.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "cover", alt: "Portada del press kit de CTRL.Z: el logo cromado sobre una foto en verde oliva." }],
        caption: "La portada: verde oliva y musgo, títulos cromados y las fotos con el mismo color que su PDF.",
      },
      {
        type: "decisions",
        title: "Decisiones",
        items: [
          {
            title: "Rediseñar en vez de clonar",
            text: "Mi plantilla de press kit da por hecho techno, tres idiomas, sets de SoundCloud, videos de YouTube y una sección personal. Brenda pasa reggaetón, RKT, cumbia y trap y toca en Argentina; su SoundCloud no expone los IDs de los temas y el PDF no cuenta nada personal. Clonada, la página quedaba medio vacía o rellena de texto inventado. Armé la estructura para el material que sí había: portada, géneros, bio, con quién compartió escenario, escenarios, fotos de prensa, rider, hospitalidad y booking, en un solo idioma.",
            discarded: "Clonar y apagar las secciones que sobraban: quedaba una página corta con la estética de otro artista.",
          },
          {
            title: "Ni un dato inventado",
            text: "Un productor usa el press kit para decidir si la contrata. El rider y la hospitalidad son literales del PDF. De los cuatro datos destacados, 2017 sale del PDF; los 9+ años, 8+ ciudades y 18+ escenarios los conté a partir de su bio. La cantidad de shows no está porque no había de dónde sacarla.",
          },
          {
            title: "Un panel que existe pero no se ve",
            text: "Lo construí completo y lo probé, pero lo entregué apagado, por si más adelante se usa: sumarlo después cuesta más que dejarlo listo, y así el contenido nació editable. Lo separan del público dos barreras independientes: ningún link desde el sitio, y sin las variables de entorno el login con contraseña no existe: el único camino que queda pide un token de GitHub, y ese token lo tengo solo yo. Además, noindex y robots.txt.",
            discarded: "Dejarlo activo con contraseña: ella no lo iba a usar, y un panel activo es superficie de ataque y una contraseña más para perder.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "rider", alt: "Sección de rider técnico: dos opciones de cabina y el diagrama con los equipos." },
          { key: "mobile", alt: "La portada del press kit en un teléfono." },
        ],
        caption: "El rider, con las dos opciones de cabina tal como vienen en su PDF, y la portada en el teléfono.",
      },
      {
        type: "text",
        title: "Cómo funciona",
        paragraphs: [
          "Sin framework: HTML, CSS y JavaScript, más funciones serverless de Vercel para el panel. El contenido está dos veces a propósito: escrito en el HTML, para buscadores y para quien no tiene JavaScript, y repetido en un `content.json` que el panel puede reescribir.",
          "En los textos, `*así*` sale en negrita y no se acepta HTML: todo entra como texto plano, así nada de lo que se escriba en el panel puede inyectar etiquetas. La política de seguridad de contenido solo permite scripts propios (`script-src 'self'`), sin código inline.",
        ],
      },
      {
        type: "list",
        title: "Lo que encontré probando",
        items: [
          "Verificando el sitio, las animaciones de entrada no se disparaban. La causa era del entorno de prueba, pero destapó un problema real: `.reveal { opacity: 0 }` dejaba la página en blanco si el JavaScript no corría, justo en un HTML escrito para funcionar sin él. Lo resolvió `boot.js`, una sola instrucción en el head que marca que hay JavaScript antes del primer pintado; el CSS solo esconde bajo `.js`. Va en un archivo aparte porque la CSP no admite scripts inline.",
          "El proyecto traía un `.htaccess` heredado de la plantilla. Es de Apache, Vercel lo ignora, y su CSP todavía nombraba SoundCloud, EmailJS y jsdelivr, que este sitio no usa. Lo borré: la configuración real vive en `vercel.json`.",
          "El panel lo probé de punta a punta contra una API simulada con el mismo contrato HTTP: login con clave buena y mala, las cinco pestañas, editar, reordenar y borrar, subir imágenes, publicar, y 401 en las tres rutas sin sesión.",
        ],
      },
      {
        type: "stats",
        title: "En números",
        items: [
          { value: "1290\u00a0×\u00a05230", label: "píxeles del PDF de origen, en una sola página" },
          { value: "18", label: "imágenes recuperadas del PDF en su resolución original" },
          { value: "5", label: "pestañas del panel: artista, textos, listas, imágenes y secciones" },
          { value: "2", label: "barreras entre el panel y el público" },
        ],
      },
      {
        type: "figure",
        figures: [{ key: "photos", alt: "Franja de fotos de prensa de CTRL.Z tocando." }],
        caption: "Las fotos de prensa se abren en un visor, y debajo está el pack completo para descargar.",
      },
      {
        type: "text",
        title: "Lo que me llevo",
        paragraphs: [
          "La plantilla sirve como base de arquitectura, no como sitio llave en mano. Con el próximo artista la pregunta no va a ser qué le cambio al clon, sino qué material tiene y qué estructura pide ese material.",
        ],
      },
    ],
  },
};
