import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable } from "react-native";

import { Input, type InputProps } from "@/shared/components/Input";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./PasswordInput.styles";

type PasswordInputProps = Omit<InputProps, "secureTextEntry" | "rightAccessory">;

/** Campo de contraseña con botón para mostrarla u ocultarla. */
export function PasswordInput(props: PasswordInputProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const label = visible ? t("auth.password.hide") : t("auth.password.show");

  return (
    <Input
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      autoComplete="password"
      {...props}
      secureTextEntry={!visible}
      rightAccessory={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={label}
          hitSlop={theme.spacing.sm}
          style={styles.toggle}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={theme.colors.textSecondary}
          />
        </Pressable>
      }
    />
  );
}
