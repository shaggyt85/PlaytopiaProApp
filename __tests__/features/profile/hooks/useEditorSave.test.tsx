import { act, renderHook } from "@testing-library/react-native";

import { useEditorSave } from "@/features/profile/hooks/useEditorSave";
import { HttpError } from "@/shared/services/HttpError";

const problem = (type: string, status = 409) => HttpError.fromResponse(status, { type, title: "Error", status });

const mutation = (overrides: Partial<{ mutateAsync: jest.Mock; isPending: boolean; error: Error | null }> = {}) => ({
  mutateAsync: jest.fn().mockResolvedValue("ok"),
  isPending: false,
  error: null,
  ...overrides,
});

describe("useEditorSave", () => {
  it("envía y, si sale bien, cierra el panel", async () => {
    const onDone = jest.fn();
    const m = mutation();
    const { result } = renderHook(() => useEditorSave(m, onDone));

    let failure: unknown;
    await act(async () => {
      failure = await result.current.save({ a: 1 });
    });

    expect(m.mutateAsync).toHaveBeenCalledWith({ a: 1 });
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(failure).toBeNull();
  });

  it("si falla, no cierra y devuelve el error", async () => {
    const onDone = jest.fn();
    const error = problem("conflict");
    const { result } = renderHook(() => useEditorSave(mutation({ mutateAsync: jest.fn().mockRejectedValue(error) }), onDone));

    let failure: unknown;
    await act(async () => {
      failure = await result.current.save({});
    });

    expect(onDone).not.toHaveBeenCalled();
    expect(failure).toBe(error);
  });

  it("el error de la mutación sale traducido por su type, y mientras guarda lo dice", () => {
    const { result } = renderHook(() =>
      useEditorSave(mutation({ isPending: true, error: problem("forbidden", 403) }), jest.fn()),
    );

    expect(result.current.saving).toBe(true);
    expect(result.current.error).toEqual(expect.any(String));
    expect(result.current.error).not.toBe("");
  });

  it("los errores que van en un campo no salen abajo", () => {
    const { result } = renderHook(() =>
      useEditorSave(mutation({ error: problem("email-already-registered") }), jest.fn(), { inField: () => true }),
    );

    expect(result.current.error).toBeNull();
  });
});
