import { completeSignIn, type CompleteSignInDeps } from "@/features/auth/services/completeSignIn";
import { HttpError } from "@/shared/services/HttpError";

import { signInTokens, teacherTerms } from "../../../helpers/authFactories";

const tokens = { access_token: signInTokens.access_token, refresh_token: "refresco" };

function deps(getTerms: CompleteSignInDeps["terms"]["getTerms"]) {
  return {
    session: {
      saveTokens: jest.fn().mockResolvedValue(undefined),
      start: jest.fn().mockResolvedValue(true),
      end: jest.fn().mockResolvedValue(undefined),
    },
    terms: { getTerms },
  } satisfies CompleteSignInDeps;
}

describe("completeSignIn", () => {
  it("con los términos vigentes abre la sesión", async () => {
    const d = deps(jest.fn().mockResolvedValue(teacherTerms()));

    await expect(completeSignIn(tokens, d)).resolves.toEqual({ tokens, termsPending: false });

    expect(d.session.saveTokens).toHaveBeenCalledWith(tokens.access_token, "refresco");
    expect(d.session.start).toHaveBeenCalledWith(tokens.access_token, "refresco");
  });

  it("pregunta los términos del profesor que dice el token", async () => {
    const d = deps(jest.fn().mockResolvedValue(teacherTerms()));

    await completeSignIn(tokens, d);

    expect(d.terms.getTerms).toHaveBeenCalledWith(42);
  });

  it.each([null, "2020-01-01"])("con los términos en %s guarda los tokens pero no abre la sesión", async (version) => {
    const d = deps(jest.fn().mockResolvedValue(teacherTerms(version)));

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

    expect(d.terms.getTerms).not.toHaveBeenCalled();
    expect(d.session.end).toHaveBeenCalled();
  });
});
