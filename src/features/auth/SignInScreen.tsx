import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useSessionStore } from "@/shared/store/sessionStore";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { AuthLayout, FormError, LegalFooter, PendingTermsModal } from "./components";
import { useBiometricSignIn, useCheckEmail, useFieldErrorText } from "./hooks";
import { EmailFormSchema, type EmailForm } from "./schemas/auth.schema";
import { useAuthFlowStore } from "./store/authFlowStore";

/**
 * Paso 1 del acceso: el email, igual que la app de alumnos. Decide por
 * `is_teacher`: si es profesor, a la contraseña; si no, el mismo botón pasa a
 * "Registrarse". Con la biometría activada, trae su email ya escrito, la lanza
 * sola al abrir (salvo justo después de cerrar sesión) y el botón pasa a
 * "Acceder con biometría".
 */
export function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const fieldError = useFieldErrorText();
  const checkEmail = useCheckEmail();
  const setCheckedEmail = useAuthFlowStore((s) => s.setCheckedEmail);
  const [notFound, setNotFound] = useState(false);
  const resetCheck = checkEmail.reset;
  const biometric = useBiometricSignIn();
  const endedManually = useSessionStore((s) => s.endReason === "manual");
  const autoTried = useRef(false);

  // Al volver a esta pantalla (p. ej. tras registrarse) el botón vuelve a
  // "Continuar": el correo ya puede existir y hay que comprobarlo de nuevo.
  useFocusEffect(
    useCallback(() => {
      setNotFound(false);
      resetCheck();
    }, [resetCheck]),
  );

  const { control, handleSubmit, formState, getValues, setValue } = useForm<EmailForm>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: { email: useAuthFlowStore.getState().email },
  });
  const useBiometric = biometric.canUseFor(useWatch({ control, name: "email" }));
  const { loaded, available, savedEmail, signIn: signInWithBiometric } = biometric;

  // Una sola vez al abrir: el email de la biometría ya escrito y, si no se
  // acaba de cerrar sesión a mano, la biometría se lanza sola.
  useEffect(() => {
    if (!loaded || autoTried.current || !savedEmail) return;
    autoTried.current = true;
    if (!getValues("email")) setValue("email", savedEmail);
    if (available && !endedManually) signInWithBiometric();
  }, [loaded, available, savedEmail, endedManually, getValues, setValue, signInWithBiometric]);

  const submit = handleSubmit(async ({ email }) => {
    setNotFound(false);
    // El error queda en checkEmail.error y se pinta abajo.
    const result = await checkEmail.mutateAsync(email).catch(() => undefined);
    if (!result) return;
    // Se guarda en los dos casos: la contraseña o el registro lo muestran ya escrito.
    setCheckedEmail(email, result.is_student);
    if (result.is_teacher) {
      router.push("/password");
    } else {
      setNotFound(true);
    }
  });

  const errorText = biometric.message
    ? biometric.message
    : notFound
    ? t("auth.signIn.notFound")
    : checkEmail.error
      ? getErrorMessage(checkEmail.error)
      : null;

  return (
    <AuthLayout testID="sign-in-screen">
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
            returnKeyType="done"
            editable={!biometric.isPending}
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              setNotFound(false);
              checkEmail.reset();
              biometric.reset();
            }}
            onSubmitEditing={submit}
            error={fieldError(formState.errors.email?.message)}
          />
        )}
      />

      <FormError message={errorText} />

      <Button
        title={
          useBiometric
            ? t("auth.biometric.signIn")
            : notFound
              ? t("auth.signIn.register")
              : t("auth.signIn.continue")
        }
        onPress={useBiometric ? signInWithBiometric : notFound ? () => router.push("/sign-up") : submit}
        loading={biometric.isPending}
      />

      <LegalFooter />
      <PendingTermsModal tokens={biometric.pendingTokens} onDismiss={biometric.reset} />
    </AuthLayout>
  );
}
