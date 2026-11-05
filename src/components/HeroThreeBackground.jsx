import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createAsciiPass } from "./AsciiPass";
import {
  ASCII_FLOOR,
  ASCII_GAIN,
  ASCII_LEVELS_COMPACT,
  RED_DEEP,
  createSceneObject,
  disposeObject,
} from "../fx/asciiScenes";

const STATIC_FRAME_TIME = 18;

export default function HeroThreeBackground({
  variant,
  staticMode = false,
  revealActive = true,
  instantReveal = false,
  paused = false,
}) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const contextLossTimerRef = useRef(null);
  const revealActiveRef = useRef(revealActive);
  // Ref y no dep: pausar no debe reconstruir la escena ni perder el contexto WebGL
  const pausedRef = useRef(paused);

  useEffect(() => {
    revealActiveRef.current = revealActive;
  }, [revealActive]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

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
    /**
     * `resize()` llama a setSize(..., false), que no toca el estilo. Sin un
     * tamaño en CSS el lienzo se mostraba a su tamaño en píxeles de
     * dispositivo: en una pantalla Retina (dpr 2) medía el doble del viewport
     * y el hero salía ampliado y recortado desde la esquina de arriba a la
     * izquierda, con la escultura corrida fuera de cuadro. Con dpr 1 no se
     * notaba, que es donde se calibró.
     */
    Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
    mount.appendChild(renderer.domElement);

    // Caida radial y no un rectangulo de color plano. Con el material basico
    // el plano tenia la misma luminancia en toda su superficie y cuatro
    // bordes duros: a ojo desnudo era un wash invisible, pero el pase ASCII
    // cuantiza por celda y dibujaba el rectangulo entero — una pared de
    // caracteres con esquinas rectas, encima de la barra y del titular.
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 4),
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(RED_DEEP) },
          uStrength: { value: 0.22 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uStrength;
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float falloff = pow(max(1.0 - d, 0.0), 2.2);
            gl_FragColor = vec4(uColor * uStrength * falloff, 1.0);
          }
        `,
        transparent: true,
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

    // Celda mas grande en mobile: menos caracteres, pero legibles
    const ascii = createAsciiPass(renderer, compact ? 9 : 11);
    const levels = (compact && ASCII_LEVELS_COMPACT[variant.scene]) || {
      gain: ASCII_GAIN[variant.scene] ?? 3.2,
      floor: ASCII_FLOOR[variant.scene] ?? 0.25,
    };
    ascii.setGain(levels.gain);
    ascii.setFloor(levels.floor);
    // Desktop: el titular vive en la columna izquierda, la barra en el 9% de
    // arriba. Mobile: todo el texto es de ancho completo y apilado, asi que
    // la columna deja de tener sentido y hay que bajar el corte de arriba
    // hasta pasar la linea de "3D / MOTION / BRANDING / WEB" y la de
    // disponibilidad, que en esa composicion caen mucho mas abajo.
    ascii.setMask(
      compact ? [0.02, 0.14] : [0.16, 0.56],
      compact ? [0.90, 0.70, 0.35] : [0.99, 0.86, 0.5],
    );
    // Handle de calibracion en dev: window.__ascii.ascii.setGain(2.5) etc.
    if (import.meta.env.DEV) window.__ascii = { ascii, renderer, scene, camera };

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    // Amplitud de la reaccion al puntero, amortiguada. Arranca en 0 —sin
    // esto el enjambre nacia con la mordida puesta en medio de la pantalla,
    // antes de que nadie tocara nada—. En desktop sube a 1 con el primer
    // movimiento y se queda; en tactil sube al apoyar y vuelve a 0 al
    // soltar, para que el hueco no quede clavado donde estuvo el dedo.
    let pointerAmp = 0;
    let pointerAmpTarget = 0;
    let rafId = 0;
    let destroyed = false;
    let start = null;
    let lastFrame = 0;
    let heroScroll = 0;
    let heroScrollTarget = 0;
    let heroVisible = true;
    // Tope de cuadros: 30 fps en compact y 60 en desktop (en monitores de
    // 120/144 Hz el pase ASCII corría al doble sin que se note). Los 2 ms de
    // margen evitan que el jitter de rAF saltee cuadros que sí tocan.
    const frameInterval = (compact ? 1000 / 30 : 1000 / 60) - 2;
    const REVEAL_MS = 1700;
    const BEAT_HZ = 145 / 60 / 4; // pulso a un cuarto de 145 BPM

    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

    // Cursor proyectado al plano z del objeto con la camara real. Antes se
    // estimaba con dos constantes (mouse.x * 5.8, mouse.y * 3.6) que son el
    // alto y el ancho visibles a esa distancia solo en 16:10; en cualquier
    // otra relacion de aspecto el punto de influencia caia corrido y el
    // enjambre reaccionaba a un palmo del puntero. Ademas la camara se
    // desplaza con el mouse, y eso tampoco entraba en la cuenta.
    const pointerRay = new THREE.Vector3();
    const pointerWorld = new THREE.Vector3();
    const projectPointer = (targetZ) => {
      // unproject lee matrixWorld, y el renderer recien la actualiza al
      // dibujar: sin esto el primer frame proyecta contra una camara en el
      // origen.
      camera.updateMatrixWorld();
      pointerRay.set(mouse.x * 2, mouse.y * 2, 0.5).unproject(camera).sub(camera.position);
      const t = (targetZ - camera.position.z) / pointerRay.z;
      return pointerWorld.copy(camera.position).addScaledVector(pointerRay, t);
    };

    const resize = () => {
      const width = Math.max(2, mount.clientWidth);
      const height = Math.max(2, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      ascii.setSize(width, height);
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
      pointerAmp += (pointerAmpTarget - pointerAmp) * (1 - Math.exp(-dt * 5));
      const pulse = Math.pow(Math.max(Math.sin(time * BEAT_HZ * Math.PI * 2), 0), 4);
      const active = pointerAmpTarget > 0 || pointerAmp > 0.002;
      const pointer = active ? projectPointer(sceneObject.object.position.z) : null;
      sceneObject.animate({ time, mouse, pointer, pointerAmp, reveal, scroll: heroScroll, pulse, dt });

      // Escena al target y despues el quad ASCII a pantalla. El reveal se
      // aplica en el pase y no en cada material, asi la entrada es una sola.
      renderer.setRenderTarget(ascii.target);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      ascii.setReveal(reveal);
      ascii.render();
    };

    let revealStart = null;

    const tick = (timestamp) => {
      if (destroyed) return;
      rafId = requestAnimationFrame(tick);
      // Fuera de viewport no gastamos GPU: el orbe solo vive en el hero
      if (!heroVisible) return;
      // En rutas de categoría el fondo queda congelado: cero GPU mientras se
      // scrollean decenas de videos, pero sin destruir el contexto WebGL
      if (pausedRef.current) return;
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

    const aim = (clientX, clientY) => {
      mouse.tx = clientX / window.innerWidth - 0.5;
      mouse.ty = -(clientY / window.innerHeight - 0.5);
    };

    const onPointerMove = (event) => {
      pointerAmpTarget = 1;
      aim(event.clientX, event.clientY);
    };

    // Tactil: el enjambre reacciona al dedo mientras esta apoyado. El
    // touchstart ademas saltea el amortiguado de posicion — al apoyar, el
    // hueco tiene que abrirse donde se toco y no venir viajando desde el
    // toque anterior. Los listeners son passive: no bloquean el scroll, y
    // arrastrar para scrollear tambien arrastra el enjambre.
    const onTouch = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      aim(touch.clientX, touch.clientY);
      if (event.type === "touchstart") {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      pointerAmpTarget = 1;
    };

    const onTouchEnd = () => {
      pointerAmpTarget = 0;
    };

    /**
     * Pausa el render cuando el hero sale de la pantalla. Antes lo decidía un
     * IntersectionObserver sobre el propio lienzo, que es `position: fixed`:
     * siempre "visible", así que la escena y el pase ASCII seguían a pleno
     * debajo de Destacados, Sobre mí y Contacto, que lo tapan al 95 %.
     */
    const syncVisible = () => {
      heroVisible = window.scrollY < window.innerHeight * 1.1;
    };

    const onScroll = () => {
      heroScrollTarget = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      syncVisible();
    };

    resize();
    if (staticMode) {
      render(STATIC_FRAME_TIME, 1);
    } else {
      rafId = requestAnimationFrame(tick);
      syncVisible();
      window.addEventListener("scroll", onScroll, { passive: true });
      if (compact) {
        window.addEventListener("touchstart", onTouch, { passive: true });
        window.addEventListener("touchmove", onTouch, { passive: true });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("touchcancel", onTouchEnd, { passive: true });
      } else {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
      }
    }
    window.addEventListener("resize", resize);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      disposeObject(scene);
      ascii.dispose();
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
