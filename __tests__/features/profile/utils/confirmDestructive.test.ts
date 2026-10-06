import { Alert, type AlertButton } from "react-native";

import { confirmDestructive } from "@/features/profile/utils/confirmDestructive";
import { t } from "@/shared/config/i18n";

const buttons = () => jest.mocked(Alert.alert).mock.calls.at(-1)?.[2] as AlertButton[];

describe("confirmDestructive", () => {
  beforeEach(() => jest.spyOn(Alert, "alert").mockImplementation(() => undefined));

  it("pregunta con «Cancelar» y el botón rojo", () => {
    confirmDestructive({ title: "¿Borrar?", message: "Sin vuelta", confirm: "Borrar", onConfirm: jest.fn() }, t);

    expect(Alert.alert).toHaveBeenCalledWith("¿Borrar?", "Sin vuelta", expect.any(Array));
    expect(buttons().map(({ text, style }) => [text, style])).toEqual([
      ["Cancelar", "cancel"],
      ["Borrar", "destructive"],
    ]);
  });

  it("solo el botón rojo hace algo", () => {
    const onConfirm = jest.fn();
    confirmDestructive({ title: "¿Borrar?", confirm: "Borrar", onConfirm }, t);

    buttons()[0].onPress?.();
    expect(onConfirm).not.toHaveBeenCalled();
    buttons()[1].onPress?.();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
