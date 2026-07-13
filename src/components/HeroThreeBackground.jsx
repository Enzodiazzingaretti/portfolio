import { useEffect, useRef } from "react";
import * as THREE from "three";

const STATIC_FRAME_TIME = 18;
const RED = 0xb11212;
const RED_DEEP = 0x5b0000;
const RED_HOT = 0xff2a2a;

function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => material.dispose());
    }
  });
}

function createParticleField() {
  const count = 560;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const radius = 0.7 + Math.random() * 2.2;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2.3;
    positions[i * 3 + 2] = -Math.random() * 8.5;
    seeds[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: RED_HOT,
    size: 0.042,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);

  return {
    object: points,
    animate: ({ time, mouse, reveal, dt = 1 / 60 }) => {
      const f = dt * 60;
      const position = geometry.attributes.position;
      const array = position.array;
      for (let i = 0; i < count; i += 1) {
        const idx = i * 3;
        array[idx] += (Math.sin(time * 0.35 + seeds[i]) * 0.0008 + mouse.x * 0.0009) * f;
        array[idx + 1] += (Math.cos(time * 0.32 + seeds[i]) * 0.0007 + mouse.y * 0.0008) * f;
        array[idx + 2] += (0.012 + Math.sin(time + seeds[i]) * 0.0015) * f;
        if (array[idx + 2] > 1.5) array[idx + 2] = -8.5;
      }
      position.needsUpdate = true;
      points.rotation.z = time * 0.018;
      material.opacity = 0.82 * reveal;
    },
  };
}

function makeOrganicCurve(seed) {
  const points = [];
  for (let i = 0; i < 9; i += 1) {
    const t = i / 8;
    points.push(new THREE.Vector3(
      Math.sin(t * Math.PI * 2 + seed) * (0.35 + t * 1.2),
      Math.cos(t * Math.PI * 3 + seed * 0.8) * 0.42,
      -t * 5.8,
    ));
  }
  return new THREE.CatmullRomCurve3(points);
}

function createOrganic() {
  const group = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const geometry = new THREE.TubeGeometry(makeOrganicCurve(i * 0.9), 96, 0.015 + i * 0.002, 8, false);
    const material = new THREE.MeshBasicMaterial({
      color: i % 2 ? RED : RED_DEEP,
      transparent: true,
      opacity: i % 2 ? 0.54 : 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      wireframe: i % 3 === 0,
    });
    const strand = new THREE.Mesh(geometry, material);
    strand.rotation.z = i * 0.9;
    group.add(strand);
  }

  return {
    object: group,
    animate: ({ time, mouse, reveal, dt = 1 / 60 }) => {
      const f = dt * 60;
      group.rotation.x = mouse.y * 0.14;
      group.rotation.y = time * 0.06 + mouse.x * 0.18;
      group.children.forEach((strand, index) => {
        strand.rotation.z += (0.0015 + index * 0.0004) * f;
        strand.scale.setScalar(1 + Math.sin(time * 0.7 + index) * 0.04);
        strand.material.opacity = (index % 2 ? 0.54 : 0.4) * reveal;
      });
    },
  };
}

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

