import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import { AVATAR_MAX_SIDE, AVATAR_QUALITY, fitsAvatar, prepareAvatar } from "@/features/profile/utils/prepareAvatar";

jest.mock("expo-image-manipulator", () => ({
  ImageManipulator: { manipulate: jest.fn() },
  SaveFormat: { JPEG: "jpeg" },
}));

const saveAsync = jest.fn();
const resize = jest.fn();

beforeEach(() => {
  saveAsync.mockResolvedValue({ uri: "file:///reducida.jpg" });
  resize.mockReturnValue({ renderAsync: jest.fn().mockResolvedValue({ saveAsync }) });
  jest.mocked(ImageManipulator.manipulate).mockReturnValue({ resize } as never);
});

describe("fitsAvatar", () => {
  it("cabe si ningún lado pasa del máximo", () => {
    expect(fitsAvatar(AVATAR_MAX_SIDE, 800)).toBe(true);
    expect(fitsAvatar(AVATAR_MAX_SIDE + 1, 800)).toBe(false);
  });

  it("sin medidas no se sabe: no cabe, y se reduce", () => {
    expect(fitsAvatar(undefined, 800)).toBe(false);
    expect(fitsAvatar()).toBe(false);
  });
});

describe("prepareAvatar", () => {
  it("una foto que cabe se sube tal cual, con su nombre y su tipo", async () => {
    const file = await prepareAvatar({ uri: "file:///a.png", width: 600, height: 600, fileName: "a.png", mimeType: "image/png" });

    expect(file).toEqual({ uri: "file:///a.png", name: "a.png", type: "image/png" });
    expect(ImageManipulator.manipulate).not.toHaveBeenCalled();
  });

  it("una grande se reduce al lado máximo y se sube en JPEG", async () => {
    const file = await prepareAvatar({ uri: "file:///grande.heic", width: 4000, height: 4000, fileName: "IMG.HEIC" });

    expect(resize).toHaveBeenCalledWith({ width: AVATAR_MAX_SIDE });
    expect(saveAsync).toHaveBeenCalledWith({ compress: AVATAR_QUALITY, format: SaveFormat.JPEG });
    expect(file).toEqual({ uri: "file:///reducida.jpg", name: "avatar.jpg", type: "image/jpeg" });
  });

  it("si reducirla falla, la original: se sube más despacio, pero se sube", async () => {
    saveAsync.mockRejectedValue(new Error("sin memoria"));

    const file = await prepareAvatar({ uri: "file:///grande.jpg", width: 4000, height: 3000 });

    expect(file).toEqual({ uri: "file:///grande.jpg", name: "avatar.jpg", type: "image/jpeg" });
  });
});
