import type { ReactNode } from "react";
import { View } from "react-native";

import { FieldError } from "@/shared/components/FieldError";
import { Text } from "@/shared/components/Text";
import type { TextVariant } from "@/shared/config/theme";

import { useStyles } from "./FormField.styles";

interface FormFieldProps {
  /** Ya traducida. Sin ella, solo el campo y su error (la casilla de los términos). */
  label?: string;
  /** Lo marca con un asterisco rojo. */
  required?: boolean;
  /** La tipografía de la etiqueta (la fecha usa `emphasis`). */
  labelVariant?: TextVariant;
  /** Mensaje de error ya traducido; nada si no hay. */
  error?: string | null;
  children: ReactNode;
}

/**
 * Un campo de formulario: la etiqueta, el campo y su error debajo. Único sitio
 * que lo compone: lo usan el texto, el teléfono, la fecha, el género, la
 * categoría de edad y la casilla de los términos.
 */
export function FormField({ label, required = false, labelVariant = "body", error, children }: FormFieldProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      {label ? (
        <Text variant={labelVariant}>
          {label}
          {required ? <Text color="danger"> *</Text> : null}
        </Text>
      ) : null}
      {children}
      <FieldError message={error} />
    </View>
  );
}
