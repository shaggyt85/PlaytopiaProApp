import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Alert, Linking, type AlertButton } from "react-native";

import { useChangeAvatar } from "@/features/profile/hooks/useChangeAvatar";
import { avatarService } from "@/features/profile/services/avatarService";
import type { IPhotoPicker } from "@/features/profile/services/photoPicker";
import { createQueryClient } from "@/shared/config/queryClient";
import { HttpError } from "@/shared/services/HttpError";
import { teacherKeys } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { teacherProfile } from "../../../helpers/profileFactories";

jest.mock("@/features/profile/services/avatarService", () => ({
  ...jest.requireActual("@/features/profile/services/avatarService"),
  avatarService: { upload: jest.fn() },
}));
jest.mock("@/features/profile/utils/prepareAvatar", () => ({
  prepareAvatar: jest.fn(async ({ uri }: { uri: string }) => ({ uri, name: "avatar.jpg", type: "image/jpeg" })),
}));

const photo = { uri: "file:///foto.jpg", width: 900, height: 900 };

/** Pulsa un botón del último `Alert`. */
const pressAlertButton = async (text: string) => {
  const buttons = jest.mocked(Alert.alert).mock.calls.at(-1)?.[2] as AlertButton[];
  await act(async () => buttons.find((button) => button.text === text)?.onPress?.());
};

function setup(pick: IPhotoPicker["pick"]) {
  const client = createQueryClient();
  client.setQueryData(teacherKeys.profile(42, "es"), teacherProfile());
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const picker = { pick: jest.fn(pick) };
  return { client, picker, ...renderHook(() => useChangeAvatar(picker), { wrapper }) };
}

describe("useChangeAvatar", () => {
  beforeEach(() => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
    jest.mocked(avatarService.upload).mockResolvedValue("https://cdn/nueva.jpg");
  });

  it("ofrece hacer una foto o elegirla de la galería", () => {
    const { result } = setup(async () => ({ status: "cancelled" }));

    act(() => result.current.change());

    const buttons = jest.mocked(Alert.alert).mock.calls[0][2] as AlertButton[];
    expect(jest.mocked(Alert.alert).mock.calls[0][0]).toBe("Cambiar foto");
    expect(buttons.map((button) => button.text)).toEqual(["Cancelar", "Hacer una foto", "Elegir de la galería"]);
  });

  it("la foto elegida se sube y queda en el perfil", async () => {
    const { result, client, picker } = setup(async () => ({ status: "picked", photo }));

    act(() => result.current.change());
    await pressAlertButton("Elegir de la galería");

    expect(picker.pick).toHaveBeenCalledWith("library");
    await waitFor(() =>
      expect(client.getQueryData(teacherKeys.profile(42, "es"))).toMatchObject({ avatar: "https://cdn/nueva.jpg" }),
    );
    expect(avatarService.upload).toHaveBeenCalledWith({ uri: photo.uri, name: "avatar.jpg", type: "image/jpeg" });
  });

  it("si cierra el selector sin elegir, no sube nada", async () => {
    const { result } = setup(async () => ({ status: "cancelled" }));

    act(() => result.current.change());
    await pressAlertButton("Hacer una foto");

    expect(avatarService.upload).not.toHaveBeenCalled();
  });

  it("sin permiso de la cámara, ofrece abrir los ajustes", async () => {
    const openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue(undefined);
    const { result } = setup(async () => ({ status: "denied" }));

    act(() => result.current.change());
    await pressAlertButton("Hacer una foto");

    expect(jest.mocked(Alert.alert).mock.calls.at(-1)?.[0]).toBe("Sin acceso a la cámara");
    await pressAlertButton("Abrir ajustes");
    expect(openSettings).toHaveBeenCalled();
    expect(avatarService.upload).not.toHaveBeenCalled();
  });

  it("si Core no la acepta, el error sale traducido en un Alert", async () => {
    const error = HttpError.fromResponse(413, {
      type: "urn:playtopia:problem:payload-too-large",
      title: "Payload Too Large",
      status: 413,
    });
    jest.mocked(avatarService.upload).mockRejectedValue(error);
    const { result } = setup(async () => ({ status: "picked", photo }));

    act(() => result.current.change());
    await pressAlertButton("Elegir de la galería");

    await waitFor(() => expect(Alert.alert).toHaveBeenLastCalledWith(getErrorMessage(error)));
  });

  it("mientras sube, lo dice", async () => {
    let finish!: (url: string) => void;
    jest.mocked(avatarService.upload).mockReturnValue(new Promise((resolve) => (finish = resolve)));
    const { result } = setup(async () => ({ status: "picked", photo }));

    act(() => result.current.change());
    await pressAlertButton("Elegir de la galería");

    await waitFor(() => expect(result.current.uploading).toBe(true));
    await act(async () => finish("https://cdn/nueva.jpg"));
    await waitFor(() => expect(result.current.uploading).toBe(false));
  });
});
