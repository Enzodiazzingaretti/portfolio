export function resolvePublicAsset(path) {
  if (!path || path.startsWith("data:") || path.startsWith("http")) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export function isVideoAsset(path) {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(path ?? "");
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
