import * as THREE from "three";

/**
 * Las tres escenas del fondo ASCII: la escultura viva, el enjambre que
 * reacciona al cursor y las hebras orgánicas. Salieron de
 * `HeroThreeBackground` (el hero ASCII de 2026-08) para que el fondo de todo
 * el sitio (`HeroGlass`) las dibuje detrás del vidrio. Los niveles de cada
 * una están medidos sobre su render target: ver CLAUDE.md, sección 3.2.
 */

// Niveles del pase ASCII por escena: uGain es el punto de blanco y uFloor el
// de negro, los dos en unidades de luminancia del render target. Los tres
// rangos no se parecen en nada —la escultura es un solido de rango estrecho
// y alto (0.27 a 0.60), el enjambre son puntos casi blancos sobre negro, y
// las hebras organicas no llegan a 0.28— asi que una sola curva deja una
// escena saturada en manchas y otra invisible. Medidos leyendo el render
// target, no elegidos a ojo.
//
// Remedidos el 2026-11-05 en el fondo nuevo (escena a px CSS, celdas de
// 11 px, diez muestras por celda), tres instantes por escena:
//   escultura  p10 0.30 · p50 0.36 · p98 0.55 · máx 0.65  → igual que antes
//   enjambre   p10 0.03 · p50 0.05 · p98 0.11 · máx 0.16  → los de antes
//              (p50 0.33) no se reproducen y con piso 0.30 no salía ni un
//              caracter: el enjambre pasa a piso 0.03 y blanco en 0.11
//   hebras     p50 0.05 · p90 0.12 · p98 0.19 · máx 0.27
export const ASCII_GAIN = { sculpture: 3.2, particles: 12, organic: 10 };
export const ASCII_FLOOR = { sculpture: 0.29, particles: 0.03, organic: 0.01 };

// En compact el enjambre tiene 6.000 puntos en vez de 16.000 y mas chicos:
// la luminancia por celda cae de 0.97 a 0.11 de maxima y el punto de negro
// de desktop lo borra entero. La escultura y las hebras son la misma
// geometria en las dos resoluciones, asi que solo el enjambre se corrige.
// Remedido el 2026-11-05 a 390×844: p50 0.037, p98 0.075.
export const ASCII_LEVELS_COMPACT = { particles: { gain: 16, floor: 0.02 } };
export const RED = 0xb11212;
export const RED_DEEP = 0x5b0000;

export function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => material.dispose());
    }
  });
}

/**
 * Enjambre reactivo al cursor.
 *
 * Todo el movimiento vive en el vertex shader: orbita, respiracion y la
 * reaccion al mouse se calculan por particula en GPU. Los 560 puntos que
 * se movian con un for por frame pasaron a ser miles sin coste de CPU.
 */
function createParticleSwarm(compact) {
  const count = compact ? 6000 : 16000;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const speeds = new Float32Array(count);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    // Cascaron esferico achatado, mas denso hacia el centro
    const radius = 0.32 + Math.pow(Math.random(), 0.62) * 1.42;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const sinPhi = Math.sin(phi);

    positions[i * 3] = radius * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.66;
    positions[i * 3 + 2] = radius * sinPhi * Math.sin(theta);

    seeds[i] = Math.random() * Math.PI * 2;
    speeds[i] = 0.6 + Math.random() * 0.9;
    scales[i] = 0.55 + Math.pow(Math.random(), 2.2) * 1.9;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uReveal: { value: 1 },
      uPulse: { value: 0 },
      // Amplitud de la reaccion al puntero. En desktop es 1 apenas se mueve
      // el mouse; en tactil sube al apoyar y baja al soltar, si no el hueco
      // queda clavado donde estuvo el ultimo dedo.
      uPointerAmp: { value: 0 },
      uSize: { value: compact ? 4.2 : 5.4 },
      // Mismo tope que usa el renderer, para que el punto mida igual en px
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, compact ? 1 : 2) },
      uCold: { value: new THREE.Color(0x7a1414) },
      uHot: { value: new THREE.Color(0xff5a3c) },
    },
    vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uPulse;
      uniform float uPointerAmp;
      uniform float uSize;
      uniform float uPixelRatio;

      attribute float aSeed;
      attribute float aSpeed;
      attribute float aScale;

      varying float vGlow;

      void main() {
        vec3 p = position;

        // Orbita lenta alrededor del eje Y, cada particula a su ritmo
        float ang = uTime * aSpeed * 0.15 + aSeed;
        float c = cos(ang);
        float s = sin(ang);
        p.xz = mat2(c, -s, s, c) * p.xz;

        // Respiracion vertical desfasada
        p.y += sin(uTime * 0.5 + aSeed * 2.0) * 0.07;

        // Reaccion al cursor: aparta radialmente y enrosca en tangente.
        // La gaussiana da un radio de influencia suave, sin borde duro.
        // El radio y el empuje son deliberadamente cortos: con la campana
        // ancha de antes el hueco medía un tercio de pantalla y las
        // particulas desplazadas terminaban lejos del puntero, asi que el
        // efecto no se leia como "el cursor las aparta" sino como una marea
        // de fondo. Lo que hace legible la reaccion a traves del filtro no
        // es el desplazamiento sino el tamaño: mas luz por celda es lo unico
        // que el ASCII traduce. De ahi que el empuje sea chico y el
        // crecimiento del punto grande.
        vec2 d = p.xy - uMouse;
        float dist = length(d) + 0.0001;
        float influence = exp(-dist * dist * 5.0) * uPointerAmp;
        vec2 dir = d / dist;
        vec2 tangent = vec2(-dir.y, dir.x);
        p.xy += dir * influence * 0.42;
        p.xy += tangent * influence * 0.30;

        vGlow = influence;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * aScale * uPixelRatio * (1.0 + uPulse * 0.3 + influence * 3.4) * (3.4 / -mv.z);
      }
    `,
    fragmentShader: `
      uniform float uReveal;
      uniform vec3 uCold;
      uniform vec3 uHot;
      varying float vGlow;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.05, d);
        vec3 col = mix(uCold, uHot, clamp(vGlow * 1.7, 0.0, 1.0));
        gl_FragColor = vec4(col * (1.0 + vGlow * 3.4), alpha * uReveal);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  const mouseLocal = new THREE.Vector2(999, 999);

  return {
    object: points,
    animate: ({ time, pointer, pointerAmp = 0, reveal, pulse }) => {
      // `pointer` ya viene en coordenadas de mundo sobre el plano del
      // enjambre: solo queda pasarlo al espacio local del objeto, que esta
      // desplazado y escalado por el llamador.
      const scale = points.scale.x || 1;
      if (pointer) {
        mouseLocal.set(
          (pointer.x - points.position.x) / scale,
          (pointer.y - points.position.y) / scale,
        );
        material.uniforms.uMouse.value.copy(mouseLocal);
      }
      material.uniforms.uPointerAmp.value = pointerAmp;
      material.uniforms.uTime.value = time;
      material.uniforms.uReveal.value = reveal;
      material.uniforms.uPulse.value = pulse;
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

export function createSceneObject(sceneType, compact) {
  if (sceneType === "organic") return createOrganic();
  if (sceneType === "sculpture") return createLivingSculpture(compact);
  return createParticleSwarm(compact);
}
