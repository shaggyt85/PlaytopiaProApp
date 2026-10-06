import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import { FormError } from "@/shared/components/FormError";
import { PersonalDataFields } from "@/shared/components/PersonalDataFields";
import { Text } from "@/shared/components/Text";
import { useFieldErrorText } from "@/shared/hooks/useFieldErrorText";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { AuthLayout, PasswordInput, TermsCheckbox } from "./components";
import { useSignUp } from "./hooks";
import {
  SIGN_UP_DEFAULTS,
  SignUpFormSchema,
  type SignUpForm,
  type SignUpFormInput,
} from "./schemas/signUp.schema";
import { useAuthFlowStore } from "./store/authFlowStore";

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
  const fieldError = useFieldErrorText();
  const signUp = useSignUp();

  const form = useForm<SignUpFormInput, unknown, SignUpForm>({
    resolver: zodResolver(SignUpFormSchema),
    mode: "onTouched",
    defaultValues: { ...SIGN_UP_DEFAULTS, email: useAuthFlowStore.getState().email },
  });
  const { control, handleSubmit, formState } = form;
  const { errors } = formState;

  const submit = handleSubmit(async (values) => {
    // El error queda en signUp.error y se pinta bajo el botón.
    const created = await signUp.mutateAsync(values).catch(() => undefined);
    if (created) router.dismissTo("/sign-in");
  });

  return (
    <AuthLayout showLogo={false} showBackButton testID="sign-up-screen">
      <FormProvider {...form}>
        <Text variant="title" align="center">
          {t("auth.signUp.title")}
        </Text>

        <PersonalDataFields birthdayRequired />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              variant="solid"
              label={t("auth.password.label")}
              placeholder={t("auth.password.placeholder")}
              textContentType="newPassword"
              autoComplete="new-password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={fieldError(errors.password?.message)}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              variant="solid"
              label={t("auth.signUp.confirmPasswordLabel")}
              placeholder={t("auth.password.placeholder")}
              textContentType="newPassword"
              autoComplete="new-password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={fieldError(errors.confirmPassword?.message)}
            />
          )}
        />

        <Controller
          control={control}
          name="acceptedTerms"
          render={({ field: { onChange, value } }) => (
            <TermsCheckbox
              checked={value}
              onChange={onChange}
              error={fieldError(errors.acceptedTerms?.message)}
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

        <FormError message={signUp.error ? getErrorMessage(signUp.error) : null} />
      </FormProvider>
    </AuthLayout>
  );
}
