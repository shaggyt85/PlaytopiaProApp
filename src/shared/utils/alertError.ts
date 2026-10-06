import { Alert } from "react-native";

import { getErrorMessage } from "./getErrorMessage";

/**
 * Un fallo de algo que no tiene dónde enseñar su error (marcar la asistencia,
 * subir la foto), en un `Alert` nativo: traducido por su `type`
 * (`getErrorMessage`), nunca con el `detail` de Core.
 */
export function alertError(error: unknown): void {
  Alert.alert(getErrorMessage(error));
}
