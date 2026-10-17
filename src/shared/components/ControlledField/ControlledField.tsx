import type { ReactElement } from "react";
import { Controller, type Control, type FieldPath, type FieldPathValue, type FieldValues } from "react-hook-form";

import { useFieldErrorText } from "@/shared/hooks/useFieldErrorText";

/** Lo que recibe el campo: su valor, cómo cambiarlo y su error ya traducido. */
export interface ControlledFieldRender<T extends FieldValues, N extends FieldPath<T>> {
  value: FieldPathValue<T, N>;
  onChange: (value: FieldPathValue<T, N>) => void;
  onBlur: () => void;
  error?: string;
}

interface ControlledFieldProps<T extends FieldValues, N extends FieldPath<T>> {
  name: N;
  /** El del formulario; dentro de un `FormProvider` se puede omitir. */
  control?: Control<T>;
  render: (field: ControlledFieldRender<T, N>) => ReactElement;
}

/**
 * Un campo de react-hook-form con su error: el `Controller` que se repetía en
 * cada formulario, pero que ya lee el error de su campo y lo traduce (los
 * schemas guardan claves de i18n). Así ninguna pantalla vuelve a escribir
 * `fieldError(errors.x?.message)`.
 */
export function ControlledField<T extends FieldValues, N extends FieldPath<T>>({
  name,
  control,
  render,
}: ControlledFieldProps<T, N>) {
  const fieldError = useFieldErrorText();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) =>
        render({
          value: field.value,
          onChange: field.onChange,
          onBlur: field.onBlur,
          error: fieldError(fieldState.error?.message),
        })
      }
    />
  );
}
