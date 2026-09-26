import { z } from "zod";

// Única puerta a las variables de entorno: el resto del código importa `env`
// de aquí y nunca lee process.env directamente (guía §5).
//
// Todo lo que empieza por EXPO_PUBLIC_ va dentro del bundle: aquí solo hay
// valores públicos. Los secretos de verdad viven en EAS, no en la app.
const envSchema = z.object({
  EXPO_PUBLIC_API_BASE_URL: z.url(),
  // Firma HMAC del registro (registration_token). Sin ella no hay alta.
  EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET: z.string().min(1),
  EXPO_PUBLIC_TOKEN_SKEW_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(300),
  EXPO_PUBLIC_SENTRY_DSN: z.url().optional(),
});

export type Env = z.infer<typeof envSchema>;

type RawEnv = Record<keyof Env, string | undefined>;

// Una variable vacía en .env (CLAVE=) cuenta como no definida.
const withoutEmpty = (raw: RawEnv) =>
  Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, value || undefined]),
  );

export function parseEnv(raw: RawEnv): Env {
  const result = envSchema.safeParse(withoutEmpty(raw));
  if (!result.success) {
    const detalle = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Variables de entorno no válidas. Revisa tu .env (plantilla en .env.example):\n${detalle}`,
    );
  }
  return result.data;
}

// Expo solo sustituye process.env.EXPO_PUBLIC_X cuando se escribe literal:
// por eso cada variable se nombra una a una.
export const env = parseEnv({
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET:
    process.env.EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET,
  EXPO_PUBLIC_TOKEN_SKEW_SECONDS: process.env.EXPO_PUBLIC_TOKEN_SKEW_SECONDS,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
});
