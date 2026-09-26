import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { FieldError } from "@/shared/components/FieldError";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { callingCodeOf, countryByCode, flagEmoji } from "./countries";
import { CountryPickerModal } from "./CountryPickerModal";
import { useStyles } from "./PhoneInput.styles";

interface PhoneInputProps {
  /** Código ISO del país elegido ("ES"). */
  country: string;
  onCountryChange: (cca2: string) => void;
  /** El número sin prefijo. */
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  /** Mensaje de error ya traducido. */
  error?: string;
}

/**
 * Teléfono con selector de país, como en la app de alumnos: el botón muestra
 * bandera y prefijo y abre la lista; el campo recoge el número sin prefijo.
 */
export function PhoneInput({
  country,
  onCountryChange,
  value,
  onChangeText,
  onBlur,
  error,
}: PhoneInputProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const label = t("phone.label");
  const countryName = countryByCode(country)?.names[locale] ?? country;

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => setPickerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`${countryName} +${callingCodeOf(country)}`}
          style={[styles.country, error ? styles.fieldError : null]}
        >
          <Text style={styles.flag}>{flagEmoji(country)}</Text>
          <Text color="primary" style={styles.code}>
            +{callingCodeOf(country)}
          </Text>
        </Pressable>
        <TextInput
          accessibilityLabel={label}
          placeholder={t("phone.placeholder")}
          placeholderTextColor={theme.colors.textSecondary}
          selectionColor={theme.colors.primary}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          autoCorrect={false}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          style={[styles.input, error ? styles.fieldError : null]}
          testID="phone-input-field"
        />
      </View>
      <FieldError message={error} />

      <CountryPickerModal
        visible={pickerOpen}
        selected={country}
        onSelect={(cca2) => {
          onCountryChange(cca2);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}
