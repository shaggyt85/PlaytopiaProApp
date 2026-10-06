import type { UseMutationResult } from "@tanstack/react-query";

import { getErrorMessage } from "@/shared/utils/getErrorMessage";

/** Lo que se usa de la mutación de un editor. */
type EditorMutation<V, R> = Pick<UseMutationResult<R, Error, V>, "mutateAsync" | "isPending" | "error">;

interface EditorSaveOptions {
  /** Los errores que el editor enseña en un campo y no abajo (el email que ya es de otra cuenta). */
  inField?: (error: unknown) => boolean;
}

/**
 * Guardar en un editor de Perfil, igual en todos: envía, cierra el panel si va
 * bien y deja el error traducido por su `type` para abajo (`getErrorMessage`).
 * `save` devuelve el error si falló (`null` si guardó), para el editor que lo
 * enseña en un campo. El editor solo dice qué envía.
 */
export function useEditorSave<V, R>(mutation: EditorMutation<V, R>, onDone: () => void, options: EditorSaveOptions = {}) {
  const save = async (variables: V): Promise<unknown> => {
    try {
      await mutation.mutateAsync(variables);
    } catch (error) {
      return error;
    }
    onDone();
    return null;
  };
  const { error } = mutation;
  return {
    save,
    saving: mutation.isPending,
    error: error && !options.inField?.(error) ? getErrorMessage(error) : null,
  };
}
