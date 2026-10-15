import { AnimatedSplash, OtaProgressCard } from "./components";
import { useOtaUpdate } from "./hooks/useOtaUpdate";

interface SplashProps {
  /** Ya está pintado: es el momento de ocultar el splash nativo. */
  onReady?: () => void;
  onFinish: () => void;
}

/**
 * El splash al abrir la app. Si llega una actualización por OTA, no se va
 * hasta que termina de bajar (con la tarjeta y su progreso) y la app se
 * reinicia ya con la versión nueva; si no hay, o falla, se entra como siempre.
 */
export function Splash({ onReady, onFinish }: SplashProps) {
  const { holdSplash, progress } = useOtaUpdate();

  return (
    <AnimatedSplash hold={holdSplash} onReady={onReady} onFinish={onFinish}>
      {progress !== null ? <OtaProgressCard progress={progress} /> : null}
    </AnimatedSplash>
  );
}
