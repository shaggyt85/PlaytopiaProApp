import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import { ControlledField } from "@/shared/components/ControlledField";
import { FormError } from "@/shared/components/FormError";
import { PersonalDataFields } from "@/shared/components/PersonalDataFields";
import { Text } from "@/shared/components/Text";
import { ROUTES } from "@/shared/config/routes";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { errorMessageOrNull } from "@/shared/utils/getErrorMessage";
import { ignoreRejection } from "@/shared/utils/ignoreRejection";

import { AuthLayout, PasswordInput, TermsCheckbox } from "./components";
import { useSignUp } from "./hooks";
import {
  SIGN_UP_DEFAULTS,
  SignUpFormSchema,
  type SignUpForm,
  type SignUpFormInput,
} from "./schemas/signUp.schema";
import { rememberedEmail } from "./store/authFlowStore";

/**
 * Registro del profesor, igual que el de la app de alumnos (sin documento ni
 * adulto/niño), con el email del primer paso ya escrito. Los datos personales
 * son los mismos campos que en Perfil (`PersonalDataFields`). Los errores de cada
 * campo salen al dejarlo y se corrigen al escribir; el botón no se activa
 * hasta que todo es válido. Tras el alta, vuelve al login para entrar con el
 * email y la contraseña recién creados.
 */
export function SignUpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const signUp = useSignUp();

  const form = useForm<SignUpFormInput, unknown, SignUpForm>({
    resolver: zodResolver(SignUpFormSchema),
    mode: "onTouched",
    defaultValues: { ...SIGN_UP_DEFAULTS, email: rememberedEmail() },
  });
  const { control, handleSubmit, formState } = form;

  const submit = handleSubmit(async (values) => {
    // El error queda en signUp.error y se pinta bajo el botón.
    const created = await ignoreRejection(signUp.mutateAsync(values));
    if (created) router.dismissTo(ROUTES.signIn);
  });

  return (
    <AuthLayout showLogo={false} showBackButton testID="sign-up-screen">
      <FormProvider {...form}>
        <Text variant="title" align="center">
          {t("auth.signUp.title")}
        </Text>

        <PersonalDataFields birthdayRequired />

        <ControlledField
          control={control}
          name="password"
          render={({ value, onChange, onBlur, error }) => (
            <PasswordInput
              variant="solid"
              textContentType="newPassword"
              autoComplete="new-password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={error}
            />
          )}
        />

        <ControlledField
          control={control}
          name="confirmPassword"
          render={({ value, onChange, onBlur, error }) => (
            <PasswordInput
              variant="solid"
              label={t("auth.signUp.confirmPasswordLabel")}
              textContentType="newPassword"
              autoComplete="new-password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={error}
            />
          )}
        />

        <ControlledField
          control={control}
          name="acceptedTerms"
          render={({ value, onChange, error }) => (
            <TermsCheckbox
              checked={value}
              onChange={onChange}
              error={error}
            />
          )}
        />

        <Button
          variant="solid"
          title={signUp.isPending ? t("auth.signUp.submitting") : t("auth.signUp.submit")}
          onPress={submit}
          disabled={!formState.isValid}
          loading={signUp.isPending}
        />

        <FormError message={errorMessageOrNull(signUp.error)} />
      </FormProvider>
    </AuthLayout>
  );
}
