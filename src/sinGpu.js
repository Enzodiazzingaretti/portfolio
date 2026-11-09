/**
 * ¿El navegador dibuja por software? (SwiftShader, llvmpipe… : sin placa de
 * video, o con la GPU bloqueada). Ahí cada cuadro animado tarda cientos de
 * ms y la página entera se traba; también les pasa a las máquinas de
 * Lighthouse y PageSpeed, que medían 33 de rendimiento por esto (2026-11-08).
 * En ese caso el sitio va quieto: videos en póster, animaciones resueltas,
 * sin desenfoques ni scroll suave (`html.sin-gpu`). Se mide una sola vez.
 */
let cache;

export function sinGpu() {
  if (cache !== undefined) return cache;
  cache = false;
  if (typeof document === "undefined") return cache;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      cache = true;
      return cache;
    }
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const nombre = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    cache = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(nombre);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cache = false;
  }
  return cache;
}
