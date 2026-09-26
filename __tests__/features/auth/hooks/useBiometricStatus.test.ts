import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useBiometricStatus } from "@/features/auth/hooks/useBiometricStatus";

import { createBiometricServiceMock } from "../../../helpers/biometricServiceMock";

describe("useBiometricStatus", () => {
  it("carga si el móvil puede usarla y para qué email está activada", async () => {
    const service = createBiometricServiceMock();
    service.isAvailable.mockResolvedValue(true);
    service.savedEmail.mockResolvedValue("ana@club.com");
    const { result } = renderHook(() => useBiometricStatus(service));

    expect(result.current.loaded).toBe(false);
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.available).toBe(true);
    expect(result.current.savedEmail).toBe("ana@club.com");
  });

  it("si falla la lectura cuenta como sin biometría", async () => {
    const service = createBiometricServiceMock();
    service.isAvailable.mockRejectedValue(new Error("sensor"));
    const { result } = renderHook(() => useBiometricStatus(service));

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.available).toBe(false);
    expect(result.current.savedEmail).toBeNull();
  });

  it("al desactivarla olvida el email guardado", async () => {
    const service = createBiometricServiceMock();
    service.isAvailable.mockResolvedValue(true);
    service.savedEmail.mockResolvedValue("ana@club.com");
    const { result } = renderHook(() => useBiometricStatus(service));
    await waitFor(() => expect(result.current.savedEmail).toBe("ana@club.com"));

    act(() => result.current.forgetSavedEmail());

    expect(result.current.savedEmail).toBeNull();
    expect(result.current.available).toBe(true);
  });
});
