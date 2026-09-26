import type { IBiometricService } from "@/features/auth/services/biometricService";

/**
 * Servicio de biometría falso: todo `jest.fn()`, sin biometría por defecto.
 * Cada test le da las respuestas que necesita.
 *
 * Para sustituir el singleton de un módulo (el factory de `jest.mock` no puede
 * usar imports, se sube arriba del fichero):
 *
 * ```ts
 * jest.mock("@/features/auth/services/biometricService", () => ({
 *   biometricService: require("<ruta>/helpers/biometricServiceMock").createBiometricServiceMock(),
 * }));
 * ```
 */
export function createBiometricServiceMock(): jest.Mocked<IBiometricService> {
  return {
    isAvailable: jest.fn().mockResolvedValue(false),
    savedEmail: jest.fn().mockResolvedValue(null),
    enable: jest.fn(),
    unlock: jest.fn(),
    disable: jest.fn().mockResolvedValue(undefined),
  };
}
