import { fireEvent, render, screen } from "@testing-library/react-native";
import { Linking } from "react-native";

import { ForceUpdateScreen } from "@/features/app-update/components/ForceUpdateScreen";

jest.mock("@/shared/config/appVersion", () => ({ APP_VERSION: "1.0.0" }));

describe("ForceUpdateScreen", () => {
  afterEach(() => jest.restoreAllMocks());

  it("dice que esta versión ya no vale y lleva a la tienda", () => {
    const open = jest.spyOn(Linking, "openURL").mockResolvedValue(true);
    render(<ForceUpdateScreen storeUrl="https://apps.apple.com/pro" />);

    expect(screen.getByRole("header", { name: "Actualiza Playtopia Pro" })).toBeTruthy();
    expect(screen.getByText("v1.0.0")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Actualizar ahora" }));

    expect(open).toHaveBeenCalledWith("https://apps.apple.com/pro");
  });

  it("sin URL de la tienda, dice dónde actualizarla y no hay botón", () => {
    render(<ForceUpdateScreen storeUrl={null} />);

    expect(screen.getByText("Actualízala desde App Store o Google Play.")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
