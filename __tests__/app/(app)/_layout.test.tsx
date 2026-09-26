import { QueryClientProvider } from "@tanstack/react-query";
import { renderRouter, screen } from "expo-router/testing-library";
import type { ReactNode } from "react";
import { Text } from "react-native";

import AppLayout from "@/app/(app)/_layout";
import { biometricService } from "@/features/auth/services/biometricService";
import { useBiometricOfferStore } from "@/features/auth/store/biometricOfferStore";
import { createQueryClient } from "@/shared/config/queryClient";

jest.mock("@/features/auth/services/biometricService", () => ({
  biometricService: {
    isAvailable: jest.fn(),
    savedEmail: jest.fn(),
    enable: jest.fn(),
    unlock: jest.fn(),
    disable: jest.fn(),
  },
}));

// En la app lo pone AppProviders, en el layout raíz.
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

const routes = {
  _layout: AppLayout,
  index: () => <Text>Pantalla de inicio</Text>,
};

describe("layout con sesión", () => {
  beforeEach(() => {
    useBiometricOfferStore.getState().clear();
    jest.mocked(biometricService.isAvailable).mockResolvedValue(true);
    jest.mocked(biometricService.savedEmail).mockResolvedValue(null);
  });

  it("pinta la pantalla sin panel si no hay oferta de biometría", () => {
    renderRouter(routes, { initialUrl: "/", wrapper });

    expect(screen.getByText("Pantalla de inicio")).toBeTruthy();
    expect(screen.queryByText("Activa el acceso con biometría")).toBeNull();
  });

  it("tras entrar con contraseña muestra la oferta encima de la pantalla", async () => {
    useBiometricOfferStore.getState().setOffer("ana@club.com", 42);
    renderRouter(routes, { initialUrl: "/", wrapper });

    expect(await screen.findByText("Activa el acceso con biometría")).toBeTruthy();
  });
});
