import { Alert, Linking } from "react-native";

import { t } from "@/shared/config/i18n";
import { openExternalUrl } from "@/shared/utils/openExternalUrl";

describe("openExternalUrl", () => {
  beforeEach(() => jest.spyOn(Alert, "alert").mockImplementation(() => undefined));
  afterEach(() => jest.restoreAllMocks());

  it("abre el enlace fuera de la app", async () => {
    const open = jest.spyOn(Linking, "openURL").mockResolvedValue(true);

    await expect(openExternalUrl("https://apps.apple.com/pro", t)).resolves.toBe(true);

    expect(open).toHaveBeenCalledWith("https://apps.apple.com/pro");
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it("si el sistema no puede, lo dice", async () => {
    jest.spyOn(Linking, "openURL").mockRejectedValue(new Error("no"));

    await expect(openExternalUrl("https://x", t)).resolves.toBe(false);

    expect(Alert.alert).toHaveBeenCalledWith("Error al abrir el enlace. Inténtalo de nuevo.");
  });
});
