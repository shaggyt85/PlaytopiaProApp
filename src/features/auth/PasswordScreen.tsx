import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { isHttpError } from "@/shared/services/HttpError";
import { session } from "@/shared/services/session";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { AuthLayout, FormError, PasswordInput } from "./components";
import { LegalModal } from "./components/LegalModal";
import { useAcceptTerms, useFieldErrorText, useSignIn } from "./hooks";
import { PasswordFormSchema, type PasswordForm } from "./schemas/auth.schema";
import { useAuthFlowStore } from "./store/authFlowStore";

/**
 * Paso 2 del acceso: la contraseña, igual que la app de alumnos. Si entra,
 * los guards llevan solos al inicio. Si le faltan los términos vigentes, se
 * abre su modal con "Aceptar": al aceptarlos entra; al cerrarlo, no.
 */
export function PasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const fieldError = useFieldErrorText();
  const signIn = useSignIn();
  const acceptTerms = useAcceptTerms();
  const pendingTokens = signIn.data?.termsPending ? signIn.data.tokens : null;
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
    <AuthLayout subtitle={email} showBackButton testID="password-screen">

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label={t("auth.password.label")}
            placeholder={t("auth.password.placeholder")}
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
        variant="link"
        onPress={() => router.push("/password-recovery")}
      />

      <LegalModal
        document={pendingTokens ? "terms" : null}
        onAccept={async () => {
          if (pendingTokens) await acceptTerms.mutateAsync(pendingTokens).catch(() => undefined);
        }}
        error={acceptTerms.error ? getErrorMessage(acceptTerms.error) : null}
        onClose={() => {
          // Sin aceptarlos no entra: se borran los tokens del login.
          signIn.reset();
          acceptTerms.reset();
          session.end();
        }}
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
