export function resolvePublicAsset(path) {
  if (!path || path.startsWith("data:") || path.startsWith("http")) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export function isVideoAsset(path) {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(path ?? "");
}

/** Las imágenes .png/.jpg de obra tienen su .webp al lado (salvo los posters de /images/loops/). */
export function isConvertible(src) {
  return /\.(png|jpe?g)(\?.*)?$/i.test(src ?? "");
}

export function toWebpSrc(src) {
  // encodeURI: srcset trata el espacio como separador URL/descriptor,
  // sin escapar rompe rutas como "logo_chica_lunar (3).webp"
  return encodeURI(src.replace(/\.(png|jpe?g)(\?.*)?$/i, ".webp"));
}

export function getStoredLanguage() {
  try {
    return window.localStorage.getItem("kexxy-language");
  } catch {
    return null;
  }
}

export function setStoredLanguage(language) {
  try {
    window.localStorage.setItem("kexxy-language", language);
  } catch {
    return undefined;
  }
}
