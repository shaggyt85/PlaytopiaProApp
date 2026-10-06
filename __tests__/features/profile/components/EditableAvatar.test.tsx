import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { Alert, type AlertButton } from "react-native";

import { EditableAvatar } from "@/features/profile/components/EditableAvatar";
import { avatarService } from "@/features/profile/services/avatarService";
import { photoPicker } from "@/features/profile/services/photoPicker";

import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { signInTeacher } from "../../../helpers/scheduleMocks";

jest.mock("expo-image", () => ({ Image: () => null }));
jest.mock("@/features/profile/services/photoPicker", () => ({ photoPicker: { pick: jest.fn() } }));
jest.mock("@/features/profile/services/avatarService", () => ({
  ...jest.requireActual("@/features/profile/services/avatarService"),
  avatarService: { upload: jest.fn() },
}));
jest.mock("@/features/profile/utils/prepareAvatar", () => ({
  prepareAvatar: jest.fn(async ({ uri }: { uri: string }) => ({ uri, name: "avatar.jpg", type: "image/jpeg" })),
}));

describe("EditableAvatar", () => {
  beforeEach(() => {
    signInTeacher();
    jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
  });

  it("la foto se toca para cambiarla", () => {
    renderWithProviders(<EditableAvatar url="https://cdn/foto.jpg" />);

    fireEvent.press(screen.getByRole("button", { name: "Cambiar foto" }));

    expect(Alert.alert).toHaveBeenCalledWith("Cambiar foto", undefined, expect.any(Array));
  });

  it("mientras sube: el indicador encima y la foto ocupada, sin poder tocarla", async () => {
    jest.mocked(photoPicker.pick).mockResolvedValue({ status: "picked", photo: { uri: "file:///f.jpg" } });
    jest.mocked(avatarService.upload).mockReturnValue(new Promise(() => undefined));
    renderWithProviders(<EditableAvatar url="https://cdn/foto.jpg" />);

    fireEvent.press(screen.getByRole("button", { name: "Cambiar foto" }));
    const buttons = jest.mocked(Alert.alert).mock.calls[0][2] as AlertButton[];
    await act(async () => buttons.find((b) => b.text === "Elegir de la galería")?.onPress?.());

    await waitFor(() => expect(screen.getByTestId("avatar-uploading")).toBeTruthy());
    expect(screen.getByRole("button", { name: "Cambiar foto" })).toBeDisabled();
  });
});
