import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero «vidrio ahumado»: una escultura de vidrio líquido en el centro, que
 * refracta el nombre de verdad. El nombre que se ve a través del vidrio no es
 * una imagen aparte: se dibuja en una textura con las posiciones exactas del
 * <h1> del DOM (se miden sus renglones), y esa textura es el fondo de la
 * escena WebGL. Así el vidrio deforma letras reales y el <h1> sigue siendo
 * texto para lectores de pantalla y buscadores; se vuelve transparente recién
 * cuando la textura ya está dibujada (clase `glass-type` en <html>). Si WebGL
 * falla, el <h1> se ve como siempre.
 *
 * Un solo contexto WebGL, montado en el Shell como el fondo de antes: se
 * pausa fuera del home, cuando el hero sale de pantalla y con la pestaña
 * oculta. Con movimiento reducido dibuja un cuadro quieto.
 *
 * El lugar y el tamaño de la escultura los decide el CSS: un ancla vacía en el
 * hero (`[data-glass-anchor]`) que la escena lee y convierte a coordenadas del
 * mundo. Cambiar la composición por breakpoint no toca este archivo.
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

/** Fondo de la escena: la atmósfera grafito (igual a la del CSS) y el nombre. */
const BG_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const BG_FRAG = /* glsl */ `
uniform sampler2D uType;
uniform float uScroll;
uniform float uTime;
uniform float uAspect;
uniform vec2 uGlow;
uniform float uCore;
uniform float uCoreR;
uniform vec3 uCoreCol;
uniform vec4 uGrid;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 p = vUv; p.x *= uAspect;
  vec3 base = vec3(0.090, 0.098, 0.114);             // grafito #17191D
  vec3 deep = vec3(0.055, 0.059, 0.071);             // #0E0F12 en los bordes
  float vig = smoothstep(0.25, 1.15, length((vUv - 0.5) * vec2(1.15, 1.0)));
  vec3 col = mix(base, deep, vig);
  // Luz roja cálida detrás de la escultura y humo frío abajo a la izquierda
  vec2 g = uGlow; g.x *= uAspect;
  float red = exp(-pow(length(p - g) * 1.55, 2.0));
  col += vec3(0.898, 0.141, 0.212) * red * 0.30;
  // Contraluz: un núcleo rojo más chico justo detrás de la escultura, para
  // que el vidrio tenga algo que doblar aunque no tenga letras atrás
  float core = exp(-pow(length(p - g) / max(uCoreR, 0.001), 2.0));
  col += uCoreCol * core * uCore;
  // La retícula de 12 columnas de la atmósfera del CSS (que el lienzo tapa):
  // sigue de largo por el hero y el vidrio la dobla
  float gx = (vUv.x - uGrid.x) / max(uGrid.y, 0.0001) * 12.0;
  if (gx > -0.02 && gx < 11.98) {
    float dpx = abs(fract(gx + 0.5) - 0.5) * uGrid.y / 12.0 * uGrid.z;
    float fade = smoothstep(0.0, 0.14, vUv.y) * smoothstep(0.0, 0.14, 1.0 - vUv.y);
    col = mix(col, vec3(0.898, 0.890, 0.878), (1.0 - smoothstep(0.5, 1.5, dpx)) * fade * uGrid.w);
  }
  vec2 s = vec2(0.08 * uAspect, 0.06);
  float smoke = exp(-pow(length(p - s) * 1.25, 2.0));
  col += vec3(0.52, 0.53, 0.57) * smoke * 0.10;
  // El nombre, en coordenadas de página: sube con el scroll
  vec2 tuv = vec2(vUv.x, vUv.y - uScroll);
  if (tuv.y >= 0.0 && tuv.y <= 1.0) {
    vec4 t = texture2D(uType, tuv);
    col = mix(col, t.rgb, t.a);
  }
  // Grano fino, el mismo del resto del sitio
  col += (hash(vUv * 900.0 + fract(uTime) * 37.0) - 0.5) * 0.028;
  gl_FragColor = vec4(col, 1.0);
}
`;

const RED = "#E52436";

