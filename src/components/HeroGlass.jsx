import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RAMP, createGlyphAtlas } from "./AsciiPass";
import { ASCII_FLOOR, ASCII_GAIN, ASCII_LEVELS_COMPACT, createSceneObject, disposeObject } from "../fx/asciiScenes";
import { createLegibilityMask } from "../fx/legibilidad";

/**
 * El fondo de todo el sitio, en un solo contexto WebGL montado en el Shell.
 *
 * Tres capas, de atrás hacia adelante:
 * 1. Atmósfera grafito (la misma del CSS: luces, viñeta, retícula y grano).
 * 2. Las animaciones con filtro ASCII (escultura, enjambre y hebras, que se
 *    turnan cada 14 s). Ocupan todo el fondo, en todas las rutas; donde hay
 *    texto, botones o tarjetas bajan la tinta (máscara de legibilidad), así
 *    se ven en los huecos sin tapar lo que hay que leer.
 * 3. En el home, el nombre y la escultura de vidrio, que refracta todo lo de
 *    atrás: las letras y los caracteres. El nombre que se ve a través del
 *    vidrio no es una imagen aparte: se dibuja en una textura con las
 *    posiciones exactas del <h1> del DOM, que sigue siendo texto para
 *    lectores de pantalla y buscadores (se vuelve transparente recién cuando
 *    la textura está lista, con la clase `glass-type` en <html>).
 *
 * El ASCII se calcula en dos pasos: la escena 3D se dibuja a media
 * resolución, un pase chico promedia cada celda (una textura de una celda por
 * píxel) y el fondo solo lee esa celda y el glifo. El pase viejo hacía diez
 * muestras por píxel a resolución completa (CLAUDE.md, 3.6).
 *
 * Fuera del hero el fondo va a 30 cuadros; con la pestaña oculta o un panel
 * abierto no dibuja. Con movimiento reducido dibuja un cuadro quieto. Si
 * WebGL falla, queda la atmósfera del CSS y el <h1> del DOM.
 *
 * El lugar y el tamaño de la escultura de vidrio los decide el CSS: un ancla
 * vacía en el hero (`[data-glass-anchor]`) que la escena lee y convierte a
 * coordenadas del mundo.
 */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const QUAD_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const SRGB = /* glsl */ `
vec3 toSRGB(vec3 c){
  c = max(c, vec3(0.0));
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
`;

/**
 * Promedio por celda. Se dibuja en una textura de una celda por píxel: cada
 * píxel promedia, con diez muestras en cruz, la región de la escena que cubre
 * su celda, y la pasa por los niveles de la escena (punto de negro, punto de
 * blanco y curva). Los taps se abren un poco más que la celda: así cada
 * partícula del enjambre mancha las vecinas y el campo lee continuo.
 */
const CELL_FRAG = /* glsl */ `
uniform sampler2D tScene;
uniform vec2 uCells;
uniform vec2 uCellUv;
uniform float uGain;
uniform float uFloor;
varying vec2 vUv;
${SRGB}
void main(){
  vec2 cell = floor(vUv * uCells);
  vec2 c = (cell + 0.5) * uCellUv;
  vec2 s = uCellUv * 0.85;
  vec3 acc = texture2D(tScene, c).rgb * 2.0;
  acc += texture2D(tScene, c + vec2( s.x,  s.y)).rgb;
  acc += texture2D(tScene, c + vec2(-s.x,  s.y)).rgb;
  acc += texture2D(tScene, c + vec2( s.x, -s.y)).rgb;
  acc += texture2D(tScene, c + vec2(-s.x, -s.y)).rgb;
  acc += texture2D(tScene, c + vec2( s.x,  0.0)).rgb;
  acc += texture2D(tScene, c + vec2(-s.x,  0.0)).rgb;
  acc += texture2D(tScene, c + vec2( 0.0,  s.y)).rgb;
  acc += texture2D(tScene, c + vec2( 0.0, -s.y)).rgb;
  float lum = dot(toSRGB(acc / 10.0), vec3(0.2126, 0.7152, 0.0722));
  // Niveles antes de la curva (ver CLAUDE.md, 3.2)
  float lifted = max(lum - uFloor, 0.0) / max(1.0 - uFloor, 0.001);
  gl_FragColor = vec4(pow(clamp(lifted * uGain, 0.0, 1.0), 0.62), 0.0, 0.0, 1.0);
}
`;

