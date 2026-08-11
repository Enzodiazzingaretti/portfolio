import * as THREE from "three";

/**
 * Post-proceso ASCII para el hero.
 *
 * La escena se dibuja a un render target y despues un quad de pantalla
 * completa la reescribe como una grilla de caracteres: cada celda promedia
 * la luminancia de la region que cubre y elige un glifo de un atlas generado
 * en runtime sobre un canvas 2D.
 *
 * El promedio por celda (y no un solo tap en el centro) es lo que evita que
 * las particulas finas del enjambre parpadeen: con un unico muestreo, un
 * punto de 3px dentro de una celda de 10px aparece y desaparece segun donde
 * caiga el centro.
 */

// Rampa de densidad, del vacio al lleno. Catorce niveles: con diez, los
// degrades de la escultura se cortaban en parches planos.
const RAMP = " .,:;~=+*xX#%8@";

const INK = new THREE.Color("#E8E4DC"); // blanco hueso
const ACCENT = new THREE.Color("#FF3B3B"); // acento rojo en las zonas calientes

/**
 * Dibuja la rampa en un canvas horizontal, un glifo por celda cuadrada.
 * @param {number} size - lado en px de cada celda del atlas
 */
function createGlyphAtlas(size = 64) {
  const canvas = document.createElement("canvas");
  canvas.width = size * RAMP.length;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = `700 ${Math.round(size * 0.82)}px "JetBrains Mono", ui-monospace, "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < RAMP.length; i += 1) {
    ctx.fillText(RAMP[i], i * size + size / 2, size / 2 + size * 0.03);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  return { texture, canvas, size };
}

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;

  uniform sampler2D tScene;
  uniform sampler2D tGlyphs;
  uniform vec2 uResolution;
  uniform float uCell;
  uniform float uGlyphs;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uMix;
  uniform float uReveal;
  uniform float uGain;
  uniform float uFloor;
  uniform float uSceneKeep;
  // Bordes de la mascara de legibilidad, en uv. Son uniforms y no constantes
  // porque la composicion cambia por breakpoint: en desktop el titular ocupa
  // una columna a la izquierda, en mobile todo el texto es de ancho completo
  // y apilado, asi que la franja a proteger es otra.
  uniform vec2 uMaskX;
  // x,y = bordes de la rampa. z = piso: cuanto queda del filtro arriba de
  // todo. Con piso 0 la franja superior quedaba vacia y se veia el corte
  // recto justo a la altura de la linea de disponibilidad. La legibilidad de
  // esa zona ya la resuelven el velo de la barra y la sombra del texto, asi
  // que el shader solo tiene que atenuar, no apagar.
  uniform vec3 uMaskTop;

  varying vec2 vUv;

  float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  // El render target guarda lineal y el canvas espera sRGB. Sin esta
  // conversion el hero sale casi negro: la escena ya es oscura de por si
  // y escribir lineal crudo la hunde otro tanto.
  vec3 linearToSRGB(vec3 c) {
    c = max(c, vec3(0.0));
    return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
  }

  void main() {
    vec2 px = vUv * uResolution;
    vec2 cell = floor(px / uCell);
    vec2 cellCenter = (cell + 0.5) * uCell;

    // Promedio de la celda con cinco taps en cruz. Los taps se abren mas
    // que la celda a proposito: asi cada particula del enjambre mancha las
    // celdas vecinas y el campo lee continuo en vez de como puntos sueltos.
    vec2 s = uCell * 0.85 / uResolution;
    vec2 uvC = cellCenter / uResolution;
    vec3 acc = texture2D(tScene, uvC).rgb * 2.0;
    acc += texture2D(tScene, uvC + vec2( s.x,  s.y)).rgb;
    acc += texture2D(tScene, uvC + vec2(-s.x,  s.y)).rgb;
    acc += texture2D(tScene, uvC + vec2( s.x, -s.y)).rgb;
    acc += texture2D(tScene, uvC + vec2(-s.x, -s.y)).rgb;
    acc += texture2D(tScene, uvC + vec2( s.x,   0.0)).rgb;
    acc += texture2D(tScene, uvC + vec2(-s.x,   0.0)).rgb;
    acc += texture2D(tScene, uvC + vec2( 0.0,  s.y)).rgb;
    acc += texture2D(tScene, uvC + vec2( 0.0, -s.y)).rgb;
    vec3 src = linearToSRGB(acc / 10.0);

    // La escena que queda debajo se muestrea a resolucion plena, no con el
    // promedio de la celda: reusando el promedio, el fondo queda cuantizado
    // a bloques del tamano de celda y el orbe pierde la forma, que es
    // justamente lo que uSceneKeep venia a salvar.
    vec3 srcFull = linearToSRGB(texture2D(tScene, vUv).rgb);

    float lum = luma(src);

    // Niveles, no umbral. uFloor es el punto de negro en unidades de
    // luminancia y uGain el de blanco; el recorte va ANTES de la curva.
    // Aplicandolo despues, el interior de la escultura —que ocupa un rango
    // estrecho, 0.25 a 0.62— caia entero en los ultimos cuatro glifos de la
    // rampa: leia como una mancha llena y no como una forma. Estirar ese
    // rango sobre la rampa completa es lo que hace que el filtro dibuje el
    // volumen en vez de taparlo.
    float lifted = max(lum - uFloor, 0.0) / max(1.0 - uFloor, 0.001);
    float shaped = pow(clamp(lifted * uGain, 0.0, 1.0), 0.62);

    // Mascara de legibilidad: el ASCII se apaga sobre la columna del titular
    // y sobre la franja de la barra. Sin esto el campo compite con el texto.
    // La franja de la barra se apaga entera (no atenuada): con la barra sin
    // fondo en el home, media docena de caracteres encima ya vuelven
    // ilegible "SOBRE MI / CONTACTO / ES EN PT".
    // La mascara atenua la TINTA, no el indice de glifo. Multiplicando la
    // densidad, el borde de la mascara caia escalon por escalon de la rampa
    // y se veia como una pared recta al costado del titular; atenuando el
    // color, los caracteres se apagan sin cambiar de forma y el borde
    // desaparece.
    float maskX = smoothstep(uMaskX.x, uMaskX.y, vUv.x);
    float maskTop = mix(uMaskTop.z, 1.0, smoothstep(uMaskTop.x, uMaskTop.y, vUv.y));
    float maskBottom = smoothstep(0.0, 0.07, vUv.y);
    float legible = maskX * maskTop * maskBottom;

    float gi = floor(shaped * (uGlyphs - 0.001));
    vec2 inCell = fract(px / uCell);
    // Inset lateral: sin esto el filtrado lineal muerde el glifo vecino
    float gx = (gi + clamp(inCell.x, 0.03, 0.97)) / uGlyphs;
    float glyph = texture2D(tGlyphs, vec2(gx, clamp(inCell.y, 0.02, 0.98))).r;

    // Blanco hueso de base; solo lo mas intenso vira al rojo
    float heat = smoothstep(0.80, 0.99, shaped);
    vec3 tint = mix(uInk, uAccent, heat);

    vec3 ascii = tint * glyph * (0.50 + shaped * 1.30) * legible;

    // La escena se conserva atenuada debajo y los caracteres se suman
    // encima. Reemplazarla del todo mataba el movimiento: quedaba solo la
    // grilla saltando de celda en celda.
    vec3 base = srcFull * uSceneKeep;
    vec3 outColor = (base + ascii * uMix) * uReveal;
    gl_FragColor = vec4(outColor, 1.0);
  }
`;

/**
 * @param {THREE.WebGLRenderer} renderer
 * @param {number} cell - lado de la celda de caracteres en px de dispositivo
 */
export function createAsciiPass(renderer, cell = 8) {
  let cssCell = cell;
  const atlas = createGlyphAtlas();

  const target = new THREE.WebGLRenderTarget(2, 2, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    depthBuffer: true,
    stencilBuffer: false,
  });

  const material = new THREE.ShaderMaterial({
    uniforms: {
      tScene: { value: target.texture },
      tGlyphs: { value: atlas.texture },
      uResolution: { value: new THREE.Vector2(2, 2) },
      uCell: { value: cell },
      uGlyphs: { value: RAMP.length },
      uInk: { value: INK.clone() },
      uAccent: { value: ACCENT.clone() },
      uMix: { value: 1 },
      uReveal: { value: 1 },
      uGain: { value: 3.2 },
      uFloor: { value: 0.25 },
      uSceneKeep: { value: 0.42 },
      uMaskX: { value: new THREE.Vector2(0.16, 0.56) },
      uMaskTop: { value: new THREE.Vector3(0.99, 0.86, 0.5) },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    depthTest: false,
    depthWrite: false,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;

  const scene = new THREE.Scene();
  scene.add(quad);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // La fuente puede no estar lista cuando se arma el atlas; al resolver,
  // se redibuja una sola vez y se sube de nuevo la textura.
  if (typeof document !== "undefined" && document.fonts?.ready) {
    document.fonts.ready
      .then(() => {
        const ctx = atlas.canvas.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, atlas.canvas.width, atlas.canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = `700 ${Math.round(atlas.size * 0.82)}px "JetBrains Mono", ui-monospace, "Courier New", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < RAMP.length; i += 1) {
          ctx.fillText(RAMP[i], i * atlas.size + atlas.size / 2, atlas.size / 2 + atlas.size * 0.03);
        }
        atlas.texture.needsUpdate = true;
      })
      .catch(() => {});
  }

  return {
    target,

    setSize(width, height) {
      const dpr = renderer.getPixelRatio();
      target.setSize(Math.max(2, Math.round(width * dpr)), Math.max(2, Math.round(height * dpr)));
      material.uniforms.uResolution.value.set(target.width, target.height);
      // uCell vive en px de dispositivo; cssCell es lo que se ve en pantalla
      material.uniforms.uCell.value = cssCell * dpr;
    },

    setCell(value) {
      cssCell = value;
      material.uniforms.uCell.value = value * renderer.getPixelRatio();
    },

    setGain(value) {
      material.uniforms.uGain.value = value;
    },

    /** Punto de negro en luminancia: mas alto = menos caracteres en las sombras */
    setFloor(value) {
      material.uniforms.uFloor.value = value;
    },

    /**
     * Bordes de la mascara de legibilidad, en uv.
     * @param {[number, number]} x - rampa horizontal: apagado en x[0], pleno en x[1]
     * @param {[number, number, number]} top - rampa vertical: [borde alto, borde
     *   bajo, piso]. El piso es lo que queda del filtro arriba de todo; en 0
     *   deja una franja vacia y se ve el corte.
     */
    setMask(x, top) {
      material.uniforms.uMaskX.value.set(x[0], x[1]);
      material.uniforms.uMaskTop.value.set(top[0], top[1], top[2]);
    },

    /** Cuanto de la escena original queda debajo de los caracteres */
    setSceneKeep(value) {
      material.uniforms.uSceneKeep.value = value;
    },

    /** 0 = escena limpia, 1 = ASCII total */
    setMix(value) {
      material.uniforms.uMix.value = value;
    },

    setReveal(value) {
      material.uniforms.uReveal.value = value;
    },

    render() {
      const prevTarget = renderer.getRenderTarget();
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
      renderer.setRenderTarget(prevTarget);
    },

    dispose() {
      target.dispose();
      atlas.texture.dispose();
      quad.geometry.dispose();
      material.dispose();
    },
  };
}