function esCompacto() {
  return window.matchMedia("(max-width: 767px)").matches;
}

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
  panel(1.1, 7, RED, 6, [5.2, 0.2, -0.8]); // franja roja a la derecha
  panel(0.6, 4, RED, 3, [-5.4, -1.2, -2.2]); // eco rojo atrás
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
    const top = base - size * 0.82;
    const bottom = base + size * 0.04;
    if (el.dataset.glassType === "red") {
      const g = ctx.createLinearGradient(0, top, 0, bottom);
      g.addColorStop(0, "#ff4a5b");
      g.addColorStop(0.55, RED);
      g.addColorStop(1, "#a50f1d");
      ctx.fillStyle = g;
    } else {
      // Metal: dos bandas de brillo, como el titular cromado de un afiche
      const g = ctx.createLinearGradient(0, top, 0, bottom);
      g.addColorStop(0, "#f6f5f3");
      g.addColorStop(0.36, "#d2d2d6");
      g.addColorStop(0.5, "#86878f");
      g.addColorStop(0.58, "#b4b5bb");
      g.addColorStop(1, "#e9e8e5");
      ctx.fillStyle = g;
    }
    ctx.fillText(text, rect.left, base);
    ctx.restore();
  });
  // textura en coordenadas de la página: el borde de arriba es scroll 0
  void w;
  void h;
  return true;
}

