import type { InternalAxiosRequestConfig } from "axios";

import { BaseHttpClient } from "@/shared/services/BaseHttpClient";
import { HttpError } from "@/shared/services/HttpError";
import type { RefreshResult } from "@/shared/services/sessionRefresher";

import { createFakeAdapter, type FakeReply } from "../../helpers/fakeAxiosAdapter";
import { createFakeTokenStorage } from "../../helpers/fakeTokenStorage";

const PROBLEM_409 = {
  type: "urn:playtopia:problem:email-taken",
  status: 409,
  detail: "El email ya está registrado",
};

function buildClient(options: {
  handler: (config: InternalAxiosRequestConfig) => FakeReply;
  access?: string | null;
  refreshResult?: RefreshResult;
}) {
  const tokens = createFakeTokenStorage({ access: options.access ?? null });
  const { adapter, calls } = createFakeAdapter(options.handler);
  const refreshSession = jest.fn(async (): Promise<RefreshResult> => {
    const result = options.refreshResult ?? { ok: false, reason: "rechazado" };
    if (result.ok) tokens.access = result.accessToken;
    return result;
  });
  const observeResponseHeaders = jest.fn();
  const client = new BaseHttpClient({
    axiosConfig: { baseURL: "https://api.test.local/api", adapter },
    tokens,
    refreshSession,
    observeResponseHeaders,
  });
  const sessionExpired = jest.fn();
  client.onSessionExpired(sessionExpired);
  return { client, calls, tokens, refreshSession, sessionExpired, observeResponseHeaders };
}

const authHeader = (config: InternalAxiosRequestConfig) =>
  config.headers.Authorization;

describe("BaseHttpClient", () => {
  it("devuelve solo el cuerpo de la respuesta", async () => {
    const { client } = buildClient({
      handler: () => ({ status: 200, data: { id: 7 } }),
    });

    await expect(client.get("/perfil")).resolves.toEqual({ id: 7 });
  });

  it("pone el token de sesión en cada petición", async () => {
    const { client, calls } = buildClient({
      access: "acceso-1",
      handler: () => ({ status: 200, data: {} }),
    });

    await client.post("/algo", { a: 1 });

    expect(authHeader(calls[0])).toBe("Bearer acceso-1");
    expect(calls[0].method).toBe("post");
  });

  it("sin sesión no manda cabecera Authorization", async () => {
    const { client, calls } = buildClient({
      handler: () => ({ status: 200, data: {} }),
    });

    await client.get("/publico");

    expect(authHeader(calls[0])).toBeUndefined();
  });

  it("un error de Core sale como HttpError con su ProblemDetail", async () => {
    const { client } = buildClient({
      handler: () => ({ status: 409, data: PROBLEM_409 }),
    });

    const error: unknown = await client.post("/UserTeacher", {}).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(HttpError);
    if (!(error instanceof HttpError)) return;
    expect(error.kind).toBe("http");
    expect(error.status).toBe(409);
    expect(error.type).toBe(PROBLEM_409.type);
  });

  it("sin respuesta es un HttpError de red; si tarda demasiado, de timeout", async () => {
    const red = buildClient({ handler: () => ({ network: true }) });
    const lento = buildClient({ handler: () => ({ timeout: true }) });

    await expect(red.client.get("/x")).rejects.toMatchObject({ kind: "network" });
    await expect(lento.client.get("/x")).rejects.toMatchObject({ kind: "timeout" });
  });

  it("el 401 del login (sin sesión) es un error normal y no intenta renovar", async () => {
    const { client, refreshSession, sessionExpired } = buildClient({
      handler: () => ({ status: 401, data: { type: "about:blank", status: 401 } }),
    });

    await expect(client.post("/auth/login/teacher", {})).rejects.toMatchObject({
      kind: "http",
      status: 401,
    });
    expect(refreshSession).not.toHaveBeenCalled();
    expect(sessionExpired).not.toHaveBeenCalled();
  });

  it("401 con sesión: renueva una vez y reintenta con el token nuevo", async () => {
    const { client, calls, refreshSession } = buildClient({
      access: "acceso-caducado",
      refreshResult: { ok: true, accessToken: "acceso-nuevo" },
      handler: (config) =>
        authHeader(config) === "Bearer acceso-nuevo"
          ? { status: 200, data: { ok: true } }
          : { status: 401, data: {} },
    });

    await expect(client.get("/clases")).resolves.toEqual({ ok: true });
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
    expect(authHeader(calls[1])).toBe("Bearer acceso-nuevo");
  });

  it("si Core rechaza el refresh: avisa de sesión expirada (cerrarla no es cosa del cliente)", async () => {
    const { client, sessionExpired } = buildClient({
      access: "acceso-caducado",
      refreshResult: { ok: false, reason: "rechazado" },
      handler: () => ({ status: 401, data: {} }),
    });

    await expect(client.get("/clases")).rejects.toMatchObject({ status: 401 });
    expect(sessionExpired).toHaveBeenCalledTimes(1);
  });

  it("si el refresh falla por red: NO cierra la sesión y devuelve error de red", async () => {
    const { client, tokens, sessionExpired } = buildClient({
      access: "acceso-caducado",
      refreshResult: { ok: false, reason: "sin_respuesta" },
      handler: () => ({ status: 401, data: {} }),
    });

    await expect(client.get("/clases")).rejects.toMatchObject({ kind: "network" });
    expect(tokens.access).toBe("acceso-caducado");
    expect(sessionExpired).not.toHaveBeenCalled();
  });

  it("no reintenta más de una vez aunque el reintento vuelva a dar 401", async () => {
    const { client, calls, refreshSession } = buildClient({
      access: "acceso-caducado",
      refreshResult: { ok: true, accessToken: "acceso-nuevo" },
      handler: () => ({ status: 401, data: {} }),
    });

    await expect(client.get("/clases")).rejects.toMatchObject({ status: 401 });
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
  });

  it("enseña las cabeceras de cada respuesta, buena o de error (hora del servidor)", async () => {
    const date = "Sat, 26 Sep 2026 10:05:00 GMT";
    const ok = buildClient({ handler: () => ({ status: 200, data: {}, headers: { date } }) });
    const ko = buildClient({ handler: () => ({ status: 409, data: {}, headers: { date } }) });

    await ok.client.get("/x");
    await ko.client.get("/x").catch(() => undefined);

    expect(ok.observeResponseHeaders.mock.calls[0][0].date).toBe(date);
    expect(ko.observeResponseHeaders.mock.calls[0][0].date).toBe(date);
  });
});
