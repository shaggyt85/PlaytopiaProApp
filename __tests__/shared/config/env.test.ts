import { parseEnv } from "@/shared/config/env";

const base = {
  EXPO_PUBLIC_API_BASE_URL: "https://core-dev.example.com/api",
  EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET: "secreto",
  EXPO_PUBLIC_TOKEN_SKEW_SECONDS: undefined,
  EXPO_PUBLIC_SENTRY_DSN: undefined,
  EXPO_PUBLIC_SENTRY_ENV: undefined,
};

describe("parseEnv", () => {
  it("acepta la configuración mínima y aplica los valores por defecto", () => {
    const env = parseEnv(base);

    expect(env.EXPO_PUBLIC_API_BASE_URL).toBe(base.EXPO_PUBLIC_API_BASE_URL);
    expect(env.EXPO_PUBLIC_TOKEN_SKEW_SECONDS).toBe(300);
    expect(env.EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET).toBe("secreto");
  });

  it("convierte el skew a número", () => {
    const env = parseEnv({ ...base, EXPO_PUBLIC_TOKEN_SKEW_SECONDS: "120" });

    expect(env.EXPO_PUBLIC_TOKEN_SKEW_SECONDS).toBe(120);
  });

  it("trata una variable vacía como no definida", () => {
    const env = parseEnv({ ...base, EXPO_PUBLIC_SENTRY_DSN: "" });

    expect(env.EXPO_PUBLIC_SENTRY_DSN).toBeUndefined();
  });

  it("falla con un mensaje que nombra la variable si falta la URL de la API", () => {
    expect(() =>
      parseEnv({ ...base, EXPO_PUBLIC_API_BASE_URL: undefined }),
    ).toThrow(/EXPO_PUBLIC_API_BASE_URL/);
  });

  it("falla si falta el secreto de la firma del registro, o está vacío", () => {
    expect(() =>
      parseEnv({ ...base, EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET: undefined }),
    ).toThrow(/EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET/);
    expect(() => parseEnv({ ...base, EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET: "" })).toThrow(
      /EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET/,
    );
  });

  it("acepta los dos entornos de Sentry y rechaza cualquier otro", () => {
    expect(parseEnv({ ...base, EXPO_PUBLIC_SENTRY_ENV: "preview" }).EXPO_PUBLIC_SENTRY_ENV).toBe(
      "preview",
    );
    expect(() => parseEnv({ ...base, EXPO_PUBLIC_SENTRY_ENV: "staging" })).toThrow(
      /EXPO_PUBLIC_SENTRY_ENV/,
    );
  });

  it("falla si la URL de la API no es una URL", () => {
    expect(() =>
      parseEnv({ ...base, EXPO_PUBLIC_API_BASE_URL: "core-dev" }),
    ).toThrow(/Variables de entorno no válidas/);
  });
});
