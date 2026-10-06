import type { ReactNode } from "react";
import { FormProvider, type FieldValues, type UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { Button } from "@/shared/components/Button";
import { FormError } from "@/shared/components/FormError";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./ProfileEditorForm.styles";

interface ProfileEditorFormProps<T extends FieldValues, R extends FieldValues> {
  form: UseFormReturn<T, unknown, R>;
  /** Lo que hace «Guardar» (el `handleSubmit` del editor). */
  onSave: () => void | Promise<unknown>;
  /** Mientras guarda, «Guardar» no se puede volver a pulsar. */
  saving: boolean;
  /** El error de abajo, ya traducido; `null` si no hay. */
  error: string | null;
  children: ReactNode;
  testID?: string;
}

/**
 * El esqueleto de un editor de Perfil: el formulario a sus campos, sus campos
 * en columna, «Guardar» (ocupado mientras guarda) y el error de abajo. Cada
 * editor solo pone sus campos y qué hace al guardar.
 */
export function ProfileEditorForm<T extends FieldValues, R extends FieldValues>({
  form,
  onSave,
  saving,
  error,
  children,
  testID,
}: ProfileEditorFormProps<T, R>) {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <FormProvider {...form}>
      <View style={styles.form} testID={testID}>
        {children}
        <View style={styles.save}>
          <Button title={t("common.save")} onPress={onSave} loading={saving} />
        </View>
        <FormError message={error} />
      </View>
    </FormProvider>
  );
}
