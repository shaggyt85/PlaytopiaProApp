import type { IHttpClient } from "@/shared/services/BaseHttpClient";

/** IHttpClient falso: cada verbo es un jest.fn; `post` responde con `response`. */
export const createFakeHttpClient = (response?: unknown) => ({
  get: jest.fn().mockResolvedValue(response),
  post: jest.fn().mockResolvedValue(response),
  put: jest.fn().mockResolvedValue(response),
  patch: jest.fn().mockResolvedValue(response),
  delete: jest.fn().mockResolvedValue(response),
}) satisfies IHttpClient;
