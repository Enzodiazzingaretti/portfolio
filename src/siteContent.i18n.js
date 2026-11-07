const webProjectAssets = {
  // Serie: Kexxy, CTRL.Z, Gabi Raíz, Martina Høbelar y Shodnan Ref. Sin
  // previewUrl porque son cinco sitios: el caso los enlaza uno por uno. El
  // código que se muestra es el de la plantilla, presskit_digital.
  pressKits: {
    year: "2025–2026",
    imageUrl: null,
    previewUrl: "",
    previewImage: "/images/previews/screenshot_presskits.webp",
    // Sin «Código»: el repo de la plantilla es el press kit personal y su
    // README lo presenta como propio; el portfolio no se vincula con el alias.
    repoUrl: null,
    caseSlug: "press-kits",
    slides: [],
  },
  // Repo privado (es de un cliente): sin botón de código.
  andino: {
    year: "2026",
    imageUrl: null,
    previewUrl: "https://andino-seguros.vercel.app/",
    previewImage: "/images/previews/screenshot_andinoseguros.webp",
    repoUrl: null,
    caseSlug: "andino-seguros",
    slides: [],
  },
  portfolio: {
    year: "2025",
    imageUrl: null,
    previewUrl: "#hero",
    previewImage: "/images/previews/screenshot_portfolio.jpeg",
    repoUrl: "https://github.com/Enzodiazzingaretti/portfolio",
    caseSlug: "portfolio",
    slides: [],
  },
  tamara: {
    year: "2026",
    imageUrl: null,
    previewUrl: "https://tamara-portfolio-xi.vercel.app/",
    previewImage: "/images/previews/screenshot_tamaraportfolio.jpeg",
    repoUrl: "https://github.com/Enzodiazzingaretti/tamara-portfolio",
    caseSlug: "tamara-gonzalez",
    slides: [],
  },
  newMetals: {
    year: "2026",
    imageUrl: null,
    previewUrl: "https://newmetals-portfolio.vercel.app/",
    previewImage: "/images/previews/screenshot_newmetalsportfolio.jpeg",
    repoUrl: "https://github.com/Enzodiazzingaretti/newmetals-portfolio",
    slides: [],
    // Oculto mientras el sitio tenga datos de muestra (teléfono e Instagram del
    // mockup) y noindex. Para mostrarlo: enabled: true acá y en content.json.
    enabled: false,
  },
  // Sin deploy propio: previewUrl vacio, asi SelectedWorkCard no dibuja el
  // boton "Visitar sitio" para un link que no existe.
  aurora: {
    year: "2026",
    imageUrl: null,
    previewUrl: "",
    previewImage: "/images/previews/screenshot_auroraretreat.jpeg",
    slides: [],
    // Oculto hasta que el sitio esté online. Para mostrarlo: enabled: true
    // acá y en public/content.json (español).
    enabled: false,
  },
};

/**
 * `thumbnail` apunta a /images/loops/: versiones de 8 s y ~600 KB generadas
 * para la grilla, con su poster .jpg al lado. Los originales siguen en
 * `slides` y son los que abre el modal. Antes la grilla usaba `slides[0]`
 * directo —el MP4 completo, hasta 28 MB— y /motion transferia 20 MB.
 * Para regenerarlas ver la seccion "Portadas de grilla" en CLAUDE.md.
 */
const touchDesignerAssets = {
  pulseVandal: {
    thumbnail: "/images/loops/pulse-vandal.mp4",
    slides: [
      "/images/touchdesigner/pulse-vandal/visuales1.mp4",
    ],
  },
  ghostTunnel: {
    thumbnail: "/images/loops/ghost-tunnel.mp4",
    audio: "/images/loops/ghost-tunnel.m4a",
    slides: [
      "/images/touchdesigner/ghost-tunnel/c4-animacion-1.mp4",
    ],
  },
  staticVeil: {
    thumbnail: "/images/loops/static-veil.mp4",
    slides: [
      "/images/touchdesigner/static-veil/humo.mp4",
      "/images/touchdesigner/static-veil/humo-mod.mp4",
    ],
  },
  ironLattice: {
    thumbnail: "/images/loops/iron-lattice.mp4",
    audio: "/images/loops/iron-lattice.m4a",
    slides: [
      "/images/touchdesigner/iron-lattice/visuales4.mp4",
    ],
  },
  eyes: {
    thumbnail: "/images/loops/eyes.mp4",
    slides: [
      "/images/touchdesigner/Eyes/ojos-visuales.mp4",
    ],
  },
  biology: {
    thumbnail: "/images/loops/biology.mp4",
    slides: [
      "/images/touchdesigner/biology/biology1.mp4",
      "/images/touchdesigner/biology/biology2.mp4",
      "/images/touchdesigner/biology/biology3.mp4",
      "/images/touchdesigner/biology/biology4.mp4",
      "/images/touchdesigner/biology/biology5.mp4",
      "/images/touchdesigner/biology/biology7.mp4",
      "/images/touchdesigner/biology/biology8.mp4",
      "/images/touchdesigner/biology/biology10.mp4",
      "/images/touchdesigner/biology/biology11.mp4",
      "/images/touchdesigner/biology/biology12.mp4",
      "/images/touchdesigner/biology/biology13.mp4",
      "/images/touchdesigner/biology/biology14.mp4",
    ],
  },
  kineticSand: {
    thumbnail: "/images/touchdesigner/kinetic-sand/kinetic-sand-1.jpg",
    slides: [
      "/images/touchdesigner/kinetic-sand/kinetic-sand-1.mp4",
      "/images/touchdesigner/kinetic-sand/kinetic-sand-1.jpg",
      "/images/touchdesigner/kinetic-sand/kinetic-sand-2.jpg",
      "/images/touchdesigner/kinetic-sand/kinetic-sand-3.jpg",
      "/images/touchdesigner/kinetic-sand/kinetic-sand-4.jpg",
    ],
  },
  visuales: {
    thumbnail: null,
    slides: [],
  },
};

const flyerAssets = {
  // Portada del compilado [V/A002INNU] del sello Innusual (Buenos Aires, 2025).
  // En el estreno del tema de IF, el crédito dice «Render: kexxy.obj» y
  // «cartoonist: shifo.__». Fecha y cantidad de temas no se nombran: no están
  // verificadas.
  innusual: {
    square: true,
    client: "Innusual",
    year: "2025",
    imageUrl: "/images/flyers/innusual/innusual-va002innu.webp",
    slides: ["/images/flyers/innusual/innusual-va002innu.webp"],
  },
  aguantaderobass: {
    portrait: true,
    imageUrl: "/images/flyers/aguantadero_bass/aguantaderobass-1.png",
    slides: [
      "/images/flyers/aguantadero_bass/aguantaderobass-preview.mp4",
      "/images/flyers/aguantadero_bass/aguantaderobass-1.png",
      "/images/flyers/aguantadero_bass/aguantaderobass-2.png",
    ],
  },
  blastkick: {
    square: true,
    imageUrl: "/images/flyers/blastkick/blastkick_preview.png",
    slides: [
      "/images/flyers/blastkick/blastkick_preview.png",
      "/images/flyers/blastkick/blastkick-3.png",
      "/images/flyers/blastkick/blastkick-reel.mp4",
    ],
  },
  blastkickAnoNuevo: {
    square: true,
    imageUrl: "/images/flyers/blastkick-ano-nuevo/blastkick-ano-nuevo-1.png",
    slides: [
      "/images/flyers/blastkick-ano-nuevo/blastkick-ano-nuevo-1.png",
      "/images/flyers/blastkick-ano-nuevo/blastkick-ano-nuevo-2.png",
    ],
  },
  distRaptisKexxy: {
    square: true,
    imageUrl: "/images/flyers/dist-raptis-kexxy/dist-raptis-kexxy-1.png",
    slides: [
      "/images/flyers/dist-raptis-kexxy/dist-raptis-kexxy-1.png",
    ],
  },
  // Portada: un cuadro del video donde se ve la pantalla con el artista. La
  // imagen fija anterior eran los cables con las pantallas en blanco.
  maccari: {
    portrait: true,
    imageUrl: "/images/flyers/maccari/maccari-cover.webp",
    slides: [
      "/images/flyers/maccari/maccari1-2.mp4",
      "/images/flyers/maccari/maccari-1.png",
    ],
  },
  overkill: {
    square: true,
    imageUrl: "/images/flyers/overkill/overkill-1.png",
    slides: [
      "/images/flyers/overkill/overkill-1.png",
      "/images/flyers/overkill/overkill-2.png",
    ],
  },
};

const espaciosAssets = {
  plug: {
    portrait: true,
    imageUrl: "/images/espacios/plug/plug-1.png",
    slides: [
      "/images/espacios/plug/plug-1.png",
      "/images/espacios/plug/plug-2.png",
      "/images/espacios/plug/plug-3.png",
      "/images/espacios/plug/plug-4.png",
      "/images/espacios/plug/plug-5.png",
      "/images/espacios/plug/plug-6.png",
      "/images/espacios/plug/plug-7.png",
      "/images/espacios/plug/plug-8.png",
      "/images/espacios/plug/plug-9.png",
    ],
  },
  recUnderclub: {
    portrait: true,
    imageUrl: "/images/espacios/rec-underclub/rec-underclub-1.png",
    slides: [
      "/images/espacios/rec-underclub/rec-underclub-1.png",
      "/images/espacios/rec-underclub/rec-underclub-2.png",
      "/images/espacios/rec-underclub/rec-underclub-4.png",
      "/images/espacios/rec-underclub/rec-underclub-ojodepez.png",
      "/images/espacios/rec-underclub/underclub-rec-videos-1.mp4",
      "/images/espacios/rec-underclub/underclub-rec-videos-2.mp4",
      "/images/espacios/rec-underclub/underclubprueba1.mp4",
    ],
  },
  underberlin: {
    portrait: true,
    imageUrl: "/images/espacios/underberlin/underberlin_preview.png",
    slides: [
      "/images/espacios/underberlin/underberlin_preview.png",
      "/images/espacios/underberlin/underberlin-1.mp4",
      "/images/espacios/underberlin/underberlin-2.mp4",
      "/images/espacios/underberlin/underberlin-3.mp4",
    ],
  },
};

// Sonar Produce (Mendoza, 2026): sistema visual y campaña de SONAR 001, su
// primera fecha (Stella Bossi, 30.10.2026). Salen de la carpeta que ve el
// cliente (compartido-con-cliente), así que son las versiones aprobadas.
// La cuenta regresiva la publicó Sonar del 27 al 30/10; está a la vista desde
// el 02/11.
const campaignAssets = {
  sonarKeyVisual: {
    portrait: true,
    client: "Sonar Produce",
    caseSlug: "sonar-produce",
    year: "2026",
    imageUrl: "/images/campanas/sonar/key-visual-feed.webp",
    slides: ["/images/campanas/sonar/key-visual-feed.webp", "/images/campanas/sonar/key-visual-historia.webp"],
  },
  sonarLineUp: {
    portrait: true,
    client: "Sonar Produce",
    caseSlug: "sonar-produce",
    year: "2026",
    imageUrl: "/images/campanas/sonar/line-up-portada.webp",
    slides: ["/images/campanas/sonar/line-up-reel.mp4", "/images/campanas/sonar/line-up-portada.webp"],
  },
  sonarCarrusel: {
    portrait: true,
    client: "Sonar Produce",
    caseSlug: "sonar-produce",
    year: "2026",
    imageUrl: "/images/campanas/sonar/carrusel-01.webp",
    slides: [
      "/images/campanas/sonar/carrusel-01.webp",
      "/images/campanas/sonar/carrusel-02.webp",
      "/images/campanas/sonar/carrusel-03.webp",
      "/images/campanas/sonar/carrusel-04.webp",
      "/images/campanas/sonar/carrusel-05.webp",
    ],
  },
  sonarHorarios: {
    portrait: true,
    client: "Sonar Produce",
    caseSlug: "sonar-produce",
    year: "2026",
    imageUrl: "/images/campanas/sonar/horarios-feed.webp",
    slides: ["/images/campanas/sonar/horarios-feed.webp", "/images/campanas/sonar/horarios-historia.webp"],
  },
  sonarEntradas: {
    portrait: true,
    client: "Sonar Produce",
    caseSlug: "sonar-produce",
    year: "2026",
    imageUrl: "/images/campanas/sonar/entradas-feed.webp",
    slides: ["/images/campanas/sonar/entradas-feed.webp", "/images/campanas/sonar/entradas-historia.webp"],
  },
  sonarManual: {
    client: "Sonar Produce",
    caseSlug: "sonar-produce",
    year: "2026",
    imageUrl: "/images/campanas/sonar/manual-01.webp",
    slides: [
      "/images/campanas/sonar/manual-01.webp",
      "/images/campanas/sonar/manual-03.webp",
      "/images/campanas/sonar/manual-06.webp",
      "/images/campanas/sonar/manual-10.webp",
      "/images/campanas/sonar/manual-13.webp",
      "/images/campanas/sonar/manual-14.webp",
    ],
  },
  sonarPlantillas: {
    portrait: true,
    client: "Sonar Produce",
    caseSlug: "sonar-produce",
    year: "2026",
    imageUrl: "/images/campanas/sonar/plantillas.webp",
    slides: ["/images/campanas/sonar/plantillas.webp"],
  },
  sonarCuentaRegresiva: {
    portrait: true,
    client: "Sonar Produce",
    caseSlug: "sonar-produce",
    year: "2026",
    imageUrl: "/images/campanas/sonar/cuenta-regresiva-portada.webp",
    slides: ["/images/campanas/sonar/cuenta-regresiva-reel.mp4", "/images/campanas/sonar/cuenta-regresiva-portada.webp"],
  },
};

