// Tipos de los matchers que registra `expo-router/testing-library` (el SDK 57 los
// añade a Jest al ejecutar, pero su `expect.d.ts` viene vacío). Solo los que usan
// los tests.
export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      /** La ruta actual de `renderRouter` es `pathname` («/network»). */
      toHavePathname(pathname: string): R;
    }
  }
}
