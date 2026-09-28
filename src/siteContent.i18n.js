const webProjectAssets = {
  pressKit: {
    year: "2025",
    imageUrl: null,
    previewUrl: "https://presskit-digital.vercel.app/",
    previewImage: "/images/previews/screenshot_kexxypresskit.jpeg",
    repoUrl: "https://github.com/Enzodiazzingaretti/presskit_digital",
    slides: [],
  },
  portfolio: {
    year: "2025",
    imageUrl: null,
    previewUrl: "#hero",
    previewImage: "/images/previews/screenshot_portfolio.jpeg",
    repoUrl: "https://github.com/Enzodiazzingaretti/portfolio",
    slides: [],
  },
  tamara: {
    year: "2026",
    imageUrl: null,
    previewUrl: "https://tamara-portfolio-xi.vercel.app/",
    previewImage: "/images/previews/screenshot_tamaraportfolio.jpeg",
    repoUrl: "https://github.com/Enzodiazzingaretti/tamara-portfolio",
    slides: [],
  },
  newMetals: {
    year: "2026",
    imageUrl: null,
    previewUrl: "https://newmetals-portfolio.vercel.app/",
    previewImage: "/images/previews/screenshot_newmetalsportfolio.jpeg",
    repoUrl: "https://github.com/Enzodiazzingaretti/newmetals-portfolio",
    slides: [],
  },
  ctrlzPresskit: {
    year: "2026",
    imageUrl: null,
    previewUrl: "https://ctrlz-presskit.vercel.app/",
    previewImage: "/images/previews/screenshot_ctrlzpresskit.jpeg",
    repoUrl: "https://github.com/Enzodiazzingaretti/ctrlz-presskit",
    slides: [],
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
  feedbackRitual: {
    thumbnail: "/images/loops/feedback-ritual.mp4",
    audio: "/images/loops/feedback-ritual.m4a",
    slides: [
      "/images/touchdesigner/feedback-ritual/audioreactive-vol2-test.mp4",
      "/images/touchdesigner/feedback-ritual/audioreactive-vol3-test-1-1.mp4",
      "/images/touchdesigner/feedback-ritual/audioreactive-vol5-test-1.mp4",
      "/images/touchdesigner/feedback-ritual/audioreactive-vol6-test-1.mp4",
      "/images/touchdesigner/feedback-ritual/audioreactive-vol7-test-1.mp4",
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
  glassSkullz: {
    portrait: true,
    slides: [
      "/images/blender/glass_skullz/glass-skullz-2.png",
      "/images/blender/glass_skullz/glass-skullz-3.png",
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
  brand: "ENZO DIAZ ZINGARETTI",
  defaultLanguage: "es",
  heroImage: null,
  languages: [
    { code: "es", label: "ES", name: "Español" },
    { code: "en", label: "EN", name: "English" },
    { code: "pt", label: "PT", name: "Português" },
  ],
  contactLinks: {
    email: "enzodiazzingaretti27@gmail.com",
    instagram: "https://www.instagram.com/kexxy.obj",
    linkedin: "https://www.linkedin.com/in/enzo-diaz-zingaretti",
    github: "https://github.com/Enzodiazzingaretti",
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
        title: "ENZO DIAZ ZINGARETTI",
        description: "Diseño y produzco piezas 3D y motion, visuales en tiempo real y sitios web con React y Three.js. Desde Mendoza, Argentina, en remoto.",
        location: "Mendoza, AR · UTC−3",
        availability: "Disponible",
        meta: "Portfolio / 2026",
        roles: ["Creative Technologist", "Diseñador 3D & Motion", "Desarrollador Creativo"],
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
        { ...webProjectAssets.portfolio, scrollPreview: true, title: "Portfolio Personal", type: "Web / Diseño y desarrollo", status: "Online", role: "Diseño y desarrollo", description: "Este sitio. React + Vite + Tailwind, con el hero en Three.js pasado por un filtro ASCII escrito a mano (shader propio). Adentro: un lab de ocho piezas generativas con parámetros en vivo, un panel de administración que guarda el contenido en el repo vía la API de GitHub, y todo en tres idiomas.", tags: ["React", "Three.js", "GLSL", "Vite", "Tailwind CSS"], features: ["Filtro ASCII en Three.js", "Lab generativo", "Panel de administración", "Trilingüe"] },
        { ...webProjectAssets.tamara, title: "Tamara González", type: "Web / Diseño y desarrollo", status: "Online", role: "Diseño y desarrollo", description: "Portfolio de una artista visual (tatuajes, ilustración y pintura). React + Vite + Tailwind CSS y Framer Motion, con panel de administración propio sobre funciones serverless para que ella actualice su galería. La API y el panel tienen tests con Vitest.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Vitest"], features: ["Panel de administración", "Tests con Vitest", "Galería por categoría", "Contacto por WhatsApp"] },
        { ...webProjectAssets.newMetals, title: "New Metals", type: "Web / Diseño y desarrollo", status: "Online", role: "Diseño y desarrollo", description: "Sitio para un taller de fabricación y soldadura metálica de Tupungato, Mendoza. React + Vite + Tailwind CSS y Framer Motion: hero animado con una chispa sobre negro, catálogo de trabajos editable desde un panel propio y contacto directo por WhatsApp.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion"], features: ["Panel de administración", "Catálogo de trabajos", "Contacto por WhatsApp"] },
        { ...webProjectAssets.ctrlzPresskit, title: "CTRL.Z — Press Kit", type: "Web / Diseño y desarrollo", status: "Online", role: "Diseño y desarrollo", description: "Press kit para CTRL.Z (Brenda Hetcer), DJ de música urbana de Mendoza. JavaScript sin framework sobre la base de mi plantilla de press kit, con la estética del PDF original de la artista y panel de administración propio con funciones serverless en Vercel.", tags: ["HTML", "CSS", "JavaScript", "Vercel Functions"], features: ["Rider técnico", "Fotos de prensa", "Contacto de booking", "Panel de administración"] },
        { ...webProjectAssets.pressKit, scrollPreview: true, title: "KEXXY — Press Kit", type: "Web / Diseño y desarrollo", status: "Online", role: "Diseño y desarrollo", description: "Mi press kit como DJ y la plantilla de la que salió el de CTRL.Z. JavaScript sin framework, trilingüe, con service worker, formulario de contacto con EmailJS y un panel de dos niveles (simple y avanzado) que guarda los cambios en el repo vía la API de GitHub.", tags: ["HTML", "CSS", "JavaScript", "Vercel Functions", "GitHub API"], features: ["Trilingüe", "Panel de administración", "Embeds de SoundCloud", "Sección de fechas"] },
        { ...webProjectAssets.aurora, title: "Cecilia — Hospedajes", type: "Web / Diseño y desarrollo", status: "En desarrollo", role: "Diseño y desarrollo", description: "Sitio para dos casas de alquiler en Mendoza. Next.js + TypeScript + Tailwind CSS, landing cinemática por propiedad, trilingüe.", tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"], features: ["Landing por propiedad", "Trilingüe", "Scroll suave"] },
      ],
      touchDesignerLoops: [
        { ...touchDesignerAssets.feedbackRitual, name: "Feedback Ritual", notes: "Partículas y trails audio-reactivos. Hardgroove, 145 BPM." },
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
        { ...blenderAssets.km240, title: "240 KM/H", description: "Semáforo bajo la lluvia, de noche: pasa a verde y se enciende un cartel con el logo de 240 KM/H. Pieza propia, vertical para Reels." },
        { ...blenderAssets.patrullero, title: "Patrullero", description: "Un patrullero cubierto de grafiti en un callejón, de noche. Modelado y animación en Blender." },
        { ...blenderAssets.cristales, title: "Cristales", description: "Geometría cristalina con refracción en Blender Cycles." },
        { ...blenderAssets.abstract, title: "Abstract Vol. I", description: "Formas orgánicas y fluidos abstractos en Blender." },
        { ...blenderAssets.screamingHead, title: "Screaming Head", description: "Un rostro que grita bajo una tela negra brillante." },
        { ...blenderAssets.noclueyet, title: "NCY", description: "Cabezas cromadas apiladas, gritando, con dientes de oro, y una variación en negro brillante sobre gris claro." },
        { ...blenderAssets.glassSkullz, title: "Glass Skullz", description: "Cráneos en vidrio. Exploración de refracción y render." },
        { ...blenderAssets.overkillBlender, title: "Overkill 3D", description: "Dos manos que se buscan a través de portales de luz roja. Render para la sesión Overkill." },
      ],
      flyers: [
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
        headline: "Diseñador 3D y motion que también programa.",
        paragraph: "Modelo, ilumino y animo en Blender y After Effects, armo visuales audio-reactivos en TouchDesigner y desarrollo sitios con React y Three.js. Trabajo freelance desde 2022 para marcas, artistas y eventos: renders de producto, flyers animados, visualización de espacios y sitios con panel de administración propio.",
        // Datos duros para quien evalúa en 30 segundos. Solo viven acá:
        // content.json no los define, así que en español también salen de acá.
        facts: [
          { label: "Experiencia", value: "3D y motion desde 2022 · Desarrollo web desde 2023" },
          { label: "Idiomas", value: "Español nativo · Inglés avanzado (título de traductor) · Portugués intermedio" },
          { label: "Base", value: "Mendoza, Argentina · UTC−3, a 1–2 h de la costa este de EE. UU." },
          { label: "Disponibilidad", value: "Full-time remoto · Freelance" },
          { label: "Herramientas", value: "Blender · After Effects · TouchDesigner · Figma · React · Three.js" },
        ],
        specializations: ["Motion Design / TouchDesigner", "Visualización 3D / Blender", "Desarrollo Web / React", "Dirección de Arte", "Branding e Identidad", "Objetos & Piezas Físicas"],
      },
      contact: {
        headline: "HABLEMOS",
        availableForLabel: "Disponible para",
        availableFor: ["Full-time remoto", "Freelance", "Motion Design", "3D", "Desarrollo web", "Dirección de arte", "Branding"],
        cta: "Escribime",
        note: "Respondo en menos de 24 horas",
        cv: "/cv/Enzo-Diaz-Zingaretti-CV-ES.pdf",
      },
      ui: {
        nav: { back: "Volver", home: "Inicio", index: "Índice", about: "Sobre mí", showcase: "Destacados", contact: "Contacto", enter: "Entrar", close: "Cerrar" },
        showcase: {
          previous: "Anterior",
          next: "Siguiente",
          audio: { listen: "Escuchar el audio de esta pieza", mute: "Silenciar" },
        },
        worksLabel: "piezas",
        workLabelSingular: "pieza",
        viewCase: "Ver caso",
        visitSite: "Abrir web",
        viewCode: "Código",
        loopLabel: "Loop",
        touchDesignerLoop: "Loop TouchDesigner",
        blenderRender: "Render Blender",
        renderTags: ["blender", "3d", "render"],
        contactLabels: { email: "Email", instagram: "Instagram", linkedin: "LinkedIn", github: "GitHub", profile: "Perfil", cv: "Descargar CV (PDF)" },
        modal: { close: "Cerrar", previous: "Anterior", next: "Siguiente", navigateHint: "← → para navegar · ", closeHint: "ESC para cerrar", year: "Año", role: "Rol", status: "Estado", visitSite: "Abrir sitio", viewCode: "Ver código", features: "Incluye", infoShow: "Ver info", infoClose: "Cerrar", slide: "Slide" },
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
          hintLong: 'escribí "kexxy"',
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
        title: "ENZO DIAZ ZINGARETTI",
        description: "I design and produce 3D and motion pieces, real-time visuals and websites with React and Three.js. From Mendoza, Argentina, working remotely.",
        location: "Mendoza, AR · UTC−3",
        availability: "Available",
        meta: "Portfolio / 2026",
        roles: ["Creative Technologist", "3D & Motion Designer", "Creative Developer"],
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
        { ...webProjectAssets.portfolio, scrollPreview: true, title: "Personal Portfolio", type: "Web / Design and development", status: "Live", role: "Design and development", description: "This site. React + Vite + Tailwind, with a Three.js hero run through a hand-written ASCII shader. Inside: a lab of eight generative pieces with live parameters, an admin panel that saves content to the repo through the GitHub API, and everything in three languages.", tags: ["React", "Three.js", "GLSL", "Vite", "Tailwind CSS"], features: ["Three.js ASCII pass", "Generative lab", "Admin panel", "Trilingual"] },
        { ...webProjectAssets.tamara, title: "Tamara González", type: "Web / Design and development", status: "Live", role: "Design and development", description: "Portfolio for a visual artist (tattoos, illustration and painting). React + Vite + Tailwind CSS and Framer Motion, with a custom admin panel on serverless functions so she can update her gallery herself. The API and the panel are tested with Vitest.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Vitest"], features: ["Admin panel", "Vitest tests", "Gallery by category", "WhatsApp contact"] },
        { ...webProjectAssets.newMetals, title: "New Metals", type: "Web / Design and development", status: "Live", role: "Design and development", description: "Site for a metal fabrication and welding workshop in Tupungato, Mendoza. React + Vite + Tailwind CSS and Framer Motion: an animated hero with a spark on black, a work catalogue editable from a custom admin panel, and direct WhatsApp contact.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion"], features: ["Admin panel", "Work catalogue", "WhatsApp contact"] },
        { ...webProjectAssets.ctrlzPresskit, title: "CTRL.Z — Press Kit", type: "Web / Design and development", status: "Live", role: "Design and development", description: "Press kit for CTRL.Z (Brenda Hetcer), an urban music DJ from Mendoza. Framework-free JavaScript built on my own press kit template, following the look of the artist's original PDF, with a custom admin panel on Vercel serverless functions.", tags: ["HTML", "CSS", "JavaScript", "Vercel Functions"], features: ["Technical rider", "Press photos", "Booking contact", "Admin panel"] },
        { ...webProjectAssets.pressKit, scrollPreview: true, title: "KEXXY — Press Kit", type: "Web / Design and development", status: "Live", role: "Design and development", description: "My own DJ press kit, and the template the CTRL.Z one was built from. Framework-free JavaScript, trilingual, with a service worker, an EmailJS contact form and a two-level admin panel (simple and advanced) that commits changes to the repo through the GitHub API.", tags: ["HTML", "CSS", "JavaScript", "Vercel Functions", "GitHub API"], features: ["Trilingual", "Admin panel", "SoundCloud embeds", "Dates section"] },
        { ...webProjectAssets.aurora, title: "Cecilia — Stays", type: "Web / Design and development", status: "In development", role: "Design and development", description: "Site for two rental houses in Mendoza. Next.js + TypeScript + Tailwind CSS, cinematic landing per property, trilingual.", tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"], features: ["Landing per property", "Trilingual", "Smooth scroll"] },
      ],
      touchDesignerLoops: [
        { ...touchDesignerAssets.feedbackRitual, name: "Feedback Ritual", notes: "Audio-reactive particles and trails. Hardgroove, 145 BPM." },
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
        { ...blenderAssets.km240, title: "240 KM/H", description: "A traffic light in the rain at night: it turns green and a sign with the 240 KM/H logo lights up. Self-initiated vertical piece for Reels." },
        { ...blenderAssets.patrullero, title: "Patrullero", description: "A police car covered in graffiti, in an alley at night. Modelling and animation in Blender." },
        { ...blenderAssets.cristales, title: "Cristales", description: "Crystal geometry with light refraction in Cycles." },
        { ...blenderAssets.abstract, title: "Abstract Vol. I", description: "Organic shapes and fluid abstractions in Blender." },
        { ...blenderAssets.screamingHead, title: "Screaming Head", description: "A screaming face pressing through a glossy black sheet." },
        { ...blenderAssets.noclueyet, title: "NCY", description: "Stacked chrome heads, screaming, with gold teeth, plus a variation in glossy black on light grey." },
        { ...blenderAssets.glassSkullz, title: "Glass Skullz", description: "Glass skulls. Refraction and render study." },
        { ...blenderAssets.overkillBlender, title: "Overkill 3D", description: "Two hands reaching for each other through portals of red light. Render for the Overkill session." },
      ],
      flyers: [
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
        headline: "A 3D and motion designer who also codes.",
        paragraph: "I model, light and animate in Blender and After Effects, build audio-reactive visuals in TouchDesigner and develop websites with React and Three.js. Freelancing since 2022 for brands, artists and events: product renders, animated flyers, venue visualization and sites with custom admin panels.",
        // Datos duros para quien evalúa en 30 segundos. Solo viven acá:
        // content.json no los define, así que en español también salen de acá.
        facts: [
          { label: "Experience", value: "3D & motion since 2022 · Web development since 2023" },
          { label: "Languages", value: "Spanish (native) · English (advanced, translation degree) · Portuguese (intermediate)" },
          { label: "Based in", value: "Mendoza, Argentina · UTC−3, 1–2 h ahead of US Eastern" },
          { label: "Availability", value: "Full-time remote · Freelance" },
          { label: "Tools", value: "Blender · After Effects · TouchDesigner · Figma · React · Three.js" },
        ],
        specializations: ["Motion Design / TouchDesigner", "3D Visualization / Blender", "Web Development / React", "Art Direction", "Branding & Identity", "Physical Objects & Craft"],
      },
      contact: {
        headline: "LET'S TALK",
        availableForLabel: "Available for",
        availableFor: ["Full-time remote", "Freelance", "Motion Design", "3D", "Web Development", "Art Direction", "Branding"],
        cta: "Get in touch",
        note: "I reply within 24 hours",
        cv: "/cv/Enzo-Diaz-Zingaretti-CV-EN.pdf",
      },
      ui: {
        nav: { back: "Back", home: "Home", index: "Index", about: "About", showcase: "Selected work", contact: "Contact", enter: "Enter", close: "Close" },
        showcase: {
          previous: "Previous",
          next: "Next",
          audio: { listen: "Play this piece's audio", mute: "Mute" },
        },
        worksLabel: "works",
        workLabelSingular: "work",
        viewCase: "View Case",
        visitSite: "Visit Site",
        viewCode: "Code",
        loopLabel: "Loop",
        touchDesignerLoop: "TouchDesigner Loop",
        blenderRender: "Blender Render",
        renderTags: ["blender", "3d", "render"],
        contactLabels: { email: "Email", instagram: "Instagram", linkedin: "LinkedIn", github: "GitHub", profile: "Profile", cv: "Download CV (PDF)" },
        modal: { close: "Close", previous: "Previous", next: "Next", navigateHint: "← → to navigate · ", closeHint: "ESC to close", year: "Year", role: "Role", status: "Status", visitSite: "Visit Site", viewCode: "View code", features: "Includes", infoShow: "View info", infoClose: "Close", slide: "Slide" },
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
          hintLong: 'type "kexxy"',
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
        title: "ENZO DIAZ ZINGARETTI",
        description: "Crio peças 3D e motion, visuais em tempo real e sites com React e Three.js. De Mendoza, Argentina, trabalhando remotamente.",
        location: "Mendoza, AR · UTC−3",
        availability: "Disponível",
        meta: "Portfólio / 2026",
        roles: ["Creative Technologist", "Designer 3D & Motion", "Desenvolvedor Criativo"],
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
        { ...webProjectAssets.portfolio, scrollPreview: true, title: "Portfólio Pessoal", type: "Web / Design e desenvolvimento", status: "Online", role: "Design e desenvolvimento", description: "Este site. React + Vite + Tailwind, com o hero em Three.js passado por um filtro ASCII escrito à mão (shader próprio). Dentro: um lab de oito peças generativas com parâmetros ao vivo, um painel de administração que salva o conteúdo no repositório pela API do GitHub, e tudo em três idiomas.", tags: ["React", "Three.js", "GLSL", "Vite", "Tailwind CSS"], features: ["Filtro ASCII em Three.js", "Lab generativo", "Painel de administração", "Trilíngue"] },
        { ...webProjectAssets.tamara, title: "Tamara González", type: "Web / Design e desenvolvimento", status: "Online", role: "Design e desenvolvimento", description: "Portfólio de uma artista visual (tatuagens, ilustração e pintura). React + Vite + Tailwind CSS e Framer Motion, com painel de administração próprio sobre funções serverless para ela atualizar a galeria. A API e o painel têm testes com Vitest.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Vitest"], features: ["Painel de administração", "Testes com Vitest", "Galeria por categoria", "Contato via WhatsApp"] },
        { ...webProjectAssets.newMetals, title: "New Metals", type: "Web / Design e desenvolvimento", status: "Online", role: "Design e desenvolvimento", description: "Site para uma oficina de fabricação e solda metálica em Tupungato, Mendoza. React + Vite + Tailwind CSS e Framer Motion: hero animado com uma faísca sobre preto, catálogo de trabalhos editável por um painel próprio e contato direto via WhatsApp.", tags: ["React", "Vite", "Tailwind CSS", "Framer Motion"], features: ["Painel de administração", "Catálogo de trabalhos", "Contato via WhatsApp"] },
        { ...webProjectAssets.ctrlzPresskit, title: "CTRL.Z — Press Kit", type: "Web / Design e desenvolvimento", status: "Online", role: "Design e desenvolvimento", description: "Press kit para CTRL.Z (Brenda Hetcer), DJ de música urbana de Mendoza. JavaScript sem framework sobre o meu template de press kit, com a estética do PDF original da artista e painel de administração próprio com funções serverless na Vercel.", tags: ["HTML", "CSS", "JavaScript", "Vercel Functions"], features: ["Rider técnico", "Fotos de imprensa", "Contato de booking", "Painel de administração"] },
        { ...webProjectAssets.pressKit, scrollPreview: true, title: "KEXXY — Press Kit", type: "Web / Design e desenvolvimento", status: "Online", role: "Design e desenvolvimento", description: "Meu press kit como DJ e o template de onde saiu o do CTRL.Z. JavaScript sem framework, trilíngue, com service worker, formulário de contato com EmailJS e um painel de dois níveis (simples e avançado) que salva as alterações no repositório pela API do GitHub.", tags: ["HTML", "CSS", "JavaScript", "Vercel Functions", "GitHub API"], features: ["Trilíngue", "Painel de administração", "Embeds do SoundCloud", "Seção de datas"] },
        { ...webProjectAssets.aurora, title: "Cecilia — Hospedagens", type: "Web / Design e desenvolvimento", status: "Em desenvolvimento", role: "Design e desenvolvimento", description: "Site para duas casas de aluguel em Mendoza. Next.js + TypeScript + Tailwind CSS, landing cinematográfica por propriedade, trilíngue.", tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"], features: ["Landing por propriedade", "Trilíngue", "Rolagem suave"] },
      ],
      touchDesignerLoops: [
        { ...touchDesignerAssets.feedbackRitual, name: "Feedback Ritual", notes: "Partículas e trails generativos sincronizados com hardgroove a 145 BPM." },
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
        { ...blenderAssets.km240, title: "240 KM/H", description: "Semáforo na chuva, à noite: fica verde e acende um letreiro com o logo da 240 KM/H. Peça própria, vertical para Reels." },
        { ...blenderAssets.patrullero, title: "Patrullero", description: "Uma viatura policial coberta de grafite num beco, à noite. Modelagem e animação em Blender." },
        { ...blenderAssets.cristales, title: "Cristales", description: "Geometria cristalina com refração em Blender Cycles." },
        { ...blenderAssets.abstract, title: "Abstract Vol. I", description: "Formas orgânicas e abstrações fluidas em Blender." },
        { ...blenderAssets.screamingHead, title: "Screaming Head", description: "Um rosto gritando sob um tecido preto brilhante." },
        { ...blenderAssets.noclueyet, title: "NCY", description: "Cabeças cromadas empilhadas, gritando, com dentes de ouro, e uma variação em preto brilhante sobre cinza claro." },
        { ...blenderAssets.glassSkullz, title: "Glass Skullz", description: "Crânios em vidro. Estudo de refração e render." },
        { ...blenderAssets.overkillBlender, title: "Overkill 3D", description: "Duas mãos que se buscam através de portais de luz vermelha. Render para a sessão Overkill." },
      ],
      flyers: [
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
        headline: "Designer 3D e motion que também programa.",
        paragraph: "Modelo, ilumino e animo no Blender e no After Effects, crio visuais audiorreativos no TouchDesigner e desenvolvo sites com React e Three.js. Freelancer desde 2022 para marcas, artistas e eventos: renders de produto, flyers animados, visualização de espaços e sites com painel de administração próprio.",
        // Datos duros para quien evalúa en 30 segundos. Solo viven acá:
        // content.json no los define, así que en español también salen de acá.
        facts: [
          { label: "Experiência", value: "3D e motion desde 2022 · Desenvolvimento web desde 2023" },
          { label: "Idiomas", value: "Espanhol nativo · Inglês avançado (formação em tradução) · Português intermediário" },
          { label: "Base", value: "Mendoza, Argentina · UTC−3, 1–2 h à frente da costa leste dos EUA" },
          { label: "Disponibilidade", value: "Full-time remoto · Freelance" },
          { label: "Ferramentas", value: "Blender · After Effects · TouchDesigner · Figma · React · Three.js" },
        ],
        specializations: ["Motion Design / TouchDesigner", "Visualização 3D / Blender", "Desenvolvimento Web / React", "Direção de Arte", "Branding & Identidade", "Objetos & Artesanato"],
      },
      contact: {
        headline: "VAMOS FALAR",
        availableForLabel: "Disponível para",
        availableFor: ["Full-time remoto", "Freelance", "Motion Design", "3D", "Desenvolvimento Web", "Direção de Arte", "Branding"],
        cta: "Me escreve",
        note: "Respondo em menos de 24 horas",
        cv: "/cv/Enzo-Diaz-Zingaretti-CV-PT.pdf",
      },
      ui: {
        nav: { back: "Voltar", home: "Início", index: "Índice", about: "Sobre mim", showcase: "Destaques", contact: "Contato", enter: "Entrar", close: "Fechar" },
        showcase: {
          previous: "Anterior",
          next: "Próximo",
          audio: { listen: "Ouvir o áudio desta peça", mute: "Silenciar" },
        },
        worksLabel: "peças",
        workLabelSingular: "peça",
        viewCase: "Ver caso",
        visitSite: "Abrir site",
        viewCode: "Código",
        loopLabel: "Loop",
        touchDesignerLoop: "Loop TouchDesigner",
        blenderRender: "Render Blender",
        renderTags: ["blender", "3d", "render"],
        contactLabels: { email: "Email", instagram: "Instagram", linkedin: "LinkedIn", github: "GitHub", profile: "Perfil", cv: "Baixar CV (PDF)" },
        modal: { close: "Fechar", previous: "Anterior", next: "Próximo", navigateHint: "← → para navegar · ", closeHint: "ESC para fechar", year: "Ano", role: "Papel", status: "Status", visitSite: "Abrir site", viewCode: "Ver código", features: "Inclui", infoShow: "Ver info", infoClose: "Fechar", slide: "Slide" },
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
          hintLong: 'digite "kexxy"',
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
