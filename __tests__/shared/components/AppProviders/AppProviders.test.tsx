import { useQueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { AppProviders } from "@/shared/components/AppProviders";
import { createQueryClient } from "@/shared/config/queryClient";
import { onSessionExpired } from "@/shared/services/httpClient";

jest.mock("@/shared/services/httpClient", () => ({
  onSessionExpired: jest.fn(),
}));
jest.mock("@/shared/config/queryManagers", () => ({
  setupQueryManagers: jest.fn(() => () => undefined),
}));

function MuestraCliente() {
  const client = useQueryClient();
  return <Text>{client ? "con cliente" : "sin cliente"}</Text>;
}

describe("AppProviders", () => {
  it("da acceso al QueryClient a toda la app", () => {
    render(
      <AppProviders client={createQueryClient()}>
        <MuestraCliente />
      </AppProviders>,
    );

    expect(screen.getByText("con cliente")).toBeTruthy();
  });

  it("cuando la sesión expira, vacía la caché", () => {
    const client = createQueryClient();
    client.setQueryData(["perfil"], { nombre: "Ana" });

    render(
      <AppProviders client={client}>
        <MuestraCliente />
      </AppProviders>,
    );
    const handler = jest.mocked(onSessionExpired).mock.calls.at(-1)?.[0];
    handler?.();

    expect(client.getQueryData(["perfil"])).toBeUndefined();
  });
});
