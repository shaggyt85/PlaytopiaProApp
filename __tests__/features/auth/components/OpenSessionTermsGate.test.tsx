import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { OpenSessionTermsGate } from "@/features/auth/components/OpenSessionTermsGate";
import { TERMS_VERSION } from "@/features/auth/config/terms";
import { session } from "@/shared/services/session";
import { teacherProfileService } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { teacherProfile } from "../../../helpers/authFactories";
import { renderWithProviders } from "../../../helpers/renderWithProviders";

jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
}));
jest.mock("@/shared/services/session", () => ({ session: { end: jest.fn() } }));

const TITLE = "Términos y Condiciones";

describe("OpenSessionTermsGate", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("con los términos al día no molesta", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
    renderWithProviders(<OpenSessionTermsGate />);

    await waitFor(() => expect(teacherProfileService.get).toHaveBeenCalledWith(42));
    expect(screen.queryByText(TITLE)).toBeNull();
  });

  it("si cambiaron con la sesión abierta, los pide; al aceptarlos quedan al día", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile("2020-01-01"));
    jest.mocked(teacherProfileService.update).mockResolvedValue(teacherProfile());
    renderWithProviders(<OpenSessionTermsGate />);

    await screen.findByText(TITLE);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Aceptar" }));
    });

    expect(teacherProfileService.update).toHaveBeenCalledWith(42, { terms_version: TERMS_VERSION });
    await waitFor(() => expect(screen.queryByText(TITLE)).toBeNull());
    expect(session.end).not.toHaveBeenCalled();
  });

  it("si los cierra sin aceptar, cierra la sesión", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile(null));
    renderWithProviders(<OpenSessionTermsGate />);

    await screen.findByText(TITLE);
    fireEvent.press(screen.getAllByRole("button", { name: "Cerrar" })[0]);

    expect(session.end).toHaveBeenCalledTimes(1);
  });

  it("si no puede leer el perfil, no molesta al profesor", async () => {
    jest.mocked(teacherProfileService.get).mockRejectedValue(new Error("sin red"));
    renderWithProviders(<OpenSessionTermsGate />);

    await waitFor(() => expect(teacherProfileService.get).toHaveBeenCalled());
    expect(screen.queryByText(TITLE)).toBeNull();
  });
});
