import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react-native";
import type { ReactElement } from "react";

import { createQueryClient } from "@/shared/config/queryClient";

/** Renderiza con un QueryClient limpio por test (sin caché compartida). */
export function renderWithProviders(ui: ReactElement) {
  const client = createQueryClient();
  return {
    client,
    ...render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>),
  };
}
