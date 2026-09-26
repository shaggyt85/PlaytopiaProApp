import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

/** Lo que devuelve el "servidor" falso para una petición. */
export type FakeReply =
  | { status: number; data?: unknown; headers?: Record<string, string> }
  | { network: true }
  | { timeout: true };

/**
 * Adapter de axios que responde con lo que diga `handler`, sin red. Guarda
 * las peticiones recibidas para poder comprobar cabeceras y reintentos.
 */
export function createFakeAdapter(
  handler: (config: InternalAxiosRequestConfig) => FakeReply,
) {
  const calls: InternalAxiosRequestConfig[] = [];

  const adapter: AxiosAdapter = async (config) => {
    calls.push(config);
    const reply = handler(config);

    if ("network" in reply) {
      throw new AxiosError("Network Error", "ERR_NETWORK", config, {});
    }
    if ("timeout" in reply) {
      throw new AxiosError("timeout", "ECONNABORTED", config, {});
    }

    const response: AxiosResponse = {
      data: reply.data,
      status: reply.status,
      statusText: String(reply.status),
      headers: new AxiosHeaders(reply.headers ?? {}),
      config,
    };
    if (reply.status >= 400) {
      throw new AxiosError(
        `HTTP ${reply.status}`,
        AxiosError.ERR_BAD_RESPONSE,
        config,
        {},
        response,
      );
    }
    return response;
  };

  return { adapter, calls };
}
