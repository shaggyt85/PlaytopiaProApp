export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/** Adónde va cada línea. Hoy la consola; Sentry se engancha aquí sin tocar las llamadas. */
export type LogSink = (level: LogLevel, message: string, context?: unknown) => void;

// Claves cuyo valor nunca debe salir en un log.
const SENSITIVE_KEY = /authorization|password|token|secret/i;
const REDACTED = "[oculto]";

/** Copia del contexto con los valores sensibles tapados (a cualquier profundidad). */
export function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [
        key,
        SENSITIVE_KEY.test(key) ? REDACTED : redact(inner),
      ]),
    );
  }
  return value;
}

const consoleSink: LogSink = (level, message, context) => {
  const line = `[${level}] ${message}`;
  if (context === undefined) console[level](line);
  else console[level](line, context);
};

export function createLogger(options: { minLevel: LogLevel; sink?: LogSink }) {
  const sink = options.sink ?? consoleSink;
  const log = (level: LogLevel) => (message: string, context?: unknown) => {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[options.minLevel]) return;
    sink(level, message, context === undefined ? undefined : redact(context));
  };
  return {
    debug: log("debug"),
    info: log("info"),
    warn: log("warn"),
    error: log("error"),
  };
}

export type Logger = ReturnType<typeof createLogger>;

// En desarrollo, todo; en producción solo avisos y errores.
export const logger: Logger = createLogger({ minLevel: __DEV__ ? "debug" : "warn" });
