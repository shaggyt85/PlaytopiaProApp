import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { AuthLayout, FormError } from "./components";
import { useCheckEmail, useFieldErrorText } from "./hooks";
import { EmailFormSchema, type EmailForm } from "./schemas/auth.schema";
import { useAuthFlowStore } from "./store/authFlowStore";

/**
 * Paso 1 del acceso: el email. Igual que la app de alumnos, pero decidiendo
 * por `exists` (Core no dice si es profesor): si existe, a la contraseña; si
 * no, se ofrece crear la cuenta.
 */
export function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const fieldError = useFieldErrorText();
  const checkEmail = useCheckEmail();
  const setCheckedEmail = useAuthFlowStore((s) => s.setCheckedEmail);
  const [notFound, setNotFound] = useState(false);

  const { control, handleSubmit, formState } = useForm<EmailForm>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: { email: useAuthFlowStore.getState().email },
  });

  const submit = handleSubmit(async ({ email }) => {
    setNotFound(false);
    // El error queda en checkEmail.error y se pinta abajo.
    const result = await checkEmail.mutateAsync(email).catch(() => undefined);
    if (!result) return;
    if (result.exists) {
      setCheckedEmail(email, result.is_student);
      router.push("/password");
    } else {
      setNotFound(true);
    }
  });

  return (
    <AuthLayout
      title={t("auth.signIn.title")}
      subtitle={t("auth.signIn.subtitle")}
      testID="sign-in-screen"
    >
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
            returnKeyType="next"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              setNotFound(false);
              checkEmail.reset();
            }}
            onSubmitEditing={submit}
            error={fieldError(formState.errors.email?.message)}
          />
        )}
      />

      <FormError message={checkEmail.error ? getErrorMessage(checkEmail.error) : null} />

      <Button title={t("auth.signIn.continue")} onPress={submit} />

      {notFound ? (
        <>
          <Text color="textSecondary" align="center">
            {t("auth.signIn.notFound")}
          </Text>
          <Button
            title={t("auth.signIn.createAccount")}
            variant="secondary"
            onPress={() => router.push("/sign-up")}
          />
        </>
      ) : null}
    </AuthLayout>
  );
}
