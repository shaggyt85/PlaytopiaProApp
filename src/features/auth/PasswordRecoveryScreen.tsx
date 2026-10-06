import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import { EmailInput } from "@/shared/components/EmailInput";
import { FormError } from "@/shared/components/FormError";
import { Text } from "@/shared/components/Text";
import { useFieldErrorText } from "@/shared/hooks/useFieldErrorText";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TranslationKey } from "@/shared/locales";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { AuthLayout } from "./components";
import { usePasswordRecovery } from "./hooks";
import { EmailFormSchema, type EmailForm } from "./schemas/auth.schema";
import { useAuthFlowStore } from "./store/authFlowStore";

/**
 * A qué viene el profesor: a recuperar una contraseña que olvidó, o a crear la
 * primera porque su club le dio de alta desde el CRM. El envío es el mismo; solo
 * cambia lo que se le cuenta.
 */
type RecoveryMode = "recovery" | "setup";

const RECOVERY_COPY: Record<
  RecoveryMode,
  { title: TranslationKey; subtitle: TranslationKey; sentMessage: TranslationKey }
> = {
  recovery: {
    title: "auth.passwordRecovery.title",
    subtitle: "auth.passwordRecovery.subtitle",
    sentMessage: "auth.passwordRecovery.sentMessage",
  },
  setup: {
    title: "auth.passwordRecovery.setupTitle",
    subtitle: "auth.passwordRecovery.setupSubtitle",
    sentMessage: "auth.passwordRecovery.setupSentMessage",
  },
};

/**
 * Recuperar la contraseña, igual que en la app de alumnos: se pide el correo y
 * la misma pantalla confirma el envío. La contraseña nueva se pone en la web,
 * desde el enlace del correo; por eso se vuelve al primer paso del acceso.
 *
 * Desde «¿Has olvidado tu contraseña?» el email empieza vacío. Si llega desde
 * el primer paso porque la cuenta aún no tiene contraseña, viene ya escrito y
 * los textos hablan de crearla.
 */
export function PasswordRecoveryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const fieldError = useFieldErrorText();
  const recovery = usePasswordRecovery();
  const needsPasswordSetup = useAuthFlowStore((s) => s.needsPasswordSetup);
  const copy = RECOVERY_COPY[needsPasswordSetup ? "setup" : "recovery"];

  const { control, handleSubmit, formState } = useForm<EmailForm>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: { email: needsPasswordSetup ? useAuthFlowStore.getState().email : "" },
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
          {t(copy.sentMessage)}
        </Text>
        <Button title={t("auth.passwordRecovery.backToLogin")} onPress={() => router.dismissTo("/sign-in")} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showBackButton testID="password-recovery-screen">
      <Text variant="title" align="center" accessibilityRole="header">
        {t(copy.title)}
      </Text>
      <Text color="textSecondary" align="center">
        {t(copy.subtitle)}
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <EmailInput
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
