import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";

import { queryClient as appQueryClient } from "@/shared/config/queryClient";
import { setupQueryManagers } from "@/shared/config/queryManagers";
import { onSessionExpired } from "@/shared/services/httpClient";

interface AppProvidersProps {
  children: ReactNode;
  /** Los tests pasan un QueryClient limpio; la app usa el suyo. */
  client?: QueryClient;
}

/**
 * Único sitio donde se componen los providers de la app (tema, sesión… se
 * añaden aquí), así el layout raíz no crece con cada uno.
 */
export function AppProviders({ children, client = appQueryClient }: AppProvidersProps) {
  useEffect(() => setupQueryManagers(), []);

  // Cuando Core da la sesión por muerta, fuera los datos del profesor de la
  // memoria. La vuelta al login se engancha con los guards de navegación.
  useEffect(() => {
    onSessionExpired(() => client.clear());
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
