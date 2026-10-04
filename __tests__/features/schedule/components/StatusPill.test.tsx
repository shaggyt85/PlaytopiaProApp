import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { StatusPill } from "@/features/schedule/components/StatusPill";
import { darkTheme } from "@/shared/config/theme";

const styleOf = () => StyleSheet.flatten(screen.getByTestId("pill").props.style);

describe("StatusPill", () => {
  it("«EN VIVO»: sobre coral", () => {
    render(<StatusPill variant="live" testID="pill" />);

    expect(screen.getByText("En vivo")).toBeTruthy();
    expect(styleOf().backgroundColor).toBe(darkTheme.accents.coral.color);
  });

  it("«PRÓXIMA»: sobre la tarjeta oscurecida y con borde claro", () => {
    render(<StatusPill variant="next" testID="pill" />);

    expect(screen.getByText("Próxima")).toBeTruthy();
    expect(styleOf()).toMatchObject({ borderWidth: 1, borderColor: darkTheme.colors.hairlineStrong });
  });

  it("no se encoge junto a un título largo", () => {
    render(<StatusPill variant="live" testID="pill" />);

    expect(styleOf().flexShrink).toBe(0);
  });
});
