import type { ReactNode } from "react";
import { FormProvider, type FieldValues, type UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { Button, type ButtonVariant } from "@/shared/components/Button";
import { FormError } from "@/shared/components/FormError";
import type { IconComponent } from "@/shared/config/icons";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./ProfileEditorForm.styles";

/** El botón de enviar, si no es «Guardar» («Borrar cuenta», en rojo). */
export interface EditorSubmit {
  title: string;
  variant?: ButtonVariant;
  Icon?: IconComponent;
}

interface ProfileEditorFormProps<T extends FieldValues, R extends FieldValues> {
  form: UseFormReturn<T, unknown, R>;
  /** Lo que hace el botón de enviar (el `handleSubmit` del editor). */
  onSave: () => void | Promise<unknown>;
  /** Mientras guarda, el botón no se puede volver a pulsar. */
  saving: boolean;
  /** Por defecto, «Guardar». */
  submit?: EditorSubmit;
  /** El error de abajo, ya traducido; `null` si no hay. */
  error: string | null;
  children: ReactNode;
  testID?: string;
}

/**
 * El esqueleto de un editor de Perfil: el formulario a sus campos, sus campos
 * en columna, el botón de enviar («Guardar», ocupado mientras guarda) y el
 * error de abajo. Cada editor solo pone sus campos, qué hace al enviar y, si no
 * es «Guardar», su botón.
 */
export function ProfileEditorForm<T extends FieldValues, R extends FieldValues>({
  form,
  onSave,
  saving,
  error,
  submit,
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
          <Button
            title={submit?.title ?? t("common.save")}
            variant={submit?.variant}
            Icon={submit?.Icon}
            onPress={onSave}
            loading={saving}
          />
        </View>
        <FormError message={error} />
      </View>
    </FormProvider>
  );
}
