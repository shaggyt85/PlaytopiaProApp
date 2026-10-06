import { TERMS_VERSION } from "@/features/auth/schemas/signUp.schema";
import { completeSignIn, type CompleteSignInDeps } from "@/features/auth/services/completeSignIn";
import { HttpError } from "@/shared/services/HttpError";
import { teacherKeys } from "@/shared/services/teacherProfileService";

import { signInTokens, teacherProfile } from "../../../helpers/authFactories";

const tokens = { access_token: signInTokens.access_token, refresh_token: "refresco" };

function deps(get: CompleteSignInDeps["profile"]["get"]) {
  return {
    session: {
      saveTokens: jest.fn().mockResolvedValue(undefined),
      start: jest.fn().mockResolvedValue(true),
      end: jest.fn().mockResolvedValue(undefined),
    },
    profile: { get },
    cache: { setQueryData: jest.fn() },
  } satisfies CompleteSignInDeps;
}

describe("completeSignIn", () => {
  it("con los términos vigentes abre la sesión", async () => {
    const d = deps(jest.fn().mockResolvedValue(teacherProfile()));

    await expect(completeSignIn(tokens, d)).resolves.toEqual({ tokens, termsPending: false });

    expect(d.session.saveTokens).toHaveBeenCalledWith(tokens.access_token, "refresco");
    expect(d.session.start).toHaveBeenCalledWith(tokens.access_token, "refresco");
  });

  it("pregunta los términos del profesor que dice el token", async () => {
    const d = deps(jest.fn().mockResolvedValue(teacherProfile()));

    await completeSignIn(tokens, d);

    expect(d.profile.get).toHaveBeenCalledWith(42);
  });

  it("deja el perfil en la caché para el inicio, también si faltan los términos", async () => {
    for (const version of [TERMS_VERSION, null]) {
      const d = deps(jest.fn().mockResolvedValue(teacherProfile(version)));

      await completeSignIn(tokens, d);

      expect(d.cache.setQueryData).toHaveBeenCalledWith(teacherKeys.profile(42, "es"), teacherProfile(version));
    }
  });

  it.each([null, "2020-01-01"])("con los términos en %s guarda los tokens pero no abre la sesión", async (version) => {
    const d = deps(jest.fn().mockResolvedValue(teacherProfile(version)));

    await expect(completeSignIn(tokens, d)).resolves.toEqual({ tokens, termsPending: true });

    expect(d.session.saveTokens).toHaveBeenCalled();
    expect(d.session.start).not.toHaveBeenCalled();
  });

  it("si no se pueden comprobar los términos, no entra y borra los tokens", async () => {
    const d = deps(jest.fn().mockRejectedValue(HttpError.network()));

    await expect(completeSignIn(tokens, d)).rejects.toBeInstanceOf(HttpError);

    expect(d.session.end).toHaveBeenCalled();
    expect(d.session.start).not.toHaveBeenCalled();
  });

  it("con un access token que no dice qué profesor es, no entra", async () => {
    const d = deps(jest.fn());

    await expect(completeSignIn({ access_token: "ilegible", refresh_token: "r" }, d)).rejects.toThrow();

    expect(d.profile.get).not.toHaveBeenCalled();
    expect(d.session.end).toHaveBeenCalled();
  });
});