/** El fondo: atmósfera, caracteres, retícula, nombre y grano. */
const BG_FRAG = /* glsl */ `
uniform float uTime;
uniform float uAspect;
uniform vec2 uGlow;
uniform float uGlowK;
uniform float uCore;
uniform float uCoreR;
uniform vec3 uCoreCol;
uniform vec4 uGrid;
uniform sampler2D tCells;
uniform sampler2D tScene;
uniform sampler2D tGlyphs;
uniform vec2 uCells;
uniform vec2 uRes;
uniform float uCellPx;
uniform float uGlyphs;
uniform vec3 uInkCol;
uniform vec3 uAccent;
uniform float uInk;
uniform float uKeep;
uniform sampler2D tLegible;
uniform vec3 uPage;
uniform float uProtect;
uniform float uBar;
uniform sampler2D uType;
uniform float uTypeOn;
uniform float uScroll;
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uGlowCol;
uniform vec3 uSmokeCol;
uniform float uClaro;
varying vec2 vUv;
${SRGB}
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 p = vUv; p.x *= uAspect;
  vec3 base = uBase;                                 // --bg-ch (grafito)
  vec3 deep = uDeep;                                 // --deep-ch, en los bordes
  float vig = smoothstep(0.25, 1.15, length((vUv - 0.5) * vec2(1.15, 1.0)));
  vec3 col = mix(base, deep, vig);
  // Luz roja cálida donde está la pieza y humo frío abajo a la izquierda
  vec2 g = uGlow; g.x *= uAspect;
  float red = exp(-pow(length(p - g) * 1.55, 2.0));
  // En una paleta clara (fondo hueso) las luces y los caracteres no se
  // suman: se mezclan, como tinta sobre papel
  if (uClaro > 0.5) col = mix(col, uGlowCol, red * uGlowK * 0.55);
  else col += uGlowCol * red * uGlowK;
  vec2 sm = vec2(0.08 * uAspect, 0.06);
  float smoke = exp(-pow(length(p - sm) * 1.25, 2.0));
  if (uClaro > 0.5) col = mix(col, uSmokeCol, smoke * 0.10);
  else col += uSmokeCol * smoke * 0.10;
  // Contraluz chico detrás del vidrio (solo en el hero)
  float core = exp(-pow(length(p - g) / max(uCoreR, 0.001), 2.0));
  col += uCoreCol * core * uCore;

  // Máscara de legibilidad, en coordenadas de página: corre con el scroll
  float pageY = uPage.x + (1.0 - vUv.y) * uPage.z;
  float legible = texture2D(tLegible, vec2(vUv.x, 1.0 - pageY / max(uPage.y, 1.0))).r;
  // La barra es fija: su franja se protege en coordenadas de pantalla
  float yTop = (1.0 - vUv.y) * uPage.z;
  legible = max(legible, 1.0 - smoothstep(uBar, uBar + 28.0, yTop));
  float ink = uInk * (1.0 - uProtect * legible);

  // Caracteres: la celda ya viene promediada; acá solo se elige el glifo.
  // La escena queda atenuada debajo, si no el campo pierde el volumen.
  vec2 px = vUv * uRes;
  vec2 cell = floor(px / uCellPx);
  float shaped = texture2D(tCells, (cell + 0.5) / uCells).r;
  vec2 inCell = fract(px / uCellPx);
  float gi = floor(shaped * (uGlyphs - 0.001));
  float gx = (gi + clamp(inCell.x, 0.03, 0.97)) / uGlyphs;
  float glyph = texture2D(tGlyphs, vec2(gx, clamp(inCell.y, 0.02, 0.98))).r;
  vec3 tint = mix(uInkCol, uAccent, smoothstep(0.80, 0.99, shaped));
  if (uClaro > 0.5) {
    col = mix(col, tint, clamp(glyph * (0.40 + shaped * 1.05) * ink * 0.8, 0.0, 1.0));
  } else {
    col += toSRGB(texture2D(tScene, vUv).rgb) * uKeep * ink;
    col += tint * glyph * (0.40 + shaped * 1.05) * ink;
  }

  // La retícula de 12 columnas de la atmósfera del CSS
  float gx2 = (vUv.x - uGrid.x) / max(uGrid.y, 0.0001) * 12.0;
  if (gx2 > -0.02 && gx2 < 11.98) {
    float dpx = abs(fract(gx2 + 0.5) - 0.5) * uGrid.y / 12.0 * uGrid.z;
    float fade = smoothstep(0.0, 0.14, vUv.y) * smoothstep(0.0, 0.14, 1.0 - vUv.y);
    col = mix(col, uInkCol, (1.0 - smoothstep(0.5, 1.5, dpx)) * fade * uGrid.w);
  }

  // El nombre (solo en el home), en coordenadas de página: sube con el scroll
  if (uTypeOn > 0.5) {
    vec2 tuv = vec2(vUv.x, vUv.y - uScroll);
    if (tuv.y >= 0.0 && tuv.y <= 1.0) {
      vec4 t = texture2D(uType, tuv);
      col = mix(col, t.rgb, t.a);
    }
  }
  // Grano fino, el mismo del resto del sitio
  col += (hash(vUv * 900.0 + fract(uTime) * 37.0) - 0.5) * 0.028;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Copia del fondo a la pantalla, cuando el vidrio va encima. */
const COPY_FRAG = /* glsl */ `
uniform sampler2D uBg;
varying vec2 vUv;
void main(){ gl_FragColor = texture2D(uBg, vUv); }
`;

/**
 * Los colores salen de los canales de vidrio.css (`--red-ch`, `--paper-ch`…),
 * así el lienzo sigue a la paleta activa (paletas.css). Devuelve [r, g, b] en
 * 0–1, o el respaldo si la variable no está.
 */
function canal(nombre, respaldo) {
  if (typeof document === "undefined") return respaldo;
  const v = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  const n = v.split(/[\s,]+/).map(Number).filter((x) => !Number.isNaN(x));
  return n.length === 3 ? n.map((x) => x / 255) : respaldo;
}
const css = (rgb) => `rgb(${rgb.map((x) => Math.round(x * 255)).join(",")})`;
const RED = () => css(canal("--red-ch", [0.898, 0.141, 0.212]));
const PAPER = () => css(canal("--paper-ch", [0.898, 0.89, 0.878]));

// Celdas de caracteres en px CSS: más grandes en celular, menos pero legibles
const CELDA = { desktop: 11, compact: 9 };
// La escena del ASCII se dibuja a px CSS (dpr 1), que es donde se midieron
// sus niveles. Lo caro era el pase de diez muestras por píxel, no esto.
const ESCENA = 1;
// Turnos de las escenas: cada una dura CICLO s; entra y sale por negro
const ESCENAS = ["sculpture", "particles", "organic"];
const CICLO = 14;
const ENTRA = 1.4;
const SALE = 0.9;

function esCompacto() {
  return window.matchMedia("(max-width: 767px)").matches;
}

/** Celular y tablet: pantalla táctil, sin mouse fino. */
function esTactil() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const lerp = (a, b, k) => a + (b - a) * k;

/**
 * Ambiente propio para los reflejos: caja oscura con un softbox, una franja
 * roja y humo. Se fotografía una sola vez con una CubeCamera.
 */
function crearAmbiente(renderer, size) {
  const scene = new THREE.Scene();
  scene.add(
    new THREE.Mesh(new THREE.BoxGeometry(12, 12, 12), new THREE.MeshBasicMaterial({ color: 0x0b0c0f, side: THREE.BackSide })),
  );
  const panel = (w, h, color, intensity, pos) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }),
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  panel(5, 2.4, 0xffffff, 6, [-3.4, 4.2, 2.6]); // softbox arriba a la izquierda
  panel(1.1, 7, RED(), 6, [5.2, 0.2, -0.8]); // franja del acento a la derecha
  panel(0.6, 4, RED(), 3, [-5.4, -1.2, -2.2]); // eco del acento atrás
  panel(7, 1, 0x8a8b92, 1.4, [0, -5.2, 1.6]); // humo abajo
  panel(2.2, 2.2, 0xffffff, 2.4, [2.8, 2.4, 5]); // rebote frontal
  const target = new THREE.WebGLCubeRenderTarget(size, { type: THREE.HalfFloatType });
  const cam = new THREE.CubeCamera(0.1, 50, target);
  cam.update(renderer, scene);
  scene.traverse((o) => {
    o.geometry?.dispose?.();
    o.material?.dispose?.();
  });
  return target;
}

/** La escultura: deformación en el vértice, refracción y reflejo en el fragmento. */
const ORB_VERT = /* glsl */ `
uniform float uTime; uniform float uAmp; uniform float uFreq; uniform float uFine;
varying vec3 vPosW; varying vec3 vNormalW; varying vec4 vClip;
${NOISE}
vec3 deformar(vec3 p){
  float t = uTime;
  float n = snoise(p * uFreq + vec3(t * 0.16, t * 0.11, -t * 0.09));
  float n2 = snoise(p * uFreq * 2.3 + vec3(-t * 0.21, t * 0.17, t * 0.13)) * uFine;
  float twist = sin(p.y * 2.2 + t * 0.6) * 0.18;
  return p + normalize(p) * (n + n2 + twist) * uAmp;
}
void main(){
  vec3 nrm0 = normalize(normal);
  vec3 tng0 = normalize(cross(nrm0, abs(nrm0.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 btg0 = normalize(cross(nrm0, tng0));
  vec3 dp0 = deformar(position);
  vec3 dp1 = deformar(position + tng0 * 0.012);
  vec3 dp2 = deformar(position + btg0 * 0.012);
  vec3 n = normalize(cross(dp1 - dp0, dp2 - dp0));
  if (dot(n, nrm0) < 0.0) n = -n;
  vec4 wp = modelMatrix * vec4(dp0, 1.0);
  vPosW = wp.xyz;
  vNormalW = normalize(mat3(modelMatrix) * n);
  vClip = projectionMatrix * viewMatrix * wp;
  gl_Position = vClip;
}
`;

const ORB_FRAG = /* glsl */ `
uniform sampler2D uBg; uniform samplerCube uEnv; uniform float uRefr; uniform float uTime;
uniform vec2 uCenter; uniform float uMag; uniform vec2 uRadius; uniform float uRim;
varying vec3 vPosW; varying vec3 vNormalW; varying vec4 vClip;
void main(){
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);
  float NdV = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - NdV, 2.6);
  vec2 suv = (vClip.xy / vClip.w) * 0.5 + 0.5;
  // Refracción: el fondo (nombre y atmósfera) se dobla según la normal en
  // pantalla, más fuerte hacia el borde; cada canal se corre un poco (dispersión)
  vec3 nV = normalize((viewMatrix * vec4(N, 0.0)).xyz);
  vec2 off = -nV.xy * uRefr * (0.25 + 0.75 * (1.0 - NdV));
  // Lente de gota: lo de atrás se ve más grande en el centro y llega intacto
  // al canto, así el final del nombre que queda debajo del borde se sigue
  // leyendo, curvado, en vez de desaparecer dentro del vidrio.
  vec2 d = (suv - uCenter) / uRadius;
  float r2 = min(dot(d, d), 1.4);
  suv = uCenter + (suv - uCenter) * (1.0 - uMag * (1.0 - r2));
  vec3 refr;
  refr.r = texture2D(uBg, suv + off * 1.00).r;
  refr.g = texture2D(uBg, suv + off * 1.07).g;
  refr.b = texture2D(uBg, suv + off * 1.15).b;
  refr *= vec3(0.96, 0.95, 0.97);
  // Borde ahumado: donde el vidrio se pone de canto, la refracción se apaga
  refr *= 1.0 - 0.5 * smoothstep(0.3, 0.95, fres);
  // Reflejo del ambiente (HDR → tono suave → sRGB)
  vec3 R = reflect(-V, N);
  vec3 env = textureCube(uEnv, R).rgb;
  env = env / (1.0 + env);
  env = pow(env, vec3(1.0 / 2.2));
  vec3 col = mix(refr, env, clamp(0.08 + fres * 0.78, 0.0, 1.0));
  // Película fina: iridiscencia en los cantos
  vec3 irid = 0.5 + 0.5 * cos(6.28318 * (fres * 1.6 + uTime * 0.025 + vec3(0.0, 0.33, 0.67)));
  col += irid * fres * 0.16;
  // Destellos: lo más brillante del ambiente pasa entero
  col += max(env - 0.72, 0.0) * 1.6;
  // Filo de luz: una línea fina sobre el contorno
  col += vec3(1.0, 0.96, 0.94) * pow(1.0 - NdV, 7.0) * uRim;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Dibuja los renglones del <h1> en un canvas 2D, en las mismas posiciones que el DOM. */
function dibujarNombre(ctx, w, h, dpr) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const lines = document.querySelectorAll("[data-glass-type]");
  if (!lines.length) return false;
  const sy = window.scrollY;
  lines.forEach((el) => {
    const probe = el.querySelector("[data-glass-baseline]");
    if (!probe) return;
    const rect = el.getBoundingClientRect();
    const base = probe.getBoundingClientRect().top + sy;
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    let text = el.textContent ?? "";
    if (cs.textTransform === "uppercase") text = text.toUpperCase();
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
    ctx.textBaseline = "alphabetic";
    // Tinta plana, como el <h1> del DOM: sin el brillo metálico (2026-11-05)
    ctx.fillStyle = el.dataset.glassType === "red" ? RED() : PAPER();
    ctx.fillText(text, rect.left, base);
    ctx.restore();
  });
  // textura en coordenadas de la página: el borde de arriba es scroll 0
  void w;
  void h;
  return true;
}

export default function HeroGlass({ home = true, revealActive = true, reduced = false }) {
  const mount = useRef(null);
  const estado = useRef({ home, revealActive, reduced });
  estado.current = { home, revealActive, reduced };
  const api = useRef(null);

  // Al entrar o salir del home el nombre aparece o se borra, la escultura se
  // vuelve a anclar y la máscara de legibilidad se rehace.
  useEffect(() => {
    api.current?.alCambiarRuta();
  }, [home]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return undefined;

    const compact = esCompacto();
    // En el teléfono el lienzo es lo más caro de cada cuadro: sin MSAA y a
    // 1,25 px por px CSS (el fondo son glifos de 9 px y el vidrio es liso; a
    // 1,5 se pintaban 1,4 veces más píxeles sin diferencia a la vista).
    const liviano = compact || esTactil();
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !liviano, alpha: false, powerPreference: "high-performance" });
    } catch {
      return undefined; // sin WebGL: queda la atmósfera del CSS y el <h1> del DOM
    }

    // Sin placa de video (el navegador dibuja por software: SwiftShader,
    // llvmpipe…) cada cuadro tarda cientos de ms y traba la página entera:
    // ahí el fondo queda en un cuadro quieto, como con movimiento reducido.
    // Les pasa a notebooks con la GPU bloqueada y a las máquinas de
    // Lighthouse/PageSpeed (2026-11-08: rendimiento 33 en celular por esto).
    const porSoftware = (() => {
      try {
        const gl = renderer.getContext();
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const nombre = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
        return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(nombre);
      } catch {
        return false;
      }
    })();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, liviano ? 1.25 : 1.5));
    // Los shaders son propios y ya entregan color sRGB: nada de tone mapping
    // ni conversión de espacio de color de three.
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x000000, 1);
    const canvas = renderer.domElement;
    Object.assign(canvas.style, { width: "100%", height: "100%", display: "block" });
    host.appendChild(canvas);
    host.style.opacity = "0";

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    const FONDO_Z = -5;
    const quad = new THREE.PlaneGeometry(1, 1);
    const DEG = Math.PI / 180;

    // ── El nombre: una textura con los renglones del <h1>
    const typeCanvas = document.createElement("canvas");
    const typeCtx = typeCanvas.getContext("2d");
    const typeTex = new THREE.CanvasTexture(typeCanvas);
    // Sin decodificar: los shaders trabajan con los valores sRGB tal cual
    typeTex.colorSpace = THREE.NoColorSpace;
    typeTex.minFilter = THREE.LinearFilter;
    typeTex.generateMipmaps = false;

    // ── ASCII: escena 3D (media resolución) → celdas → glifos
    const sceneTarget = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: true });
    const cellTarget = new THREE.WebGLRenderTarget(2, 2, {
      depthBuffer: false,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    });
    const atlas = createGlyphAtlas();
    // La fuente puede no estar lista al armar el atlas: se redibuja cuando
    // termina de cargar. `fonts.ready` solo no alcanza: la hoja de Google
    // Fonts entra asíncrona y puede resolverse antes de registrar la fuente.
    const redibujarAtlas = () => {
      const ctx = atlas.canvas.getContext("2d");
      if (!ctx) return;
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
    };
    document.fonts?.ready?.then(redibujarAtlas);
    document.fonts?.addEventListener?.("loadingdone", redibujarAtlas);

    const cellUniforms = {
      tScene: { value: sceneTarget.texture },
      uCells: { value: new THREE.Vector2(1, 1) },
      uCellUv: { value: new THREE.Vector2(1, 1) },
      uGain: { value: ASCII_GAIN.sculpture },
      uFloor: { value: ASCII_FLOOR.sculpture },
    };
    const cellCam = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
    cellCam.position.z = 0.5;
    const cellScene = new THREE.Scene();
    cellScene.add(
      new THREE.Mesh(
        quad,
        new THREE.ShaderMaterial({
          uniforms: cellUniforms,
          vertexShader: QUAD_VERT,
          fragmentShader: CELL_FRAG,
          depthTest: false,
          depthWrite: false,
        }),
      ),
    );

    // Las tres escenas en una sola escena 3D; se ve una por vez
    const a3 = new THREE.Scene();
    a3.fog = new THREE.FogExp2(0x050505, 0.12);
    const a3cam = new THREE.PerspectiveCamera(45, 1, 0.1, 42);
    a3cam.position.set(0, 0.18, 4.4);
    const piezas = ESCENAS.map((kind) => {
      const pieza = createSceneObject(kind, compact);
      pieza.kind = kind;
      pieza.object.visible = false;
      // El enjambre mide sus puntos en px del render target, que va a px CSS
      const pr = pieza.object.material?.uniforms?.uPixelRatio;
      if (pr) pr.value = ESCENA;
      a3.add(pieza.object);
      return pieza;
    });

    // ── Máscara de legibilidad (coordenadas de página)
    const mascara = createLegibilityMask();

    // ── El fondo
    const bgUniforms = {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uGlow: { value: new THREE.Vector2(0.66, 0.6) },
      uGlowK: { value: 0.2 },
      uCore: { value: 0 },
      uCoreR: { value: 0.12 },
      uCoreCol: { value: new THREE.Vector3(0.84, 0.68, 0.7) },
      uGrid: { value: new THREE.Vector4(0, 1, 1, 0) },
      tCells: { value: cellTarget.texture },
      tScene: { value: sceneTarget.texture },
      tGlyphs: { value: atlas.texture },
      uCells: { value: new THREE.Vector2(1, 1) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uCellPx: { value: 11 },
      uGlyphs: { value: RAMP.length },
      uInkCol: { value: new THREE.Color("#E8E4DC") },
      uAccent: { value: new THREE.Color("#FF3B3B") },
      uInk: { value: 0 },
      uKeep: { value: 0.36 },
      tLegible: { value: mascara.texture },
      uPage: { value: new THREE.Vector3(0, 1, 1) },
      uProtect: { value: 0.86 },
      uBar: { value: 0 },
      uType: { value: typeTex },
      uTypeOn: { value: 0 },
      uScroll: { value: 0 },
      uBase: { value: new THREE.Vector3() },
      uDeep: { value: new THREE.Vector3() },
      uGlowCol: { value: new THREE.Vector3() },
      uSmokeCol: { value: new THREE.Vector3() },
      uClaro: { value: 0 },
    };
    // La paleta: se lee al montar y cada vez que cambia `data-paleta`
    const aplicarPaleta = () => {
      bgUniforms.uBase.value.fromArray(canal("--bg-ch", [0.09, 0.098, 0.114]));
      bgUniforms.uDeep.value.fromArray(canal("--deep-ch", [0.055, 0.059, 0.071]));
      bgUniforms.uGlowCol.value.fromArray(canal("--red-ch", [0.898, 0.141, 0.212]));
      bgUniforms.uSmokeCol.value.fromArray(canal("--smoke-ch", [0.52, 0.52, 0.55]).map((x) => x * 0.98));
      // Como el `new THREE.Color("#…")` de antes: del sRGB al espacio de trabajo
      bgUniforms.uInkCol.value.setRGB(...canal("--paper-ch", [0.91, 0.894, 0.863]), THREE.SRGBColorSpace);
      bgUniforms.uAccent.value.setRGB(...canal("--red-hi-ch", [1, 0.23, 0.23]), THREE.SRGBColorSpace);
      bgUniforms.uClaro.value = getComputedStyle(document.documentElement).getPropertyValue("--claro").trim() === "1" ? 1 : 0;
    };
    aplicarPaleta();
    const bg = new THREE.Mesh(
      quad,
      new THREE.ShaderMaterial({ uniforms: bgUniforms, vertexShader: QUAD_VERT, fragmentShader: BG_FRAG, depthWrite: false }),
    );
    bg.position.z = FONDO_Z;
    const bgScene = new THREE.Scene();
    bgScene.add(bg);
    // Con el vidrio a la vista, el fondo va primero a una textura: es lo que
    // el vidrio refracta. Sin MSAA ni mipmaps, así se ve igual en cualquier GPU.
    const bgTarget = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: false });
    const scene = new THREE.Scene();
    const copia = new THREE.Mesh(
      quad,
      new THREE.ShaderMaterial({
        uniforms: { uBg: { value: bgTarget.texture } },
        vertexShader: QUAD_VERT,
        fragmentShader: COPY_FRAG,
        depthWrite: false,
      }),
    );
    copia.position.z = FONDO_Z;
    scene.add(copia);

    // ── La escultura de vidrio
    let envTarget = crearAmbiente(renderer, compact ? 128 : 256);
    const geo = new THREE.IcosahedronGeometry(1, liviano ? 30 : 72);
    const glassUniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.0 },
      uFreq: { value: 1.05 },
      uFine: { value: 0.1 },
      uRim: { value: 0.7 },
      uBg: { value: bgTarget.texture },
      uEnv: { value: envTarget.texture },
      uRefr: { value: 0.035 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: new THREE.Vector2(0.2, 0.3) },
      uMag: { value: 0.22 },
    };
    const mat = new THREE.ShaderMaterial({ uniforms: glassUniforms, vertexShader: ORB_VERT, fragmentShader: ORB_FRAG });
    const orb = new THREE.Mesh(geo, mat);
    scene.add(orb);

    // Estado de animación
    const anim = {
      porSoftware,
      w: 1,
      h: 1,
      halfH: 1,
      halfW: 1,
      target: new THREE.Vector3(),
      radius: 1,
      anclaOk: false,
      pointer: new THREE.Vector2(),
      pointerS: new THREE.Vector2(),
      mouse: { x: 0, y: 0, tx: 0, ty: 0 },
      pointerAmp: 0,
      pointerAmpTarget: 0,
      speed: 0,
      reveal: 0,
      scroll: 0,
      typeReady: false,
      raf: 0,
      last: performance.now(),
      t: 0,
      dibujado: false,
      ciclo: { i: 0, t: 0, fase: "entra", k: 0 },
    };

    const medirAncla = () => {
      const a = estado.current.home ? document.querySelector("[data-glass-anchor]") : null;
      anim.anclaOk = Boolean(a);
      if (!a) return false;
      const r = a.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2 + window.scrollY; // en coordenadas de página
      anim.target.set((cx / anim.w) * 2 - 1, -((cy / anim.h) * 2 - 1), 0);
      anim.radius = (r.width / 2 / anim.w) * 2 * anim.halfW;
      const grid = document.querySelector(".atmo-grid")?.getBoundingClientRect();
      if (grid?.width) bgUniforms.uGrid.value.set(grid.left / anim.w, grid.width / anim.w, anim.w, 0.04);
      return true;
    };

    const redibujarNombre = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.round(anim.w * dpr);
      const H = Math.round(anim.h * dpr);
      if (typeCanvas.width !== W || typeCanvas.height !== H) {
        typeCanvas.width = W;
        typeCanvas.height = H;
        typeTex.dispose(); // otro tamaño: textura nueva en la GPU
      }
      const ok = estado.current.home ? dibujarNombre(typeCtx, anim.w, anim.h, dpr) : false;
      if (!ok) typeCtx.clearRect(0, 0, typeCanvas.width, typeCanvas.height);
      typeTex.needsUpdate = true;
      anim.typeReady = ok;
      document.documentElement.classList.toggle("glass-type", ok);
    };

    // Medir la máscara recorre todo el contenido: se hace con la página
    // quieta y en un hueco del hilo principal, no en medio del scroll (en el
    // teléfono las imágenes que cargan al bajar la disparaban seguido).
    let tMascara = 0;
    const programarMascara = () => {
      window.clearTimeout(tMascara);
      tMascara = window.setTimeout(() => {
        if (performance.now() - (anim.ultimoScroll || 0) < 300) {
          programarMascara();
          return;
        }
        const medir = () => {
          mascara.update();
          despertar();
        };
        if ("requestIdleCallback" in window) window.requestIdleCallback(medir, { timeout: 600 });
        else medir();
      }, 250);
    };

    // El lienzo mide lo que mide su caja (100lvh: el alto con la barra del
    // navegador escondida). En el celular esa barra aparece y desaparece al
    // scrollear y dispara `resize` sin parar: reasignar el lienzo y los render
    // targets en medio del scroll trababa todo. Si la caja no cambió, nada.
    const medirCaja = () => [host.clientWidth || window.innerWidth, host.clientHeight || window.innerHeight];
    const alRedimensionar = () => {
      const [w, h] = medirCaja();
      if (w !== anim.w || h !== anim.h) resize();
    };

    const resize = () => {
      const [w, h] = medirCaja();
      // Volver a asignar el tamaño del lienzo, aunque sea el mismo, rehace su
      // buffer: solo si cambió (el `hero-layout` de cada ajuste del nombre
      // pasa por acá con la ventana igual)
      if (w !== anim.w || h !== anim.h || !anim.lienzoListo) {
        anim.lienzoListo = true;
        ajustarLienzo(w, h);
      }
      medirAncla();
      redibujarNombre();
      programarMascara();
    };

    const ajustarLienzo = (w, h) => {
      anim.w = w;
      anim.h = h;
      renderer.setSize(anim.w, anim.h, false);
      camera.aspect = anim.w / anim.h;
      camera.updateProjectionMatrix();
      a3cam.aspect = camera.aspect;
      a3cam.updateProjectionMatrix();
      anim.halfH = Math.tan((camera.fov / 2) * DEG) * camera.position.z;
      anim.halfW = anim.halfH * camera.aspect;
      const bh = 2 * Math.tan((camera.fov / 2) * DEG) * (camera.position.z - FONDO_Z);
      bg.scale.set(bh * camera.aspect, bh, 1);
      copia.scale.copy(bg.scale);
      const pr = renderer.getPixelRatio();
      const W = Math.max(2, Math.round(anim.w * pr));
      const H = Math.max(2, Math.round(anim.h * pr));
      bgTarget.setSize(W, H);
      sceneTarget.setSize(Math.max(2, Math.round(anim.w * ESCENA)), Math.max(2, Math.round(anim.h * ESCENA)));
      const celda = (compact ? CELDA.compact : CELDA.desktop) * pr;
      const cx = Math.ceil(W / celda);
      const cy = Math.ceil(H / celda);
      cellTarget.setSize(cx, cy);
      cellUniforms.uCells.value.set(cx, cy);
      cellUniforms.uCellUv.value.set(celda / W, celda / H);
      bgUniforms.uCells.value.set(cx, cy);
      bgUniforms.uRes.value.set(W, H);
      bgUniforms.uCellPx.value = celda;
      bgUniforms.uAspect.value = camera.aspect;
    };

    const alMedir = () => {
      // dos cuadros: el layout recién montado todavía puede moverse
      requestAnimationFrame(() => requestAnimationFrame(resize));
    };

    const onPointer = (e) => {
      anim.pointer.set((e.clientX / anim.w) * 2 - 1, -((e.clientY / anim.h) * 2 - 1));
      anim.mouse.tx = e.clientX / anim.w - 0.5;
      anim.mouse.ty = -(e.clientY / anim.h - 0.5);
      // Al apoyar el dedo el hueco del enjambre se abre ahí mismo, no viene
      // viajando desde el toque anterior
      if (e.type === "pointerdown" && e.pointerType === "touch") {
        anim.mouse.x = anim.mouse.tx;
        anim.mouse.y = anim.mouse.ty;
      }
      anim.pointerAmpTarget = 1;
    };
    // En táctil el enjambre reacciona mientras el dedo está apoyado
    const onPointerUp = (e) => {
      if (e.pointerType === "touch") anim.pointerAmpTarget = 0;
    };
    const onScroll = () => {
      anim.scroll = window.scrollY;
      anim.ultimoScroll = performance.now();
    };

    // Cursor proyectado al plano de la escena ASCII con la cámara real
    const rayo = new THREE.Vector3();
    const enPlano = (nx, ny, z, out) => {
      a3cam.updateMatrixWorld();
      rayo.set(nx, ny, 0.5).unproject(a3cam).sub(a3cam.position);
      const k = (z - a3cam.position.z) / rayo.z;
      return out.copy(a3cam.position).addScaledVector(rayo, k);
    };
    const lugar = new THREE.Vector3();
    const puntero = new THREE.Vector3();
    const BEAT_HZ = 145 / 60 / 4; // pulso a un cuarto de 145 BPM

    const frame = (now) => {
      anim.raf = requestAnimationFrame(frame);
      const { home: enHome, revealActive: listo, reduced } = estado.current;
      const quieto = reduced || anim.porSoftware;
      if (document.hidden) return;
      // Con el visor o un panel abiertos el fondo queda tapado: no se dibuja
      if (anim.dibujado && document.body.style.overflow === "hidden") return;
      const enHero = enHome && anim.scroll < anim.h * 1.05;
      // Fuera del hero (y en celular) alcanza con 30 cuadros
      const intervalo = compact || !enHero ? 1000 / 30 - 2 : 0;
      if (!quieto && anim.dibujado && now - anim.last < intervalo) return;
      // El timestamp del rAF puede venir antes del último registro: sin el piso
      // en 0 el dt negativo se acumula y la escultura se deforma sin límite.
      const dt = Math.min(0.05, Math.max(0, (now - anim.last) / 1000));
      anim.last = now;

      if (!quieto) anim.t += dt;
      const film = import.meta.env.DEV ? anim.film : null;
      // Solo en dev: modo filmación, para grabar cuadro por cuadro en
      // máquinas sin GPU (el tiempo, el puntero y la escena los fija quien graba).
      if (film) {
        anim.t = film.t;
        anim.pointer.set(film.px, film.py);
        anim.mouse.x = anim.mouse.tx = film.px * 0.5;
        anim.mouse.y = anim.mouse.ty = film.py * 0.5;
        anim.reveal = 1;
      }
      if (quieto) anim.reveal = 1;
      else if (listo) anim.reveal = Math.min(1, anim.reveal + dt / 1.6);
      const ease = 1 - Math.pow(1 - clamp01(anim.reveal), 3);

      // Turnos de las escenas ASCII: cada una entra y sale por negro, así el
      // cambio de niveles (cada escena tiene los suyos) no se nota
      const ci = anim.ciclo;
      if (quieto) ci.k = 1;
      else if (ci.fase === "entra") {
        ci.t += dt;
        ci.k = Math.min(1, ci.k + dt / ENTRA);
        if (ci.t >= CICLO - SALE) ci.fase = "sale";
      } else {
        ci.k = Math.max(0, ci.k - dt / SALE);
        if (ci.k === 0) {
          ci.i = (ci.i + 1) % piezas.length;
          ci.t = 0;
          ci.fase = "entra";
        }
      }
      if (film?.escena) {
        ci.i = Math.max(0, ESCENAS.indexOf(film.escena));
        ci.k = 1;
      }
      const pieza = piezas[ci.i];
      piezas.forEach((p) => {
        p.object.visible = p === pieza;
      });
      const revealAscii = (1 - Math.pow(1 - ci.k, 3)) * ease;
      const niveles = (compact && ASCII_LEVELS_COMPACT[pieza.kind]) || {
        gain: ASCII_GAIN[pieza.kind],
        floor: ASCII_FLOOR[pieza.kind],
      };
      cellUniforms.uGain.value = niveles.gain;
      cellUniforms.uFloor.value = niveles.floor;

      // Puntero: amortiguado igual a cualquier cantidad de cuadros
      const m = anim.mouse;
      const suave = film || quieto ? 1 : 1 - Math.exp(-dt * 6.5);
      m.x += (m.tx - m.x) * suave;
      m.y += (m.ty - m.y) * suave;
      anim.pointerAmp += (anim.pointerAmpTarget - anim.pointerAmp) * (1 - Math.exp(-dt * 5));

      // La escultura de vidrio (solo en el home): mira hacia el puntero y se
      // agita con la velocidad
      const heroK = enHome && anim.anclaOk ? clamp01(1 - anim.scroll / (anim.h * 0.85)) : 0;
      const scrollK = clamp01(anim.scroll / anim.h);
      let orbX = 0;
      let orbY = 0;
      if (enHome && anim.anclaOk) {
        const prev = anim.pointerS.clone();
        anim.pointerS.lerp(anim.pointer, quieto || film ? 1 : 0.06);
        const v = prev.distanceTo(anim.pointerS) / Math.max(dt, 0.001);
        anim.speed = THREE.MathUtils.lerp(anim.speed, Math.min(v, 3), 0.08);
        orb.position.set(
          anim.target.x * anim.halfW + anim.pointerS.x * 0.18,
          anim.target.y * anim.halfH + anim.pointerS.y * 0.12 + scrollK * anim.halfH * 0.9,
          0,
        );
        const s = anim.radius * (0.72 + 0.28 * ease) * (1 - scrollK * 0.18);
        orb.scale.setScalar(Math.max(s, 0.001));
        orb.rotation.y = anim.t * 0.18 + anim.pointerS.x * 0.55;
        orb.rotation.x = Math.sin(anim.t * 0.21) * 0.25 - anim.pointerS.y * 0.4;
        orb.rotation.z = anim.t * 0.05;
        const ndc = orb.position.clone().project(camera);
        orbX = ndc.x;
        orbY = ndc.y;
        glassUniforms.uCenter.value.set(ndc.x * 0.5 + 0.5, ndc.y * 0.5 + 0.5);
        glassUniforms.uRadius.value.set(s / (2 * anim.halfW), s / (2 * anim.halfH));
        glassUniforms.uTime.value = anim.t;
        glassUniforms.uAmp.value = (0.12 + 0.1 * (1 - ease) + anim.speed * 0.035) * (quieto ? 0.8 : 1);
      }

      // La escena ASCII ocupa todo el fondo, al tamaño del hero de 2026-08
      // (con la cámara fija en vertical, mide lo mismo contra el alto en
      // cualquier pantalla). En el hero se centra detrás del vidrio, que la
      // dobla; más abajo y en las otras rutas, un poco a la derecha.
      const nx = lerp(compact ? 0 : 0.3, orbX, heroK);
      const ny = lerp(compact ? -0.04 : -0.02, orbY, heroK);
      a3cam.position.x = m.x * 0.18;
      a3cam.position.y = 0.18 + m.y * 0.12;
      a3cam.lookAt(0, 0, -2.5);
      enPlano(nx, ny, 0, lugar);
      pieza.object.position.set(lugar.x, lugar.y, 0);
      pieza.object.scale.setScalar(compact ? 1.48 : 1.46);
      const activo = anim.pointerAmpTarget > 0 || anim.pointerAmp > 0.002;
      pieza.animate({
        time: anim.t,
        mouse: m,
        pointer: activo ? enPlano(m.x * 2, m.y * 2, 0, puntero) : null,
        pointerAmp: anim.pointerAmp,
        reveal: revealAscii,
        scroll: scrollK,
        pulse: Math.pow(Math.max(Math.sin(anim.t * BEAT_HZ * Math.PI * 2), 0), 4),
        dt,
      });
      // `animate` de la escultura mueve su posición: el lugar lo manda el fondo
      pieza.object.position.set(lugar.x, lugar.y, 0);

      renderer.setRenderTarget(sceneTarget);
      renderer.clear();
      renderer.render(a3, a3cam);
      renderer.setRenderTarget(cellTarget);
      renderer.render(cellScene, cellCam);

      bgUniforms.uTime.value = anim.t;
      bgUniforms.uInk.value = revealAscii * lerp(0.85, 1, heroK);
      // La escena debajo de los caracteres le da volumen al hero; en el resto
      // del sitio, más baja, si no queda una mancha detrás de las secciones
      bgUniforms.uKeep.value = lerp(0.2, 0.36, heroK);
      bgUniforms.uGlow.value.set(nx * 0.5 + 0.5, ny * 0.5 + 0.5);
      bgUniforms.uGlowK.value = lerp(0.18, 0.3, heroK);
      bgUniforms.uCore.value = 0.5 * heroK * ease;
      bgUniforms.uPage.value.set(anim.scroll, mascara.state.pageH, anim.h);
      bgUniforms.uBar.value = mascara.state.barra;
      bgUniforms.uScroll.value = anim.scroll / anim.h;
      bgUniforms.uTypeOn.value = enHome && anim.typeReady ? 1 : 0;

      if (enHero && anim.anclaOk) {
        renderer.setRenderTarget(bgTarget);
        renderer.render(bgScene, camera);
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
      } else {
        renderer.setRenderTarget(null);
        renderer.render(bgScene, camera);
      }
      if (!anim.dibujado) {
        anim.dibujado = true;
        host.style.opacity = "1";
        // El lienzo ya tapa la atmósfera del CSS: se apaga (sus luces se
        // seguían componiendo y animando debajo, sin verse)
        document.documentElement.classList.add("fondo-vivo");
      }
      if (quieto) {
        cancelAnimationFrame(anim.raf);
        anim.raf = 0;
      }
    };

    // Con movimiento reducido el bucle se corta después de un cuadro: hay que
    // volver a pedirlo cuando algo cambia (scroll, tamaño, ruta).
    const despertar = () => {
      if (!anim.raf) anim.raf = requestAnimationFrame(frame);
    };

    resize();
    onScroll();
    mascara.update();

    // Cambio de paleta (paletas.css, `data-paleta` en <html>): colores del
    // fondo, reflejos del vidrio y el nombre, sin rehacer la escena.
    const alCambiarPaleta = () => {
      aplicarPaleta();
      const viejo = envTarget;
      envTarget = crearAmbiente(renderer, compact ? 128 : 256);
      glassUniforms.uEnv.value = envTarget.texture;
      viejo.dispose();
      redibujarNombre();
      despertar();
    };
    const vigiaPaleta = new MutationObserver(alCambiarPaleta);
    vigiaPaleta.observe(document.documentElement, { attributes: true, attributeFilter: ["data-paleta"] });

    window.addEventListener("resize", alRedimensionar);
    window.addEventListener("hero-layout", alMedir);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", despertar, { passive: true });
    window.addEventListener("resize", despertar);
    window.addEventListener("hero-layout", despertar);
    document.fonts?.ready?.then(alMedir);
    // El largo de la página cambia con las imágenes, las rutas y el idioma
    const ro = new ResizeObserver(programarMascara);
    ro.observe(document.body);
    const main = document.getElementById("main");
    const mo = main ? new MutationObserver(programarMascara) : null;
    mo?.observe(main, { childList: true, subtree: true });
    const reloj = window.setInterval(despertar, 1000);
    anim.raf = requestAnimationFrame(frame);

    api.current = {
      alCambiarRuta: () => {
        alMedir();
        programarMascara();
        despertar();
      },
    };

    if (import.meta.env.DEV) {
      window.__glass = { anim, mat, glassUniforms, bgUniforms, cellUniforms, renderer, mascara, sceneTarget, cellTarget, piezas };
    }

    return () => {
      cancelAnimationFrame(anim.raf);
      document.fonts?.removeEventListener?.("loadingdone", redibujarAtlas);
      window.clearInterval(reloj);
      window.clearTimeout(tMascara);
      ro.disconnect();
      mo?.disconnect();
      window.removeEventListener("resize", alRedimensionar);
      window.removeEventListener("hero-layout", alMedir);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", despertar);
      window.removeEventListener("resize", despertar);
      window.removeEventListener("hero-layout", despertar);
      document.documentElement.classList.remove("glass-type", "fondo-vivo");
      api.current = null;
      piezas.forEach((p) => disposeObject(p.object));
      cellScene.traverse((o) => o.material?.dispose?.());
      geo.dispose();
      mat.dispose();
      bg.material.dispose();
      copia.material.dispose();
      quad.dispose();
      vigiaPaleta.disconnect();
      envTarget.dispose();
      bgTarget.dispose();
      sceneTarget.dispose();
      cellTarget.dispose();
      atlas.texture.dispose();
      typeTex.dispose();
      mascara.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={mount} className="hero-glass" />;
}
