import { useEffect, useSyncExternalStore } from "react";
import { loopAudio } from "../audio/loopAudio";

/** Estado de la pista compartida: `{ armado, sonando }`. */
export function useLoopAudio() {
  const estado = useSyncExternalStore(
    loopAudio.subscribe,
    loopAudio.getSnapshot,
    loopAudio.getServerSnapshot,
  );

  // Recupera el armado de la sesión al montar el primer consumidor, para que
  // ir del home a /motion no vuelva a pedir el click.
  useEffect(() => {
    loopAudio.hidratar();
  }, []);

  return estado;
}
