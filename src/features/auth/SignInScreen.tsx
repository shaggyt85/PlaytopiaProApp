import { Button } from "@/shared/components/Button";
import { ControlledField } from "@/shared/components/ControlledField";
import { EmailInput } from "@/shared/components/EmailInput";
import { FormError } from "@/shared/components/FormError";

import { AuthLayout, LegalFooter, PendingTermsModal } from "./components";
import { useSignInFlow } from "./hooks";

/**
 * Paso 1 del acceso: el email, igual que la app de alumnos. Qué pasa con cada
 * email (contraseña, crearla, registrarse, biometría) lo decide `useSignInFlow`;
 * la pantalla solo pinta.
 */
export function SignInScreen() {
  const { form, submit, onEmailEdited, editable, errorText, button, pendingTokens, dismissPendingTerms } =
    useSignInFlow();

  return (
    <AuthLayout testID="sign-in-screen">
      <ControlledField
        control={form.control}
        name="email"
        render={({ value, onChange, onBlur, error }) => (
          <EmailInput
            returnKeyType="done"
            editable={editable}
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              onEmailEdited();
            }}
            onSubmitEditing={submit}
            error={error}
          />
        )}
      />

      <FormError message={errorText} />

      <Button title={button.title} onPress={button.onPress} loading={button.loading} />

      <LegalFooter />
      <PendingTermsModal tokens={pendingTokens} onDismiss={dismissPendingTerms} />
    </AuthLayout>
  );
}