export default function HeroGlass({ active = true, revealActive = true, reduced = false }) {
  const mount = useRef(null);
  const estado = useRef({ active, revealActive, reduced });
  estado.current = { active, revealActive, reduced };

  useEffect(() => {
    const host = mount.current;
    if (!host) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      return undefined; // sin WebGL: queda el <h1> del DOM
    }

    const compact = esCompacto();
    const dprMax = compact ? 1.5 : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));
    // Los dos shaders son propios y ya entregan color sRGB: nada de tone
    // mapping ni conversión de espacio de color de three.
    renderer.toneMapping = THREE.NoToneMapping;
    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    const FONDO_Z = -5;

    // Fondo: atmósfera + nombre
    const typeCanvas = document.createElement("canvas");
    const typeCtx = typeCanvas.getContext("2d");
    const typeTex = new THREE.CanvasTexture(typeCanvas);
    // Sin decodificar: los shaders trabajan con los valores sRGB tal cual
    typeTex.colorSpace = THREE.NoColorSpace;
    typeTex.minFilter = THREE.LinearFilter;
    typeTex.generateMipmaps = false;
    const bgUniforms = {
      uType: { value: typeTex },
      uScroll: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uGlow: { value: new THREE.Vector2(0.58, 0.55) },
      uCore: { value: 0.5 },
      uCoreR: { value: 0.12 },
      uCoreCol: { value: new THREE.Vector3(0.84, 0.68, 0.7) },
      uGrid: { value: new THREE.Vector4(0, 1, 1, 0) },
    };
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({ uniforms: bgUniforms, vertexShader: BG_VERT, fragmentShader: BG_FRAG, depthWrite: false }),
    );
    bg.position.z = FONDO_Z;
    scene.add(bg);

    // El fondo se dibuja primero en un render target: es lo que el vidrio
    // refracta. Sin MSAA ni mipmaps, así se ve igual en cualquier GPU.
    const bgTarget = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: false });
    const bgScene = new THREE.Scene();
    const bgCopy = new THREE.Mesh(bg.geometry, bg.material);
    bgScene.add(bgCopy);

    // La escultura
    const envTarget = crearAmbiente(renderer, compact ? 128 : 256);
    const geo = new THREE.IcosahedronGeometry(1, compact ? 40 : 72);
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
      w: 1,
      h: 1,
      halfH: 1,
      halfW: 1,
      target: new THREE.Vector3(),
      radius: 1,
      pointer: new THREE.Vector2(),
      pointerS: new THREE.Vector2(),
      speed: 0,
      reveal: 0,
      scroll: 0,
      visible: true,
      typeReady: false,
      raf: 0,
      last: performance.now(),
      t: 0,
      lastMove: 0,
    };

    const medirAncla = () => {
      const a = document.querySelector("[data-glass-anchor]");
      if (!a) return false;
      const r = a.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2 + window.scrollY; // en coordenadas de página
      anim.target.set((cx / anim.w) * 2 - 1, -((cy / anim.h) * 2 - 1), 0);
      anim.radius = (r.width / 2 / anim.w) * 2 * anim.halfW;
      bgUniforms.uGlow.value.set(cx / anim.w, 1 - cy / anim.h);
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
      }
      const ok = dibujarNombre(typeCtx, anim.w, anim.h, dpr);
      typeTex.needsUpdate = true;
      anim.typeReady = ok;
      document.documentElement.classList.toggle("glass-type", ok);
    };

    const resize = () => {
      anim.w = window.innerWidth;
      anim.h = window.innerHeight;
      renderer.setSize(anim.w, anim.h, false);
      camera.aspect = anim.w / anim.h;
      camera.updateProjectionMatrix();
      anim.halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      anim.halfW = anim.halfH * camera.aspect;
      const dist = camera.position.z - FONDO_Z;
      const bh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
      bg.scale.set(bh * camera.aspect, bh, 1);
      bgCopy.position.copy(bg.position);
      bgCopy.scale.copy(bg.scale);
      const pr = renderer.getPixelRatio();
      bgTarget.setSize(Math.round(anim.w * pr), Math.round(anim.h * pr));
      bgUniforms.uAspect.value = camera.aspect;
      medirAncla();
      redibujarNombre();
    };

    const alMedir = () => {
      // dos cuadros: el layout del hero recién montado todavía puede moverse
      requestAnimationFrame(() => requestAnimationFrame(resize));
    };

    const onPointer = (e) => {
      anim.pointer.set((e.clientX / anim.w) * 2 - 1, -((e.clientY / anim.h) * 2 - 1));
      anim.lastMove = performance.now();
    };
    const onScroll = () => {
      anim.scroll = window.scrollY;
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("hero-layout", alMedir);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.fonts?.ready?.then(alMedir);

    const frame = (now) => {
      anim.raf = requestAnimationFrame(frame);
      const { active: on, revealActive: listo, reduced: quieto } = estado.current;
      // El timestamp del rAF puede venir antes del último registro: sin el piso
      // en 0 el dt negativo se acumula y la escultura se deforma sin límite.
      const dt = Math.min(0.05, Math.max(0, (now - anim.last) / 1000));
      anim.last = now;

      // Visible mientras el hero ocupa la pantalla; después el canvas se funde
      const fade = 1 - THREE.MathUtils.clamp(anim.scroll / (anim.h * 0.9), 0, 1);
      host.style.opacity = on ? String(fade) : "0";
      const visible = on && fade > 0.01 && !document.hidden;
      if (!visible) return;

      if (!quieto) anim.t += dt;
      // Solo en dev: modo filmación, para grabar cuadro por cuadro en
      // máquinas sin GPU (el tiempo y el puntero los fija quien graba).
      if (import.meta.env.DEV && anim.film) {
        anim.t = anim.film.t;
        anim.pointer.set(anim.film.px, anim.film.py);
        anim.reveal = 1;
      }
      if (listo) anim.reveal = Math.min(1, anim.reveal + dt / 1.6);
      const ease = 1 - Math.pow(1 - THREE.MathUtils.clamp(anim.reveal, 0, 1), 3);

      // Cursor: la pieza mira hacia el puntero y se agita con la velocidad
      const prev = anim.pointerS.clone();
      anim.pointerS.lerp(anim.pointer, quieto || (import.meta.env.DEV && anim.film) ? 1 : 0.06);
      const v = prev.distanceTo(anim.pointerS) / Math.max(dt, 0.001);
      anim.speed = THREE.MathUtils.lerp(anim.speed, Math.min(v, 3), 0.08);

      const scrollK = THREE.MathUtils.clamp(anim.scroll / anim.h, 0, 1);
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
      glassUniforms.uCenter.value.set(ndc.x * 0.5 + 0.5, ndc.y * 0.5 + 0.5);
      glassUniforms.uRadius.value.set(s / (2 * anim.halfW), s / (2 * anim.halfH));
      glassUniforms.uTime.value = anim.t;
      glassUniforms.uAmp.value = (0.12 + 0.1 * (1 - ease) + anim.speed * 0.035) * (quieto ? 0.8 : 1);
      bgUniforms.uTime.value = anim.t;
      bgUniforms.uScroll.value = anim.scroll / anim.h;

      renderer.setRenderTarget(bgTarget);
      renderer.render(bgScene, camera);
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
      if (quieto) {
        cancelAnimationFrame(anim.raf);
        anim.raf = 0;
      }
    };
    anim.raf = requestAnimationFrame(frame);

    // Con movimiento reducido el bucle se corta después de un cuadro: hay que
    // volver a pedirlo cuando algo cambia (scroll, tamaño, ruta).
    const despertar = () => {
      if (!anim.raf) anim.raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", despertar, { passive: true });
    window.addEventListener("resize", despertar);
    window.addEventListener("hero-layout", despertar);
    const reloj = window.setInterval(despertar, 1000);

    if (import.meta.env.DEV) window.__glass = { anim, mat, glassUniforms, bgUniforms, renderer };

    return () => {
      cancelAnimationFrame(anim.raf);
      window.clearInterval(reloj);
      window.removeEventListener("resize", resize);
      window.removeEventListener("hero-layout", alMedir);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", despertar);
      window.removeEventListener("resize", despertar);
      window.removeEventListener("hero-layout", despertar);
      document.documentElement.classList.remove("glass-type");
      geo.dispose();
      mat.dispose();
      envTarget.dispose();
      bgTarget.dispose();
      typeTex.dispose();
      bg.geometry.dispose();
      bg.material.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={mount} className="hero-glass" />;
}
