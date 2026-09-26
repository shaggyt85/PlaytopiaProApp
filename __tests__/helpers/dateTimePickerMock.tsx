import { Pressable } from "react-native";

/** Fecha que "elige" la rueda simulada al tocarla. */
export const PICKED_DATE = new Date(1990, 4, 3);

/**
 * Sustituto del selector nativo de fecha para jest, que no tiene parte nativa:
 *
 *   jest.mock("@react-native-community/datetimepicker", () =>
 *     jest.requireActual("<ruta>/helpers/dateTimePickerMock"),
 *   );
 *
 * En iOS pinta la "rueda" (etiqueta `rueda`): al tocarla elige `PICKED_DATE`.
 * En Android, `DateTimePickerAndroid.open` es un jest.fn para mirar lo que se
 * le pide al diálogo y llamar a sus callbacks.
 */
function DateTimePicker({ onValueChange }: { onValueChange: (event: unknown, date: Date) => void }) {
  return (
    <Pressable
      accessibilityRole="adjustable"
      accessibilityLabel="rueda"
      onPress={() => onValueChange({ nativeEvent: {} }, PICKED_DATE)}
    />
  );
}

export default DateTimePicker;
export const DateTimePickerAndroid = { open: jest.fn() };
