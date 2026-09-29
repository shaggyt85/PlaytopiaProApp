import { useEffect, useRef } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * El lector de pantalla dice `message` cada vez que cambia (no al montar): al
 * pulsar una flecha, el profesor oye a qué día ha pasado. Con un anuncio y no
 * con una región viva, porque la línea de la barra lleva la hora y se leería
 * cada minuto.
 */
export function useAnnounceOnChange(message: string): void {
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    AccessibilityInfo.announceForAccessibility(message);
  }, [message]);
}
