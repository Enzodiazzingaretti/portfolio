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

  "andino-seguros": {
    role: "Diseño y desarrollo",
    blocks: [
      {
        type: "text",
        title: "El punto de partida",
        paragraphs: [
          "Federico Andino es productor asesor de seguros en Mendoza y trabaja por WhatsApp. El sitio no tenía que informar sobre seguros: tenía que lograr que alguien que llega desde Instagram o desde una búsqueda termine escribiéndole, y que el mensaje llegue con los datos del riesgo adentro, en vez de arrancar con «hola, ¿qué auto tenés?».",
          "De ahí salieron los dos criterios que ordenan todo lo demás: que ninguna consulta se pierda, ni porque alguien cierra la pestaña ni porque falla un servicio, y mobile primero en serio, porque el tráfico viene de Instagram, en la calle y con datos móviles.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "home", alt: "Inicio del sitio de Andino Seguros: el titular en blanco y naranja sobre azul marino, con los botones para cotizar y para hablar por WhatsApp." }],
        caption: "El azul carga el peso; el naranja queda para lo que hay que tocar: cotizar y escribir por WhatsApp.",
      },
      {
        type: "decisions",
        title: "Decisiones",
        items: [
          {
            title: "La consulta se guarda antes de abrir WhatsApp",
            text: "El formulario manda los datos al servidor, que los vuelve a validar, guarda la consulta y recién ahí devuelve el link de WhatsApp con el mensaje armado. Si el mensaje se armara en el navegador, quien abre WhatsApp y no toca enviar desaparecería sin dejar rastro, y es justo la persona a la que Federico querría volver a escribirle. Si la base falla, igual se abre WhatsApp: se pierde el registro, no la conversación.",
            discarded: "Armar el mensaje en el navegador y abrir WhatsApp directo: más simple, y pierde a todos los que no llegan a tocar enviar.",
          },
          {
            title: "Un archivo por seguro, un solo formulario",
            text: "Cada seguro es un archivo que declara sus campos, su esquema Zod y cómo se resume en el mensaje. Un único componente los dibuja sin saber nada de seguros. Empezó con cinco y hoy son diez: sumar uno es un archivo nuevo y una línea en el registro, y si falta la línea, TypeScript no compila.",
            discarded: "Cuatro formularios escritos a mano: más fáciles de leer al principio, pero lo previsible en este proyecto era justamente sumar seguros.",
          },
          {
            title: "Dos credenciales que no se mezclan",
            text: "El sitio público escribe en la base con una key que solo puede insertar: con RLS activo no lee, no edita y no borra. Lo probé contra la API real: leer y borrar dan 401, insertar da 201. El panel usa la única credencial que puede leer datos de clientes, encerrada en un módulo de servidor que se usa recién después de validar la sesión.",
          },
          {
            title: "Un panel a la medida de quien lo usa",
            text: "Federico no es programador. En vez de darle acceso a la tabla de la base, le armé un panel: ve las consultas con los datos ya traducidos, le escribe a cada persona por WhatsApp, marca a quién contactó y anota. La cartera se importa de su Excel y se agrupa por persona, no por póliza, porque cuando lo llaman quiere ver qué tiene esa persona con él.",
            discarded: "Invitarlo a Supabase: cero trabajo, pero iba a ver una tabla cruda con acceso a todo el proyecto.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "formulario", alt: "Formulario del seguro de auto en el teléfono: DNI, marca, modelo, año y patente." },
          { key: "consulta", alt: "La misma consulta en el panel, con datos de prueba: el vehículo, la cobertura que busca y el botón para escribirle por WhatsApp." },
        ],
        caption: "El formulario de auto en el teléfono y la consulta como le llega a Federico. En el panel, datos de prueba.",
      },
      {
        type: "text",
        title: "Cómo funciona",
        paragraphs: [
          "Next.js 16 con App Router y TypeScript, Tailwind CSS 4 y Zod, que valida en el navegador y otra vez en el servidor. Las tarjetas de seguros y las preguntas frecuentes se editan en Sanity, con el Studio embebido en el mismo sitio; lo que no cambia nunca, como la matrícula o los textos legales, vive en el código. Si Sanity no responde, el sitio sirve un contenido de respaldo y no se cae.",
          "El panel entra con contraseña: la sesión es una cookie firmada con HMAC y `httpOnly`, y el login admite cinco intentos cada diez minutos por IP. Google Analytics y Meta Pixel no existen en la página hasta que la persona acepta las cookies.",
        ],
      },
      {
        type: "list",
        title: "Lo que encontré probando",
        items: [
          "El botón principal no cumplía contraste: blanco sobre el naranja de marca da 3,0:1 y WCAG AA pide 4,5:1. Oscurecer el naranja llegaba a 4,02. Lo resolvió el texto azul marino sobre el mismo naranja: 5,89:1, sin tocar el color de marca.",
          "El botón flotante de WhatsApp quedaba a 2 px del aviso de cookies: no se pisaban de casualidad. Ahora los dos viven en un contenedor en columna y la separación sale del `gap`. Lo probé duplicando el texto del aviso: pasó de 162 a 231 px de alto y la separación siguió en 12 px.",
          "El honeypot no servía: el esquema rechazaba el campo antes del chequeo, devolvía 400 y le avisaba al bot que lo habían detectado. Ahora responde normal y descarta el envío en silencio.",
          "El sitio seguía mostrando el contenido de respaldo con Sanity ya cargado. No era Sanity: era la caché de fetch de Next, que vive en disco y sobrevive al reinicio del servidor.",
        ],
      },
      {
        type: "stats",
        title: "En números",
        items: [
          { value: "10", label: "formularios de seguro, dibujados por un solo componente" },
          { value: "5,89:1", label: "de contraste en el botón principal, que tenía 3,0:1" },
          { value: "9", label: "errores de la primera versión que encontró la verificación, no el desarrollo" },
          { value: "401", label: "lo que responde la base si la key pública intenta leer o borrar; insertar da 201" },
        ],
      },
      {
        type: "figure",
        figures: [{ key: "panel", alt: "Inicio del panel con datos de prueba: consultas sin responder, comisión sin cobrar, clientes y pólizas que vencen en 30 días." }],
        caption: "El inicio del panel responde a «¿qué hago hoy?». Datos de prueba: los reales no salen del panel.",
      },
      {
        type: "text",
        title: "Lo que me llevo",
        paragraphs: [
          "En un sitio de conversión, la decisión técnica que importa no es el framework: es el orden de las cosas. Guardar antes de redirigir, redirigir aunque falle el guardado y no animar el botón del que depende todo. Ninguna de las tres se ve, y las tres deciden si la consulta llega.",
        ],
      },
    ],
  },

  "press-kits": {
    role: "Diseño y desarrollo",
    blocks: [
      {
        type: "text",
        title: "El punto de partida",
        paragraphs: [
          "Empecé por el mío: un press kit web para mostrar mis sets como DJ, en tres idiomas y con un panel para editarlo sin tocar código. Después vinieron tres artistas: CTRL.Z, DJ de música urbana de Mendoza; Gabi Raíz, DJ y productor de Mendoza que va del downtempo al psychedelic trance; y Martina Høbelar, DJ y productora de hard techno y schranz de Buenos Aires.",
          "Un productor abre el press kit para decidir si contrata: quién es, qué toca, qué equipo pide y adónde escribir. Los cuatro responden eso mismo, y ninguno se parece a otro.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "portadas", alt: "Las portadas de los cuatro press kits: Kexxy, CTRL.Z, Gabi Raíz y Martina Høbelar." }],
        caption: "Kexxy, CTRL.Z, Gabi Raíz y Martina Høbelar: la misma base, cuatro estéticas.",
      },
      {
        type: "decisions",
        title: "Decisiones",
        items: [
          {
            title: "Una base de arquitectura, no un sitio para clonar",
            text: "Mi plantilla da por hecho techno, tres idiomas, sets de SoundCloud y una sección personal. CTRL.Z pasa reggaetón, RKT, cumbia y trap, y todo su material era un PDF de una sola página. Clonada, la página quedaba medio vacía o rellena de texto inventado, así que rehice la estructura para el material que había. Desde ahí, cada press kit arranca por la misma pregunta: qué tiene el artista y qué estructura pide ese material.",
            discarded: "Clonar y apagar las secciones que sobraban: quedaba una página corta con la estética de otro artista.",
          },
          {
            title: "La estética sale del material",
            text: "En CTRL.Z, el verde oliva y los títulos cromados de su PDF. En Gabi Raíz, el azul petróleo de sus fotos de estudio, un rojo que aparece una sola vez y las rayas de su logo, que siguen de largo y dibujan la cordillera detrás de él; al final de la página vuelve dada vuelta, como raíz. En Martina Høbelar, la sala a oscuras, una sola tipografía condensada y su rojo reservado para un led que marca lo activo.",
          },
          {
            title: "Ni un dato inventado",
            text: "Un productor usa el press kit para decidir. En CTRL.Z el rider y la hospitalidad son literales del PDF, y los datos que calculé a partir de su bio quedaron para que ella los confirme. Con Gabi Raíz la regla fue explícita: lo que él no confirmó se saca, aunque esté en un perfil público.",
          },
          {
            title: "Panel solo si alguien lo va a usar",
            text: "El mío tiene un panel de dos niveles que guarda los cambios en el repo vía la API de GitHub. El de CTRL.Z lo construí, lo probé y lo entregué apagado. Gabi Raíz y Martina Høbelar son una sola página estática, sin panel ni funciones serverless.",
            discarded: "Un panel en todos, por las dudas: un panel activo es superficie de ataque y una contraseña más para perder.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "gabiMobile", alt: "El press kit de Gabi Raíz en el teléfono: su logo, la cordillera de líneas y los botones para consultar una fecha y escuchar un set." },
          { key: "martinaMobile", alt: "El press kit de Martina Høbelar en el teléfono: su nombre en tipografía condensada y los botones Ver sets y Booking." },
        ],
        caption: "En el teléfono, cada portada lleva a lo mismo: escuchar y consultar una fecha.",
      },
      {
        type: "text",
        title: "Cómo funcionan",
        paragraphs: [
          "Sin framework ni paso de build: HTML, CSS y JavaScript escritos a mano, en Vercel. El contenido está en el HTML, que es lo que leen Google y WhatsApp y lo que queda si falla el JavaScript. En los tres de clientes, la política de seguridad de contenido solo deja cargar scripts propios.",
          "En los dos últimos, el booking no pasa por ningún servidor: con lo que se completa, la página arma la consulta y la abre en el WhatsApp o el mail de quien escribe. En el de Martina, el asunto lleva la fecha y el lugar, para que la casilla de bookings se pueda ordenar.",
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "gabiBooking", alt: "Formulario de booking de Gabi Raíz: nombre, productora, fecha, ciudad, formato y mensaje, con botones para enviar por WhatsApp o por mail." },
          { key: "martinaBooking", alt: "Formulario de booking de Martina Høbelar: nombre, fecha y lugar, mensaje y un solo botón para enviar por mail." },
        ],
        caption: "Dos bookings sin servidor: el de Gabi abre WhatsApp o el mail; el de Martina, solo el mail, con un asunto que se puede ordenar.",
      },
      {
        type: "list",
        title: "Lo que encontré probando",
        items: [
          "En CTRL.Z, las animaciones de entrada dejaban la página en blanco si el JavaScript no corría: `.reveal { opacity: 0 }` en un HTML escrito para funcionar sin él. Lo resolvió `boot.js`, una sola instrucción en el head que marca que hay JavaScript antes del primer pintado; el CSS solo esconde bajo `.js`.",
          "En Gabi Raíz, la foto de la bio no aparecía: con `clip-path` recortando el elemento entero, el navegador lo daba por invisible, la imagen diferida nunca cargaba y la entrada no se disparaba. Ahora la descubre una cortina: un pseudo-elemento del color del fondo que se corre.",
          "En Martina Høbelar, con la conexión del celular cortándose, las miniaturas que fallaban quedaban rotas: el navegador no las vuelve a pedir solo. Cada imagen se reintenta hasta cuatro veces, y todas de nuevo cuando vuelve la conexión.",
        ],
      },
      {
        type: "stats",
        title: "En números",
        items: [
          { value: "4", label: "press kits en vivo, de la misma base" },
          { value: "18", label: "imágenes recuperadas en su resolución original del PDF de CTRL.Z" },
          { value: "8", label: "destellos del led de Martina, a los BPM del set que se elige" },
          { value: "44 px", label: "de alto mínimo para botones y enlaces en el de Martina" },
        ],
      },
      {
        type: "figure",
        figures: [{ key: "martinaSets", alt: "Sección de sets de Martina Høbelar: el reproductor y la lista de sets con sus BPM; un led rojo marca el elegido." }],
        caption: "Los sets de Martina con sus BPM. Al elegir uno, el led titila ocho veces a ese tempo.",
      },
      {
        type: "text",
        title: "Lo que me llevo",
        paragraphs: [
          "La plantilla sirve como base de arquitectura, no como sitio llave en mano. Con cada artista la pregunta no es qué le cambio al clon, sino qué material tiene y qué estructura pide ese material.",
        ],
      },
    ],
  },
};
