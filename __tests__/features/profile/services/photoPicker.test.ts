import * as ImagePicker from "expo-image-picker";

import { ExpoPhotoPicker } from "@/features/profile/services/photoPicker";

jest.mock("expo-image-picker", () => ({
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}));

const asset = { uri: "file:///foto.jpg", width: 900, height: 900, fileName: "foto.jpg", mimeType: "image/jpeg", type: "image" };
const picked = { canceled: false, assets: [asset] } as never;

describe("ExpoPhotoPicker", () => {
  beforeEach(() => {
    jest.mocked(ImagePicker.requestCameraPermissionsAsync).mockResolvedValue({ granted: true } as never);
    jest.mocked(ImagePicker.launchCameraAsync).mockResolvedValue(picked);
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue(picked);
  });

  it("la galería no pide permiso y abre cuadrada, solo imágenes", async () => {
    const result = await new ExpoPhotoPicker().pick("library");

    expect(ImagePicker.requestCameraPermissionsAsync).not.toHaveBeenCalled();
    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith(
      expect.objectContaining({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1] }),
    );
    expect(result).toEqual({
      status: "picked",
      photo: { uri: "file:///foto.jpg", width: 900, height: 900, fileName: "foto.jpg", mimeType: "image/jpeg" },
    });
  });

  it("la cámara pide permiso antes de abrirse", async () => {
    await new ExpoPhotoPicker().pick("camera");

    expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
    expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
  });

  it("sin permiso de la cámara, no se abre", async () => {
    jest.mocked(ImagePicker.requestCameraPermissionsAsync).mockResolvedValue({ granted: false } as never);

    expect(await new ExpoPhotoPicker().pick("camera")).toEqual({ status: "denied" });
    expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
  });

  it("si cierra el selector sin elegir, está cancelado", async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue({ canceled: true, assets: null } as never);

    expect(await new ExpoPhotoPicker().pick("library")).toEqual({ status: "cancelled" });
  });
});
