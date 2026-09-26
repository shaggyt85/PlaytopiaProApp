import { createSessionRefresher } from "@/shared/services/sessionRefresher";

import { createFakeTokenStorage } from "../../helpers/fakeTokenStorage";

const tokensNuevos = { access_token: "acceso-2", refresh_token: "refresco-2" };

describe("createSessionRefresher", () => {
  it("renueva con el refresh token y guarda los tokens nuevos", async () => {
    const tokens = createFakeTokenStorage({ access: "acceso-1", refresh: "refresco-1" });
    const requestRefresh = jest.fn().mockResolvedValue(tokensNuevos);

    const result = await createSessionRefresher({ tokens, requestRefresh })();

    expect(requestRefresh).toHaveBeenCalledWith("refresco-1");
    expect(result).toEqual({ ok: true, accessToken: "acceso-2" });
    expect(tokens.refresh).toBe("refresco-2");
  });

  it("varios 401 a la vez comparten un solo refresh", async () => {
    const tokens = createFakeTokenStorage({ refresh: "refresco-1" });
    const requestRefresh = jest.fn().mockResolvedValue(tokensNuevos);
    const refresh = createSessionRefresher({ tokens, requestRefresh });

    await Promise.all([refresh(), refresh(), refresh()]);

    expect(requestRefresh).toHaveBeenCalledTimes(1);
  });

  it("sin refresh token guardado, la sesión se da por rechazada", async () => {
    const requestRefresh = jest.fn();
    const result = await createSessionRefresher({
      tokens: createFakeTokenStorage(),
      requestRefresh,
    })();

    expect(result).toEqual({ ok: false, reason: "rechazado" });
    expect(requestRefresh).not.toHaveBeenCalled();
  });

  it("un 4xx de Core es rechazado", async () => {
    const result = await createSessionRefresher({
      tokens: createFakeTokenStorage({ refresh: "caducado" }),
      requestRefresh: jest.fn().mockRejectedValue({ response: { status: 401 } }),
    })();

    expect(result).toEqual({ ok: false, reason: "rechazado" });
  });

  it("un fallo de red o un 5xx no dice nada de la sesión: sin_respuesta", async () => {
    const tokens = createFakeTokenStorage({ refresh: "refresco-1" });

    const red = await createSessionRefresher({
      tokens,
      requestRefresh: jest.fn().mockRejectedValue(new Error("Network Error")),
    })();
    const servidor = await createSessionRefresher({
      tokens,
      requestRefresh: jest.fn().mockRejectedValue({ response: { status: 503 } }),
    })();

    expect(red).toEqual({ ok: false, reason: "sin_respuesta" });
    expect(servidor).toEqual({ ok: false, reason: "sin_respuesta" });
  });

  it("tras terminar, un refresh nuevo vuelve a llamar a Core", async () => {
    const requestRefresh = jest.fn().mockResolvedValue(tokensNuevos);
    const refresh = createSessionRefresher({
      tokens: createFakeTokenStorage({ refresh: "refresco-1" }),
      requestRefresh,
    });

    await refresh();
    await refresh();

    expect(requestRefresh).toHaveBeenCalledTimes(2);
  });
});
