import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderRouter, screen } from "expo-router/testing-library";
import type { ReactNode } from "react";
import { Text } from "react-native";

import AppLayout from "@/app/(app)/_layout";
import { biometricService } from "@/features/auth/services/biometricService";
import { useBiometricOfferStore } from "@/features/auth/store/biometricOfferStore";
import { createQueryClient } from "@/shared/config/queryClient";
import { teacherProfileService } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { teacherProfile } from "../../helpers/authFactories";

jest.mock("@/features/auth/services/biometricService", () => ({
  biometricService: require("../../helpers/biometricServiceMock").createBiometricServiceMock(),
}));
jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
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
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    useBiometricOfferStore.getState().clear();
    jest.mocked(biometricService.isAvailable).mockResolvedValue(true);
    jest.mocked(biometricService.savedEmail).mockResolvedValue(null);
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
  });

  it("pinta la pantalla sin panel si no hay oferta de biometría", async () => {
    renderRouter(routes, { initialUrl: "/", wrapper });
    // Deja resolver la lectura de la biometría (renderRouter usa timers falsos).
    await act(async () => {});

    expect(screen.getByText("Pantalla de inicio")).toBeTruthy();
    expect(screen.queryByText("Activa el acceso con biometría")).toBeNull();
  });

  it("tras entrar con contraseña muestra la oferta encima de la pantalla", async () => {
    useBiometricOfferStore.getState().setOffer("ana@club.com", 42);
    renderRouter(routes, { initialUrl: "/", wrapper });

    expect(await screen.findByText("Activa el acceso con biometría")).toBeTruthy();
  });

  it("si los términos cambiaron con la sesión abierta, los pide encima de la pantalla", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile("2020-01-01"));
    renderRouter(routes, { initialUrl: "/", wrapper });

    expect(await screen.findByText("Términos y Condiciones")).toBeTruthy();
    expect(screen.getByText("Pantalla de inicio")).toBeTruthy();
  });
});
