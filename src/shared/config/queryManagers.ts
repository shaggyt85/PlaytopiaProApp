import { focusManager, onlineManager } from "@tanstack/react-query";
import { addNetworkStateListener } from "expo-network";
import { AppState, type AppStateStatus } from "react-native";

/**
 * Enseña a TanStack Query cuándo la app vuelve a primer plano y cuándo hay
 * red, para que las políticas con refetchOnWindowFocus / refetchOnReconnect
 * funcionen en móvil. Devuelve la función que deshace las suscripciones.
 */
export function setupQueryManagers(): () => void {
  const appStateSubscription = AppState.addEventListener(
    "change",
    (status: AppStateStatus) => focusManager.setFocused(status === "active"),
  );

  // `isConnected` y no `isInternetReachable`: este último da falsos "sin
  // internet". Si no se sabe (undefined), se asume que hay red.
  onlineManager.setEventListener((setOnline) => {
    const networkSubscription = addNetworkStateListener((state) =>
      setOnline(state.isConnected !== false),
    );
    return () => networkSubscription.remove();
  });

  return () => {
    appStateSubscription.remove();
    onlineManager.setEventListener(() => undefined);
  };
}
