import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Platform } from "react-native";

import { DateInput } from "@/shared/components/DateInput";
import { darkTheme } from "@/shared/config/theme";

jest.mock("@react-native-community/datetimepicker", () =>
  jest.requireActual("../../../helpers/dateTimePickerMock"),
);

const renderDate = (props: Partial<Parameters<typeof DateInput>[0]> = {}) =>
  render(<DateInput label="Fecha de nacimiento" value="" onChange={jest.fn()} {...props} />);

describe("DateInput", () => {
  it("sin fecha muestra el formato esperado en el idioma", () => {
    renderDate();

    expect(screen.getByText("DD/MM/AAAA")).toBeTruthy();
  });

  it("con fecha la muestra en cifras según el idioma", () => {
    renderDate({ value: "1990-05-03" });

    expect(screen.getByText("03/05/1990")).toBeTruthy();
  });

  it("obligatorio lleva el asterisco", () => {
    renderDate({ required: true });

    expect(screen.getByText(" *")).toBeTruthy();
  });

  it("con error lo muestra y marca el borde en rojo", () => {
    renderDate({ error: "Indica tu fecha de nacimiento" });

    expect(screen.getByText("Indica tu fecha de nacimiento")).toBeTruthy();
    expect(screen.getByTestId("date-input-field")).toHaveStyle({
      borderColor: darkTheme.colors.danger,
    });
  });

  describe("iOS", () => {
    it("Aceptar guarda la fecha elegida como YYYY-MM-DD y marca el campo tocado", () => {
      const onChange = jest.fn();
      const onBlur = jest.fn();
      renderDate({ onChange, onBlur });

      fireEvent.press(screen.getByRole("button", { name: "Fecha de nacimiento" }));
      fireEvent.press(screen.getByLabelText("rueda"));
      fireEvent.press(screen.getByRole("button", { name: "Aceptar" }));

      expect(onChange).toHaveBeenCalledWith("1990-05-03");
      expect(onBlur).toHaveBeenCalled();
      expect(screen.queryByLabelText("rueda")).toBeNull();
    });

    it("Cancelar no cambia la fecha pero el campo cuenta como tocado", () => {
      const onChange = jest.fn();
      const onBlur = jest.fn();
      renderDate({ onChange, onBlur });

      fireEvent.press(screen.getByRole("button", { name: "Fecha de nacimiento" }));
      fireEvent.press(screen.getByLabelText("rueda"));
      fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));

      expect(onChange).not.toHaveBeenCalled();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe("Android", () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, "OS", "android");
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("abre el diálogo del sistema desde la fecha actual del campo y sus límites", () => {
      const maximumDate = new Date(2026, 8, 26);
      renderDate({ value: "1990-05-03", maximumDate });

      fireEvent.press(screen.getByRole("button", { name: "Fecha de nacimiento" }));

      expect(DateTimePickerAndroid.open).toHaveBeenCalledWith(
        expect.objectContaining({ value: new Date(1990, 4, 3), mode: "date", maximumDate }),
      );
    });

    it("al elegir en el diálogo guarda la fecha; al descartarlo no", () => {
      const onChange = jest.fn();
      const onBlur = jest.fn();
      renderDate({ onChange, onBlur });

      fireEvent.press(screen.getByRole("button", { name: "Fecha de nacimiento" }));
      const dialog = jest.mocked(DateTimePickerAndroid.open).mock.calls[0][0];

      dialog.onDismiss?.();
      expect(onChange).not.toHaveBeenCalled();

      dialog.onValueChange?.({ nativeEvent: { timestamp: 0, utcOffset: 0 } }, new Date(1985, 11, 31));
      expect(onChange).toHaveBeenCalledWith("1985-12-31");
      expect(onBlur).toHaveBeenCalledTimes(2);
    });
  });
});
