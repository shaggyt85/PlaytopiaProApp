import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, useRouter } from "expo-router";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import { ControlledField } from "@/shared/components/ControlledField";
import { FormError } from "@/shared/components/FormError";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { ignoreRejection } from "@/shared/utils/ignoreRejection";

import { AuthLayout, PasswordInput, PendingTermsModal } from "./components";
import { useSignIn } from "./hooks";
import { PasswordFormSchema, type PasswordForm } from "./schemas/auth.schema";
import { useAuthFlowStore } from "./store/authFlowStore";
import { passwordErrorText } from "./utils/passwordErrorText";

/**
 * Paso 2 del acceso: la contraseña, igual que la app de alumnos. Si entra,
 * los guards llevan solos al inicio. Si le faltan los términos vigentes, se
 * abre su modal con "Aceptar": al aceptarlos entra; al cerrarlo, no.
 */
export function PasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const signIn = useSignIn();
  const pendingTokens = signIn.data?.termsPending ? signIn.data.tokens : null;
  const email = useAuthFlowStore((s) => s.email);
  const isStudent = useAuthFlowStore((s) => s.isStudent);

  const { control, handleSubmit } = useForm<PasswordForm>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: { password: "" },
  });

  // Sin email (se abrió esta ruta directamente) no hay nada que hacer aquí.
  if (!email) return <Redirect href="/sign-in" />;

  const submit = handleSubmit(async ({ password }) => {
    await ignoreRejection(signIn.mutateAsync({ username: email, password }));
  });

  return (
    <AuthLayout subtitle={email} showBackButton testID="password-screen">

      <ControlledField
        control={control}
        name="password"
        render={({ value, onChange, onBlur, error }) => (
          <PasswordInput
            returnKeyType="go"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              signIn.reset();
            }}
            onSubmitEditing={submit}
            error={error}
          />
        )}
      />

      <FormError message={passwordErrorText(signIn.error, isStudent, t)} />

      <Button title={t("auth.password.submit")} onPress={submit} />
      <Button
        title={t("auth.password.forgot")}
        variant="link"
        onPress={() => router.push("/password-recovery")}
      />

      <PendingTermsModal tokens={pendingTokens} onDismiss={signIn.reset} />
    </AuthLayout>
  );
}
