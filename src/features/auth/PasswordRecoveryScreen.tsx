import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { AuthLayout, FormError } from "./components";
import { useFieldErrorText, usePasswordRecovery } from "./hooks";
import { EmailFormSchema, type EmailForm } from "./schemas/auth.schema";

/**
 * Recuperar la contraseña, igual que en la app de alumnos: se pide el correo y
 * la misma pantalla confirma el envío. La contraseña nueva se pone en la web,
 * desde el enlace del correo; por eso se vuelve al primer paso del acceso.
 */
export function PasswordRecoveryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const fieldError = useFieldErrorText();
  const recovery = usePasswordRecovery();

  const { control, handleSubmit, formState } = useForm<EmailForm>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: { email: "" },
  });

  const submit = handleSubmit(async ({ email }) => {
    // El error queda en recovery.error y se pinta abajo.
    await recovery.mutateAsync(email).catch(() => undefined);
  });

  // Mismo mensaje exista o no la cuenta: Core siempre responde igual.
  if (recovery.isSuccess) {
    return (
      <AuthLayout testID="password-recovery-sent">
        <Text variant="display" align="center" accessibilityElementsHidden>
          ✅
        </Text>
        <Text variant="title" align="center" accessibilityRole="header">
          {t("auth.passwordRecovery.sentTitle")}
        </Text>
        <Text color="textSecondary" align="center">
          {t("auth.passwordRecovery.sentMessage")}
        </Text>
        <Button title={t("auth.passwordRecovery.backToLogin")} onPress={() => router.dismissTo("/sign-in")} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showBackButton testID="password-recovery-screen">
      <Text variant="title" align="center" accessibilityRole="header">
        {t("auth.passwordRecovery.title")}
      </Text>
      <Text color="textSecondary" align="center">
        {t("auth.passwordRecovery.subtitle")}
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t("auth.signIn.emailLabel")}
            placeholder={t("auth.signIn.emailPlaceholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            maxLength={254}
            returnKeyType="send"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              recovery.reset();
            }}
            onSubmitEditing={submit}
            error={fieldError(formState.errors.email?.message)}
          />
        )}
      />

      <FormError message={recovery.error ? getErrorMessage(recovery.error) : null} />

      <Button
        title={t("auth.passwordRecovery.submit")}
        onPress={submit}
        disabled={!formState.isValid}
        loading={recovery.isPending}
      />
    </AuthLayout>
  );
}
