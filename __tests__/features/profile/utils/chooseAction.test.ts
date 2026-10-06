import { Alert, type AlertButton } from "react-native";

import { chooseAction } from "@/features/profile/utils/chooseAction";
import { t } from "@/shared/config/i18n";

const buttons = () => jest.mocked(Alert.alert).mock.calls.at(-1)?.[2] as AlertButton[];

describe("chooseAction", () => {
  beforeEach(() => jest.spyOn(Alert, "alert").mockImplementation(() => undefined));

  it("«Cancelar» primero y luego sus opciones, en su orden", () => {
    chooseAction({ title: "Cambiar foto", actions: [{ text: "Cámara", onPress: jest.fn() }, { text: "Galería", onPress: jest.fn() }] }, t);

    expect(Alert.alert).toHaveBeenCalledWith("Cambiar foto", undefined, expect.any(Array));
    expect(buttons().map(({ text, style }) => [text, style])).toEqual([
      ["Cancelar", "cancel"],
      ["Cámara", "default"],
      ["Galería", "default"],
    ]);
  });

  it("cada opción hace lo suyo; la destructiva va en rojo", () => {
    const onPress = jest.fn();
    chooseAction({ title: "¿Borrar?", actions: [{ text: "Borrar", onPress, destructive: true }] }, t);

    expect(buttons()[1].style).toBe("destructive");
    buttons()[1].onPress?.();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