function createLivingSculpture(compact) {
  const detail = compact ? 24 : 48;
  const geometry = new THREE.IcosahedronGeometry(1.0, detail);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 1 },
      uPulse: { value: 0 },
      uScroll: { value: 0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uReveal;
      uniform float uPulse;
      uniform float uScroll;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vNoise;

      ${SIMPLEX3D}

      float fbm(vec3 p) {
        float value = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 4; i += 1) {
          value += amp * snoise(p);
          p *= 1.75;
          amp *= 0.5;
        }
        return value;
      }

      float displace(vec3 n, float t) {
        vec3 q = vec3(
          fbm(n + vec3(0.0, 0.0, t)),
          fbm(n + vec3(5.2, 1.3, t)),
          fbm(n + vec3(1.7, 9.2, t))
        );
        return fbm(n * 1.20 + q * 0.50);
      }

      vec3 sculpt(vec3 dir, float t, float amp) {
        return dir + dir * displace(dir * 1.35, t) * amp;
      }

      void main() {
        // Scroll como offset acotado: no acumula vueltas ni acelera el tiempo
        float t = uTime * 0.10 + uScroll * 0.25;
        float amp = 0.30 * uReveal + uPulse * 0.025 + uScroll * 0.05;
        vec3 n0 = normalize(position);
        vec3 displaced = sculpt(n0, t, amp) * (0.62 + 0.38 * uReveal);
        vNoise = length(displaced) - 1.0;

        vec3 helper = abs(n0.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
        vec3 tangent = normalize(cross(n0, helper));
        vec3 bitangent = cross(n0, tangent);
        float eps = 0.032;
        vec3 pa = sculpt(normalize(n0 + tangent * eps), t, amp);
        vec3 pb = sculpt(normalize(n0 + bitangent * eps), t, amp);
        vec3 objNormal = normalize(cross(pa - displaced, pb - displaced));
        if (dot(objNormal, n0) < 0.0) objNormal = -objNormal;

        vec4 world = modelMatrix * vec4(displaced, 1.0);
        vNormal = normalize(mat3(modelMatrix) * objNormal);
        vView = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform float uReveal;
      uniform float uPulse;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vNoise;

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vView);
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);

        // Key light direccional (half-lambert) para que el interior lea forma
        vec3 keyDir = normalize(vec3(-0.55, 0.65, 0.5));
        float diff = dot(N, keyDir) * 0.5 + 0.5;
        diff *= diff;

        // Oclusion por ruido: punto medio entre definicion y suavidad
        float ao = clamp(0.55 + vNoise * 1.3, 0.25, 1.0);

        vec3 base = vec3(0.05, 0.048, 0.05);
        vec3 bodyRed = vec3(0.30, 0.045, 0.045);
        vec3 rim = vec3(0.74, 0.09, 0.09);
        vec3 hot = vec3(1.0, 0.2, 0.16);

        vec3 color = base + bodyRed * diff * ao;

        vec3 H = normalize(keyDir + V);
        float spec = pow(max(dot(N, H), 0.0), 24.0) * 0.30 * ao;
        color += vec3(0.9, 0.25, 0.2) * spec;

        color += rim * fresnel * (2.0 + uPulse * 0.30);
        color += hot * pow(fresnel, 3.0) * 0.65;
        color *= uReveal;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: false,
    depthWrite: true,
  });

  const mesh = new THREE.Mesh(geometry, material);

  return {
    object: mesh,
    animate: ({ time, mouse, reveal, scroll, pulse }) => {
      material.uniforms.uTime.value = time;
      material.uniforms.uReveal.value = reveal;
      material.uniforms.uPulse.value = pulse;
      material.uniforms.uScroll.value = scroll * 0.85; // scroll como offset
      // Rotaciones limitadas: scroll solo añade un offset acotado, no velocidad
      mesh.rotation.y = Math.sin(time * 0.02) * 0.05 + scroll * 0.35 + mouse.x * 0.15;
      mesh.rotation.x = mouse.y * 0.10 + scroll * 0.10;
      mesh.rotation.z = Math.sin(time * 0.03) * 0.04 + scroll * 0.05;
      mesh.position.y = Math.sin(time * 0.15) * 0.01 + scroll * 0.04;
      mesh.position.z = -scroll * 0.04;
    },
  };
}

function createSceneObject(sceneType, compact) {
  if (sceneType === "organic") return createOrganic();
  if (sceneType === "sculpture") return createLivingSculpture(compact);
  return createParticleField();
}

