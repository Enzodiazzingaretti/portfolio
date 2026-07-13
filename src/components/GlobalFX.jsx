import { useEffect, useRef } from "react";
import * as THREE from "three";

const SIMPLEX3D = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const FBM = `
${SIMPLEX3D}
float fbm(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < octaves; i += 1) {
    value += amplitude * snoise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uPhase;
  uniform float uScroll;
  uniform float uReveal;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  ${FBM}

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    // Mouse parallax sutil
    p += uMouse * 0.04;

    // La phase evoluciona entre secciones; scroll agita y desplaza verticalmente
    float phase = uPhase;
    float t = uTime * (0.12 + phase * 0.06) + uScroll * 2.5;
    float scale = 2.2 + phase * 1.6;
    p *= scale;

    // Domain warping: nube de ruido que muta con la phase (3 octavas: barato y difuso)
    float q = fbm(vec3(p, t), 3);
    vec2 r = vec2(
      fbm(vec3(p + q + vec2(1.7, 9.2) + phase * 3.0, t * 1.05), 3),
      fbm(vec3(p + q + vec2(8.3, 2.8) - phase * 2.0, t * 1.05), 3)
    );
    float warped = fbm(vec3(p + r * (1.3 + phase * 0.6) + vec2(0.0, uScroll * 3.0), t * 1.15), 3);

    float n = warped * 0.5 + 0.5;

    // La phase ajusta la "estructura" del patron
    float structure = pow(n, 1.7 + phase * 1.6);
    float glow = smoothstep(0.42, 0.82, structure) * (0.42 + phase * 0.18);
    float hot = smoothstep(0.74, 0.95, structure) * (0.12 + phase * 0.12);

    vec3 dark = vec3(0.02, 0.02, 0.02);
    vec3 mid = vec3(0.06 + phase * 0.04, 0.012, 0.012);
    vec3 red = vec3(0.55 + phase * 0.22, 0.05, 0.04);
    vec3 hotColor = vec3(0.95, 0.16, 0.12);

    vec3 color = mix(dark, mid, structure);
    color += red * glow;
    color += hotColor * hot;

    // Vignette para mantener los bordes oscuros y no competir con el texto
    float vig = 1.0 - length((vUv - 0.5) * 1.45);
    vig = smoothstep(0.0, 0.9, vig);
    color *= mix(0.35, 1.0, vig);

    gl_FragColor = vec4(color * uReveal, 1.0);
  }
`;

export default function GlobalFX({ scrollProgress }) {
  const mountRef = useRef(null);
  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const mount = mountRef.current;
    if (!mount) return undefined;

    const compact = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x050505, 0);
    // Fondo difuso y vigneteado: rinde a resolucion reducida (upscale invisible)
    // y baja mucho el costo del fragment shader (ruido por pixel)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 0.7 : 1));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPhase: { value: 0 },
        uScroll: { value: 0 },
        uReveal: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const phase = { current: 0, target: 0 };
    const scroll = { current: 0 };
    let reveal = 0;

    const sectionRatios = new Map();

    const getSections = () => Array.from(document.querySelectorAll("section[id]"));

    const updatePhaseTarget = () => {
      const sections = getSections();
      let best = null;
      let bestRatio = 0;
      for (const [section, ratio] of sectionRatios.entries()) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = section;
        }
      }
      if (best) {
        const index = Math.max(0, sections.indexOf(best));
        const total = Math.max(1, sections.length - 1);
        phase.target = index / total;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionRatios.set(entry.target, entry.intersectionRatio);
        });
        updatePhaseTarget();
      },
      {
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
        rootMargin: "0px",
      },
    );

    const observeAll = () => {
      getSections().forEach((section) => {
        if (!sectionRatios.has(section)) {
          observer.observe(section);
        }
      });
      updatePhaseTarget();
    };

    observeAll();

    // Observar solo altas/bajas de secciones en <main>; sin subtree para no
    // reaccionar al tick del reloj del HUD (que muta el DOM cada segundo)
    const container = document.querySelector("main") || document.body;
    const mutation = new MutationObserver(observeAll);
    mutation.observe(container, { childList: true });

    const onPointer = (event) => {
      mouse.tx = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    let raf = 0;
    let last = 0;
    let lastFrame = 0;
    let start = 0;
    let hidden = false;
    const frameInterval = 1000 / 30; // el fondo difuso no necesita 60fps

    const onVisibility = () => {
      hidden = document.hidden;
    };

    const tick = (timestamp) => {
      raf = requestAnimationFrame(tick);
      if (hidden) return;
      // Un solo WebGL a la vez: mientras el hero cubre el viewport, el fondo descansa
      if (window.scrollY < window.innerHeight * 0.82) {
        last = timestamp;
        lastFrame = timestamp;
        return;
      }
      if (timestamp - lastFrame < frameInterval) return;
      lastFrame = timestamp;

      const dt = last ? Math.min((timestamp - last) / 1000, 0.05) : 1 / 60;
      last = timestamp;
      if (start === 0) start = timestamp;
      const elapsed = (timestamp - start) / 1000;

      // Damping exponencial para transiciones suaves
      const ease = (k) => 1 - Math.exp(-dt * k);
      phase.current += (phase.target - phase.current) * ease(2.2);
      scroll.current += (scrollProgressRef.current - scroll.current) * ease(3.0);
      mouse.x += (mouse.tx - mouse.x) * ease(4.0);
      mouse.y += (mouse.ty - mouse.y) * ease(4.0);
      reveal = Math.min(reveal + dt * 0.85, 1.0);

      material.uniforms.uTime.value = elapsed;
      material.uniforms.uPhase.value = phase.current;
      material.uniforms.uScroll.value = scroll.current;
      material.uniforms.uReveal.value = reveal;
      material.uniforms.uMouse.value.set(mouse.x, mouse.y);

      renderer.render(scene, camera);
    };

    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      mutation.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-2]"
    />
  );
}
