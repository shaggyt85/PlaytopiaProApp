import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * ¿Tiene el usuario activado «reducir movimiento» en el sistema? Se actualiza
 * si lo cambia con la app abierta. Mientras no se sabe, se asume que no.
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => mounted && setReduceMotion(enabled))
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}
