import { Image } from "expo-image";

import { preloadBrandAssets } from "@/shared/config/assets";

jest.mock("expo-asset", () => ({
  Asset: { fromModule: () => ({ uri: "http://metro.local/assets/logoWhite.png" }) },
}));
jest.mock("expo-image", () => ({ Image: { prefetch: jest.fn().mockResolvedValue(true) } }));

describe("preloadBrandAssets", () => {
  it("deja el logo en la caché en memoria de expo-image, con la misma URI que usará la imagen", async () => {
    await preloadBrandAssets();

    expect(Image.prefetch).toHaveBeenCalledWith(
      ["http://metro.local/assets/logoWhite.png"],
      "memory-disk",
    );
  });
});
