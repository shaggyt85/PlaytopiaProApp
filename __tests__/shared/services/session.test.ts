import { createSessionService } from "@/shared/services/session";

import { createTestJwt, teacherClaims } from "../../helpers/jwt";
import { createFakeTokenStorage } from "../../helpers/fakeTokenStorage";

function build(initial?: { access?: string | null; refresh?: string | null }) {
  const tokens = createFakeTokenStorage(initial);
  const queryClient = { clear: jest.fn() };
  const store = { setAuthenticated: jest.fn(), setAnonymous: jest.fn() };
  const biometric = { clear: jest.fn().mockResolvedValue(undefined) };
  const session = createSessionService({ tokens, biometric, queryClient, store });
  return { session, tokens, biometric, queryClient, store };
}

const teacherToken = createTestJwt(teacherClaims());
const studentToken = createTestJwt(teacherClaims({ RoleId: 3 }));

describe("session.restore", () => {
  it("con refresh token y rol de profesor, abre la sesión con usuario y escuela", async () => {
    const { session, store } = build({ access: teacherToken, refresh: "refresco" });

    await session.restore();

    expect(store.setAuthenticated).toHaveBeenCalledWith({ userId: 42, dbId: 7 });
  });

  it("un access token caducado no cierra la sesión si hay refresh token", async () => {
    const caducado = createTestJwt(teacherClaims({ exp: 1 }));
    const { session, store } = build({ access: caducado, refresh: "refresco" });

    await session.restore();

    expect(store.setAuthenticated).toHaveBeenCalled();
  });

  it("sin refresh token no hay sesión: limpia todo", async () => {
    const { session, store, tokens, queryClient } = build({ access: teacherToken });

    await session.restore();

    expect(store.setAnonymous).toHaveBeenCalled();
    expect(tokens.access).toBeNull();
    expect(queryClient.clear).toHaveBeenCalled();
  });

  it("un token que no es de profesor se descarta", async () => {
    const { session, store, tokens } = build({ access: studentToken, refresh: "refresco" });

    await session.restore();

    expect(store.setAuthenticated).not.toHaveBeenCalled();
    expect(store.setAnonymous).toHaveBeenCalled();
    expect(tokens.refresh).toBeNull();
  });

  it("si el Keychain falla, enseña el login sin borrar los tokens", async () => {
    const { session, store, tokens } = build({ access: teacherToken, refresh: "refresco" });
    tokens.getRefreshToken = jest.fn().mockRejectedValue(new Error("Keychain"));

    await session.restore();

    expect(store.setAnonymous).toHaveBeenCalled();
    expect(tokens.refresh).toBe("refresco");
  });
});

describe("session.start", () => {
  it("guarda los tokens y abre la sesión si es un profesor", async () => {
    const { session, store, tokens } = build();

    await expect(session.start(teacherToken, "refresco")).resolves.toBe(true);

    expect(tokens.refresh).toBe("refresco");
    expect(store.setAuthenticated).toHaveBeenCalledWith({ userId: 42, dbId: 7 });
  });

  it("con un token de otro rol no abre la sesión y no deja tokens", async () => {
    const { session, tokens } = build();

    await expect(session.start(studentToken, "refresco")).resolves.toBe(false);

    expect(tokens.refresh).toBeNull();
  });
});

describe("session.saveTokens", () => {
  it("guarda los tokens sin abrir la sesión", async () => {
    const { session, store, tokens } = build();

    await session.saveTokens(teacherToken, "refresco");

    expect(tokens.access).toBe(teacherToken);
    expect(tokens.refresh).toBe("refresco");
    expect(store.setAuthenticated).not.toHaveBeenCalled();
  });
});

describe("session.end", () => {
  it("borra los tokens, vacía la caché y deja la sesión anónima", async () => {
    const { session, store, tokens, queryClient } = build({
      access: teacherToken,
      refresh: "refresco",
    });

    await session.end();

    expect(tokens.access).toBeNull();
    expect(tokens.refresh).toBeNull();
    expect(queryClient.clear).toHaveBeenCalled();
    expect(store.setAnonymous).toHaveBeenCalled();
  });

  it("por defecto el cierre es manual (lo decidió el profesor)", async () => {
    const { session, store } = build({ access: teacherToken, refresh: "refresco" });

    await session.end();

    expect(store.setAnonymous).toHaveBeenCalledWith("manual");
  });

  it("cuando Core da la sesión por muerta, el cierre es expired", async () => {
    const { session, store } = build({ access: teacherToken, refresh: "refresco" });

    await session.end("expired");

    expect(store.setAnonymous).toHaveBeenCalledWith("expired");
  });

  it("cerrar sesión conserva la biometría", async () => {
    const { session, biometric } = build({ access: teacherToken, refresh: "refresco" });

    await session.end();
    await session.end("expired");

    expect(biometric.clear).not.toHaveBeenCalled();
  });

  it("tras dar de baja la cuenta, el cierre es deleted y borra también la biometría", async () => {
    const { session, store, biometric, tokens } = build({ access: teacherToken, refresh: "refresco" });

    await session.end("deleted");

    expect(biometric.clear).toHaveBeenCalledTimes(1);
    expect(tokens.refresh).toBeNull();
    expect(store.setAnonymous).toHaveBeenCalledWith("deleted");
  });

  it("al arrancar sin sesión no hay motivo de cierre", async () => {
    const { session, store } = build();

    await session.restore();

    expect(store.setAnonymous).toHaveBeenCalledWith(null);
  });
});
