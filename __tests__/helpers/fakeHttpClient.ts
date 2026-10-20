import type { z } from "zod";

import type { IHttpClient } from "@/shared/services/BaseHttpClient";

/**
 * IHttpClient falso: cada verbo es un jest.fn que responde `response` pasado
 * por el schema que recibe, como el de verdad (una respuesta que no cumple el
 * contrato se rechaza).
 */
export const createFakeHttpClient = (response?: unknown): jest.Mocked<IHttpClient> => {
  const reply = <S extends z.ZodType>(schema: S): Promise<z.output<S>> => Promise.resolve(schema.parse(response));
  const client: IHttpClient = {
    get: (_url, schema) => reply(schema),
    post: (_url, _data, schema) => reply(schema),
    put: (_url, _data, schema) => reply(schema),
    patch: (_url, _data, schema) => reply(schema),
    delete: (_url, schema) => reply(schema),
  };
  return {
    get: jest.fn(client.get),
    post: jest.fn(client.post),
    put: jest.fn(client.put),
    patch: jest.fn(client.patch),
    delete: jest.fn(client.delete),
  } as jest.Mocked<IHttpClient>;
};
