import { useCallback, useState } from "react";

/**
 * «Tirar para refrescar»: `refreshing` queda encendido mientras dura la
 * promesa de `refresh`, y solo por ese gesto (una recarga de fondo no enseña
 * el spinner). Si falla, se apaga igual; el error lo lleva la query.
 */
export function useRefreshing(refresh: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } catch {
      // El fallo ya queda en la query; aquí solo se apaga el spinner.
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  return { refreshing, onRefresh };
}
