import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/components/Button";
import { DateInput } from "@/shared/components/DateInput";
import { GenderSelector } from "@/shared/components/GenderSelector";
import { Input } from "@/shared/components/Input";
import { PhoneInput } from "@/shared/components/PhoneInput";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import { AuthLayout, FormError, PasswordInput, TermsCheckbox } from "./components";
import { useFieldErrorText, useSignUp } from "./hooks";
import {
  SIGN_UP_DEFAULTS,
  SignUpFormSchema,
  type SignUpForm,
  type SignUpFormInput,
} from "./schemas/signUp.schema";
import { useAuthFlowStore } from "./store/authFlowStore";

/**
 * Registro del profesor, igual que el de la app de alumnos (sin documento ni
 * adulto/niño), con el email del primer paso ya escrito. Los errores de cada
 * campo salen al dejarlo y se corrigen al escribir; el botón no se activa
 * hasta que todo es válido. Tras el alta, vuelve al login para entrar con el
 * email y la contraseña recién creados.
 */
export function SignUpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const fieldError = useFieldErrorText();
  const signUp = useSignUp();

  const { control, handleSubmit, formState } = useForm<SignUpFormInput, unknown, SignUpForm>({
    resolver: zodResolver(SignUpFormSchema),
    mode: "onTouched",
    defaultValues: { ...SIGN_UP_DEFAULTS, email: useAuthFlowStore.getState().email },
  });
  const { errors } = formState;
  // Hasta hoy mismo: nadie nace en el futuro.
  const today = new Date();

  const submit = handleSubmit(async (form) => {
    // El error queda en signUp.error y se pinta bajo el botón.
    const created = await signUp.mutateAsync(form).catch(() => undefined);
    if (created) router.dismissTo("/sign-in");
  });

  return (
    <AuthLayout showLogo={false} showBackButton testID="sign-up-screen">
      <Text variant="title" align="center">
        {t("auth.signUp.title")}
      </Text>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant="solid"
            label={t("auth.signUp.firstNameLabel")}
            placeholder={t("auth.signUp.firstNamePlaceholder")}
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldError(errors.firstName?.message)}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant="solid"
            label={t("auth.signUp.lastNameLabel")}
            placeholder={t("auth.signUp.lastNamePlaceholder")}
            autoCapitalize="words"
            autoComplete="family-name"
            textContentType="familyName"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldError(errors.lastName?.message)}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            variant="solid"
            label={t("auth.signIn.emailLabel")}
            placeholder={t("auth.signIn.emailPlaceholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            maxLength={254}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={fieldError(errors.email?.message)}
          />
        )}
      />

      <Controller
        control={control}
        name="country"
        render={({ field: country }) => (
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <PhoneInput
                country={country.value}
                onCountryChange={country.onChange}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldError(errors.phone?.message)}
              />
            )}
          />
        )}
      />

      <Controller
        control={control}
        name="birthday"
        render={({ field: { onChange, onBlur, value } }) => (
          <DateInput
            label={t("auth.signUp.birthdayLabel")}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            maximumDate={today}
            required
            error={fieldError(errors.birthday?.message)}
          />
        )}
      />

      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <GenderSelector value={value} onChange={onChange} error={fieldError(errors.gender?.message)} />
        )}
      />

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
    </AuthLayout>
  );
}
