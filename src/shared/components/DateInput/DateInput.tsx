import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Modal, Platform, Pressable, View } from "react-native";

import { Button } from "@/shared/components/Button";
import { FormField } from "@/shared/components/FormField";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatNumericDate } from "@/shared/utils/formatDate";

import { useStyles } from "./DateInput.styles";

interface DateInputProps {
  label: string;
  /** Fecha de calendario "YYYY-MM-DD", o "" sin elegir. */
  value: string;
  onChange: (value: string) => void;
  /** Se llama al cerrar el selector, elija o no (el campo cuenta como tocado). */
  onBlur?: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  required?: boolean;
  /** Mensaje de error ya traducido. */
  error?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

// La fecha viaja como texto de calendario y el selector trabaja con Date en la
// hora local: se convierte por sus partes para que ningún huso mueva el día.
const toDate = (value: string, fallback: Date): Date => {
  if (!value) return fallback;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * Campo de fecha con el selector nativo del sistema: en Android su diálogo de
 * calendario y en iOS la rueda, en una hoja con Cancelar y Aceptar.
 */
export function DateInput({
  label,
  value,
  onChange,
  onBlur,
  minimumDate,
  maximumDate,
  required = false,
  error,
}: DateInputProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const [draft, setDraft] = useState<Date | null>(null);
  const initial = toDate(value, maximumDate ?? new Date());

  const open = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: initial,
        mode: "date",
        minimumDate,
        maximumDate,
        onValueChange: (_, date) => {
          onChange(toValue(date));
          onBlur?.();
        },
        onDismiss: () => onBlur?.(),
      });
      return;
    }
    setDraft(initial);
  };

  const closeIos = (accept: boolean) => {
    if (accept && draft) onChange(toValue(draft));
    setDraft(null);
    onBlur?.();
  };

  return (
    <FormField label={label} labelVariant="emphasis" required={required} error={error}>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: value ? formatNumericDate(value) : undefined }}
        style={[styles.field, error ? styles.fieldError : null]}
        testID="date-input-field"
      >
        <Text color={value ? "text" : "option"} style={styles.value}>
          {value ? formatNumericDate(value) : t("datePicker.placeholder")}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={theme.colors.option} />
      </Pressable>

      {/* `Modal` y no `BottomSheet`: el campo va dentro de un formulario con
          scroll, y la hoja tiene que tapar la pantalla entera; un `BottomSheet`
          se pinta dentro de su contenedor y se montaría en mitad del formulario. */}
      {Platform.OS === "ios" ? (
        <Modal visible={draft !== null} transparent animationType="slide" onRequestClose={() => closeIos(false)}>
          <View style={styles.backdrop}>
            <View style={styles.sheet}>
              {draft ? (
                <DateTimePicker
                  value={draft}
                  mode="date"
                  display="spinner"
                  themeVariant="dark"
                  locale={locale}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  onValueChange={(_, date) => setDraft(date)}
                  style={styles.picker}
                  testID="date-input-picker"
                />
              ) : null}
              <View style={styles.actions}>
                <View style={styles.action}>
                  <Button title={t("common.cancel")} variant="secondary" onPress={() => closeIos(false)} />
                </View>
                <View style={styles.action}>
                  <Button title={t("common.accept")} onPress={() => closeIos(true)} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </FormField>
  );
}