const logosAssets = {
  grandgroove: {
    square: true,
    imageUrl: "/images/visual/Logos/Grandgroove/grandgroove-records-logo-1.png",
    slides: [
      "/images/visual/Logos/Grandgroove/grandgroove-records-logo-1.png",
      "/images/visual/Logos/Grandgroove/grandgroove-records-logo-2.png",
      "/images/visual/Logos/Grandgroove/grandgroove-records-logo-1.mp4",
    ],
  },
  chicaLunar: {
    square: true,
    imageUrl: "/images/visual/Logos/chicalunar/logo-chica-lunar-3.png",
    slides: [
      "/images/visual/Logos/chicalunar/logo-chica-lunar-3.png",
    ],
  },
};

// Reels de motion (9:16). `thumbnail` es la portada liviana de /images/loops/
// (8 s o menos, 360 px, sin audio, con su -poster.jpg); el reel entero va
// primero en `slides`, a 720 px y sin audio, y después su portada.
const reelAssets = {
  sonarCaso: {
    caseSlug: "sonar-produce",
    thumbnail: "/images/loops/reel-sonar-caso.mp4",
    slides: ["/images/reels/sonar-caso.mp4", "/images/reels/sonar-caso-portada.webp"],
  },
  // Los reels de la serie de press kits y el de kook. salen de la carpeta
  // «reels portfolio» del Drive: 720 px, 30 fps y sin audio para la web.
  kexxy: {
    thumbnail: "/images/loops/reel-kexxy.mp4",
    slides: ["/images/reels/kexxy.mp4"],
  },
  shodnanRef: {
    thumbnail: "/images/loops/reel-shodnan-ref.mp4",
    slides: ["/images/reels/shodnan-ref.mp4"],
  },
  martinaHobelar: {
    thumbnail: "/images/loops/reel-martina-hobelar.mp4",
    slides: ["/images/reels/martina-hobelar.mp4"],
  },
  kook: {
    thumbnail: "/images/loops/reel-kook.mp4",
    slides: ["/images/reels/kook.mp4"],
  },
  ctrlz: {
    thumbnail: "/images/loops/reel-ctrlz.mp4",
    slides: ["/images/reels/ctrlz.mp4"],
  },
  gabiRaiz: {
    thumbnail: "/images/loops/reel-gabi-raiz.mp4",
    slides: ["/images/reels/gabi-raiz.mp4"],
  },
};

const blenderAssets = {
  // Golden Faces y Faces Alternative eran dos fichas del mismo modelo con
  // otro material: van juntas. El showcase la busca por "golden-faces" en la
  // portada, así que la primera slide tiene que seguir siendo una dorada.
  goldenFaces: {
    square: true,
    slides: [
      "/images/blender/golden-faces/golden-1.png",
      "/images/blender/golden-faces/golden-2.png",
      "/images/blender/golden-faces/golden-3.png",
      "/images/blender/faces_alternative/faces-alternative-1.png",
      "/images/blender/faces_alternative/faces-alternative-2.png",
      "/images/blender/faces_alternative/faces-alternative-3.png",
      "/images/blender/faces_alternative/faces-alternative-4.png",
    ],
  },
  // Sin la slide que tenía "Mañana render final :p" quemado en la imagen ni la
  // -3, que era el mismo archivo que la -2. La portada naranja estaba sin usar
  // en Renders-3D.
  ratherModular: {
    portrait: true,
    slides: [
      "/images/blender/rather-modular/rathermodular-orange.webp",
      "/images/blender/rather-modular/rathermodular-2.png",
      "/images/blender/rather-modular/rathermodular-4.png",
      "/images/blender/rather-modular/rathermodular-5.png",
      "/images/blender/rather-modular/rathermodular-6.png",
      "/images/blender/rather-modular/rathermodular-1.mp4",
      "/images/blender/rather-modular/rathermodular-2.mp4",
    ],
  },
  calvariaGlass: {
    portrait: true,
    thumbnail: "/images/loops/calvaria-glass.mp4",
    slides: [
      "/images/blender/calvaria-glass/calvarian-animation.mp4",
      "/images/blender/calvaria-glass/calvarian_glass1.webp",
      "/images/blender/calvaria-glass/calvarian_glass2.webp",
      "/images/blender/calvaria-glass/calvarian_glass3.webp",
      "/images/blender/calvaria-glass/calvarian_glass4.webp",
    ],
  },
  metallicSwarm: {
    portrait: true,
    slides: [
      "/images/blender/metallic-swarm/metallic-swarm-1.png",
      "/images/blender/metallic-swarm/METALLIC_SWARM2.png",
    ],
  },
  plasticStudies: {
    square: true,
    slides: [
      "/images/blender/plastic-studies/plastic_preview.png",
      "/images/blender/plastic-studies/plastic-1.png",
      "/images/blender/plastic-studies/plastic-2.png",
    ],
  },
  abstract: {
    portrait: true,
    slides: [
      "/images/blender/abstract/abstract.png",
      "/images/blender/abstract/blackgoo.mp4",
    ],
  },
  // Oculta: la portada sale casi negra en la grilla y repetía el tema de las
  // cabezas. Queda cargada; se vuelve a mostrar con enabled: true (y en
  // public/content.json para español).
  screamingHead: {
    square: true,
    enabled: false,
    slides: [
      "/images/blender/Screaming_head/screaming-head-remake-1.png",
      "/images/blender/Screaming_head/screaming-head-remake-2.png",
    ],
  },
  // NCY I y II eran la misma serie en dos fichas: ahora una sola.
  noclueyet: {
    portrait: true,
    slides: [
      "/images/blender/noclueyet/cabezas-locas-1.png",
      "/images/blender/noclueyet/cabezas-locas-2.png",
      "/images/blender/noclueyet/cabezas-locas-3.png",
      "/images/blender/noclueyet/cabezas-locas-4.png",
      "/images/blender/noclueyet_1/carasdeformes.png",
    ],
  },
  overkillBlender: {
    square: true,
    slides: [
      "/images/blender/Overkill/overkill_prueba.png",
    ],
  },
  km240: {
    portrait: true,
    thumbnail: "/images/loops/240kmh.mp4",
    slides: [
      "/images/blender/240KM-H/semaforo-preview.mp4",
      "/images/blender/240KM-H/semaforo-1.png",
      "/images/blender/240KM-H/semaforo-2.png",
      "/images/blender/240KM-H/semaforo-3.png",
    ],
  },
  patrullero: {
    slides: [
      "/images/blender/patrullero/patrullero-1.png",
      "/images/blender/patrullero/patrullero-2.mp4",
      "/images/blender/patrullero/patrullero-1.mp4",
    ],
  },
  cristales: {
    portrait: true,
    thumbnail: "/images/loops/cristales.mp4",
    slides: [
      "/images/blender/cristales/cristales-preview.mp4",
      "/images/blender/cristales/cristales-1.png",
      "/images/blender/cristales/cristales-2.png",
    ],
  },
};

