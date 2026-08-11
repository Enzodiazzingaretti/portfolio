const webProjectAssets = {
  pressKit: {
    year: "2025",
    imageUrl: null,
    previewUrl: "https://presskit-digital.vercel.app/",
    previewImage: "/images/previews/screenshot_kexxypresskit.jpeg",
    slides: [],
  },
  portfolio: {
    year: "2025",
    imageUrl: null,
    previewUrl: "#hero",
    previewImage: "/images/previews/screenshot_portfolio.jpeg",
    slides: [],
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
  feedbackRitual: {
    thumbnail: "/images/loops/feedback-ritual.mp4",
    slides: [
      "/images/touchdesigner/feedback-ritual/Audioreactive Vol2 Test.mp4",
      "/images/touchdesigner/feedback-ritual/Audioreactive Vol3 Test 1(1).mp4",
      "/images/touchdesigner/feedback-ritual/Audioreactive Vol5 Test(1).mp4",
      "/images/touchdesigner/feedback-ritual/Audioreactive Vol6 Test(1).mp4",
      "/images/touchdesigner/feedback-ritual/Audioreactive Vol7 Test(1).mp4",
    ],
  },
  pulseVandal: {
    thumbnail: "/images/loops/pulse-vandal.mp4",
    slides: [
      "/images/touchdesigner/pulse-vandal/visuales1.mp4",
    ],
  },
  ghostTunnel: {
    thumbnail: "/images/loops/ghost-tunnel.mp4",
    slides: [
      "/images/touchdesigner/ghost-tunnel/C4 Animacion (1).mp4",
    ],
  },
  staticVeil: {
    thumbnail: "/images/loops/static-veil.mp4",
    slides: [
      "/images/touchdesigner/static-veil/humo.mp4",
      "/images/touchdesigner/static-veil/humo mod.mp4",
    ],
  },
  ironLattice: {
    thumbnail: "/images/loops/iron-lattice.mp4",
    slides: [
      "/images/touchdesigner/iron-lattice/visuales4.mp4",
    ],
  },
  eyes: {
    thumbnail: "/images/loops/eyes.mp4",
    slides: [
      "/images/touchdesigner/Eyes/Ojos Visuales.mp4",
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
  aguantaderobass: {
    portrait: true,
    imageUrl: "/images/flyers/aguantadero_bass/aguantaderobass-1.png",
    slides: [
      "/images/flyers/aguantadero_bass/Aguantaderobass Preview.mp4",
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
  maccari: {
    portrait: true,
    imageUrl: "/images/flyers/maccari/maccari-1.png",
    slides: [
      "/images/flyers/maccari/maccari-1.png",
      "/images/flyers/maccari/Maccari1 2.mp4",
    ],
  },
  overkill: {
    square: true,
    imageUrl: "/images/flyers/overkill/overkill (1).png",
    slides: [
      "/images/flyers/overkill/overkill (1).png",
      "/images/flyers/overkill/overkill (2).png",
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
      "/images/espacios/rec-underclub/Underclub Rec Videos (1).mp4",
      "/images/espacios/rec-underclub/Underclub Rec Videos (2).mp4",
      "/images/espacios/rec-underclub/underclubprueba1.mp4",
      "/images/espacios/underclub/underclub-1.mp4",
      "/images/espacios/underclub/underclub-2.mp4",
      "/images/espacios/underclub/underclub-3.mp4",
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

const logosAssets = {
  grandgroove: {
    square: true,
    imageUrl: "/images/visual/Logos/Grandgroove/grandgroove_records_logo (1).png",
    slides: [
      "/images/visual/Logos/Grandgroove/grandgroove_records_logo (1).png",
      "/images/visual/Logos/Grandgroove/grandgroove_records_logo (2).png",
      "/images/visual/Logos/Grandgroove/grandgroove_records_logo (1).mp4",
    ],
  },
  chicaLunar: {
    square: true,
    imageUrl: "/images/visual/Logos/chicalunar/logo_chica_lunar (3).png",
    slides: [
      "/images/visual/Logos/chicalunar/logo_chica_lunar (3).png",
    ],
  },
};

const blenderAssets = {
  goldenFaces: {
    slides: [
      "/images/blender/golden-faces/golden-1.png",
      "/images/blender/golden-faces/golden-2.png",
      "/images/blender/golden-faces/golden-3.png",
    ],
  },
  ratherModular: {
    slides: [
      "/images/blender/rather-modular/rathermodular-1.png",
      "/images/blender/rather-modular/rathermodular-2.png",
      "/images/blender/rather-modular/rathermodular-3.png",
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
      "/images/blender/calvaria-glass/Calvarian Animation.mp4",
      "/images/blender/calvaria-glass/calvarian_glass1.webp",
      "/images/blender/calvaria-glass/calvarian_glass2.webp",
      "/images/blender/calvaria-glass/calvarian_glass3.webp",
      "/images/blender/calvaria-glass/calvarian_glass4.webp",
    ],
  },
  metallicSwarm: {
    slides: [
      "/images/blender/metallic-swarm/metallic-swarm-1.png",
      "/images/blender/metallic-swarm/METALLIC_SWARM2.png",
    ],
  },
  plasticStudies: {
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
  glassSkullz: {
    portrait: true,
    slides: [
      "/images/blender/glass_skullz/glass_skullz (2).png",
      "/images/blender/glass_skullz/glass_skullz (3).png",
    ],
  },
  screamingHead: {
    square: true,
    slides: [
      "/images/blender/Screaming_head/screaming_head_remake (1).png",
      "/images/blender/Screaming_head/screaming_head_remake (2).png",
    ],
  },
  noclueyet: {
    portrait: true,
    slides: [
      "/images/blender/noclueyet/cabezas locas (1).png",
      "/images/blender/noclueyet/cabezas locas (2).png",
      "/images/blender/noclueyet/cabezas locas (3).png",
      "/images/blender/noclueyet/cabezas locas (4).png",
    ],
  },
  noclueyetB: {
    square: true,
    slides: [
      "/images/blender/noclueyet_1/carasdeformes.png",
    ],
  },
  overkillBlender: {
    square: true,
    slides: [
      "/images/blender/Overkill/overkill_prueba.png",
    ],
  },
  facesAlternative: {
    slides: [
      "/images/blender/faces_alternative/FACES_ALTERNATIVE (1).png",
      "/images/blender/faces_alternative/FACES_ALTERNATIVE (2).png",
      "/images/blender/faces_alternative/FACES_ALTERNATIVE (3).png",
      "/images/blender/faces_alternative/FACES_ALTERNATIVE (4).png",
    ],
  },
  km240: {
    portrait: true,
    thumbnail: "/images/loops/240kmh.mp4",
    slides: [
      "/images/blender/240KM-H/Semaforo Preview.mp4",
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
      "/images/blender/cristales/Cristales Preview.mp4",
      "/images/blender/cristales/cristales-1.png",
      "/images/blender/cristales/cristales-2.png",
    ],
  },
};

export const siteContent = {
  brand: "ENZO DIAZ ZINGARETTI",
  defaultLanguage: "es",
  heroImage: null,
  languages: [
    { code: "es", label: "ES", name: "Español" },
    { code: "en", label: "EN", name: "English" },
    { code: "pt", label: "PT", name: "Português" },
  ],
  contactLinks: {
    email: "k3xxy.art@gmail.com",
    instagram: "https://www.instagram.com/kexxy.obj",
    linkedin: "",
    presskit: "https://presskit-digital.vercel.app/",
  },
  locales: {
    es: {
      nav: [
        { label: "Motion", href: "/motion" },
        { label: "3D", href: "/3d" },
        { label: "Gráfica", href: "/grafica" },
        { label: "Web", href: "/web" },
        { label: "Press Kit ↗", href: "https://presskit-digital.vercel.app/", external: true },
      ],
      categories: {
        motion: {
          title: "MOTION",
          kicker: "TouchDesigner / Tiempo real",
          subtitle: "Loops audio-reactivos, visuales en vivo y sistemas generativos.",
          groups: {
            touchdesigner: { title: "TouchDesigner", note: "Loops audio-reactivos y visuales en tiempo real" },
            lab: { title: "Lab generativo", note: "Sistemas algorítmicos dibujándose en vivo a 145 BPM" },
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
          kicker: "Flyers / Identidad",
          subtitle: "Piezas para eventos de electrónica e identidades para artistas y sellos.",
          groups: {
            flyers: { title: "Flyers", note: "Piezas gráficas para eventos" },
            logos: { title: "Logos & branding", note: "Identidades para artistas y proyectos" },
          },
        },
        web: {
          title: "WEB",
          kicker: "React / Diseño y desarrollo",
          subtitle: "Diseño, desarrollo y deploy de proyectos web propios y por encargo.",
          groups: {
            proyectos: { title: "Proyectos", note: "Diseño, desarrollo y deploy" },
          },
        },
      },
      labPieces: [
        { id: "congregacion", title: "CONGREGACIÓN", description: "Multitud de partículas rezando en un campo de ruido; la luz acumulada es la memoria de sus trayectorias." },
        { id: "himno", title: "HIMNO FANTASMA", description: "Armonógrafo amortiguado con trazo de fósforo; cada compás re-excita el péndulo con nuevas armonías enteras." },
        { id: "comunion", title: "COMUNIÓN CELULAR", description: "Reacción-difusión de Gray-Scott: membranas que se devoran y regeneran sobre una grilla toroidal." },
        { id: "enjambre", title: "ENJAMBRE 145", description: "Atractor de De Jong en morfosis continua; la incandescencia no es paleta, es densidad." },
        { id: "liturgia", title: "LITURGIA BRUTAL", description: "Retícula brutalista de proporción áurea, cortada en bandas glitch al ritmo del golpe." },
      ],
      hero: {
        tagline: "3D / Motion / Branding / Web",
        title: "ENZO DIAZ ZINGARETTI",
        description: "Trabajo en Blender, TouchDesigner, React y con materiales. Basado en Argentina, disponible internacionalmente.",
        location: "Argentina",
        availability: "Disponible",
        meta: "Portfolio / 2026",
        roles: ["Artista 3D", "Motion Designer", "Creador Visual"],
        cta: "Ver proyectos ↓",
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
        { ...webProjectAssets.pressKit, title: "Press Kit", type: "Web / Diseño", status: "Online", role: "Diseño y desarrollo", description: "Press kit digital para DJ. HTML estático, i18n en 3 idiomas, formulario de contacto con EmailJS, embeds de SoundCloud y sección de fechas.", tags: ["HTML", "CSS", "JavaScript", "EmailJS", "i18n"], features: ["Multiidioma", "Formulario de contacto", "Embeds musicales"] },
        { ...webProjectAssets.portfolio, title: "WEB V1", type: "Web / Desarrollo", status: "En progreso", role: "Diseño y desarrollo", description: "Este portfolio. React + Vite + Tailwind CSS. Modal con carrusel multimedia, lazy loading, WebP, contenido centralizado.", tags: ["React", "Vite", "Tailwind CSS"], features: ["Contenido centralizado", "Galerías multimedia", "Optimización de assets"] },
      ],
      touchDesignerLoops: [
        { ...touchDesignerAssets.feedbackRitual, name: "Feedback Ritual", notes: "Partículas y trails audio-reactivos. Hardgroove, 145 BPM." },
        { ...touchDesignerAssets.pulseVandal, name: "Pulse Vandal", notes: "Geometrías con bloom, estrobos y ruido procedural." },
        { ...touchDesignerAssets.ghostTunnel, name: "Ghost Tunnel", notes: "Túnel de texturas industriales con deformación en tiempo real." },
        { ...touchDesignerAssets.staticVeil, name: "Static Veil", notes: "Ruido y feedback reactivos al volumen." },
        { ...touchDesignerAssets.ironLattice, name: "Iron Lattice", notes: "Estructuras modulares generadas por audio mid-side." },
        { ...touchDesignerAssets.eyes, name: "Eyes", notes: "Loop de ojos. Movimiento procedural en tiempo real." },
        { ...touchDesignerAssets.biology, name: "Biology", notes: "Serie de loops orgánicos. Fluidos y sistemas celulares." },
        { ...touchDesignerAssets.kineticSand, name: "Kinetic Sand", notes: "Arena cinética simulada con respuesta al audio." },
      ],
      blenderWorks: [
        { ...blenderAssets.goldenFaces, title: "Golden Faces", description: "Retratos 3D con material dorado y especular." },
        { ...blenderAssets.ratherModular, title: "Rather Modular", description: "Estructuras modulares industriales en Blender." },
        { ...blenderAssets.calvariaGlass, title: "Calvaria Glass", description: "Cráneo en vidrio. Estudio de refracción y render." },
        { ...blenderAssets.metallicSwarm, title: "Metallic Swarm", description: "Superficies metálicas densas. Exploración de textura y luz." },
        { ...blenderAssets.plasticStudies, title: "Plastic Studies", description: "Estudio de materiales plásticos, color y transparencia." },
        { ...blenderAssets.facesAlternative, title: "Faces Alternative", description: "Rostros alterados con geometría y distorsión." },
        { ...blenderAssets.km240, title: "240 KM/H", description: "Render de semáforo. Pieza para evento de hardgroove." },
        { ...blenderAssets.patrullero, title: "1312", description: "Modelo y animación de patrullero en Blender." },
        { ...blenderAssets.cristales, title: "Cristales", description: "Geometría cristalina con refracción en Blender Cycles." },
        { ...blenderAssets.abstract, title: "Abstract Vol. I", description: "Formas orgánicas y fluidos abstractos en Blender." },
        { ...blenderAssets.screamingHead, title: "Screaming Head", description: "Cabeza con deformación extrema. Estudio de malla y expresión." },
        { ...blenderAssets.noclueyet, title: "NCY — I", description: "Cabezas distorsionadas. Serie sin nombre." },
        { ...blenderAssets.noclueyetB, title: "NCY — II", description: "Caras deformes. Estudio de geometría facial." },
        { ...blenderAssets.glassSkullz, title: "Glass Skullz", description: "Cráneos en vidrio. Exploración de refracción y render." },
        { ...blenderAssets.overkillBlender, title: "Overkill 3D", description: "Render 3D para la sesión Overkill." },
      ],
      flyers: [
        { ...flyerAssets.aguantaderobass, title: "Aguantadero Bass", type: "Flyer", description: "Flyers para Aguantadero Bass.", tags: ["Diseño", "Flyer"] },
        { ...flyerAssets.blastkick, title: "Blastkick", type: "Flyer", description: "Flyers para Blastkick. Incluye reel animado.", tags: ["Diseño", "Flyer", "Motion"] },
        { ...flyerAssets.blastkickAnoNuevo, title: "Blastkick — Año Nuevo", type: "Flyer", description: "Edición año nuevo para Blastkick.", tags: ["Diseño", "Flyer"] },
        { ...flyerAssets.distRaptisKexxy, title: "Dist. Raptis. Kexxy.", type: "Flyer", description: "Flyer para fecha entre Dist. Raptis y Kexxy.", tags: ["Diseño", "Flyer"] },
        { ...flyerAssets.maccari, title: "Maccari", type: "Flyer", description: "Flyer para el evento Maccari.", tags: ["Diseño", "Flyer"] },
        { ...flyerAssets.overkill, title: "Overkill", type: "Flyer", description: "Flyers para Overkill.", tags: ["Diseño", "Flyer"] },
      ],
      logos: [
        { ...logosAssets.grandgroove, title: "Grandgroove Records", type: "Logo", description: "Logo para Grandgroove Records. Incluye versión animada.", tags: ["Logo", "Branding", "Motion"] },
        { ...logosAssets.chicaLunar, title: "Chica Lunar", type: "Logo", description: "Logo para Chica Lunar.", tags: ["Logo", "Branding"] },
      ],
      espacios: [
        { ...espaciosAssets.plug, title: "Plug", type: "3D / Arquitectura", description: "Visualización 3D de espacio para eventos.", tags: ["Blender", "Arquitectura", "3D"] },
        { ...espaciosAssets.recUnderclub, title: "REC Underclub", type: "3D / Arquitectura", description: "Renders y video del espacio REC Underclub.", tags: ["Blender", "Arquitectura", "3D"] },
        { ...espaciosAssets.underberlin, title: "Underberlin", type: "3D / Motion", description: "Visualización de club underground estilo Berlin.", tags: ["Blender", "Motion", "3D"] },
      ],
      about: {
        headline: "Motion, 3D, branding, web y objetos físicos.",
        paragraph: "Trabajo en Blender, TouchDesigner, After Effects y React. También con materiales: encendedores, piezas físicas, dirección de arte para eventos. No me limito a un solo servicio ni a una sola pantalla. Actualmente construyendo un estudio creativo personal en Argentina.",
        specializations: ["Motion Design / TouchDesigner", "Visualización 3D / Blender", "Desarrollo Web / React", "Dirección de Arte", "Branding e Identidad", "Objetos & Piezas Físicas"],
        portrait: null,
      },
      contact: {
        headline: "HABLEMOS",
        availableForLabel: "Disponible para",
        availableFor: ["Proyectos Freelance", "Motion Design", "3D", "Dirección de Arte", "Branding"],
        cta: "Escribime",
        note: "Respondo en menos de 24 horas",
      },
      ui: {
        nav: { back: "Volver", home: "Inicio", index: "Índice", about: "Sobre mí", contact: "Contacto", enter: "Entrar", close: "Cerrar" },
        worksLabel: "piezas",
        workLabelSingular: "pieza",
        viewCase: "Ver caso",
        visitSite: "Abrir web",
        loopLabel: "Loop",
        touchDesignerLoop: "Loop TouchDesigner",
        blenderRender: "Render Blender",
        renderTags: ["blender", "3d", "render"],
        contactLabels: { email: "Email", instagram: "Instagram", linkedin: "LinkedIn", profile: "Perfil", presskit: "Press Kit" },
        modal: { close: "Cerrar", previous: "Anterior", next: "Siguiente", navigateHint: "← → para navegar · ", closeHint: "ESC para cerrar", year: "Año", role: "Rol", status: "Estado", visitSite: "Abrir sitio", infoShow: "Ver info", infoClose: "Cerrar", slide: "Slide" },
        skipToContent: "Saltar al contenido",
        backToTop: "Inicio",
        lab: { seed: "Semilla", hint: "Click: nueva semilla", reseed: "nueva semilla" },
        footerLocation: "Argentina / Internacional",
        pageTitle: "Portfolio",
        notFound: { title: "Esta página no existe", text: "El enlace es viejo o está mal escrito. Probá con una categoría." },
        aboutCta: "Hablemos",
      },
    },
    en: {
      nav: [
        { label: "Motion", href: "/motion" },
        { label: "3D", href: "/3d" },
        { label: "Graphics", href: "/grafica" },
        { label: "Web", href: "/web" },
        { label: "Press Kit ↗", href: "https://presskit-digital.vercel.app/", external: true },
      ],
      categories: {
        motion: {
          title: "MOTION",
          kicker: "TouchDesigner / Real-time",
          subtitle: "Audio-reactive loops, live visuals and generative systems.",
          groups: {
            touchdesigner: { title: "TouchDesigner", note: "Audio-reactive loops and real-time visuals" },
            lab: { title: "Generative lab", note: "Algorithmic systems drawing live at 145 BPM" },
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
          kicker: "Flyers / Identity",
          subtitle: "Pieces for electronic music events and identities for artists and labels.",
          groups: {
            flyers: { title: "Flyers", note: "Graphic pieces for events" },
            logos: { title: "Logos & branding", note: "Identities for artists and projects" },
          },
        },
        web: {
          title: "WEB",
          kicker: "React / Design and development",
          subtitle: "Design, development and deployment of web projects.",
          groups: {
            proyectos: { title: "Projects", note: "Design, development and deploy" },
          },
        },
      },
      labPieces: [
        { id: "congregacion", title: "CONGREGACIÓN", description: "A crowd of particles praying inside a noise field; accumulated light is the memory of their paths." },
        { id: "himno", title: "HIMNO FANTASMA", description: "Damped harmonograph with a phosphor trace; every bar re-excites the pendulum with new integer harmonies." },
        { id: "comunion", title: "COMUNIÓN CELULAR", description: "Gray-Scott reaction-diffusion: membranes devouring and regrowing over a toroidal grid." },
        { id: "enjambre", title: "ENJAMBRE 145", description: "A De Jong attractor in continuous morphosis; incandescence is density, not palette." },
        { id: "liturgia", title: "LITURGIA BRUTAL", description: "Brutalist golden-ratio grid, sliced into glitch bands on the beat." },
      ],
      hero: {
        tagline: "3D / Motion / Branding / Web",
        title: "ENZO DIAZ ZINGARETTI",
        description: "Working in Blender, TouchDesigner, React and with physical materials. Based in Argentina.",
        location: "Argentina",
        availability: "Available",
        meta: "Portfolio / 2026",
        roles: ["3D Artist", "Motion Designer", "Visual Creator"],
        cta: "View Projects ↓",
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
        { ...webProjectAssets.pressKit, title: "Press Kit", type: "Web / Design", status: "Live", role: "Design and development", description: "Digital press kit for DJ. Static HTML, 3-language i18n, EmailJS contact form, SoundCloud embeds and a dates section.", tags: ["HTML", "CSS", "JavaScript", "EmailJS", "i18n"], features: ["Multilingual", "Contact form", "Music embeds"] },
        { ...webProjectAssets.portfolio, title: "WEB V1", type: "Web / Development", status: "In progress", role: "Design and development", description: "This portfolio. React + Vite + Tailwind CSS. Multimedia modal, lazy loading, WebP, centralized content.", tags: ["React", "Vite", "Tailwind CSS"], features: ["Centralized content", "Multimedia galleries", "Asset optimization"] },
      ],
      touchDesignerLoops: [
        { ...touchDesignerAssets.feedbackRitual, name: "Feedback Ritual", notes: "Audio-reactive particles and trails. Hardgroove, 145 BPM." },
        { ...touchDesignerAssets.pulseVandal, name: "Pulse Vandal", notes: "Geometries with bloom, strobes and procedural noise." },
        { ...touchDesignerAssets.ghostTunnel, name: "Ghost Tunnel", notes: "Industrial texture tunnel with real-time deformation." },
        { ...touchDesignerAssets.staticVeil, name: "Static Veil", notes: "Noise and feedback reactive to volume." },
        { ...touchDesignerAssets.ironLattice, name: "Iron Lattice", notes: "Modular structures driven by mid-side audio data." },
        { ...touchDesignerAssets.eyes, name: "Eyes", notes: "Generative eye loop. Procedural movement in real time." },
        { ...touchDesignerAssets.biology, name: "Biology", notes: "Organic loops. Fluids and cellular systems." },
        { ...touchDesignerAssets.kineticSand, name: "Kinetic Sand", notes: "Kinetic sand simulation with audio response." },
      ],
      blenderWorks: [
        { ...blenderAssets.goldenFaces, title: "Golden Faces", description: "3D portraits with gold and specular material." },
        { ...blenderAssets.ratherModular, title: "Rather Modular", description: "Modular industrial structures in Blender." },
        { ...blenderAssets.calvariaGlass, title: "Calvaria Glass", description: "Glass skull. Refraction and render study." },
        { ...blenderAssets.metallicSwarm, title: "Metallic Swarm", description: "Dense metallic surfaces. Light and texture study." },
        { ...blenderAssets.plasticStudies, title: "Plastic Studies", description: "Plastic materials, color and transparency study." },
        { ...blenderAssets.facesAlternative, title: "Faces Alternative", description: "Altered faces with geometry and distortion." },
        { ...blenderAssets.km240, title: "240 KM/H", description: "Traffic light render for a hardgroove event." },
        { ...blenderAssets.patrullero, title: "1312", description: "Police car model and animation in Blender." },
        { ...blenderAssets.cristales, title: "Cristales", description: "Crystal geometry with light refraction in Cycles." },
        { ...blenderAssets.abstract, title: "Abstract Vol. I", description: "Organic shapes and fluid abstractions in Blender." },
        { ...blenderAssets.screamingHead, title: "Screaming Head", description: "Screaming head with extreme mesh deformation." },
        { ...blenderAssets.noclueyet, title: "NCY — I", description: "Distorted heads. Unnamed series." },
        { ...blenderAssets.noclueyetB, title: "NCY — II", description: "Deformed face geometry study." },
        { ...blenderAssets.glassSkullz, title: "Glass Skullz", description: "Glass skulls. Refraction and render study." },
        { ...blenderAssets.overkillBlender, title: "Overkill 3D", description: "3D render for the Overkill session." },
      ],
      flyers: [
        { ...flyerAssets.aguantaderobass, title: "Aguantadero Bass", type: "Flyer", description: "Flyers for Aguantadero Bass.", tags: ["Design", "Flyer"] },
        { ...flyerAssets.blastkick, title: "Blastkick", type: "Flyer", description: "Flyers for Blastkick. Includes animated reel.", tags: ["Design", "Flyer", "Motion"] },
        { ...flyerAssets.blastkickAnoNuevo, title: "Blastkick — New Year", type: "Flyer", description: "New Year edition for Blastkick.", tags: ["Design", "Flyer"] },
        { ...flyerAssets.distRaptisKexxy, title: "Dist. Raptis. Kexxy.", type: "Flyer", description: "Flyer for a collab event between Dist. Raptis and Kexxy.", tags: ["Design", "Flyer"] },
        { ...flyerAssets.maccari, title: "Maccari", type: "Flyer", description: "Flyer for the Maccari event.", tags: ["Design", "Flyer"] },
        { ...flyerAssets.overkill, title: "Overkill", type: "Flyer", description: "Flyers for Overkill.", tags: ["Design", "Flyer"] },
      ],
      logos: [
        { ...logosAssets.grandgroove, title: "Grandgroove Records", type: "Logo", description: "Logo for Grandgroove Records. Includes animated version.", tags: ["Logo", "Branding", "Motion"] },
        { ...logosAssets.chicaLunar, title: "Chica Lunar", type: "Logo", description: "Logo for Chica Lunar.", tags: ["Logo", "Branding"] },
      ],
      espacios: [
        { ...espaciosAssets.plug, title: "Plug", type: "3D / Architecture", description: "3D visualization of an event venue.", tags: ["Blender", "Architecture", "3D"] },
        { ...espaciosAssets.recUnderclub, title: "REC Underclub", type: "3D / Architecture", description: "Renders and video of the REC Underclub space.", tags: ["Blender", "Architecture", "3D"] },
        { ...espaciosAssets.underberlin, title: "Underberlin", type: "3D / Motion", description: "Berlin-style underground club visualization.", tags: ["Blender", "Motion", "3D"] },
      ],
      about: {
        headline: "Motion, 3D, branding, web and physical objects.",
        paragraph: "I work in Blender, TouchDesigner, After Effects and React. Also with physical materials: lighters, handcrafted pieces, art direction for events. Not limited to a single service or screen. Currently building a personal creative studio in Argentina.",
        specializations: ["Motion Design / TouchDesigner", "3D Visualization / Blender", "Web Development / React", "Art Direction", "Branding & Identity", "Physical Objects & Craft"],
        portrait: null,
      },
      contact: {
        headline: "LET'S TALK",
        availableForLabel: "Available for",
        availableFor: ["Freelance Projects", "Motion Design", "3D", "Art Direction", "Branding"],
        cta: "Get in touch",
        note: "I reply within 24 hours",
      },
      ui: {
        nav: { back: "Back", home: "Home", index: "Index", about: "About", contact: "Contact", enter: "Enter", close: "Close" },
        worksLabel: "works",
        workLabelSingular: "work",
        viewCase: "View Case",
        visitSite: "Visit Site",
        loopLabel: "Loop",
        touchDesignerLoop: "TouchDesigner Loop",
        blenderRender: "Blender Render",
        renderTags: ["blender", "3d", "render"],
        contactLabels: { email: "Email", instagram: "Instagram", linkedin: "LinkedIn", profile: "Profile", presskit: "Press Kit" },
        modal: { close: "Close", previous: "Previous", next: "Next", navigateHint: "← → to navigate · ", closeHint: "ESC to close", year: "Year", role: "Role", status: "Status", visitSite: "Visit Site", infoShow: "View info", infoClose: "Close", slide: "Slide" },
        skipToContent: "Skip to content",
        backToTop: "Top",
        lab: { seed: "Seed", hint: "Click: new seed", reseed: "new seed" },
        footerLocation: "Argentina / Worldwide",
        pageTitle: "Portfolio",
        notFound: { title: "This page doesn't exist", text: "The link is old or mistyped. Try one of the categories." },
        aboutCta: "Let's Talk",
      },
    },
    pt: {
      nav: [
        { label: "Motion", href: "/motion" },
        { label: "3D", href: "/3d" },
        { label: "Gráfica", href: "/grafica" },
        { label: "Web", href: "/web" },
        { label: "Press Kit ↗", href: "https://presskit-digital.vercel.app/", external: true },
      ],
      categories: {
        motion: {
          title: "MOTION",
          kicker: "TouchDesigner / Tempo real",
          subtitle: "Loops audio-reativos, visuais ao vivo e sistemas generativos.",
          groups: {
            touchdesigner: { title: "TouchDesigner", note: "Loops audio-reativos e visuais em tempo real" },
            lab: { title: "Lab generativo", note: "Sistemas algorítmicos desenhando ao vivo a 145 BPM" },
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
          kicker: "Flyers / Identidade",
          subtitle: "Peças para eventos de eletrônica e identidades para artistas e selos.",
          groups: {
            flyers: { title: "Flyers", note: "Peças gráficas para eventos" },
            logos: { title: "Logos & branding", note: "Identidades para artistas e projetos" },
          },
        },
        web: {
          title: "WEB",
          kicker: "React / Design e desenvolvimento",
          subtitle: "Design, desenvolvimento e deploy de projetos web.",
          groups: {
            proyectos: { title: "Projetos", note: "Design, desenvolvimento e deploy" },
          },
        },
      },
      labPieces: [
        { id: "congregacion", title: "CONGREGACIÓN", description: "Multidão de partículas rezando num campo de ruído; a luz acumulada é a memória das suas trajetórias." },
        { id: "himno", title: "HIMNO FANTASMA", description: "Harmonógrafo amortecido com traço de fósforo; cada compasso re-excita o pêndulo com novas harmonias inteiras." },
        { id: "comunion", title: "COMUNIÓN CELULAR", description: "Reação-difusão de Gray-Scott: membranas que se devoram e regeneram sobre uma grade toroidal." },
        { id: "enjambre", title: "ENJAMBRE 145", description: "Atrator de De Jong em morfose contínua; a incandescência é densidade, não paleta." },
        { id: "liturgia", title: "LITURGIA BRUTAL", description: "Grade brutalista de proporção áurea, cortada em bandas glitch no ritmo da batida." },
      ],
      hero: {
        tagline: "3D / Motion / Branding / Web",
        title: "ENZO DIAZ ZINGARETTI",
        description: "Trabalho em Blender, TouchDesigner, React e com materiais físicos. Baseado na Argentina.",
        location: "Argentina",
        availability: "Disponível",
        meta: "Portfólio / 2026",
        roles: ["Artista 3D", "Motion Designer", "Criador Visual"],
        cta: "Ver projetos ↓",
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
        { ...webProjectAssets.pressKit, title: "Press Kit", type: "Web / Design", status: "Online", role: "Design e desenvolvimento", description: "Press kit digital para DJ. HTML estático, i18n em 3 idiomas, formulário EmailJS, embeds do SoundCloud e seção de datas.", tags: ["HTML", "CSS", "JavaScript", "EmailJS", "i18n"], features: ["Multilíngue", "Formulário de contato", "Embeds musicais"] },
        { ...webProjectAssets.portfolio, title: "WEB V1", type: "Web / Desenvolvimento", status: "Em progresso", role: "Design e desenvolvimento", description: "Este portfólio. React + Vite + Tailwind CSS. Modal com carrossel multimídia, lazy loading, WebP, conteúdo centralizado.", tags: ["React", "Vite", "Tailwind CSS"], features: ["Conteúdo centralizado", "Galerias multimídia", "Otimização de assets"] },
      ],
      touchDesignerLoops: [
        { ...touchDesignerAssets.feedbackRitual, name: "Feedback Ritual", notes: "Partículas e trails generativos sincronizados com hardgroove a 145 BPM." },
        { ...touchDesignerAssets.pulseVandal, name: "Pulse Vandal", notes: "Geometrias quebradas com bloom agressivo, estrobos e camadas de ruído procedural." },
        { ...touchDesignerAssets.ghostTunnel, name: "Ghost Tunnel", notes: "Túnel audiovisual de texturas industriais com deformação modular." },
        { ...touchDesignerAssets.staticVeil, name: "Static Veil", notes: "Camadas de ruído e feedback que reagem ao volume em tempo real." },
        { ...touchDesignerAssets.ironLattice, name: "Iron Lattice", notes: "Estruturas modulares geradas por dados de áudio mid-side." },
        { ...touchDesignerAssets.eyes, name: "Eyes", notes: "Loop visual de olhos generativos. Movimento orgânico e tratamento escuro em tempo real." },
        { ...touchDesignerAssets.biology, name: "Biology", notes: "Loops orgânicos. Fluidos e sistemas celulares." },
        { ...touchDesignerAssets.kineticSand, name: "Kinetic Sand", notes: "Simulação de areia cinética com resposta ao áudio." },
      ],
      blenderWorks: [
        { ...blenderAssets.goldenFaces, title: "Golden Faces", description: "Retratos 3D com material dourado e especular." },
        { ...blenderAssets.ratherModular, title: "Rather Modular", description: "Estruturas modulares industriais em Blender." },
        { ...blenderAssets.calvariaGlass, title: "Calvaria Glass", description: "Crânio em vidro. Estudo de refração e render." },
        { ...blenderAssets.metallicSwarm, title: "Metallic Swarm", description: "Superfícies metálicas densas. Estudo de luz e textura." },
        { ...blenderAssets.plasticStudies, title: "Plastic Studies", description: "Materiais plásticos, cor e transparência." },
        { ...blenderAssets.facesAlternative, title: "Faces Alternative", description: "Rostos alterados com geometria e distorção." },
        { ...blenderAssets.km240, title: "240 KM/H", description: "Render de semáforo para evento de hardgroove." },
        { ...blenderAssets.patrullero, title: "1312", description: "Modelo e animação de viatura policial em Blender." },
        { ...blenderAssets.cristales, title: "Cristales", description: "Geometria cristalina com refração em Blender Cycles." },
        { ...blenderAssets.abstract, title: "Abstract Vol. I", description: "Formas orgânicas e abstrações fluidas em Blender." },
        { ...blenderAssets.screamingHead, title: "Screaming Head", description: "Cabeça com deformação extrema. Estudo de malha e expressão." },
        { ...blenderAssets.noclueyet, title: "NCY — I", description: "Cabeças distorcidas. Série sem nome." },
        { ...blenderAssets.noclueyetB, title: "NCY — II", description: "Estudo de geometria facial deformada." },
        { ...blenderAssets.glassSkullz, title: "Glass Skullz", description: "Crânios em vidro. Estudo de refração e render." },
        { ...blenderAssets.overkillBlender, title: "Overkill 3D", description: "Render 3D para a sessão Overkill." },
      ],
      flyers: [
        { ...flyerAssets.aguantaderobass, title: "Aguantadero Bass", type: "Flyer", description: "Flyers para Aguantadero Bass.", tags: ["Design", "Flyer"] },
        { ...flyerAssets.blastkick, title: "Blastkick", type: "Flyer", description: "Flyers para Blastkick. Inclui reel animado.", tags: ["Design", "Flyer", "Motion"] },
        { ...flyerAssets.blastkickAnoNuevo, title: "Blastkick — Ano Novo", type: "Flyer", description: "Edição ano novo para Blastkick.", tags: ["Design", "Flyer"] },
        { ...flyerAssets.distRaptisKexxy, title: "Dist. Raptis. Kexxy.", type: "Flyer", description: "Flyer para evento entre Dist. Raptis e Kexxy.", tags: ["Design", "Flyer"] },
        { ...flyerAssets.maccari, title: "Maccari", type: "Flyer", description: "Flyer para o evento Maccari.", tags: ["Design", "Flyer"] },
        { ...flyerAssets.overkill, title: "Overkill", type: "Flyer", description: "Flyers para Overkill.", tags: ["Design", "Flyer"] },
      ],
      logos: [
        { ...logosAssets.grandgroove, title: "Grandgroove Records", type: "Logo", description: "Logo para Grandgroove Records. Inclui versão animada.", tags: ["Logo", "Branding", "Motion"] },
        { ...logosAssets.chicaLunar, title: "Chica Lunar", type: "Logo", description: "Logo para Chica Lunar.", tags: ["Logo", "Branding"] },
      ],
      espacios: [
        { ...espaciosAssets.plug, title: "Plug", type: "3D / Arquitetura", description: "Visualização 3D de espaço para eventos.", tags: ["Blender", "Arquitetura", "3D"] },
        { ...espaciosAssets.recUnderclub, title: "REC Underclub", type: "3D / Arquitetura", description: "Renders e vídeo do espaço REC Underclub.", tags: ["Blender", "Arquitetura", "3D"] },
        { ...espaciosAssets.underberlin, title: "Underberlin", type: "3D / Motion", description: "Visualização de clube underground estilo Berlim.", tags: ["Blender", "Motion", "3D"] },
      ],
      about: {
        headline: "Motion, 3D, branding, web e objetos físicos.",
        paragraph: "Trabalho em Blender, TouchDesigner, After Effects e React. Também com materiais físicos: isqueiros, peças artesanais, direção de arte para eventos. Não me limito a um único serviço. Atualmente construindo um estúdio criativo pessoal na Argentina.",
        specializations: ["Motion Design / TouchDesigner", "Visualização 3D / Blender", "Desenvolvimento Web / React", "Direção de Arte", "Branding & Identidade", "Objetos & Artesanato"],
        portrait: null,
      },
      contact: {
        headline: "VAMOS FALAR",
        availableForLabel: "Disponível para",
        availableFor: ["Projetos Freelance", "Motion Design", "3D", "Direção de Arte", "Branding"],
        cta: "Me escreve",
        note: "Respondo em menos de 24 horas",
      },
      ui: {
        nav: { back: "Voltar", home: "Início", index: "Índice", about: "Sobre mim", contact: "Contato", enter: "Entrar", close: "Fechar" },
        worksLabel: "peças",
        workLabelSingular: "peça",
        viewCase: "Ver caso",
        visitSite: "Abrir site",
        loopLabel: "Loop",
        touchDesignerLoop: "Loop TouchDesigner",
        blenderRender: "Render Blender",
        renderTags: ["blender", "3d", "render"],
        contactLabels: { email: "Email", instagram: "Instagram", linkedin: "LinkedIn", profile: "Perfil", presskit: "Press Kit" },
        modal: { close: "Fechar", previous: "Anterior", next: "Próximo", navigateHint: "← → para navegar · ", closeHint: "ESC para fechar", year: "Ano", role: "Papel", status: "Status", visitSite: "Abrir site", infoShow: "Ver info", infoClose: "Fechar", slide: "Slide" },
        skipToContent: "Pular para o conteúdo",
        backToTop: "Início",
        lab: { seed: "Semente", hint: "Clique: nova semente", reseed: "nova semente" },
        footerLocation: "Argentina / Internacional",
        pageTitle: "Portfólio",
        notFound: { title: "Esta página não existe", text: "O link é antigo ou está mal escrito. Tente uma das categorias." },
        aboutCta: "Vamos Conversar",
      },
    },
  },
};