export default function HeroThreeBackground({ variant, staticMode = false, revealActive = true, instantReveal = false }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const contextLossTimerRef = useRef(null);
  const revealActiveRef = useRef(revealActive);

  useEffect(() => {
    revealActiveRef.current = revealActive;
  }, [revealActive]);

  useEffect(() => {
    if (contextLossTimerRef.current) {
      clearTimeout(contextLossTimerRef.current);
      contextLossTimerRef.current = null;
    }

    const mount = mountRef.current;
    if (!mount || !variant) return undefined;

    const compact = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.12);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 42);
    camera.position.set(0, 0.18, 4.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !compact,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x050505, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1 : 2));
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 4),
      new THREE.MeshBasicMaterial({
        color: RED_DEEP,
        transparent: true,
        opacity: 0.13,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.position.set(compact ? 0.72 : 1.55, compact ? 0.3 : -0.04, -3.8);
    glow.rotation.z = -0.18;
    scene.add(glow);

    const sceneObject = createSceneObject(variant.scene, compact);
    sceneObject.object.position.set(compact ? 0.66 : 1.35, compact ? 0.28 : -0.04, 0);
    sceneObject.object.scale.setScalar(compact ? 1.48 : 1.46);
    scene.add(sceneObject.object);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let rafId = 0;
    let destroyed = false;
    let start = null;
    let lastFrame = 0;
    let heroScroll = 0;
    let heroScrollTarget = 0;
    let heroVisible = true;
    const frameInterval = compact ? 1000 / 30 : 0;
    const REVEAL_MS = 1700;
    const BEAT_HZ = 145 / 60 / 4; // pulso a un cuarto de 145 BPM

    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

    const resize = () => {
      const width = Math.max(2, mount.clientWidth);
      const height = Math.max(2, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const render = (time, reveal = 1, dt = 1 / 60) => {
      // Damping exponencial: suavizado identico a cualquier framerate
      const ease = 1 - Math.exp(-dt * 6.5);
      mouse.x += (mouse.tx - mouse.x) * ease;
      mouse.y += (mouse.ty - mouse.y) * ease;
      heroScroll += (heroScrollTarget - heroScroll) * (1 - Math.exp(-dt * 4.5));
      camera.position.x = mouse.x * 0.18;
      camera.position.y = 0.18 + mouse.y * 0.12;
      camera.lookAt(0, 0, -2.5);
      const pulse = Math.pow(Math.max(Math.sin(time * BEAT_HZ * Math.PI * 2), 0), 4);
      sceneObject.animate({ time, mouse, reveal, scroll: heroScroll, pulse, dt });
      renderer.render(scene, camera);
    };

    let revealStart = null;

    const tick = (timestamp) => {
      if (destroyed) return;
      rafId = requestAnimationFrame(tick);
      // Fuera de viewport no gastamos GPU: el orbe solo vive en el hero
      if (!heroVisible) return;
      if (frameInterval && timestamp - lastFrame < frameInterval) return;
      const dt = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.05) : 1 / 60;
      lastFrame = timestamp;
      if (start === null) start = timestamp;
      // La entrada arranca recien cuando el preloader termino (revealActive)
      if (revealStart === null && revealActiveRef.current) revealStart = timestamp;
      // instantReveal: la variante entra ya formada (para el crossfade de ciclo)
      const reveal = instantReveal
        ? 1
        : revealStart === null
          ? 0
          : easeOutCubic(Math.min((timestamp - revealStart) / REVEAL_MS, 1));
      render(((timestamp - start) * 0.001) % 3600, reveal, dt);
    };

    const onPointerMove = (event) => {
      mouse.tx = event.clientX / window.innerWidth - 0.5;
      mouse.ty = -(event.clientY / window.innerHeight - 0.5);
    };

    const onScroll = () => {
      heroScrollTarget = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    };

    // Pausa el render cuando el hero sale del viewport
    const visibilityObserver = new IntersectionObserver(
      (entries) => { heroVisible = entries.some((entry) => entry.isIntersecting); },
      { threshold: 0 },
    );

    resize();
    if (staticMode) {
      render(STATIC_FRAME_TIME, 1);
    } else {
      rafId = requestAnimationFrame(tick);
      visibilityObserver.observe(mount);
      window.addEventListener("scroll", onScroll, { passive: true });
      if (!compact) window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    window.addEventListener("resize", resize);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      visibilityObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      disposeObject(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      contextLossTimerRef.current = setTimeout(() => {
        renderer.forceContextLoss();
        rendererRef.current = null;
        contextLossTimerRef.current = null;
      }, 0);
    };
  }, [variant, staticMode, instantReveal]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
    />
  );
}
