import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import { Text } from "@/shared/components/Text";
import { isHttpError } from "@/shared/services/HttpError";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { AuthLayout, FormError, PasswordInput } from "./components";
import { useFieldErrorText, useSignIn } from "./hooks";
import { PasswordFormSchema, type PasswordForm } from "./schemas/auth.schema";
import { useAuthFlowStore } from "./store/authFlowStore";

/**
 * Paso 2 del acceso: la contraseña. Si entra, los guards llevan solos al
 * inicio. Siempre ofrece registrarse: un alumno que aún no es profesor llega
 * aquí (Core le dice que el email existe) y tiene que poder crear su cuenta.
 */
export function PasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const fieldError = useFieldErrorText();
  const signIn = useSignIn();
  const email = useAuthFlowStore((s) => s.email);
  const isStudent = useAuthFlowStore((s) => s.isStudent);

  const { control, handleSubmit, formState } = useForm<PasswordForm>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: { password: "" },
  });

  // Sin email (se abrió esta ruta directamente) no hay nada que hacer aquí.
  if (!email) return <Redirect href="/sign-in" />;

  const submit = handleSubmit(async ({ password }) => {
    await signIn.mutateAsync({ username: email, password }).catch(() => undefined);
  });

  return (
    <AuthLayout
      title={t("auth.password.title")}
      subtitle={t("auth.password.subtitle", { email })}
      testID="password-screen"
    >
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t("auth.password.label")}
            returnKeyType="go"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              signIn.reset();
            }}
            onSubmitEditing={submit}
            error={fieldError(formState.errors.password?.message)}
          />
        )}
      />

      <FormError message={signInErrorText(signIn.error, isStudent, t)} />

      <Button title={t("auth.password.submit")} onPress={submit} />
      <Button
        title={t("auth.password.forgot")}
        variant="ghost"
        onPress={() => router.push("/password-recovery")}
      />

      <Text color="textSecondary" align="center">
        {t("auth.password.noTeacherAccount")}
      </Text>
      <Button
        title={t("auth.password.register")}
        variant="secondary"
        onPress={() => router.push("/sign-up")}
      />
      <Button
        title={t("auth.password.changeEmail")}
        variant="ghost"
        onPress={() => router.back()}
      />
    </AuthLayout>
  );
}

/**
 * En el login, un 401 son credenciales incorrectas (Core no manda un `type`
 * propio). Si el email también es de alumno, se aclara que la contraseña es
 * la de la cuenta de profesor, que es otra.
 */
function signInErrorText(
  error: unknown,
  isStudent: boolean,
  t: ReturnType<typeof useTranslation>["t"],
): string | null {
  if (!error) return null;
  if (isHttpError(error) && error.status === 401) {
    const base = t("auth.password.invalidCredentials");
    return isStudent ? `${base} ${t("auth.password.studentHint")}` : base;
  }
  return getErrorMessage(error);
}
