import { act } from "@testing-library/react-native";

/**
 * Deja terminar lo que un evento dispara en segundo plano antes de comprobar:
 * la validación asíncrona del resolver de Zod o el `reset()` de una mutación de
 * TanStack, que se notifican en la siguiente vuelta. `waitFor` no les da paso
 * para quitar algo que ya está pintado.
 */
export const settle = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