export const siteContent = {
  brand: "ENZO ZINGARETTI",
  defaultLanguage: "es",
  heroImage: null,
  languages: [
    { code: "es", label: "ES", name: "Español" },
    { code: "en", label: "EN", name: "English" },
    { code: "pt", label: "PT", name: "Português" },
  ],
  contactLinks: {
    email: "k3xxy.art@gmail.com",
    linkedin: "https://www.linkedin.com/in/enzo-diaz-zingaretti",
    github: "https://github.com/Enzodiazzingaretti",
  },
  locales: {
    es: {
      nav: [
        { label: "Motion", href: "/motion" },
        { label: "3D", href: "/3d" },
        { label: "Gráfica", href: "/grafica" },
        { label: "Tech", href: "/tech" },
      ],
      categories: {
        motion: {
          title: "MOTION",
          kicker: "Reels / Campañas / Marcas",
          subtitle: "Reels y piezas de motion para marcas, campañas y artistas.",
          groups: {
            ia: { title: "Comerciales con IA", note: "Anuncios, campañas y piezas audiovisuales hechas o asistidas con IA" },
            reels: { title: "Reels", note: "Motion para redes: press kits, campañas y marcas" },
          },
        },
        tresd: {
          title: "3D",
          kicker: "Blender / Render",
          subtitle: "Renders, animaciones, estudios de material y visualización de espacios.",
          groups: {
            blender: { title: "Renders & estudios", note: "Piezas y series hechas en Blender" },
            arquitectura: { title: "Arquitectura", note: "Visualización de espacios y clubes" },
          },
        },
        grafica: {
          title: "GRÁFICA",
          kicker: "Campañas / Flyers / Identidad",
          subtitle: "Campañas y piezas para eventos de electrónica, e identidades para artistas y sellos.",
          groups: {
            campanas: { title: "Campañas y dirección de arte", note: "Sonar Produce: sistema visual y campaña de su primera fecha" },
            flyers: { title: "Flyers y portadas", note: "Piezas para eventos y lanzamientos" },
            logos: { title: "Logos & branding", note: "Identidades para artistas y proyectos" },
          },
        },
        tech: {
          title: "TECH",
          kicker: "TouchDesigner / Código / Web",
          subtitle: "Visuales en tiempo real, sistemas generativos y sitios web: la parte técnica que sostiene el trabajo visual.",
          groups: {
            touchdesigner: { title: "TouchDesigner", note: "Loops audio-reactivos y visuales en tiempo real" },
            lab: { title: "Lab generativo", note: "Sistemas algorítmicos dibujándose en vivo a 145 BPM" },
            proyectos: { title: "Sitios web", note: "Diseño, desarrollo y deploy" },
          },
        },
      },
      labPieces: [
        { id: "congregacion", title: "CONGREGACIÓN", description: "Partículas siguiendo un campo de ruido fbm. Los trazos se acumulan sobre un fade lento y el pulso a 145 BPM les inyecta velocidad." },
        { id: "himno", title: "HIMNO FANTASMA", description: "Armonógrafo de dos péndulos amortiguados. Cuando la curva se apaga, el compás siguiente la reinicia con otra relación de frecuencias enteras." },
        { id: "comunion", title: "COMUNIÓN CELULAR", description: "Reacción-difusión de Gray-Scott sobre una grilla toroidal. Cinco regímenes: mitosis, gusanos, laberintos, coral y caos pulsante." },
        { id: "enjambre", title: "ENJAMBRE 145", description: "Atractor de De Jong. Miles de iteraciones por frame se acumulan en aditivo y los parámetros derivan a nuevos valores cada 8 compases." },
        { id: "liturgia", title: "LITURGIA BRUTAL", description: "Subdivisión recursiva en proporción áurea. El golpe corta la retícula en bandas desplazadas y cada 32 se recompone." },
        { id: "sudario", title: "SUDARIO", description: "Nube de 5.200 puntos sobre una esfera irregular, deformada por un campo de ruido que deriva. Gira en 3D con proyección en perspectiva y lo que el campo arranca del cuerpo quema en rojo." },
        { id: "salmo", title: "SALMO DE ARENA", description: "Figuras de Chladni. La arena camina al azar con un paso proporcional a la vibración de la placa, así que solo queda quieta sobre las líneas nodales. Cambia de modo cada 16 golpes." },
        { id: "velo", title: "VELO DEL TEMPLO", description: "Tela de Verlet de 30×20 nudos. El viento la infla y el golpe la sacude; los hilos que se estiran de más se cortan y no vuelven hasta que el velo se teje de nuevo." },
      ],
      hero: {
        title: "ENZO ZINGARETTI",
        description: "Motion, 3D y dirección de arte para marcas, campañas y artistas, con herramientas de IA y TouchDesigner en el proceso. Desde Mendoza, Argentina, en remoto.",
        location: "Mendoza, AR · UTC−3",
        availability: "Disponible",
        meta: "Portfolio / 2026",
        // El título va en inglés en los tres idiomas: es el puesto que se busca.
        // Cambia a «Creative AI & Motion Designer» recién cuando haya piezas
        // de IA publicadas (y a la par en LinkedIn y en los CV).
        headline: "Motion & 3D Designer",
        roles: ["Motion graphics", "3D y animación", "Campañas y dirección de arte", "Tecnología creativa"],
        cta: "Ver trabajo",
        scrollLabel: "scroll",
        shaderSelector: {
          ariaLabel: "Elegir fondo del hero",
          random: "azar",
          items: {
            sculpture: "Escultura",
            particles: "Particulas",
            organic: "Organica",
          },
        },
      },
      webProjects: [
        { ...webProjectAssets.portfolio, scrollPreview: true, title: "Portfolio Personal", type: "Web / Diseño y desarrollo", status: "Online", role: "Diseño y desarrollo", description: "Este sitio. React + Vite + Tailwind, con el hero en Three.js pasado por un filtro ASCII escrito a mano (shader propio). Adentro: un lab de ocho piezas generativas con parámetros en vivo, un panel de administración que guarda el contenido en el repo vía la API de GitHub, y todo en tres idiomas.", tags: ["React", "Three.js", "GLSL", "Vite", "Tailwind CSS"], features: ["Filtro ASCII en Three.js", "Lab generativo", "Panel de administración", "Trilingüe"] },
        { ...webProjectAssets.andino, title: "Andino Seguros", type: "Web / Diseño y desarrollo", status: "Online", role: "Diseño y desarrollo", description: "Sitio de un productor de seguros de Mendoza: diez formularios de cotización que terminan en un WhatsApp con los datos ya cargados, y un panel propio para seguir las consultas y la cartera de clientes. Next.js y TypeScript, con Sanity y Supabase.", tags: ["Next.js", "TypeScript", "Supabase", "Sanity", "Tailwind CSS"], features: ["Cotizador de 10 seguros", "Panel de consultas y clientes", "Contenido editable", "Una URL por seguro"] },
        { ...webProjectAssets.tamara, title: "Tamara González", type: "Web / Diseño y desarrollo", status: "Online", role: "Diseño y desarrollo", description: "Portfolio de una artista visual (tatuajes, ilustración y pintura). React + Vite + Tailwind CSS y Framer Motion, con panel de administración propio sobre funciones serverless para que ella actualice su galería. La API y el panel tienen tests con Vitest.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Vitest"], features: ["Panel de administración", "Tests con Vitest", "Galería por categoría", "Contacto por WhatsApp"] },
        { ...webProjectAssets.newMetals, title: "New Metals", type: "Web / Diseño y desarrollo", status: "Online", role: "Diseño y desarrollo", description: "Sitio para un taller de fabricación y soldadura metálica de Tupungato, Mendoza. React + Vite + Tailwind CSS y Framer Motion: hero animado con una chispa sobre negro, catálogo de trabajos editable desde un panel propio y contacto directo por WhatsApp.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion"], features: ["Panel de administración", "Catálogo de trabajos", "Contacto por WhatsApp"] },
        { ...webProjectAssets.pressKits, scrollPreview: false, title: "Press kits para artistas", type: "Web / Diseño y desarrollo", status: "Online", role: "Diseño y desarrollo", description: "Cinco press kits web para DJs a partir de una plantilla propia: Kexxy, CTRL.Z, Gabi Raíz, Martina Høbelar y Shodnan Ref. La misma base de arquitectura, una estética propia para cada artista y ningún dato que el artista no haya dado. HTML, CSS y JavaScript sin framework.", tags: ["HTML", "CSS", "JavaScript", "Vercel"], features: ["5 sitios en vivo", "Una estética por artista", "Booking sin servidor", "Sin framework"] },
        { ...webProjectAssets.aurora, title: "Cecilia — Hospedajes", type: "Web / Diseño y desarrollo", status: "En desarrollo", role: "Diseño y desarrollo", description: "Sitio para dos casas de alquiler en Mendoza. Next.js + TypeScript + Tailwind CSS, landing cinemática por propiedad, trilingüe.", tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"], features: ["Landing por propiedad", "Trilingüe", "Scroll suave"] },
      ],
      // Casos de estudio: título, bajada y orden. El cuerpo vive en src/cases/
      // y entra solo con la página del caso (/tech/<slug>). No los edita /admin.
      cases: [
        { slug: "sonar-produce", title: "Sonar Produce", tags: "Identidad · Campaña · Motion", summary: "El sistema visual de Sonar Produce y la campaña completa de su primera fecha: un radar como idea, tres reglas para todas las piezas y plantillas para las fechas que siguen." },
        { slug: "portfolio", title: "Portfolio Personal", tags: "React · Three.js · GLSL", summary: "Rehice la estructura de mi sitio y escribí a mano el filtro ASCII del hero. Los niveles del filtro, el peso de las páginas y el contraste los fijé midiendo." },
        { slug: "andino-seguros", title: "Andino Seguros", tags: "Next.js · TypeScript · Supabase", summary: "Un sitio para que cada visita termine en un WhatsApp con los datos del seguro ya cargados. Guarda la consulta antes de abrir el chat, y Federico la sigue desde un panel propio junto con su cartera de clientes." },
        { slug: "tamara-gonzalez", title: "Tamara González", tags: "React · Framer Motion · Panel propio", summary: "Empezó como portfolio de marketing y terminó siendo el de una artista visual. Le hice un panel para que cargue su obra sin tocar código, y ese panel quedó como base de otros tres sitios." },
        { slug: "press-kits", title: "Press kits para artistas", tags: "HTML · CSS · JavaScript", summary: "Cinco press kits para artistas a partir de una plantilla propia. Clonarla no funcionó: cada estructura sale del material del artista, y en un press kit no se inventa ningún dato." },
      ],
      // Comerciales con IA: vacía hasta que haya piezas publicadas (el grupo
      // no se muestra vacío). Se cargan desde /admin y acá en EN y PT.
      aiCommercials: [],
      motionReels: [
        { ...reelAssets.sonarCaso, title: "Sonar Produce — Reel del caso", client: "Sonar Produce", type: "Reel · Caso de estudio", year: "2026", duration: "25,6 s", description: "Reel propio que cuenta la campaña de SONAR 001 en 25 segundos: identidad, key visual (cuatro propuestas, se eligió la B), carrusel del line-up, motion, cuenta regresiva, entradas, horarios, plantillas y el mosaico de las 49 piezas. A 150 BPM: cada corte cae en el beat. No es After Effects: el video se genera con código (Python + ffmpeg), y la misma plantilla rinde el reel, la historia y el feed.", tags: ["Motion", "Python", "ffmpeg", "150 BPM"] },
        { ...reelAssets.kexxy, title: "KEXXY — Reel del press kit", client: "Kexxy", type: "Reel · Press kit", year: "2026", duration: "25 s", description: "El reel del press kit de Kexxy en su versión fanzine: portada, sets, próximas fechas, cabina, productoras y contacto. No es una grabación de pantalla: un motor propio copia el sitio en vivo, le inyecta un reloj virtual y lo graba cuadro por cuadro con Playwright y ffmpeg, con motion blur real.", tags: ["Motion", "Playwright", "ffmpeg", "Press kit"] },
        { ...reelAssets.shodnanRef, title: "Shodnan Ref — Reel del press kit", client: "Shodnan Ref", type: "Reel · Press kit", year: "2026", duration: "29 s", description: "Reel del press kit de Shodnan Ref, DJ de hardtechno y hardgroove de Tupungato: info, biografía, cabinas, rider y sonido, con la estética del sitio (revelado en blanco y negro, rojo y grano). Animado en HTML con GSAP.", tags: ["Motion", "GSAP", "Press kit"] },
        { ...reelAssets.martinaHobelar, title: "Martina Høbelar — Reel del press kit", client: "Martina Høbelar", type: "Reel · Press kit", year: "2026", duration: "23 s", description: "Recorrido por el press kit de Martina Høbelar, DJ y productora de hard techno y schranz: portada, sets, bio, fotos, rider y booking, y el sitio en el celular. Renderizado a 60 fps con el motor propio de la serie.", tags: ["Motion", "60 fps", "Press kit"] },
        { ...reelAssets.kook, title: "kook. — Armá la tuya", client: "kook.", type: "Historia · Motion para redes", year: "2026", duration: "21 s", description: "Motion para kook., tortas servidas en tazas de cerámica pintadas a mano. 21 s a 120 BPM con loop perfecto: el logo cae, «elegí tu torta», «elegí tu taza», el glaseado dibujado a mano y la foto real de la combinación. El wordmark está vectorizado letra por letra y la animación sale de un motor propio en HTML y Canvas, sin librerías.", tags: ["Motion", "Canvas", "120 BPM"] },
        { ...reelAssets.ctrlz, title: "CTRL.Z — Reel del press kit", client: "CTRL.Z", type: "Reel · Press kit", year: "2026", duration: "16 s", description: "Cinco escenas en 16 s: la portada, el sitio corriendo en el celular, las fotos de prensa y la trayectoria. Hecho con el mismo motor que el resto de la serie: el sitio real, con un reloj virtual, exportado cuadro por cuadro.", tags: ["Motion", "Playwright", "Press kit"] },
        { ...reelAssets.gabiRaiz, title: "Gabi Raíz — De la foto a la web", client: "Gabi Raíz", type: "Historia · Press kit", year: "2026", duration: "21 s", description: "Del retrato al sitio: las fotos de Coty Marty (@circes.eyes.ph) pasan al press kit de Gabi Raíz, DJ y productor de Mendoza, y el recorrido termina en el celular. La fotógrafa lleva su crédito en la pieza.", tags: ["Motion", "Press kit", "Fotografía"] },
      ],
      touchDesignerLoops: [
        { ...touchDesignerAssets.pulseVandal, name: "Pulse Vandal", notes: "Humo en blanco y negro que envuelve un vacío en el centro." },
        { ...touchDesignerAssets.ghostTunnel, name: "Ghost Tunnel", notes: "Caleidoscopio de partículas verdes en simetría radial." },
        { ...touchDesignerAssets.staticVeil, name: "Static Veil", notes: "Un rostro que aparece y se pierde entre humo, ruido y líneas de barrido." },
        { ...touchDesignerAssets.ironLattice, name: "Iron Lattice", notes: "Caleidoscopio en blanco y negro de formas óseas, como una radiografía." },
        { ...touchDesignerAssets.eyes, name: "Eyes", notes: "Grilla de ojos que giran, en rojo y blanco." },
        { ...touchDesignerAssets.biology, name: "Biology", notes: "Serie de loops orgánicos: filamentos y cilios en rosa y turquesa." },
        { ...touchDesignerAssets.kineticSand, name: "Kinetic Sand", notes: "Arena cinética simulada con respuesta al audio." },
      ],
      blenderWorks: [
        { ...blenderAssets.goldenFaces, title: "Golden Faces", description: "Cabezas derretidas en dos tratamientos: metal dorado especular sobre azul y blanco plano sobre negro." },
        { ...blenderAssets.ratherModular, title: "Rather Modular", description: "Composición orgánica de pétalos, fibras, burbujas de vidrio y humo. Variaciones de color y fondo." },
        { ...blenderAssets.calvariaGlass, title: "Calvaria Glass", description: "Formas neo-tribales en vidrio violeta y un corazón de cristal que gira. Estudio de refracción y brillo." },
        { ...blenderAssets.metallicSwarm, title: "Metallic Swarm", description: "Columnas vertebrales de metal con púas, enroscadas como serpientes. Estudio de material cromado." },
        { ...blenderAssets.plasticStudies, title: "Plastic Studies", description: "Una cabeza gritando y una bandeja de vinilo en paleta de cámara térmica, con stickers “Hello, my name is”." },
        { ...blenderAssets.km240, title: "240 KM/H", description: "Spec, por iniciativa propia: no es un encargo de 240 KM/H ni está afiliado a la marca. Semáforo bajo la lluvia, de noche: pasa a verde y se enciende un cartel con el logo de 240 KM/H. Vertical, para Reels." },
        { ...blenderAssets.patrullero, title: "Patrullero", description: "Un patrullero cubierto de grafiti en un callejón, de noche. Modelado y animación en Blender." },
        { ...blenderAssets.cristales, title: "Cristales", description: "Geometría cristalina con refracción en Blender Cycles." },
        { ...blenderAssets.abstract, title: "Abstract Vol. I", description: "Formas orgánicas y fluidos abstractos en Blender." },
        { ...blenderAssets.screamingHead, title: "Screaming Head", description: "Un rostro que grita bajo una tela negra brillante." },
        { ...blenderAssets.noclueyet, title: "Chrome Grotesque", description: "Cabezas cromadas apiladas, gritando, con dientes de oro, y una variación en negro brillante sobre gris claro." },
        { ...blenderAssets.overkillBlender, title: "Overkill 3D", description: "Dos manos que se buscan a través de portales de luz roja. Render para la sesión Overkill." },
      ],
      campaigns: [
        { ...campaignAssets.sonarKeyVisual, title: "Sonar 001 — Key visual", type: "Key visual", description: "Key visual de SONAR 001, la primera fecha de Sonar Produce (Stella Bossi, Mendoza, 30.10.2026). Fondo negro, el radar del logo ordena la pieza alrededor de la artista y el rojo aparece solo donde hay que mirar. Presenté cuatro opciones; Sonar eligió esta. Feed 3:4 e historia 9:16.", tags: ["Dirección de arte", "Flyer", "Photoshop"] },
        { ...campaignAssets.sonarLineUp, title: "Sonar 001 — Animación del line-up", type: "Motion / Reel", description: "Reel de 14,4 s a 150 BPM: el radar barre la pieza, el golpe de la headliner cae en el segundo 9,6 y el cierre es la tapa del carrusel. Reel e historia en 1080 × 1920.", tags: ["Motion", "Dirección de arte", "Reel"] },
        { ...campaignAssets.sonarCarrusel, title: "Sonar 001 — Carrusel del line-up", type: "Carrusel", description: "Cinco placas 3:4 para el feed: la tapa y una por artista, con su foto tratada en negro, blanco y rojo, su rol, una bio corta y su @. Cada placa sale también en historia y reel.", tags: ["Dirección de arte", "Carrusel", "Photoshop"] },
        { ...campaignAssets.sonarHorarios, title: "Sonar 001 — Horarios", type: "Placa", description: "Una franja por set, con la foto de cada artista; el alto de la franja es proporcional a lo que dura el set y la headliner va en rojo. Feed, historia y reel.", tags: ["Diseño", "Placa", "Photoshop"] },
        { ...campaignAssets.sonarEntradas, title: "Sonar 001 — Entradas", type: "Placa", description: "Las tres tandas de venta, cada una con su talón para el sello de SOLD OUT. En el PSD los sellos son capas: se prende el de cada tanda cuando se agota, sin rehacer la pieza.", tags: ["Diseño", "Placa", "Photoshop"] },
        { ...campaignAssets.sonarManual, title: "Sonar — Manual de marca", type: "Branding / Sistema visual", description: "Manual de 16 páginas que baja el documento de marca a reglas concretas: el radar como concepto, tres colores con su proporción, dos tipografías, tratamiento de foto con mapa de degradado, zonas seguras por formato y usos incorrectos.", tags: ["Branding", "Sistema visual", "Manual de marca"] },
        { ...campaignAssets.sonarPlantillas, title: "Sonar — Plantillas", type: "Plantillas", description: "Tres plantillas de Photoshop para las próximas fechas (flyer de fecha, placa de artista y anuncio), cada una en feed, historia y reel. La foto toma el look de Sonar desde una capa de ajuste: al cambiarla, el tratamiento se aplica solo.", tags: ["Plantillas", "Photoshop", "Sistema visual"] },
        { ...campaignAssets.sonarCuentaRegresiva, title: "Sonar 001 — Cuenta regresiva", type: "Motion / Reel", description: "Animación de 14,4 s a 150 BPM: el 3-2-1 en el dial del radar, los datos de la fecha y el golpe final en rojo. Un reel, un feed y una historia por día. Se arma desde una plantilla de After Effects con los textos editables.", tags: ["Motion", "After Effects", "Plantilla"] },
      ],
      flyers: [
        { ...flyerAssets.innusual, title: "Innusual — V/A002INNU", type: "Portada", description: "Portada del compilado [V/A002INNU] del sello Innusual, de Buenos Aires (2025). El render es mío; la ilustración, de @shifo.__. Un disco partido desde el centro dentro de un marco técnico, casi sin color, para que se lea igual en miniatura que en grande.", tags: ["Portada", "3D", "Dirección de arte"] },
        { ...flyerAssets.aguantaderobass, title: "Aguantadero Bass", type: "Flyer", description: "Flyers 3D para el ciclo Aguantadero Bass (dubstep y drum & bass, Buenos Aires): la cabina de DJ en gran angular y el line-up en pantalla. Dos fechas, con versión animada.", tags: ["Diseño", "Flyer", "3D", "Motion"] },
        { ...flyerAssets.blastkick, title: "Blastkick", type: "Flyer", description: "Flyer 3D del Blastkick Festival (Club Sportivo Italiano): un monolito de piedra con raíces rojas y el line-up grabado. Incluye reel animado.", tags: ["Diseño", "Flyer", "3D", "Motion"] },
        { ...flyerAssets.blastkickAnoNuevo, title: "Blastkick — Año Nuevo", type: "Flyer", description: "Edición del 31 de diciembre: composición 3D en violeta y dorado.", tags: ["Diseño", "Flyer", "3D"] },
        { ...flyerAssets.distRaptisKexxy, title: "Dist. Raptis. Kexxy.", type: "Flyer", description: "Cadenas y tipografía gótica sobre rojo, para DIST b2b RAPTIS y Kexxy.", tags: ["Diseño", "Flyer", "3D"] },
        { ...flyerAssets.maccari, title: "Maccari", type: "Flyer", description: "Flyer animado en 3D para Maccari: una sala de cables con pantallas que muestran al artista y los logos de la fecha.", tags: ["Diseño", "Flyer", "3D", "Motion"] },
        { ...flyerAssets.overkill, title: "Overkill", type: "Flyer", description: "Placa de piedra colgada de cadenas con el line-up grabado, para la sesión Overkill.", tags: ["Diseño", "Flyer", "3D"] },
      ],
      logos: [
        { ...logosAssets.grandgroove, title: "Grandgroove Records", type: "Logo", description: "Logo para el sello Grandgroove Records: una G de trazo fino entre dos órbitas. Versión 3D cromada que gira.", tags: ["Logo", "Branding", "Motion"] },
        { ...logosAssets.chicaLunar, title: "Chica Lunar", type: "Logo", description: "Logo cromado estilo Y2K, con estrellas y una órbita.", tags: ["Logo", "Branding"] },
      ],
      espacios: [
        { ...espaciosAssets.plug, title: "Plug", type: "3D / Arquitectura", description: "Cabina de DJ y pista de un espacio para eventos, con luz roja y mural. Incluye vistas de trabajo sin texturas.", tags: ["Blender", "Arquitectura", "3D"] },
        { ...espaciosAssets.recUnderclub, title: "REC Underclub", type: "3D / Arquitectura", description: "Club en luz roja con overlay de cámara REC: renders y recorridos en video.", tags: ["Blender", "Arquitectura", "3D"] },
        { ...espaciosAssets.underberlin, title: "Underberlin", type: "3D / Motion", description: "Club underground estilo Berlín: cabina, barandas de metal y haces de luz. Renders y video.", tags: ["Blender", "Motion", "3D"] },
      ],
      about: {
        headline: "Motion, 3D y dirección de arte para marcas, campañas y artistas.",
        paragraph: "Diseño y animo key visuals, reels, renders 3D y piezas para redes. Trabajo en Blender, After Effects y Photoshop, uso herramientas de IA en el proceso y sumo TouchDesigner y código cuando la pieza lo pide. Freelance desde 2022 para marcas, artistas y eventos.",
        // Datos duros para quien evalúa en 30 segundos. Solo viven acá:
        // content.json no los define, así que en español también salen de acá.
        facts: [
          { label: "Experiencia", value: "3D y motion desde 2022 · Desarrollo web desde 2023" },
          { label: "Idiomas", value: "Español nativo · Inglés avanzado (título de traductor) · Portugués intermedio" },
          { label: "Base", value: "Mendoza, Argentina · UTC−3, a 1–2 h de la costa este de EE. UU." },
          { label: "Disponibilidad", value: "Full-time remoto · Freelance" },
          { label: "Herramientas", value: "Blender · After Effects · Photoshop · TouchDesigner · Herramientas de IA · Figma · React" },
        ],
        specializations: ["Motion graphics / After Effects", "3D y animación / Blender", "Campañas y dirección de arte", "Branding e identidad", "Tecnología creativa / TouchDesigner", "Desarrollo web"],
      },
      contact: {
        headline: "HABLEMOS",
        availableForLabel: "Disponible para",
        availableFor: ["Full-time remoto", "Freelance", "Motion design", "3D", "Dirección de arte", "Campañas", "Branding"],
        cta: "Escribime",
        note: "Respondo en menos de 24 horas",
        cv: "/cv/Enzo-Diaz-Zingaretti-CV-ES.pdf",
      },
      ui: {
        nav: { back: "Volver", home: "Inicio", index: "Índice", about: "Sobre mí", showcase: "Destacados", cases: "Casos", contact: "Contacto", enter: "Entrar", close: "Cerrar" },
        showcase: {
          previous: "Anterior",
          next: "Siguiente",
          audio: { listen: "Escuchar el audio de esta pieza", mute: "Silenciar" },
        },
        worksLabel: "piezas",
        workLabelSingular: "pieza",
        details: "Ver detalles",
        readCase: "Leer el caso",
        visitSite: "Abrir web",
        viewCode: "Código",
        loopLabel: "Loop",
        touchDesignerLoop: "Loop TouchDesigner",
        blenderRender: "Render Blender",
        renderTags: ["blender", "3d", "render"],
        contactLabels: { email: "Email", instagram: "Instagram", linkedin: "LinkedIn", github: "GitHub", profile: "Perfil", cv: "Descargar CV (PDF)" },
        modal: { close: "Cerrar", previous: "Anterior", next: "Siguiente", navigateHint: "← → para navegar · ", closeHint: "ESC para cerrar", year: "Año", role: "Rol", status: "Estado", client: "Cliente", duration: "Duración", tools: "Herramientas", visitSite: "Abrir sitio", viewCode: "Ver código", features: "Incluye", infoShow: "Ver info", infoClose: "Cerrar", slide: "Slide", readCase: "Leer el caso" },
        skipToContent: "Saltar al contenido",
        backToTop: "Inicio",
        lab: {
          seed: "Semilla", hint: "Click: nueva semilla", reseed: "nueva semilla",
          controlsTitle: "Parámetros", reset: "reset",
          controls: {
            densidad: "densidad", campo: "campo", turbulencia: "turbulencia", estela: "estela",
            amortiguacion: "amortiguación", velocidad: "velocidad", amplitud: "amplitud",
            regimen: "régimen", incandescencia: "incandescencia", siembra: "siembra",
            plegado: "plegado", morfosis: "morfosis",
            profundidad: "profundidad", corte: "corte", glitch: "glitch", epoca: "época",
            deformacion: "deformación", rotacion: "rotación",
            modo: "modo", simetria: "simetría", agitacion: "agitación",
            gravedad: "gravedad", viento: "viento", rigidez: "rigidez", desgarro: "desgarro",
          },
        },
        footerLocation: "Argentina / Internacional",
        pageTitle: "Portfolio",
        notFound: { title: "Esta página no existe", text: "El enlace es viejo o está mal escrito. Probá con una categoría." },
        aboutCta: "Hablemos",
        cvCta: "Descargar CV",
        // Rotulos que solo escucha un lector de pantalla. Estaban en español
        // fijo: alguien navegando el sitio en inglés los oia igual en español.
        a11y: { openConsole: "Abrir la consola oculta", adminPanel: "Panel de administración" },
        konsole: {
          hintLong: 'escribí "enzo"',
          hintShort: "consola",
          prompt: "escribí un comando...",
          // Las descripciones del `help`. El resto de la terminal es salida de
          // maquina y queda en inglés a proposito, en los tres idiomas.
          commands: {
            about: "manifiesto de identidad",
            links: "redes y contacto",
            stack: "herramientas y software",
            play: "activar stream de audio underground",
            vjpack: "descargar VJ asset pack (coming soon)",
            glitch: "fragmentar la interfaz visual",
            status: "diagnóstico del sistema",
            credits: "stack técnico + mensaje oculto",
            clear: "limpiar consola",
            exit: "cerrar terminal",
          },
        },
        // Secuencia de arranque. Es texto de maquina, va igual en los tres
        // idiomas; vive acá para poder cambiarlo sin tocar el componente.
        // Capa «tinta y señal»: rótulos del HUD, la nota a mano del hero y las
        // cintas. Van en `ui` y no en content.json: son interfaz, no obra.
        ink: {
          live: "En vivo",
          coords: "32°53′S 68°50′O",
          showreel: { title: "Trabajo seleccionado", open: "Ver la pieza", list: "Piezas seleccionadas", play: "Reproducir el showreel", pause: "Pausar el showreel" },
          reels: { open: "Ver reel", hint: "Deslizá →", previous: "Anteriores", next: "Siguientes" },
          cases: { label: "Caso", plural: "casos" },
          cursor: { view: "Ver", play: "Play" },
          modal: { piece: "Pieza", prevPiece: "Pieza anterior", nextPiece: "Pieza siguiente" },
        },
        boot: [
          "INITIALIZING PORTFOLIO_SYS v1.0",
          "LOADING ASSET MANIFEST...",
          "3D RENDER CACHE: OK",
          "MOTION SYSTEM: ONLINE",
          "VISUAL ARCHIVE: INDEXED",
          "IDENTITY LAYER: ACTIVE",
          "BOOT SEQUENCE COMPLETE",
        ],
      },
    },
    en: {
      nav: [
        { label: "Motion", href: "/motion" },
        { label: "3D", href: "/3d" },
        { label: "Graphics", href: "/grafica" },
        { label: "Tech", href: "/tech" },
      ],
      categories: {
        motion: {
          title: "MOTION",
          kicker: "Reels / Campaigns / Brands",
          subtitle: "Reels and motion pieces for brands, campaigns and artists.",
          groups: {
            ia: { title: "AI commercials", note: "Ads, campaigns and films made or assisted with AI" },
            reels: { title: "Reels", note: "Motion for social: press kits, campaigns and brands" },
          },
        },
        tresd: {
          title: "3D",
          kicker: "Blender / Rendering",
          subtitle: "Renders, animations, material studies and space visualisation.",
          groups: {
            blender: { title: "Renders & studies", note: "Pieces and series made in Blender" },
            arquitectura: { title: "Architecture", note: "Visualisation of spaces and clubs" },
          },
        },
        grafica: {
          title: "GRAPHICS",
          kicker: "Campaigns / Flyers / Identity",
          subtitle: "Pieces for electronic music events and identities for artists and labels.",
          groups: {
            campanas: { title: "Campaigns & art direction", note: "Sonar Produce: visual system and launch campaign for its first night" },
            flyers: { title: "Flyers & covers", note: "Pieces for events and releases" },
            logos: { title: "Logos & branding", note: "Identities for artists and projects" },
          },
        },
        tech: {
          title: "TECH",
          kicker: "TouchDesigner / Code / Web",
          subtitle: "Real-time visuals, generative systems and websites: the technical side behind the visual work.",
          groups: {
            touchdesigner: { title: "TouchDesigner", note: "Audio-reactive loops and real-time visuals" },
            lab: { title: "Generative lab", note: "Algorithmic systems drawing live at 145 BPM" },
            proyectos: { title: "Websites", note: "Design, development and deploy" },
          },
        },
      },
      labPieces: [
        { id: "congregacion", title: "CONGREGACIÓN", description: "Particles following an fbm noise field. Trails build up over a slow fade and the 145 BPM pulse injects speed." },
        { id: "himno", title: "HIMNO FANTASMA", description: "Harmonograph with two damped pendulums. When the curve fades out, the next bar restarts it with another integer frequency ratio." },
        { id: "comunion", title: "COMUNIÓN CELULAR", description: "Gray-Scott reaction-diffusion on a toroidal grid. Five regimes: mitosis, worms, labyrinths, coral and pulsing chaos." },
        { id: "enjambre", title: "ENJAMBRE 145", description: "De Jong attractor. Thousands of iterations per frame build up additively and the parameters drift to new values every 8 bars." },
        { id: "liturgia", title: "LITURGIA BRUTAL", description: "Recursive golden-ratio subdivision. The beat cuts the grid into displaced bands and every 32 it recomposes." },
        { id: "sudario", title: "SUDARIO", description: "A cloud of 5,200 points on an irregular sphere, deformed by a drifting noise field. It spins in 3D under perspective projection, and whatever the field tears off the body burns red." },
        { id: "salmo", title: "SALMO DE ARENA", description: "Chladni figures. The sand walks at random with a step proportional to how hard the plate vibrates beneath it, so it only rests on the nodal lines. New mode every 16 beats." },
        { id: "velo", title: "VELO DEL TEMPLO", description: "A 30×20 Verlet cloth. Wind fills it and the beat shakes it; threads stretched past their limit snap and stay snapped until the veil is woven again." },
      ],
      hero: {
        title: "ENZO ZINGARETTI",
        description: "Motion, 3D and art direction for brands, campaigns and artists, with AI tools and TouchDesigner in the process. Based in Mendoza, Argentina, working remotely.",
        location: "Mendoza, AR · UTC−3",
        availability: "Available",
        meta: "Portfolio / 2026",
        headline: "Motion & 3D Designer",
        roles: ["Motion graphics", "3D design & animation", "Campaigns & art direction", "Creative technology"],
        cta: "See the work",
        scrollLabel: "scroll",
        shaderSelector: {
          ariaLabel: "Choose hero background",
          random: "random",
          items: {
            sculpture: "Sculpture",
            particles: "Particles",
            organic: "Organic",
          },
        },
      },
      webProjects: [
        { ...webProjectAssets.portfolio, scrollPreview: true, title: "Personal Portfolio", type: "Web / Design and development", status: "Live", role: "Design and development", description: "This site. React + Vite + Tailwind, with a Three.js hero run through a hand-written ASCII shader. Inside: a lab of eight generative pieces with live parameters, an admin panel that saves content to the repo through the GitHub API, and everything in three languages.", tags: ["React", "Three.js", "GLSL", "Vite", "Tailwind CSS"], features: ["Three.js ASCII pass", "Generative lab", "Admin panel", "Trilingual"] },
        { ...webProjectAssets.andino, title: "Andino Seguros", type: "Web / Design and development", status: "Live", role: "Design and development", description: "Site for an insurance broker in Mendoza: ten quote forms that end in a WhatsApp chat with the details already filled in, and a custom panel to follow up leads and the client portfolio. Next.js and TypeScript, with Sanity and Supabase.", tags: ["Next.js", "TypeScript", "Supabase", "Sanity", "Tailwind CSS"], features: ["Quotes for 10 insurance types", "Leads and clients panel", "Editable content", "One URL per insurance type"] },
        { ...webProjectAssets.tamara, title: "Tamara González", type: "Web / Design and development", status: "Live", role: "Design and development", description: "Portfolio for a visual artist (tattoos, illustration and painting). React + Vite + Tailwind CSS and Framer Motion, with a custom admin panel on serverless functions so she can update her gallery herself. The API and the panel are tested with Vitest.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Vitest"], features: ["Admin panel", "Vitest tests", "Gallery by category", "WhatsApp contact"] },
        { ...webProjectAssets.newMetals, title: "New Metals", type: "Web / Design and development", status: "Live", role: "Design and development", description: "Site for a metal fabrication and welding workshop in Tupungato, Mendoza. React + Vite + Tailwind CSS and Framer Motion: an animated hero with a spark on black, a work catalogue editable from a custom admin panel, and direct WhatsApp contact.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion"], features: ["Admin panel", "Work catalogue", "WhatsApp contact"] },
        { ...webProjectAssets.pressKits, scrollPreview: false, title: "Artist press kits", type: "Web / Design and development", status: "Live", role: "Design and development", description: "Five web press kits for DJs built from a template of my own: Kexxy, CTRL.Z, Gabi Raíz, Martina Høbelar and Shodnan Ref. The same architecture underneath, a look of its own for each artist, and no fact the artist didn't give. Framework-free HTML, CSS and JavaScript.", tags: ["HTML", "CSS", "JavaScript", "Vercel"], features: ["5 live sites", "A look per artist", "Server-free booking", "No framework"] },
        { ...webProjectAssets.aurora, title: "Cecilia — Stays", type: "Web / Design and development", status: "In development", role: "Design and development", description: "Site for two rental houses in Mendoza. Next.js + TypeScript + Tailwind CSS, cinematic landing per property, trilingual.", tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"], features: ["Landing per property", "Trilingual", "Smooth scroll"] },
      ],
      cases: [
        { slug: "sonar-produce", title: "Sonar Produce", tags: "Identity · Campaign · Motion", summary: "Sonar Produce's visual system and the full campaign for its first night: a radar as the idea, three rules for every piece and templates for the nights to come." },
        { slug: "portfolio", title: "Personal Portfolio", tags: "React · Three.js · GLSL", summary: "I rebuilt my site's structure and hand-wrote the ASCII filter on the hero. The filter levels, page weight and contrast were all set by measuring." },
        { slug: "andino-seguros", title: "Andino Seguros", tags: "Next.js · TypeScript · Supabase", summary: "A site built so every visit ends in a WhatsApp chat with the insurance details already filled in. It saves the lead before opening the chat, and the broker follows it up from a custom panel along with his client portfolio." },
        { slug: "tamara-gonzalez", title: "Tamara González", tags: "React · Framer Motion · Custom CMS", summary: "It started as a marketing portfolio and ended up as a visual artist's. I built her a panel to upload her work without touching code, and that panel became the base for three other sites." },
        { slug: "press-kits", title: "Artist press kits", tags: "HTML · CSS · JavaScript", summary: "Five artist press kits built from a template of my own. Cloning it didn't work: each structure comes from the artist's material, and a press kit never invents a fact." },
      ],
      // Comerciales con IA: vacía hasta que haya piezas publicadas (el grupo
      // no se muestra vacío). Se cargan desde /admin y acá en EN y PT.
      aiCommercials: [],
      motionReels: [
        { ...reelAssets.sonarCaso, title: "Sonar Produce — Case reel", client: "Sonar Produce", type: "Reel · Case study", year: "2026", duration: "25.6 s", description: "My own reel telling the SONAR 001 campaign in 25 seconds: identity, key visual (four proposals, B was chosen), line-up carousel, motion, countdown, tickets, set times, templates and the mosaic of all 49 pieces. At 150 BPM, every cut lands on the beat. It isn't After Effects: the video is generated with code (Python + ffmpeg), and the same template renders the reel, the story and the feed.", tags: ["Motion", "Python", "ffmpeg", "150 BPM"] },
        { ...reelAssets.kexxy, title: "KEXXY — Press kit reel", client: "Kexxy", type: "Reel · Press kit", year: "2026", duration: "25 s", description: "The reel for Kexxy's press kit, in its fanzine version: cover, sets, upcoming dates, booth, promoters and contact. It isn't a screen recording: an engine of my own mirrors the live site, injects a virtual clock and records it frame by frame with Playwright and ffmpeg, with real motion blur.", tags: ["Motion", "Playwright", "ffmpeg", "Press kit"] },
        { ...reelAssets.shodnanRef, title: "Shodnan Ref — Press kit reel", client: "Shodnan Ref", type: "Reel · Press kit", year: "2026", duration: "29 s", description: "Reel for the press kit of Shodnan Ref, a hardtechno and hardgroove DJ from Tupungato: info, bio, booths, rider and sound, in the site's look (black-and-white development, red and grain). Animated in HTML with GSAP.", tags: ["Motion", "GSAP", "Press kit"] },
        { ...reelAssets.martinaHobelar, title: "Martina Høbelar — Press kit reel", client: "Martina Høbelar", type: "Reel · Press kit", year: "2026", duration: "23 s", description: "A walkthrough of the press kit of Martina Høbelar, a hard techno and schranz DJ and producer: cover, sets, bio, photos, rider and booking, plus the site on a phone. Rendered at 60 fps with the series' own engine.", tags: ["Motion", "60 fps", "Press kit"] },
        { ...reelAssets.kook, title: "kook. — Build yours", client: "kook.", type: "Story · Social motion", year: "2026", duration: "21 s", description: "Motion for kook., cakes served in hand-painted ceramic cups. 21 s at 120 BPM with a seamless loop: the logo drops, “pick your cake”, “pick your cup”, the hand-drawn frosting and the real photo of the combination. The wordmark is vectorized letter by letter and the animation comes from an engine of my own in HTML and Canvas, with no libraries.", tags: ["Motion", "Canvas", "120 BPM"] },
        { ...reelAssets.ctrlz, title: "CTRL.Z — Press kit reel", client: "CTRL.Z", type: "Reel · Press kit", year: "2026", duration: "16 s", description: "Five scenes in 16 s: the cover, the site running on a phone, the press photos and the track record. Made with the same engine as the rest of the series: the real site, on a virtual clock, exported frame by frame.", tags: ["Motion", "Playwright", "Press kit"] },
        { ...reelAssets.gabiRaiz, title: "Gabi Raíz — From photo to web", client: "Gabi Raíz", type: "Story · Press kit", year: "2026", duration: "21 s", description: "From portrait to site: Coty Marty's photos (@circes.eyes.ph) flow into the press kit of Gabi Raíz, a DJ and producer from Mendoza, and the walkthrough ends on a phone. The photographer is credited in the piece.", tags: ["Motion", "Press kit", "Photography"] },
      ],
      touchDesignerLoops: [
        { ...touchDesignerAssets.pulseVandal, name: "Pulse Vandal", notes: "Black-and-white smoke wrapped around an empty centre." },
        { ...touchDesignerAssets.ghostTunnel, name: "Ghost Tunnel", notes: "A kaleidoscope of green particles in radial symmetry." },
        { ...touchDesignerAssets.staticVeil, name: "Static Veil", notes: "A face that surfaces and fades through smoke, noise and scanlines." },
        { ...touchDesignerAssets.ironLattice, name: "Iron Lattice", notes: "A black-and-white kaleidoscope of bone-like forms, like an X-ray." },
        { ...touchDesignerAssets.eyes, name: "Eyes", notes: "A grid of turning eyeballs in red and white." },
        { ...touchDesignerAssets.biology, name: "Biology", notes: "A series of organic loops: filaments and cilia in pink and teal." },
        { ...touchDesignerAssets.kineticSand, name: "Kinetic Sand", notes: "Kinetic sand simulation with audio response." },
      ],
      blenderWorks: [
        { ...blenderAssets.goldenFaces, title: "Golden Faces", description: "Melted heads in two treatments: specular gold metal on blue, and flat white on black." },
        { ...blenderAssets.ratherModular, title: "Rather Modular", description: "An organic composition of petals, fibres, glass bubbles and smoke. Colour and background variations." },
        { ...blenderAssets.calvariaGlass, title: "Calvaria Glass", description: "Neo-tribal shapes in violet glass and a spinning crystal heart. Refraction and glow study." },
        { ...blenderAssets.metallicSwarm, title: "Metallic Swarm", description: "Spiked metal spines coiling like snakes. Chrome material study." },
        { ...blenderAssets.plasticStudies, title: "Plastic Studies", description: "A screaming head and a turntable in a thermal-camera palette, with “Hello, my name is” stickers." },
        { ...blenderAssets.km240, title: "240 KM/H", description: "Spec / self-initiated. Not commissioned by or affiliated with 240 KM/H. A traffic light in the rain at night: it turns green and a sign with the 240 KM/H logo lights up. Vertical, for Reels." },
        { ...blenderAssets.patrullero, title: "Patrullero", description: "A police car covered in graffiti, in an alley at night. Modelling and animation in Blender." },
        { ...blenderAssets.cristales, title: "Cristales", description: "Crystal geometry with light refraction in Cycles." },
        { ...blenderAssets.abstract, title: "Abstract Vol. I", description: "Organic shapes and fluid abstractions in Blender." },
        { ...blenderAssets.screamingHead, title: "Screaming Head", description: "A screaming face pressing through a glossy black sheet." },
        { ...blenderAssets.noclueyet, title: "Chrome Grotesque", description: "Stacked chrome heads, screaming, with gold teeth, plus a variation in glossy black on light grey." },
        { ...blenderAssets.overkillBlender, title: "Overkill 3D", description: "Two hands reaching for each other through portals of red light. Render for the Overkill session." },
      ],
      campaigns: [
        { ...campaignAssets.sonarKeyVisual, title: "Sonar 001 — Key visual", type: "Key visual", description: "Key visual for SONAR 001, the first night by Sonar Produce (Stella Bossi, Mendoza, 30.10.2026). Black background, the logo's radar organizing the piece around the artist, and red only where the eye should go. I presented four options; Sonar chose this one. 3:4 feed and 9:16 story.", tags: ["Art direction", "Flyer", "Photoshop"] },
        { ...campaignAssets.sonarLineUp, title: "Sonar 001 — Line-up animation", type: "Motion / Reel", description: "A 14.4 s reel at 150 BPM: the radar sweeps the frame, the headliner's hit lands at 9.6 s and it closes on the carousel cover. Reel and story at 1080 × 1920.", tags: ["Motion", "Art direction", "Reel"] },
        { ...campaignAssets.sonarCarrusel, title: "Sonar 001 — Line-up carousel", type: "Carousel", description: "Five 3:4 feed slides: the cover and one per artist, with their photo treated in black, white and red, their role, a short bio and their handle. Each slide also ships as a story and a reel.", tags: ["Art direction", "Carousel", "Photoshop"] },
        { ...campaignAssets.sonarHorarios, title: "Sonar 001 — Set times", type: "Post", description: "One band per set with each artist's photo; each band's height is proportional to the set's length and the headliner is in red. Feed, story and reel.", tags: ["Design", "Post", "Photoshop"] },
        { ...campaignAssets.sonarEntradas, title: "Sonar 001 — Tickets", type: "Post", description: "The three ticket tiers, each with a stub for the SOLD OUT stamp. In the PSD the stamps are layers: switch on each tier's stamp when it sells out, no redesign needed.", tags: ["Design", "Post", "Photoshop"] },
        { ...campaignAssets.sonarManual, title: "Sonar — Brand manual", type: "Branding / Visual system", description: "A 16-page manual that turns the brand document into concrete rules: the radar as concept, three colors and their proportion, two typefaces, a gradient-map photo treatment, safe zones per format and incorrect uses.", tags: ["Branding", "Visual system", "Brand manual"] },
        { ...campaignAssets.sonarPlantillas, title: "Sonar — Templates", type: "Templates", description: "Three Photoshop templates for upcoming nights (date flyer, artist card and announcement), each in feed, story and reel. Photos take on Sonar's look through an adjustment layer: swap the photo and the treatment applies itself.", tags: ["Templates", "Photoshop", "Visual system"] },
        { ...campaignAssets.sonarCuentaRegresiva, title: "Sonar 001 — Countdown", type: "Motion / Reel", description: "A 14.4 s animation at 150 BPM: 3-2-1 on the radar dial, the event details and a final hit in red. One reel, one feed post and a story per day, built from an After Effects template with editable text.", tags: ["Motion", "After Effects", "Template"] },
      ],
      flyers: [
        { ...flyerAssets.innusual, title: "Innusual — V/A002INNU", type: "Cover art", description: "Cover for the [V/A002INNU] compilation on Innusual, a Buenos Aires label (2025). The render is mine; the illustration is by @shifo.__. A disc fractured from the center inside a technical frame, almost colorless, so it reads the same as a thumbnail and at full size.", tags: ["Cover art", "3D", "Art direction"] },
        { ...flyerAssets.aguantaderobass, title: "Aguantadero Bass", type: "Flyer", description: "3D flyers for the Aguantadero Bass night (dubstep and drum & bass, Buenos Aires): the DJ booth in wide angle with the line-up on screen. Two dates, with an animated version.", tags: ["Design", "Flyer", "3D", "Motion"] },
        { ...flyerAssets.blastkick, title: "Blastkick", type: "Flyer", description: "3D flyer for Blastkick Festival (Club Sportivo Italiano): a stone monolith with red roots and the line-up carved in. Includes an animated reel.", tags: ["Design", "Flyer", "3D", "Motion"] },
        { ...flyerAssets.blastkickAnoNuevo, title: "Blastkick — New Year", type: "Flyer", description: "New Year's Eve edition: a 3D composition in violet and gold.", tags: ["Design", "Flyer", "3D"] },
        { ...flyerAssets.distRaptisKexxy, title: "Dist. Raptis. Kexxy.", type: "Flyer", description: "Chains and gothic type on red, for DIST b2b RAPTIS and Kexxy.", tags: ["Design", "Flyer", "3D"] },
        { ...flyerAssets.maccari, title: "Maccari", type: "Flyer", description: "Animated 3D flyer for Maccari: a room of cables with screens showing the artist and the event logos.", tags: ["Design", "Flyer", "3D", "Motion"] },
        { ...flyerAssets.overkill, title: "Overkill", type: "Flyer", description: "A stone plaque hanging from chains with the line-up carved in, for the Overkill session.", tags: ["Design", "Flyer", "3D"] },
      ],
      logos: [
        { ...logosAssets.grandgroove, title: "Grandgroove Records", type: "Logo", description: "Logo for the label Grandgroove Records: a thin-stroke G between two orbits. Spinning chrome 3D version.", tags: ["Logo", "Branding", "Motion"] },
        { ...logosAssets.chicaLunar, title: "Chica Lunar", type: "Logo", description: "A Y2K-style chrome logo with stars and an orbit.", tags: ["Logo", "Branding"] },
      ],
      espacios: [
        { ...espaciosAssets.plug, title: "Plug", type: "3D / Architecture", description: "DJ booth and floor of an event space, with red light and a mural. Includes untextured work views.", tags: ["Blender", "Architecture", "3D"] },
        { ...espaciosAssets.recUnderclub, title: "REC Underclub", type: "3D / Architecture", description: "A red-lit club with a camera REC overlay: renders and video walkthroughs.", tags: ["Blender", "Architecture", "3D"] },
        { ...espaciosAssets.underberlin, title: "Underberlin", type: "3D / Motion", description: "A Berlin-style underground club: DJ booth, metal railings and light beams. Renders and video.", tags: ["Blender", "Motion", "3D"] },
      ],
      about: {
        headline: "Motion, 3D and art direction for brands, campaigns and artists.",
        paragraph: "I design and animate key visuals, reels, 3D renders and social pieces. I work in Blender, After Effects and Photoshop, use AI tools in the process and bring in TouchDesigner and code when a piece calls for it. Freelancing since 2022 for brands, artists and events.",
        // Datos duros para quien evalúa en 30 segundos. Solo viven acá:
        // content.json no los define, así que en español también salen de acá.
        facts: [
          { label: "Experience", value: "3D & motion since 2022 · Web development since 2023" },
          { label: "Languages", value: "Spanish (native) · English (advanced, translation degree) · Portuguese (intermediate)" },
          { label: "Based in", value: "Mendoza, Argentina · UTC−3, 1–2 h ahead of US Eastern" },
          { label: "Availability", value: "Full-time remote · Freelance" },
          { label: "Tools", value: "Blender · After Effects · Photoshop · TouchDesigner · AI tools · Figma · React" },
        ],
        specializations: ["Motion graphics / After Effects", "3D & animation / Blender", "Campaigns & art direction", "Branding & identity", "Creative technology / TouchDesigner", "Web development"],
      },
      contact: {
        headline: "LET'S TALK",
        availableForLabel: "Available for",
        availableFor: ["Full-time remote", "Freelance", "Motion design", "3D", "Art direction", "Campaigns", "Branding"],
        cta: "Get in touch",
        note: "I reply within 24 hours",
        cv: "/cv/Enzo-Diaz-Zingaretti-CV-EN.pdf",
      },
      ui: {
        nav: { back: "Back", home: "Home", index: "Index", about: "About", showcase: "Selected work", cases: "Case studies", contact: "Contact", enter: "Enter", close: "Close" },
        showcase: {
          previous: "Previous",
          next: "Next",
          audio: { listen: "Play this piece's audio", mute: "Mute" },
        },
        worksLabel: "works",
        workLabelSingular: "work",
        details: "Details",
        readCase: "Read the case study",
        visitSite: "Visit Site",
        viewCode: "Code",
        loopLabel: "Loop",
        touchDesignerLoop: "TouchDesigner Loop",
        blenderRender: "Blender Render",
        renderTags: ["blender", "3d", "render"],
        contactLabels: { email: "Email", instagram: "Instagram", linkedin: "LinkedIn", github: "GitHub", profile: "Profile", cv: "Download CV (PDF)" },
        modal: { close: "Close", previous: "Previous", next: "Next", navigateHint: "← → to navigate · ", closeHint: "ESC to close", year: "Year", role: "Role", status: "Status", client: "Client", duration: "Duration", tools: "Tools", visitSite: "Visit Site", viewCode: "View code", features: "Includes", infoShow: "View info", infoClose: "Close", slide: "Slide", readCase: "Read the case study" },
        skipToContent: "Skip to content",
        backToTop: "Top",
        lab: {
          seed: "Seed", hint: "Click: new seed", reseed: "new seed",
          controlsTitle: "Parameters", reset: "reset",
          controls: {
            densidad: "density", campo: "field", turbulencia: "turbulence", estela: "trail",
            amortiguacion: "damping", velocidad: "speed", amplitud: "amplitude",
            regimen: "regime", incandescencia: "glow", siembra: "seeding",
            plegado: "folding", morfosis: "morphing",
            profundidad: "depth", corte: "cuts", glitch: "glitch", epoca: "epoch",
            deformacion: "deformation", rotacion: "rotation",
            modo: "mode", simetria: "symmetry", agitacion: "agitation",
            gravedad: "gravity", viento: "wind", rigidez: "stiffness", desgarro: "tearing",
          },
        },
        footerLocation: "Argentina / Worldwide",
        pageTitle: "Portfolio",
        notFound: { title: "This page doesn't exist", text: "The link is old or mistyped. Try one of the categories." },
        aboutCta: "Let's Talk",
        cvCta: "Download CV",
        a11y: { openConsole: "Open the hidden console", adminPanel: "Admin panel" },
        konsole: {
          hintLong: 'type "enzo"',
          hintShort: "console",
          prompt: "type a command...",
          commands: {
            about: "identity manifesto",
            links: "socials and contact",
            stack: "tools and software",
            play: "start the underground audio stream",
            vjpack: "download the VJ asset pack (coming soon)",
            glitch: "fragment the visual interface",
            status: "system diagnostic",
            credits: "tech stack + hidden message",
            clear: "clear the console",
            exit: "close the terminal",
          },
        },
        ink: {
          live: "Live",
          coords: "32°53′S 68°50′W",
          showreel: { title: "Selected work", open: "View the piece", list: "Selected pieces", play: "Play the showreel", pause: "Pause the showreel" },
          reels: { open: "Watch reel", hint: "Swipe →", previous: "Previous", next: "Next" },
          cases: { label: "Case", plural: "cases" },
          cursor: { view: "View", play: "Play" },
          modal: { piece: "Piece", prevPiece: "Previous piece", nextPiece: "Next piece" },
        },
        boot: [
          "INITIALIZING PORTFOLIO_SYS v1.0",
          "LOADING ASSET MANIFEST...",
          "3D RENDER CACHE: OK",
          "MOTION SYSTEM: ONLINE",
          "VISUAL ARCHIVE: INDEXED",
          "IDENTITY LAYER: ACTIVE",
          "BOOT SEQUENCE COMPLETE",
        ],
      },
    },
    pt: {
      nav: [
        { label: "Motion", href: "/motion" },
        { label: "3D", href: "/3d" },
        { label: "Gráfica", href: "/grafica" },
        { label: "Tech", href: "/tech" },
      ],
      categories: {
        motion: {
          title: "MOTION",
          kicker: "Reels / Campanhas / Marcas",
          subtitle: "Reels e peças de motion para marcas, campanhas e artistas.",
          groups: {
            ia: { title: "Comerciais com IA", note: "Anúncios, campanhas e peças audiovisuais feitas ou assistidas com IA" },
            reels: { title: "Reels", note: "Motion para redes: press kits, campanhas e marcas" },
          },
        },
        tresd: {
          title: "3D",
          kicker: "Blender / Render",
          subtitle: "Renders, animações, estudos de material e visualização de espaços.",
          groups: {
            blender: { title: "Renders & estudos", note: "Peças e séries feitas em Blender" },
            arquitectura: { title: "Arquitetura", note: "Visualização de espaços e clubes" },
          },
        },
        grafica: {
          title: "GRÁFICA",
          kicker: "Campanhas / Flyers / Identidade",
          subtitle: "Peças para eventos de eletrônica e identidades para artistas e selos.",
          groups: {
            campanas: { title: "Campanhas e direção de arte", note: "Sonar Produce: sistema visual e campanha da primeira data" },
            flyers: { title: "Flyers e capas", note: "Peças para eventos e lançamentos" },
            logos: { title: "Logos & branding", note: "Identidades para artistas e projetos" },
          },
        },
        tech: {
          title: "TECH",
          kicker: "TouchDesigner / Código / Web",
          subtitle: "Visuais em tempo real, sistemas generativos e sites: o lado técnico por trás do trabalho visual.",
          groups: {
            touchdesigner: { title: "TouchDesigner", note: "Loops audio-reativos e visuais em tempo real" },
            lab: { title: "Lab generativo", note: "Sistemas algorítmicos desenhando ao vivo a 145 BPM" },
            proyectos: { title: "Sites", note: "Design, desenvolvimento e deploy" },
          },
        },
      },
      labPieces: [
        { id: "congregacion", title: "CONGREGACIÓN", description: "Partículas seguindo um campo de ruído fbm. Os traços se acumulam sobre um fade lento e o pulso a 145 BPM injeta velocidade." },
        { id: "himno", title: "HIMNO FANTASMA", description: "Harmonógrafo de dois pêndulos amortecidos. Quando a curva se apaga, o compasso seguinte a reinicia com outra relação de frequências inteiras." },
        { id: "comunion", title: "COMUNIÓN CELULAR", description: "Reação-difusão de Gray-Scott sobre uma grade toroidal. Cinco regimes: mitose, vermes, labirintos, coral e caos pulsante." },
        { id: "enjambre", title: "ENJAMBRE 145", description: "Atrator de De Jong. Milhares de iterações por frame se acumulam em aditivo e os parâmetros derivam para novos valores a cada 8 compassos." },
        { id: "liturgia", title: "LITURGIA BRUTAL", description: "Subdivisão recursiva em proporção áurea. A batida corta a retícula em bandas deslocadas e a cada 32 ela se recompõe." },
        { id: "sudario", title: "SUDARIO", description: "Nuvem de 5.200 pontos sobre uma esfera irregular, deformada por um campo de ruído que deriva. Gira em 3D com projeção em perspectiva e o que o campo arranca do corpo queima em vermelho." },
        { id: "salmo", title: "SALMO DE ARENA", description: "Figuras de Chladni. A areia caminha ao acaso com um passo proporcional à vibração da placa, então só fica parada sobre as linhas nodais. Muda de modo a cada 16 batidas." },
        { id: "velo", title: "VELO DEL TEMPLO", description: "Tecido de Verlet de 30×20 nós. O vento o enche e a batida o sacode; os fios esticados além do limite se rompem e não voltam até o véu ser tecido de novo." },
      ],
      hero: {
        title: "ENZO ZINGARETTI",
        description: "Motion, 3D e direção de arte para marcas, campanhas e artistas, com ferramentas de IA e TouchDesigner no processo. De Mendoza, Argentina, trabalhando remotamente.",
        location: "Mendoza, AR · UTC−3",
        availability: "Disponível",
        meta: "Portfólio / 2026",
        headline: "Motion & 3D Designer",
        roles: ["Motion graphics", "3D e animação", "Campanhas e direção de arte", "Tecnologia criativa"],
        cta: "Ver trabalhos",
        scrollLabel: "scroll",
        shaderSelector: {
          ariaLabel: "Escolher fundo do hero",
          random: "aleatorio",
          items: {
            sculpture: "Escultura",
            particles: "Particulas",
            organic: "Organica",
          },
        },
      },
      webProjects: [
        { ...webProjectAssets.portfolio, scrollPreview: true, title: "Portfólio Pessoal", type: "Web / Design e desenvolvimento", status: "Online", role: "Design e desenvolvimento", description: "Este site. React + Vite + Tailwind, com o hero em Three.js passado por um filtro ASCII escrito à mão (shader próprio). Dentro: um lab de oito peças generativas com parâmetros ao vivo, um painel de administração que salva o conteúdo no repositório pela API do GitHub, e tudo em três idiomas.", tags: ["React", "Three.js", "GLSL", "Vite", "Tailwind CSS"], features: ["Filtro ASCII em Three.js", "Lab generativo", "Painel de administração", "Trilíngue"] },
        { ...webProjectAssets.andino, title: "Andino Seguros", type: "Web / Design e desenvolvimento", status: "Online", role: "Design e desenvolvimento", description: "Site de um corretor de seguros de Mendoza: dez formulários de cotação que terminam numa conversa de WhatsApp com os dados já preenchidos, e um painel próprio para acompanhar as consultas e a carteira de clientes. Next.js e TypeScript, com Sanity e Supabase.", tags: ["Next.js", "TypeScript", "Supabase", "Sanity", "Tailwind CSS"], features: ["Cotação de 10 seguros", "Painel de consultas e clientes", "Conteúdo editável", "Uma URL por seguro"] },
        { ...webProjectAssets.tamara, title: "Tamara González", type: "Web / Design e desenvolvimento", status: "Online", role: "Design e desenvolvimento", description: "Portfólio de uma artista visual (tatuagens, ilustração e pintura). React + Vite + Tailwind CSS e Framer Motion, com painel de administração próprio sobre funções serverless para ela atualizar a galeria. A API e o painel têm testes com Vitest.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Vitest"], features: ["Painel de administração", "Testes com Vitest", "Galeria por categoria", "Contato via WhatsApp"] },
        { ...webProjectAssets.newMetals, title: "New Metals", type: "Web / Design e desenvolvimento", status: "Online", role: "Design e desenvolvimento", description: "Site para uma oficina de fabricação e solda metálica em Tupungato, Mendoza. React + Vite + Tailwind CSS e Framer Motion: hero animado com uma faísca sobre preto, catálogo de trabalhos editável por um painel próprio e contato direto via WhatsApp.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion"], features: ["Painel de administração", "Catálogo de trabalhos", "Contato via WhatsApp"] },
        { ...webProjectAssets.pressKits, scrollPreview: false, title: "Press kits para artistas", type: "Web / Design e desenvolvimento", status: "Online", role: "Design e desenvolvimento", description: "Cinco press kits web para DJs a partir de um template próprio: Kexxy, CTRL.Z, Gabi Raíz, Martina Høbelar e Shodnan Ref. A mesma base de arquitetura, uma estética própria para cada artista e nenhum dado que o artista não tenha dado. HTML, CSS e JavaScript sem framework.", tags: ["HTML", "CSS", "JavaScript", "Vercel"], features: ["5 sites no ar", "Uma estética por artista", "Booking sem servidor", "Sem framework"] },
        { ...webProjectAssets.aurora, title: "Cecilia — Hospedagens", type: "Web / Design e desenvolvimento", status: "Em desenvolvimento", role: "Design e desenvolvimento", description: "Site para duas casas de aluguel em Mendoza. Next.js + TypeScript + Tailwind CSS, landing cinematográfica por propriedade, trilíngue.", tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"], features: ["Landing por propriedade", "Trilíngue", "Rolagem suave"] },
      ],
      cases: [
        { slug: "sonar-produce", title: "Sonar Produce", tags: "Identidade · Campanha · Motion", summary: "O sistema visual da Sonar Produce e a campanha completa da sua primeira data: um radar como ideia, três regras para todas as peças e templates para as próximas datas." },
        { slug: "portfolio", title: "Portfólio Pessoal", tags: "React · Three.js · GLSL", summary: "Refiz a estrutura do meu site e escrevi à mão o filtro ASCII do hero. Os níveis do filtro, o peso das páginas e o contraste foram definidos medindo." },
        { slug: "andino-seguros", title: "Andino Seguros", tags: "Next.js · TypeScript · Supabase", summary: "Um site para que cada visita termine numa conversa de WhatsApp com os dados do seguro já preenchidos. Ele salva a consulta antes de abrir o chat, e o corretor acompanha tudo num painel próprio, junto com a carteira de clientes." },
        { slug: "tamara-gonzalez", title: "Tamara González", tags: "React · Framer Motion · Painel próprio", summary: "Começou como portfólio de marketing e virou o de uma artista visual. Fiz um painel para ela subir a obra sem mexer em código, e esse painel virou a base de outros três sites." },
        { slug: "press-kits", title: "Press kits para artistas", tags: "HTML · CSS · JavaScript", summary: "Cinco press kits para artistas a partir de um template próprio. Cloná-lo não funcionou: cada estrutura sai do material do artista, e num press kit nenhum dado é inventado." },
      ],
      // Comerciales con IA: vacía hasta que haya piezas publicadas (el grupo
      // no se muestra vacío). Se cargan desde /admin y acá en EN y PT.
      aiCommercials: [],
      motionReels: [
        { ...reelAssets.sonarCaso, title: "Sonar Produce — Reel do case", client: "Sonar Produce", type: "Reel · Estudo de caso", year: "2026", duration: "25,6 s", description: "Reel próprio que conta a campanha do SONAR 001 em 25 segundos: identidade, key visual (quatro propostas, a B foi a escolhida), carrossel do line-up, motion, contagem regressiva, ingressos, horários, templates e o mosaico das 49 peças. A 150 BPM: cada corte cai no beat. Não é After Effects: o vídeo é gerado com código (Python + ffmpeg), e o mesmo template renderiza o reel, o story e o feed.", tags: ["Motion", "Python", "ffmpeg", "150 BPM"] },
        { ...reelAssets.kexxy, title: "KEXXY — Reel do press kit", client: "Kexxy", type: "Reel · Press kit", year: "2026", duration: "25 s", description: "O reel do press kit de Kexxy, na versão fanzine: capa, sets, próximas datas, cabine, produtoras e contato. Não é uma gravação de tela: um motor próprio copia o site no ar, injeta um relógio virtual e grava quadro a quadro com Playwright e ffmpeg, com motion blur real.", tags: ["Motion", "Playwright", "ffmpeg", "Press kit"] },
        { ...reelAssets.shodnanRef, title: "Shodnan Ref — Reel do press kit", client: "Shodnan Ref", type: "Reel · Press kit", year: "2026", duration: "29 s", description: "Reel do press kit de Shodnan Ref, DJ de hardtechno e hardgroove de Tupungato: info, biografia, cabines, rider e som, com a estética do site (revelação em preto e branco, vermelho e granulado). Animado em HTML com GSAP.", tags: ["Motion", "GSAP", "Press kit"] },
        { ...reelAssets.martinaHobelar, title: "Martina Høbelar — Reel do press kit", client: "Martina Høbelar", type: "Reel · Press kit", year: "2026", duration: "23 s", description: "Um passeio pelo press kit de Martina Høbelar, DJ e produtora de hard techno e schranz: capa, sets, bio, fotos, rider e booking, e o site no celular. Renderizado a 60 fps com o motor próprio da série.", tags: ["Motion", "60 fps", "Press kit"] },
        { ...reelAssets.kook, title: "kook. — Monte a sua", client: "kook.", type: "Story · Motion para redes", year: "2026", duration: "21 s", description: "Motion para a kook., bolos servidos em xícaras de cerâmica pintadas à mão. 21 s a 120 BPM com loop perfeito: o logo cai, «escolha seu bolo», «escolha sua xícara», a cobertura desenhada à mão e a foto real da combinação. O wordmark foi vetorizado letra por letra e a animação sai de um motor próprio em HTML e Canvas, sem bibliotecas.", tags: ["Motion", "Canvas", "120 BPM"] },
        { ...reelAssets.ctrlz, title: "CTRL.Z — Reel do press kit", client: "CTRL.Z", type: "Reel · Press kit", year: "2026", duration: "16 s", description: "Cinco cenas em 16 s: a capa, o site rodando no celular, as fotos de imprensa e a trajetória. Feito com o mesmo motor do resto da série: o site real, com um relógio virtual, exportado quadro a quadro.", tags: ["Motion", "Playwright", "Press kit"] },
        { ...reelAssets.gabiRaiz, title: "Gabi Raíz — Da foto à web", client: "Gabi Raíz", type: "Story · Press kit", year: "2026", duration: "21 s", description: "Do retrato ao site: as fotos de Coty Marty (@circes.eyes.ph) passam para o press kit de Gabi Raíz, DJ e produtor de Mendoza, e o passeio termina no celular. A fotógrafa leva o crédito na peça.", tags: ["Motion", "Press kit", "Fotografia"] },
      ],
      touchDesignerLoops: [
        { ...touchDesignerAssets.pulseVandal, name: "Pulse Vandal", notes: "Fumaça em preto e branco envolvendo um vazio no centro." },
        { ...touchDesignerAssets.ghostTunnel, name: "Ghost Tunnel", notes: "Caleidoscópio de partículas verdes em simetria radial." },
        { ...touchDesignerAssets.staticVeil, name: "Static Veil", notes: "Um rosto que aparece e se perde entre fumaça, ruído e linhas de varredura." },
        { ...touchDesignerAssets.ironLattice, name: "Iron Lattice", notes: "Caleidoscópio em preto e branco de formas ósseas, como uma radiografia." },
        { ...touchDesignerAssets.eyes, name: "Eyes", notes: "Grade de olhos que giram, em vermelho e branco." },
        { ...touchDesignerAssets.biology, name: "Biology", notes: "Série de loops orgânicos: filamentos e cílios em rosa e turquesa." },
        { ...touchDesignerAssets.kineticSand, name: "Kinetic Sand", notes: "Simulação de areia cinética com resposta ao áudio." },
      ],
      blenderWorks: [
        { ...blenderAssets.goldenFaces, title: "Golden Faces", description: "Cabeças derretidas em dois tratamentos: metal dourado especular sobre azul e branco chapado sobre preto." },
        { ...blenderAssets.ratherModular, title: "Rather Modular", description: "Composição orgânica de pétalas, fibras, bolhas de vidro e fumaça. Variações de cor e fundo." },
        { ...blenderAssets.calvariaGlass, title: "Calvaria Glass", description: "Formas neotribais em vidro violeta e um coração de cristal girando. Estudo de refração e brilho." },
        { ...blenderAssets.metallicSwarm, title: "Metallic Swarm", description: "Colunas vertebrais de metal com espinhos, enroladas como serpentes. Estudo de material cromado." },
        { ...blenderAssets.plasticStudies, title: "Plastic Studies", description: "Uma cabeça gritando e um toca-discos em paleta de câmera térmica, com adesivos “Hello, my name is”." },
        { ...blenderAssets.km240, title: "240 KM/H", description: "Spec, por iniciativa própria: não é uma encomenda da 240 KM/H nem é afiliado à marca. Semáforo na chuva, à noite: fica verde e acende um letreiro com o logo da 240 KM/H. Vertical, para Reels." },
        { ...blenderAssets.patrullero, title: "Patrullero", description: "Uma viatura policial coberta de grafite num beco, à noite. Modelagem e animação em Blender." },
        { ...blenderAssets.cristales, title: "Cristales", description: "Geometria cristalina com refração em Blender Cycles." },
        { ...blenderAssets.abstract, title: "Abstract Vol. I", description: "Formas orgânicas e abstrações fluidas em Blender." },
        { ...blenderAssets.screamingHead, title: "Screaming Head", description: "Um rosto gritando sob um tecido preto brilhante." },
        { ...blenderAssets.noclueyet, title: "Chrome Grotesque", description: "Cabeças cromadas empilhadas, gritando, com dentes de ouro, e uma variação em preto brilhante sobre cinza claro." },
        { ...blenderAssets.overkillBlender, title: "Overkill 3D", description: "Duas mãos que se buscam através de portais de luz vermelha. Render para a sessão Overkill." },
      ],
      campaigns: [
        { ...campaignAssets.sonarKeyVisual, title: "Sonar 001 — Key visual", type: "Key visual", description: "Key visual de SONAR 001, a primeira data da Sonar Produce (Stella Bossi, Mendoza, 30.10.2026). Fundo preto, o radar do logo organizando a peça em volta da artista e o vermelho só onde o olhar deve ir. Apresentei quatro opções; a Sonar escolheu esta. Feed 3:4 e story 9:16.", tags: ["Direção de arte", "Flyer", "Photoshop"] },
        { ...campaignAssets.sonarLineUp, title: "Sonar 001 — Animação do line-up", type: "Motion / Reel", description: "Reel de 14,4 s a 150 BPM: o radar varre a peça, o golpe da headliner cai no segundo 9,6 e o fechamento é a capa do carrossel. Reel e story em 1080 × 1920.", tags: ["Motion", "Direção de arte", "Reel"] },
        { ...campaignAssets.sonarCarrusel, title: "Sonar 001 — Carrossel do line-up", type: "Carrossel", description: "Cinco placas 3:4 para o feed: a capa e uma por artista, com a foto tratada em preto, branco e vermelho, a função, uma bio curta e o @. Cada placa sai também em story e reel.", tags: ["Direção de arte", "Carrossel", "Photoshop"] },
        { ...campaignAssets.sonarHorarios, title: "Sonar 001 — Horários", type: "Post", description: "Uma faixa por set, com a foto de cada artista; a altura da faixa é proporcional à duração do set e a headliner vai em vermelho. Feed, story e reel.", tags: ["Design", "Post", "Photoshop"] },
        { ...campaignAssets.sonarEntradas, title: "Sonar 001 — Ingressos", type: "Post", description: "Os três lotes de venda, cada um com seu canhoto para o carimbo de SOLD OUT. No PSD os carimbos são camadas: liga-se o de cada lote quando esgota, sem refazer a peça.", tags: ["Design", "Post", "Photoshop"] },
        { ...campaignAssets.sonarManual, title: "Sonar — Manual de marca", type: "Branding / Sistema visual", description: "Manual de 16 páginas que leva o documento de marca a regras concretas: o radar como conceito, três cores e sua proporção, duas tipografias, tratamento de foto com mapa de gradiente, zonas seguras por formato e usos incorretos.", tags: ["Branding", "Sistema visual", "Manual de marca"] },
        { ...campaignAssets.sonarPlantillas, title: "Sonar — Templates", type: "Templates", description: "Três templates de Photoshop para as próximas datas (flyer de data, placa de artista e anúncio), cada um em feed, story e reel. A foto ganha o visual da Sonar por uma camada de ajuste: ao trocá-la, o tratamento se aplica sozinho.", tags: ["Templates", "Photoshop", "Sistema visual"] },
        { ...campaignAssets.sonarCuentaRegresiva, title: "Sonar 001 — Contagem regressiva", type: "Motion / Reel", description: "Animação de 14,4 s a 150 BPM: o 3-2-1 no dial do radar, os dados da data e o golpe final em vermelho. Um reel, um post de feed e um story por dia, montados a partir de um template de After Effects com textos editáveis.", tags: ["Motion", "After Effects", "Template"] },
      ],
      flyers: [
        { ...flyerAssets.innusual, title: "Innusual — V/A002INNU", type: "Capa", description: "Capa da coletânea [V/A002INNU] do selo Innusual, de Buenos Aires (2025). O render é meu; a ilustração, de @shifo.__. Um disco rachado a partir do centro, dentro de uma moldura técnica, quase sem cor, para ser lida igual em miniatura e em tamanho grande.", tags: ["Capa", "3D", "Direção de arte"] },
        { ...flyerAssets.aguantaderobass, title: "Aguantadero Bass", type: "Flyer", description: "Flyers 3D para o ciclo Aguantadero Bass (dubstep e drum & bass, Buenos Aires): a cabine de DJ em grande-angular e o line-up na tela. Duas datas, com versão animada.", tags: ["Design", "Flyer", "3D", "Motion"] },
        { ...flyerAssets.blastkick, title: "Blastkick", type: "Flyer", description: "Flyer 3D do Blastkick Festival (Club Sportivo Italiano): um monólito de pedra com raízes vermelhas e o line-up gravado. Inclui reel animado.", tags: ["Design", "Flyer", "3D", "Motion"] },
        { ...flyerAssets.blastkickAnoNuevo, title: "Blastkick — Ano Novo", type: "Flyer", description: "Edição de 31 de dezembro: composição 3D em violeta e dourado.", tags: ["Design", "Flyer", "3D"] },
        { ...flyerAssets.distRaptisKexxy, title: "Dist. Raptis. Kexxy.", type: "Flyer", description: "Correntes e tipografia gótica sobre vermelho, para DIST b2b RAPTIS e Kexxy.", tags: ["Design", "Flyer", "3D"] },
        { ...flyerAssets.maccari, title: "Maccari", type: "Flyer", description: "Flyer animado em 3D para Maccari: uma sala de cabos com telas que mostram o artista e os logos do evento.", tags: ["Design", "Flyer", "3D", "Motion"] },
        { ...flyerAssets.overkill, title: "Overkill", type: "Flyer", description: "Placa de pedra pendurada em correntes com o line-up gravado, para a sessão Overkill.", tags: ["Design", "Flyer", "3D"] },
      ],
      logos: [
        { ...logosAssets.grandgroove, title: "Grandgroove Records", type: "Logo", description: "Logo para o selo Grandgroove Records: um G de traço fino entre duas órbitas. Versão 3D cromada que gira.", tags: ["Logo", "Branding", "Motion"] },
        { ...logosAssets.chicaLunar, title: "Chica Lunar", type: "Logo", description: "Logo cromado estilo Y2K, com estrelas e uma órbita.", tags: ["Logo", "Branding"] },
      ],
      espacios: [
        { ...espaciosAssets.plug, title: "Plug", type: "3D / Arquitetura", description: "Cabine de DJ e pista de um espaço para eventos, com luz vermelha e mural. Inclui vistas de trabalho sem texturas.", tags: ["Blender", "Arquitetura", "3D"] },
        { ...espaciosAssets.recUnderclub, title: "REC Underclub", type: "3D / Arquitetura", description: "Clube em luz vermelha com overlay de câmera REC: renders e percursos em vídeo.", tags: ["Blender", "Arquitetura", "3D"] },
        { ...espaciosAssets.underberlin, title: "Underberlin", type: "3D / Motion", description: "Clube underground estilo Berlim: cabine, grades de metal e fachos de luz. Renders e vídeo.", tags: ["Blender", "Motion", "3D"] },
      ],
      about: {
        headline: "Motion, 3D e direção de arte para marcas, campanhas e artistas.",
        paragraph: "Crio e animo key visuals, reels, renders 3D e peças para redes. Trabalho no Blender, After Effects e Photoshop, uso ferramentas de IA no processo e somo TouchDesigner e código quando a peça pede. Freelancer desde 2022 para marcas, artistas e eventos.",
        // Datos duros para quien evalúa en 30 segundos. Solo viven acá:
        // content.json no los define, así que en español también salen de acá.
        facts: [
          { label: "Experiência", value: "3D e motion desde 2022 · Desenvolvimento web desde 2023" },
          { label: "Idiomas", value: "Espanhol nativo · Inglês avançado (formação em tradução) · Português intermediário" },
          { label: "Base", value: "Mendoza, Argentina · UTC−3, 1–2 h à frente da costa leste dos EUA" },
          { label: "Disponibilidade", value: "Full-time remoto · Freelance" },
          { label: "Ferramentas", value: "Blender · After Effects · Photoshop · TouchDesigner · Ferramentas de IA · Figma · React" },
        ],
        specializations: ["Motion graphics / After Effects", "3D e animação / Blender", "Campanhas e direção de arte", "Branding e identidade", "Tecnologia criativa / TouchDesigner", "Desenvolvimento web"],
      },
      contact: {
        headline: "VAMOS FALAR",
        availableForLabel: "Disponível para",
        availableFor: ["Full-time remoto", "Freelance", "Motion design", "3D", "Direção de arte", "Campanhas", "Branding"],
        cta: "Me escreve",
        note: "Respondo em menos de 24 horas",
        cv: "/cv/Enzo-Diaz-Zingaretti-CV-PT.pdf",
      },
      ui: {
        nav: { back: "Voltar", home: "Início", index: "Índice", about: "Sobre mim", showcase: "Destaques", cases: "Cases", contact: "Contato", enter: "Entrar", close: "Fechar" },
        showcase: {
          previous: "Anterior",
          next: "Próximo",
          audio: { listen: "Ouvir o áudio desta peça", mute: "Silenciar" },
        },
        worksLabel: "peças",
        workLabelSingular: "peça",
        details: "Ver detalhes",
        readCase: "Ler o case",
        visitSite: "Abrir site",
        viewCode: "Código",
        loopLabel: "Loop",
        touchDesignerLoop: "Loop TouchDesigner",
        blenderRender: "Render Blender",
        renderTags: ["blender", "3d", "render"],
        contactLabels: { email: "Email", instagram: "Instagram", linkedin: "LinkedIn", github: "GitHub", profile: "Perfil", cv: "Baixar CV (PDF)" },
        modal: { close: "Fechar", previous: "Anterior", next: "Próximo", navigateHint: "← → para navegar · ", closeHint: "ESC para fechar", year: "Ano", role: "Função", status: "Status", client: "Cliente", duration: "Duração", tools: "Ferramentas", visitSite: "Abrir site", viewCode: "Ver código", features: "Inclui", infoShow: "Ver info", infoClose: "Fechar", slide: "Slide", readCase: "Ler o case" },
        skipToContent: "Pular para o conteúdo",
        backToTop: "Início",
        lab: {
          seed: "Semente", hint: "Clique: nova semente", reseed: "nova semente",
          controlsTitle: "Parâmetros", reset: "reset",
          controls: {
            densidad: "densidade", campo: "campo", turbulencia: "turbulência", estela: "rastro",
            amortiguacion: "amortecimento", velocidad: "velocidade", amplitud: "amplitude",
            regimen: "regime", incandescencia: "incandescência", siembra: "semeadura",
            plegado: "dobra", morfosis: "morfose",
            profundidad: "profundidade", corte: "corte", glitch: "glitch", epoca: "época",
            deformacion: "deformação", rotacion: "rotação",
            modo: "modo", simetria: "simetria", agitacion: "agitação",
            gravedad: "gravidade", viento: "vento", rigidez: "rigidez", desgarro: "rasgo",
          },
        },
        footerLocation: "Argentina / Internacional",
        pageTitle: "Portfólio",
        notFound: { title: "Esta página não existe", text: "O link é antigo ou está mal escrito. Tente uma das categorias." },
        aboutCta: "Vamos Conversar",
        cvCta: "Baixar CV",
        a11y: { openConsole: "Abrir o console oculto", adminPanel: "Painel de administração" },
        konsole: {
          hintLong: 'digite "enzo"',
          hintShort: "console",
          prompt: "digite um comando...",
          commands: {
            about: "manifesto de identidade",
            links: "redes e contato",
            stack: "ferramentas e software",
            play: "ativar o stream de áudio underground",
            vjpack: "baixar o VJ asset pack (coming soon)",
            glitch: "fragmentar a interface visual",
            status: "diagnóstico do sistema",
            credits: "stack técnico + mensagem oculta",
            clear: "limpar o console",
            exit: "fechar o terminal",
          },
        },
        ink: {
          live: "Ao vivo",
          coords: "32°53′S 68°50′O",
          showreel: { title: "Trabalhos selecionados", open: "Ver a peça", list: "Peças selecionadas", play: "Reproduzir o showreel", pause: "Pausar o showreel" },
          reels: { open: "Ver reel", hint: "Deslize →", previous: "Anteriores", next: "Próximos" },
          cases: { label: "Caso", plural: "casos" },
          cursor: { view: "Ver", play: "Play" },
          modal: { piece: "Peça", prevPiece: "Peça anterior", nextPiece: "Próxima peça" },
        },
        boot: [
          "INITIALIZING PORTFOLIO_SYS v1.0",
          "LOADING ASSET MANIFEST...",
          "3D RENDER CACHE: OK",
          "MOTION SYSTEM: ONLINE",
          "VISUAL ARCHIVE: INDEXED",
          "IDENTITY LAYER: ACTIVE",
          "BOOT SEQUENCE COMPLETE",
        ],
      },
    },
  },
};
