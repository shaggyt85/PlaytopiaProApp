import { CachePolicy } from "@/shared/config/cachePolicies";
import {
  createQueryClient,
  queryRetryDelay,
  shouldRetryQuery,
} from "@/shared/config/queryClient";
import { HttpError } from "@/shared/services/HttpError";

describe("shouldRetryQuery", () => {
  it("reintenta lo pasajero: sin red, timeout y 5xx", () => {
    expect(shouldRetryQuery(0, HttpError.network())).toBe(true);
    expect(shouldRetryQuery(0, HttpError.timeout())).toBe(true);
    expect(shouldRetryQuery(0, HttpError.fromResponse(503, {}))).toBe(true);
  });

  it("no reintenta un 4xx: es una respuesta clara de Core", () => {
    expect(shouldRetryQuery(0, HttpError.fromResponse(401, {}))).toBe(false);
    expect(shouldRetryQuery(0, HttpError.fromResponse(404, {}))).toBe(false);
    expect(shouldRetryQuery(0, HttpError.fromResponse(429, {}))).toBe(false);
  });

  it("no reintenta errores que no son HttpError (validación, código)", () => {
    expect(shouldRetryQuery(0, new Error("respuesta no válida"))).toBe(false);
  });

  it("para al tercer reintento", () => {
    expect(shouldRetryQuery(2, HttpError.network())).toBe(true);
    expect(shouldRetryQuery(3, HttpError.network())).toBe(false);
  });
});

describe("queryRetryDelay", () => {
  it("espera 1 s, 2 s, 4 s y no pasa de 8 s", () => {
    expect([0, 1, 2, 3, 6].map(queryRetryDelay)).toEqual([1000, 2000, 4000, 8000, 8000]);
  });
});

describe("createQueryClient", () => {
  const { queries, mutations } = createQueryClient().getDefaultOptions();

  it("las queries usan STANDARD por defecto y se intentan aunque parezca que no hay red", () => {
    expect(queries?.staleTime).toBe(CachePolicy.STANDARD.staleTime);
    expect(queries?.gcTime).toBe(CachePolicy.STANDARD.gcTime);
    expect(queries?.networkMode).toBe("offlineFirst");
  });

  it("las mutaciones no se reintentan solas y solo salen con red", () => {
    expect(mutations?.retry).toBe(false);
    expect(mutations?.networkMode).toBe("online");
  });

  it("cada llamada crea un cliente nuevo (caché aislada)", () => {
    expect(createQueryClient()).not.toBe(createQueryClient());
  });
});
