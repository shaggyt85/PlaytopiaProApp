import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { useSessionStore } from "@/shared/store/sessionStore";
import { errorMessageOrNull } from "@/shared/utils/getErrorMessage";
import { ignoreRejection } from "@/shared/utils/ignoreRejection";

import { EmailFormSchema, type EmailForm } from "../schemas/auth.schema";
import { rememberedEmail, useAuthFlowStore } from "../store/authFlowStore";
import { firstError, SIGN_IN_BUTTON_TITLE, signInMode, type SignInMode } from "../utils/signInMode";
import { signInNextStep, type SignInNextStep } from "../utils/signInNextStep";

import { useBiometricSignIn } from "./useBiometricSignIn";
import { useCheckEmail } from "./useCheckEmail";

/**
 * El paso del email entero, para que `SignInScreen` solo pinte (como en la app
 * de alumnos): el formulario, la comprobación del email (`check-email`), la
 * biometría y qué hace el botón.
 *
 * - Si es profesor, a la contraseña; si su club le dio de alta y aún no tiene
 *   contraseña, a la recuperación para crearla; si no es profesor, el botón
 *   pasa a «Registrarse».
 * - Con la biometría activada, su email ya escrito y, una sola vez al abrir, se
 *   lanza sola (salvo justo después de cerrar sesión a mano); con su email
 *   escrito, el botón pasa a «Acceder con biometría».
 * - Al volver a la pantalla (p. ej. tras registrarse), el botón vuelve a
 *   «Continuar»: el correo ya puede existir y hay que comprobarlo otra vez.
 */
export function useSignInFlow() {
  const { t } = useTranslation();
  const router = useRouter();
  const checkEmail = useCheckEmail();
  const biometric = useBiometricSignIn();
  const setCheckedEmail = useAuthFlowStore((s) => s.setCheckedEmail);
  const endedManually = useSessionStore((s) => s.endReason === "manual");
  const [notFound, setNotFound] = useState(false);
  const autoTried = useRef(false);
  const resetCheck = checkEmail.reset;

  useFocusEffect(
    useCallback(() => {
      setNotFound(false);
      resetCheck();
    }, [resetCheck]),
  );

  const form = useForm<EmailForm>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: { email: rememberedEmail() },
  });
  const { control, handleSubmit, getValues, setValue } = form;
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

  // Qué se hace con cada paso: el paso lo decide `signInNextStep`.
  const goTo: Record<SignInNextStep, () => void> = {
    password: () => router.push("/password"),
    passwordSetup: () => router.push("/password-recovery"),
    register: () => setNotFound(true),
  };

  const submit = handleSubmit(async ({ email }) => {
    setNotFound(false);
    // El error queda en checkEmail.error y se pinta.
    const result = await ignoreRejection(checkEmail.mutateAsync(email));
    if (!result) return;
    const step = signInNextStep(result);
    // Se guarda siempre: la siguiente pantalla lo muestra ya escrito.
    setCheckedEmail(email, {
      isStudent: result.is_student,
      needsPasswordSetup: step === "passwordSetup",
    });
    goTo[step]();
  });

  // Qué hace el botón en cada modo.
  const action: Record<SignInMode, () => void> = {
    biometric: signInWithBiometric,
    register: () => router.push("/sign-up"),
    continue: submit,
  };
  const mode = signInMode({ useBiometric, notFound });

  /** Al escribir: lo comprobado deja de valer. */
  const onEmailEdited = () => {
    setNotFound(false);
    checkEmail.reset();
    biometric.reset();
  };

  return {
    form,
    submit,
    onEmailEdited,
    editable: !biometric.isPending,
    errorText: firstError(
      biometric.message,
      notFound && t("auth.signIn.notFound"),
      errorMessageOrNull(checkEmail.error),
    ),
    button: { title: t(SIGN_IN_BUTTON_TITLE[mode]), onPress: action[mode], loading: biometric.isPending },
    /** Entrar con biometría también comprueba los términos. */
    pendingTokens: biometric.pendingTokens,
    dismissPendingTerms: biometric.reset,
  };
}
