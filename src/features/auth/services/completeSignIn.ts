import { session } from "@/shared/services/session";
import type { SessionTokens } from "@/shared/services/tokenRefresh";
import { decodeSessionClaims } from "@/shared/utils/jwt";

import { TERMS_VERSION } from "../schemas/signUp.schema";

import { termsService, type ITermsService } from "./termsService";

export interface SignInOutcome {
  tokens: SessionTokens;
  /** No tiene aceptada la versión vigente de los términos: la sesión sigue cerrada. */
  termsPending: boolean;
}

export interface CompleteSignInDeps {
  session: Pick<typeof session, "saveTokens" | "start" | "end">;
  terms: Pick<ITermsService, "getTerms">;
}

const defaultDeps: CompleteSignInDeps = { session, terms: termsService };

/**
 * Lo que pasa tras conseguir tokens, se entre con contraseña o con biometría:
 * se guardan, se comprueban los términos vigentes y se abre la sesión (los
 * guards llevan solos al inicio). Sin los términos vigentes la sesión queda
 * cerrada y la pantalla pide aceptarlos. El profesor sale del token.
 */
export async function completeSignIn(
  tokens: SessionTokens,
  deps: CompleteSignInDeps = defaultDeps,
): Promise<SignInOutcome> {
  const teacherId = decodeSessionClaims(tokens.access_token)?.userId;
  await deps.session.saveTokens(tokens.access_token, tokens.refresh_token);
  try {
    if (teacherId === undefined) throw new Error("El access token no dice qué profesor es.");
    const { terms_version } = await deps.terms.getTerms(teacherId);
    if (terms_version !== TERMS_VERSION) return { tokens, termsPending: true };
  } catch (error) {
    // Sin saber si los aceptó no se entra: se borran los tokens guardados.
    await deps.session.end();
    throw error;
  }
  await deps.session.start(tokens.access_token, tokens.refresh_token);
  return { tokens, termsPending: false };
}
