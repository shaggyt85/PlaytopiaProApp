import type { ITokenStorage } from "@/shared/services/tokenStorage";

/** ITokenStorage en memoria para tests: sin SecureStore ni Keychain. */
export function createFakeTokenStorage(initial?: {
  access?: string | null;
  refresh?: string | null;
}): ITokenStorage & { access: string | null; refresh: string | null } {
  return {
    access: initial?.access ?? null,
    refresh: initial?.refresh ?? null,
    async getAccessToken() {
      return this.access;
    },
    async getRefreshToken() {
      return this.refresh;
    },
    async setTokens(access, refresh) {
      this.access = access;
      this.refresh = refresh;
    },
    async clearTokens() {
      this.access = null;
      this.refresh = null;
    },
  };
}
