import {
  create as createAxios,
  isAxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from "axios";
import type { z } from "zod";

import { HttpError } from "./HttpError";
import type { RefreshResult } from "./sessionRefresher";
import type { ITokenStorage } from "./tokenStorage";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** La petición ya se reintentó tras renovar la sesión. */
    _retry?: boolean;
  }
}

/**
 * Lo que usan los services: solo los verbos (ISP). Cada uno recibe el schema
 * de la respuesta y devuelve lo que dice: no se puede pedir nada sin
 * validarlo. Sin cuerpo que leer, `NoContentSchema`.
 */
export interface IHttpClient {
  get<S extends z.ZodType>(url: string, schema: S, config?: AxiosRequestConfig): Promise<z.output<S>>;
  post<S extends z.ZodType>(url: string, data: unknown, schema: S, config?: AxiosRequestConfig): Promise<z.output<S>>;
  put<S extends z.ZodType>(url: string, data: unknown, schema: S, config?: AxiosRequestConfig): Promise<z.output<S>>;
  patch<S extends z.ZodType>(url: string, data: unknown, schema: S, config?: AxiosRequestConfig): Promise<z.output<S>>;
  delete<S extends z.ZodType>(url: string, schema: S, config?: AxiosRequestConfig): Promise<z.output<S>>;
}

export interface HttpClientDeps {
  axiosConfig: CreateAxiosDefaults;
  tokens: ITokenStorage;
  refreshSession: () => Promise<RefreshResult>;
  /** Ve las cabeceras de toda respuesta, buena o de error (p. ej. la hora del servidor). */
  observeResponseHeaders?: (headers: Record<string, unknown>) => void;
  /**
   * El idioma activo de la app, que viaja en `Accept-Language` en cada
   * petición: Core devuelve en él lo que traduce él (p. ej. los nombres de
   * los deportes). Se lee en cada petición, así que un cambio de idioma vale
   * desde la siguiente.
   */
  requestLanguage?: () => string;
  /** Quién se entera de una respuesta que no cumple el contrato (Sentry), aparte del error que recibe la pantalla. */
  onContractError?: (error: HttpError) => void;
}

/**
 * Cliente HTTP base. Coordina tres cosas y nada más:
 * - pone el token y el idioma en cada petición;
 * - ante un 401 con sesión, la renueva una vez y reintenta;
 * - valida la respuesta con su schema;
 * - convierte cualquier fallo en un `HttpError`.
 *
 * No conoce la caché de queries ni la navegación: cuando la sesión muere,
 * avisa con `onSessionExpired` y quien lo escuche decide (DIP).
 */
export class BaseHttpClient implements IHttpClient {
  protected readonly instance: AxiosInstance;
  private readonly tokens: ITokenStorage;
  private readonly refreshSession: () => Promise<RefreshResult>;
  private readonly observeHeaders: (headers: Record<string, unknown>) => void;
  private readonly requestLanguage?: () => string;
  private readonly onContractError: (error: HttpError) => void;
  private sessionExpiredHandler: () => void = () => {};

  constructor(deps: HttpClientDeps) {
    this.instance = createAxios(deps.axiosConfig);
    this.tokens = deps.tokens;
    this.refreshSession = deps.refreshSession;
    this.observeHeaders = deps.observeResponseHeaders ?? (() => {});
    this.requestLanguage = deps.requestLanguage;
    this.onContractError = deps.onContractError ?? (() => {});
    this.instance.interceptors.request.use((config) => this.withToken(config));
    this.instance.interceptors.request.use((config) => this.withLanguage(config));
    this.instance.interceptors.response.use(
      (response) => {
        this.observeHeaders(response.headers ?? {});
        return response;
      },
      (error) => this.handleError(error),
    );
  }

  /** Quién reacciona cuando la sesión deja de valer (limpiar caché, ir al login). */
  onSessionExpired(handler: () => void): void {
    this.sessionExpiredHandler = handler;
  }

  private async withToken(
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    const token = await this.tokens.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }

  private withLanguage(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    if (this.requestLanguage) config.headers["Accept-Language"] = this.requestLanguage();
    return config;
  }

  private async handleError(error: unknown): Promise<never> {
    if (!isAxiosError(error)) throw error;

    if (!error.response) {
      const timedOut =
        error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
      throw timedOut ? HttpError.timeout() : HttpError.network();
    }

    const { status, data, headers } = error.response;
    this.observeHeaders(headers ?? {});
    const original = error.config;

    // Solo se renueva si la petición iba con sesión. El 401 del login con
    // credenciales malas llega sin token y es un error normal.
    const hadSession = Boolean(original?.headers?.Authorization);
    if (status === 401 && hadSession && original && !original._retry) {
      original._retry = true;
      const refresh = await this.refreshSession();

      if (refresh.ok) return this.instance.request(original);

      if (refresh.reason === "sin_respuesta") throw HttpError.network();

      // Solo avisa: cerrar la sesión (tokens, caché, estado) es cosa de
      // quien escucha, en un único sitio.
      this.sessionExpiredHandler();
    }

    throw HttpError.fromResponse(status, data, headers?.["retry-after"]);
  }

  /** Un solo punto de salida para todos los verbos (DRY): pide y valida. */
  protected async request<S extends z.ZodType>(config: AxiosRequestConfig, schema: S): Promise<z.output<S>> {
    const response = await this.instance.request<unknown>(config);
    const parsed = schema.safeParse(response.data);
    if (parsed.success) return parsed.data;
    const error = HttpError.contract(config.url, parsed.error.issues);
    this.onContractError(error);
    throw error;
  }

  get<S extends z.ZodType>(url: string, schema: S, config?: AxiosRequestConfig): Promise<z.output<S>> {
    return this.request({ ...config, method: "GET", url }, schema);
  }

  post<S extends z.ZodType>(url: string, data: unknown, schema: S, config?: AxiosRequestConfig): Promise<z.output<S>> {
    return this.request({ ...config, method: "POST", url, data }, schema);
  }

  put<S extends z.ZodType>(url: string, data: unknown, schema: S, config?: AxiosRequestConfig): Promise<z.output<S>> {
    return this.request({ ...config, method: "PUT", url, data }, schema);
  }

  patch<S extends z.ZodType>(url: string, data: unknown, schema: S, config?: AxiosRequestConfig): Promise<z.output<S>> {
    return this.request({ ...config, method: "PATCH", url, data }, schema);
  }

  delete<S extends z.ZodType>(url: string, schema: S, config?: AxiosRequestConfig): Promise<z.output<S>> {
    return this.request({ ...config, method: "DELETE", url }, schema);
  }
}
